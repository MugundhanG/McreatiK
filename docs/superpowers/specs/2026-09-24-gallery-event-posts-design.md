# Gallery Event Posts — Design

**Date:** 2026-09-24
**Status:** Approved in chat (approach A); awaiting spec review
**Repos:** `mcreatik-backend` (master), `mcreatik-admin` (master), `mcreatik` (branch `gallery-event-posts`)

## Goal

Turn the Studios Gallery (`/studios/gallery`) into an Instagram-style profile grid of **event posts**. Each post holds **1–20 photos**, so one event (a wedding, a ring ceremony) can be published as a single post with its best frames. Albums (flip-book) stay separate and untouched.

## Decisions (from brainstorming)

| Question | Decision |
|---|---|
| Gallery vs Albums | Separate — Gallery gets its own multi-photo posts; Albums unchanged |
| Layout | Instagram **profile grid** (square covers, 3 columns) → click opens the post |
| Post fields | title, caption (existing `description`), category, featured, status **+ location + per-photo alt text** |
| Not included | event date, explicit cover picker (first photo = cover), deep links to posts |
| Data approach | **A — extend `gallery_items`** with a child photos table (not a new parallel feature) |

## Critical constraint: one shared database

The local backend and production use **the same Supabase database** (see go-live checklist #1). A Flyway migration run by a local backend lands in production immediately, while production still runs the old backend code. Therefore:

1. **V30 must be purely additive.** The current live backend (which reads/writes `gallery_items.media_id` and knows nothing about photos) must keep working unchanged after V30 is applied.
2. **The migration is validated on a throwaway Postgres first** (a disposable `postgres:16` container on the Oracle VM — no Docker locally), running V1–V30 from scratch, before any backend with V30 starts against the shared DB.
3. **No new tests may write to the shared DB.** Backend tests for this feature are Mockito unit tests plus a controller test with the service mocked. The controller test follows the repo pattern (`@SpringBootTest` + `@AutoConfigureMockMvc`, the only setup that evaluates `@PreAuthorize`), which boots Flyway against the shared DB — so it must not run until V30 has passed the throwaway validation.

## 1. Backend (`mcreatik-backend`)

### Migration `V30__add_gallery_item_photos.sql`

```sql
ALTER TABLE gallery_items ADD COLUMN location VARCHAR(255);

CREATE TABLE gallery_item_photos (
    id              BIGSERIAL PRIMARY KEY,
    gallery_item_id BIGINT NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
    media_id        BIGINT NOT NULL REFERENCES media(id),
    sort_order      INT NOT NULL DEFAULT 0,
    alt_text        VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gallery_item_id, media_id)
);
CREATE INDEX idx_gallery_item_photos_item_id ON gallery_item_photos(gallery_item_id);

-- Backfill: every existing item's single photo becomes photo #1 of its post.
INSERT INTO gallery_item_photos (gallery_item_id, media_id, sort_order, alt_text)
SELECT gi.id, gi.media_id, 0, m.alt_text
FROM gallery_items gi JOIN media m ON m.id = gi.media_id;
```

`gallery_items.media_id` stays `NOT NULL` and keeps meaning "the cover photo". The new code always sets it to photo #1 on save, so old and new code agree on it.

**Rollout gap (accepted):** between V30 landing and the new backend deploying, the old live backend can still create/edit items without writing `gallery_item_photos`. The new code tolerates that — an item with zero photo rows is read as a one-photo post built from `media`. The admin is used only by the owner, so this window is short and controlled.

### Entity / DTOs

- New `GalleryItemPhoto` entity (mirrors `AlbumPhoto`): `galleryItem`, `media`, `sortOrder`, `altText`.
- `GalleryItem` gains `location` and `@OneToMany(mappedBy, cascade = ALL, orphanRemoval = true) @OrderBy("sortOrder") List<GalleryItemPhoto> photos`, fetched via `@EntityGraph(attributePaths = {"media", "photos", "photos.media"})` on every repository finder (same pattern as `AlbumRepository`). `update(...)` replaces the photo list and resets `media` to the first photo.
- **`GalleryRequest`** (admin create/update):
  - new `String location`
  - new `List<GalleryPhotoRequest> photos` where `GalleryPhotoRequest(@NotNull Long mediaId, @Size(max = 500) String altText)`
  - `mediaId` becomes optional. **Backward compatibility:** if `photos` is null/empty and `mediaId` is present, it is treated as `photos = [{mediaId, altText: null}]`, so the live admin keeps working until the new admin ships.
  - Validation (service-level, 400 with a clear message): 1–20 photos, no duplicate `mediaId` within a post, every `mediaId` must exist.
- **`GalleryResponse`** adds `location` and `photos: [{ media: MediaResponse, altText }]` in order. `media` (= cover) is **kept** so the currently live website keeps working. For items with no photo rows (see rollout gap), `photos` is synthesised as `[{ media, altText: media.altText }]`.

### Service / ordering

- Mapping to DTOs stays inside the existing `@Transactional` service methods (the class's documented pattern), so lazily loading `photos` is safe.
- Public list order is unchanged: featured first, then newest (`createdAt DESC`).

### Tests (no DB writes)

- `GalleryServiceTest` (Mockito): create with N photos → order preserved, `media` = first; update replaces photos and reorders; 0 photos → 400; 21 photos → 400; duplicate mediaId → 400; unknown mediaId → 400; legacy `mediaId`-only request → one-photo post; item with no photo rows → response synthesises one photo.
- `GalleryAdminControllerTest` (`@SpringBootTest` + MockMvc, `GalleryService` mocked): request with `photos` binds correctly; `altText` > 500 → 400 (matches `media.alt_text` VARCHAR(500), so the backfill can never overflow).

## 2. Admin (`mcreatik-admin`, `src/pages/gallery/`)

- **GalleryFormPage:** replaces the single-image picker with a photo list:
  - multi-select upload (`<input multiple>`), uploading sequentially via existing `uploadMedia`; counter "N / 20"; picks beyond the limit are rejected with a toast naming how many were skipped
  - each row: thumbnail, alt-text input, ↑/↓ reorder, remove; first row labelled **Cover**
  - new **Location** input
  - submit sends `photos: [{mediaId, altText}]` + `location`
- **GalleryListPage:** cover thumbnail + "N photos" badge.
- Types in `src/types/gallery.ts` updated to match the new request/response.
- Admin has no test infra (known, deliberately open) — verified manually in the browser.

## 3. Website (`mcreatik`, `src/components/studios/`)

Keeps the editorial header and category text-tabs from the previous redesign. Replaces the masonry grid and single-photo lightbox.

- **Normalisation** (`galleryPosts.js`): `toPost(item)` returns `{ ...item, photos }` where `photos` falls back to `[{ media: item.media, altText: item.media.altText }]` when the API doesn't send `photos`. This lets the website work against both the old and new backend. Unit-tested with Vitest.
- **Grid:** 3 columns at every width (Instagram-style), square (`aspect-square`, `object-cover`) cover = `photos[0]`, small gaps (`gap-1` mobile, `gap-4` desktop). Multi-photo posts show a ⧉ "stack" icon top-right. Desktop hover: dark overlay with title + "N photos".
- **Post viewer** (`GalleryPostViewer.jsx`, replaces `GalleryLightbox.jsx`):
  - *Desktop (≥ lg):* centered modal — carousel on the left (image `object-contain`, prev/next arrows, dot indicators, ←/→ keys), right panel with title, location (pin icon), category, caption.
  - *Mobile:* full-screen — carousel on top (swipe), details scroll beneath.
  - Photo counter "3 / 12"; outer "previous/next post" arrows at the modal edges (desktop) to move between events in the current filter.
  - Closes on Esc, X, backdrop click; locks body scroll; `role="dialog"`, `aria-modal`, focus returns to the grid tile on close.
  - Per-photo `alt` = `altText || post.title`.
- **Samples (DEV only, unchanged rule):** `gallerySamples.js` becomes ~3 posts per category, each with 1–20 picsum photos of mixed shapes. Never used in production builds.

## Rollout

All three repos work on a `gallery-event-posts` feature branch.

1. Backend: implement + unit tests → validate V30 on a throwaway Postgres on the VM → only then start the local backend against the shared DB (this applies V30 to production — safe because it is additive; confirm the live website + admin still load right after).
2. Admin + website: implement, then run all three locally together (backend :8080, website :5199, admin :5200).
3. **User tests locally.** Nothing is merged, pushed to `main`/`master` or deployed until the user says so.
4. On the user's go-ahead: deploy the backend to the Oracle VM (smoke-test on 8081, then cut over), then push admin `master` and website `main` (Vercel auto-deploys).
5. Afterwards: user replaces sample data with real posts via admin; `gallerySamples.js` deleted in a follow-up.

## Out of scope

Event dates, cover picker, shareable post URLs, likes/comments, drag-and-drop reordering, video.
