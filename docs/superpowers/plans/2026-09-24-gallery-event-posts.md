# Gallery Event Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Studios Gallery into an Instagram-style profile grid of event posts, each holding 1–20 photos, editable from the admin app.

**Architecture:** Extend the existing `gallery_items` table with a child `gallery_item_photos` table (additive migration V30, backfilled), keep `gallery_items.media_id` as the cover so the currently-live backend/admin/website keep working. Backend returns `photos[]` + `location`; admin edits an ordered photo list; website normalises old/new response shapes and renders a square-cover grid that opens a carousel post viewer.

**Tech Stack:** Spring Boot 4 / JPA / Flyway / JUnit 5 + Mockito (`mcreatik-backend`), React + TypeScript + shadcn/ui (`mcreatik-admin`), React 19 + Tailwind v4 + framer-motion + Vitest (`mcreatik`).

**Spec:** `docs/superpowers/specs/2026-09-24-gallery-event-posts-design.md` (in `D:\Websites\mcreatik`). Read it before starting any task.

## Global Constraints

- **Shared database.** Local backend and production use the SAME Supabase database. Anything that boots a Spring context (running the app, any `@SpringBootTest`) runs Flyway against production. **No `@SpringBootTest` and no app start until Task 1's throwaway validation has passed.**
- **No test may write to the database.** Service tests are pure Mockito; controller tests mock `GalleryService`.
- V30 is **purely additive**: no dropped/renamed columns, `gallery_items.media_id` stays `NOT NULL`.
- Photos per post: **min 1, max 20**. No duplicate `mediaId` in a post. Per-photo `altText` max **500** chars (matches `media.alt_text VARCHAR(500)`).
- `gallery_items.media_id` (the cover) must always equal the first photo's media.
- Public list order unchanged: featured first, then `createdAt DESC`.
- Backward compat: backend accepts legacy `{mediaId}` requests (no `photos`) as a one-photo post; response keeps `media`; website falls back to `[media]` when `photos` is missing.
- Sample photos (`gallerySamples.js`) are used **only when `import.meta.env.DEV`**.
- Branch `gallery-event-posts` in all three repos. **Nothing is merged, pushed to `main`/`master`, or deployed** — the user tests locally first.
- Commit messages end with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- Known ESLint false positive in `mcreatik`: `'motion' is defined but never used` for `motion.div` JSX usage — ignore it.

## File Map

**`D:\Websites\mcreatik-backend`**
- Create `src/main/resources/db/migration/V30__add_gallery_item_photos.sql` — schema + backfill
- Create `src/main/java/com/mcreatik/cms/gallery/entity/GalleryItemPhoto.java` — ordered photo row
- Modify `src/main/java/com/mcreatik/cms/gallery/entity/GalleryItem.java` — `location`, `photos`, `addPhoto`/`clearPhotos`
- Create `src/main/java/com/mcreatik/cms/gallery/dto/GalleryPhotoRequest.java`
- Create `src/main/java/com/mcreatik/cms/gallery/dto/GalleryPhotoResponse.java`
- Modify `src/main/java/com/mcreatik/cms/gallery/dto/GalleryRequest.java` — `location`, `photos`, `resolvedPhotos()`
- Modify `src/main/java/com/mcreatik/cms/gallery/dto/GalleryResponse.java` — `photos`, `location`
- Modify `src/main/java/com/mcreatik/cms/gallery/repository/GalleryItemRepository.java` — entity graphs
- Modify `src/main/java/com/mcreatik/cms/gallery/service/GalleryService.java` — photo validation + replace
- Create `src/test/java/com/mcreatik/cms/gallery/service/GalleryServiceTest.java`
- Create `src/test/java/com/mcreatik/cms/gallery/controller/GalleryAdminControllerTest.java`

**`D:\Websites\mcreatik`** (website)
- Create `src/components/studios/galleryPosts.js` + `galleryPosts.test.js` — response normalisation
- Rewrite `src/components/studios/gallerySamples.js` — sample posts
- Rewrite `src/components/studios/Gallery.jsx` — square grid
- Create `src/components/studios/GalleryPostViewer.jsx` — carousel post modal
- Delete `src/components/studios/GalleryLightbox.jsx`

**`D:\Websites\mcreatik-admin`**
- Modify `src/types/gallery.ts`
- Modify `src/pages/gallery/GalleryFormPage.tsx`
- Modify `src/pages/gallery/GalleryListPage.tsx`

---

### Task 1: V30 migration, validated on a throwaway Postgres

**Files:**
- Create: `D:\Websites\mcreatik-backend\src\main\resources\db\migration\V30__add_gallery_item_photos.sql`

**Interfaces:**
- Produces: table `gallery_item_photos(id, gallery_item_id, media_id, sort_order, alt_text VARCHAR(500), created_at, updated_at, UNIQUE(gallery_item_id, media_id))`, column `gallery_items.location VARCHAR(255)`.

- [ ] **Step 1: Create the feature branch**

```bash
cd /d/Websites/mcreatik-backend && git switch -c gallery-event-posts
```

- [ ] **Step 2: Write the migration**

```sql
-- Gallery items become multi-photo "event posts" (1-20 photos each).
-- Purely additive: the backend currently live in production still reads/writes
-- gallery_items.media_id and knows nothing about this table, and it shares this
-- database with local dev — so nothing here may break the old code. media_id is
-- kept and always points at the post's first photo (the cover).
ALTER TABLE gallery_items ADD COLUMN location VARCHAR(255);

CREATE TABLE gallery_item_photos (
    id              BIGSERIAL PRIMARY KEY,
    gallery_item_id BIGINT NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
    media_id        BIGINT NOT NULL REFERENCES media(id),
    sort_order      INT NOT NULL DEFAULT 0,
    -- Same width as media.alt_text so the backfill below can never overflow.
    alt_text        VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (gallery_item_id, media_id)
);

CREATE INDEX idx_gallery_item_photos_item_id ON gallery_item_photos(gallery_item_id);

-- Every existing single-photo item becomes a one-photo post.
INSERT INTO gallery_item_photos (gallery_item_id, media_id, sort_order, alt_text)
SELECT gi.id, gi.media_id, 0, m.alt_text
FROM gallery_items gi
JOIN media m ON m.id = gi.media_id;
```

- [ ] **Step 3: Copy all migrations to the VM and start a throwaway Postgres**

`ssh mcreatik-oracle` is already configured (see memory `digital-store-go-live-checklist`). There is no `rsync`; use tar over ssh.

```bash
cd /d/Websites/mcreatik-backend && tar czf - -C src/main/resources/db migration | ssh mcreatik-oracle "rm -rf ~/v30check && mkdir -p ~/v30check && tar xzf - -C ~/v30check"
ssh mcreatik-oracle "docker run -d --name pg-v30-check -e POSTGRES_PASSWORD=check postgres:16-alpine && sleep 6 && docker exec pg-v30-check pg_isready -U postgres"
```
Expected: `accepting connections`.

- [ ] **Step 4: Apply V1–V29, seed one legacy gallery item, then apply V30**

```bash
ssh mcreatik-oracle 'cd ~/v30check/migration && for f in $(ls V*.sql | sort -V | grep -v "^V30__"); do docker exec -i pg-v30-check psql -v ON_ERROR_STOP=1 -q -U postgres < "$f" || { echo "FAILED $f"; exit 1; }; done; echo PRE_V30_OK'
ssh mcreatik-oracle 'docker exec -i pg-v30-check psql -v ON_ERROR_STOP=1 -U postgres <<SQL
INSERT INTO media (object_key, url, content_type, alt_text) VALUES ($$k1$$, $$https://x/1.jpg$$, $$image/jpeg$$, repeat($$a$$, 500));
INSERT INTO gallery_items (title, media_id, category, status) VALUES ($$Legacy$$, currval($$media_id_seq$$), $$Ring Ceremony$$, $$PUBLISHED$$);
SQL'
ssh mcreatik-oracle 'docker exec -i pg-v30-check psql -v ON_ERROR_STOP=1 -U postgres < ~/v30check/migration/V30__add_gallery_item_photos.sql && echo V30_OK'
```
Expected: `PRE_V30_OK`, then `V30_OK`. If any pre-V30 file fails on vanilla Postgres (e.g. a Supabase-only extension), report the file and error to the controller instead of editing old migrations.

- [ ] **Step 5: Verify backfill and old-code compatibility**

```bash
ssh mcreatik-oracle 'docker exec -i pg-v30-check psql -v ON_ERROR_STOP=1 -U postgres <<SQL
SELECT gi.title, p.sort_order, length(p.alt_text) AS alt_len FROM gallery_item_photos p JOIN gallery_items gi ON gi.id = p.gallery_item_id;
-- The OLD backend inserts items like this (no location, no photo rows) — must still work:
INSERT INTO gallery_items (title, media_id, category, status) VALUES ($$OldCodeInsert$$, 1, $$X$$, $$DRAFT$$);
DELETE FROM gallery_items WHERE title = $$Legacy$$;
SELECT count(*) AS photos_left FROM gallery_item_photos;
SQL'
```
Expected: one row `Legacy | 0 | 500`; the insert succeeds; `photos_left = 0` (cascade delete works).

- [ ] **Step 6: Tear down**

```bash
ssh mcreatik-oracle "docker rm -f pg-v30-check && rm -rf ~/v30check"
```

- [ ] **Step 7: Commit**

```bash
cd /d/Websites/mcreatik-backend && git add src/main/resources/db/migration/V30__add_gallery_item_photos.sql && git commit -m "Add gallery_item_photos table for multi-photo gallery posts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Backend entity, DTOs, repository and service (TDD, Mockito only)

**Files:**
- Create: `src/main/java/com/mcreatik/cms/gallery/entity/GalleryItemPhoto.java`
- Modify: `src/main/java/com/mcreatik/cms/gallery/entity/GalleryItem.java`
- Create: `src/main/java/com/mcreatik/cms/gallery/dto/GalleryPhotoRequest.java`
- Create: `src/main/java/com/mcreatik/cms/gallery/dto/GalleryPhotoResponse.java`
- Modify: `src/main/java/com/mcreatik/cms/gallery/dto/GalleryRequest.java`
- Modify: `src/main/java/com/mcreatik/cms/gallery/dto/GalleryResponse.java`
- Modify: `src/main/java/com/mcreatik/cms/gallery/repository/GalleryItemRepository.java`
- Modify: `src/main/java/com/mcreatik/cms/gallery/service/GalleryService.java`
- Test: `src/test/java/com/mcreatik/cms/gallery/service/GalleryServiceTest.java`

(All paths relative to `D:\Websites\mcreatik-backend`.)

**Interfaces:**
- Consumes: V30 schema from Task 1.
- Produces:
  - `record GalleryPhotoRequest(@NotNull Long mediaId, @Size(max = 500) String altText)`
  - `record GalleryRequest(String title, String description, Long mediaId, String category, String location, boolean featured, ContentStatus status, List<GalleryPhotoRequest> photos)` with `List<GalleryPhotoRequest> resolvedPhotos()`
  - `record GalleryPhotoResponse(MediaResponse media, String altText)`
  - `record GalleryResponse(Long id, String title, String description, MediaResponse media, List<GalleryPhotoResponse> photos, String category, String location, boolean featured, ContentStatus status, Instant createdAt)`
  - JSON: `{ id, title, description, media, photos: [{ media, altText }], category, location, featured, status, createdAt }`

- [ ] **Step 1: Write the failing tests**

`src/test/java/com/mcreatik/cms/gallery/service/GalleryServiceTest.java`:

```java
package com.mcreatik.cms.gallery.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyIterable;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.LongStream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.mcreatik.cms.common.ContentStatus;
import com.mcreatik.cms.gallery.dto.GalleryPhotoRequest;
import com.mcreatik.cms.gallery.dto.GalleryPhotoResponse;
import com.mcreatik.cms.gallery.dto.GalleryRequest;
import com.mcreatik.cms.gallery.dto.GalleryResponse;
import com.mcreatik.cms.gallery.entity.GalleryItem;
import com.mcreatik.cms.gallery.repository.GalleryItemRepository;
import com.mcreatik.cms.media.entity.Media;
import com.mcreatik.cms.media.repository.MediaRepository;
import com.mcreatik.cms.user.entity.User;
import com.mcreatik.cms.user.repository.UserRepository;

// Pure Mockito — the dev and production databases are the same Supabase project,
// so these tests must never touch a real repository.
class GalleryServiceTest {

    private final GalleryItemRepository galleryItemRepository = mock(GalleryItemRepository.class);
    private final MediaRepository mediaRepository = mock(MediaRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final List<Media> mediaStore = new ArrayList<>();

    private GalleryService service;

    @BeforeEach
    void setUp() {
        service = new GalleryService(galleryItemRepository, mediaRepository, userRepository);
        LongStream.rangeClosed(1, 25).forEach(id -> mediaStore.add(media(id)));
        when(mediaRepository.findAllById(anyIterable())).thenAnswer(inv -> {
            List<Long> ids = new ArrayList<>();
            ((Iterable<Long>) inv.getArgument(0)).forEach(ids::add);
            return mediaStore.stream().filter(m -> ids.contains(m.getId())).toList();
        });
        when(galleryItemRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(galleryItemRepository.saveAndFlush(any())).thenAnswer(inv -> inv.getArgument(0));
        when(userRepository.findByEmail("admin@test")).thenReturn(Optional.of(mock(User.class)));
    }

    private static Media media(long id) {
        Media media = new Media("key-" + id, "https://cdn.test/" + id + ".jpg", "image/jpeg", 10L, "media alt " + id, null);
        ReflectionTestUtils.setField(media, "id", id);
        return media;
    }

    private static GalleryRequest request(List<GalleryPhotoRequest> photos) {
        return new GalleryRequest("Wedding", "Caption", null, "Wedding Photography", "Kumbakonam",
                false, ContentStatus.PUBLISHED, photos);
    }

    private static List<GalleryPhotoRequest> photos(long... ids) {
        return LongStream.of(ids).mapToObj(id -> new GalleryPhotoRequest(id, "alt " + id)).toList();
    }

    private static List<Long> mediaIds(GalleryResponse response) {
        return response.photos().stream().map(p -> p.media().id()).toList();
    }

    private void assertBadRequest(GalleryRequest request, String messagePart) {
        assertThatThrownBy(() -> service.create(request, "admin@test"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(rse.getReason()).contains(messagePart);
                });
    }

    @Test
    void createKeepsPhotoOrderAndUsesFirstPhotoAsCover() {
        GalleryResponse response = service.create(request(photos(7, 3, 12)), "admin@test");

        assertThat(mediaIds(response)).containsExactly(7L, 3L, 12L);
        assertThat(response.media().id()).isEqualTo(7L);
        assertThat(response.photos().get(1).altText()).isEqualTo("alt 3");
        assertThat(response.location()).isEqualTo("Kumbakonam");
    }

    @Test
    void blankAltTextIsStoredAsNull() {
        GalleryResponse response = service.create(
                request(List.of(new GalleryPhotoRequest(1L, "   "))), "admin@test");

        assertThat(response.photos().get(0).altText()).isNull();
    }

    @Test
    void createAcceptsExactlyTwentyPhotos() {
        long[] ids = LongStream.rangeClosed(1, 20).toArray();

        assertThat(service.create(request(photos(ids)), "admin@test").photos()).hasSize(20);
    }

    @Test
    void createRejectsZeroPhotos() {
        assertBadRequest(request(List.of()), "at least one photo");
    }

    @Test
    void createRejectsMoreThanTwentyPhotos() {
        assertBadRequest(request(photos(LongStream.rangeClosed(1, 21).toArray())), "at most 20 photos");
    }

    @Test
    void createRejectsDuplicatePhoto() {
        assertBadRequest(request(photos(4, 5, 4)), "added more than once");
    }

    @Test
    void createRejectsUnknownMedia() {
        assertBadRequest(request(photos(1, 999)), "do not exist");
    }

    @Test
    void legacyMediaIdOnlyRequestBecomesOnePhotoPost() {
        GalleryRequest legacy = new GalleryRequest("Old", null, 9L, "Portrait Session", null,
                false, ContentStatus.DRAFT, null);

        GalleryResponse response = service.create(legacy, "admin@test");

        assertThat(mediaIds(response)).containsExactly(9L);
        assertThat(response.media().id()).isEqualTo(9L);
    }

    @Test
    void updateReplacesPhotosAndMovesCover() {
        GalleryItem existing = new GalleryItem("Wedding", null, mediaStore.get(0), "Wedding Photography",
                null, false, ContentStatus.DRAFT, null);
        existing.addPhoto(mediaStore.get(0), null);
        existing.addPhoto(mediaStore.get(1), null);
        when(galleryItemRepository.findById(1L)).thenReturn(Optional.of(existing));

        GalleryResponse response = service.update(1L, request(photos(2, 5)));

        assertThat(mediaIds(response)).containsExactly(2L, 5L);
        assertThat(response.media().id()).isEqualTo(2L);
    }

    @Test
    void itemWithNoPhotoRowsIsReadAsOnePhotoPost() {
        // Created by the old backend after V30 landed but before this code deployed.
        GalleryItem legacy = new GalleryItem("Legacy", null, mediaStore.get(4), "Ring Ceremony",
                null, false, ContentStatus.PUBLISHED, null);

        GalleryResponse response = GalleryResponse.from(legacy);

        assertThat(response.photos()).containsExactly(
                new GalleryPhotoResponse(response.media(), "media alt 5"));
    }
}
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd /d/Websites/mcreatik-backend && ./mvnw -q test -Dtest=GalleryServiceTest`
Expected: COMPILATION ERROR (`GalleryPhotoRequest`, `addPhoto`, etc. do not exist). **Do not run the full suite** — other tests boot a Spring context against the shared DB.

- [ ] **Step 3: Create `GalleryItemPhoto`**

```java
package com.mcreatik.cms.gallery.entity;

import com.mcreatik.cms.common.entity.BaseEntity;
import com.mcreatik.cms.media.entity.Media;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "gallery_item_photos")
public class GalleryItemPhoto extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gallery_item_id")
    private GalleryItem galleryItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "media_id")
    private Media media;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "alt_text", length = 500)
    private String altText;

    protected GalleryItemPhoto() {
        // JPA
    }

    public GalleryItemPhoto(GalleryItem galleryItem, Media media, int sortOrder, String altText) {
        this.galleryItem = galleryItem;
        this.media = media;
        this.sortOrder = sortOrder;
        this.altText = altText;
    }

    public Media getMedia() {
        return media;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public String getAltText() {
        return altText;
    }
}
```

- [ ] **Step 4: Update `GalleryItem`**

Replace the whole file with:

```java
package com.mcreatik.cms.gallery.entity;

import java.util.ArrayList;
import java.util.List;

import com.mcreatik.cms.common.ContentStatus;
import com.mcreatik.cms.common.entity.BaseEntity;
import com.mcreatik.cms.media.entity.Media;
import com.mcreatik.cms.user.entity.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "gallery_items")
public class GalleryItem extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // The post's cover — always the first entry in photos. Kept as its own column
    // (rather than derived) so the pre-multi-photo backend, which only knows this
    // column, keeps working against the same database during rollout.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "media_id")
    private Media media;

    @Column(nullable = false)
    private String category;

    private String location;

    @Column(nullable = false)
    private boolean featured;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // orphanRemoval: replacing this list's contents (clear + re-add) deletes the
    // rows that fell out, same as Album.photos.
    @OneToMany(mappedBy = "galleryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<GalleryItemPhoto> photos = new ArrayList<>();

    protected GalleryItem() {
        // JPA
    }

    public GalleryItem(String title, String description, Media cover, String category, String location,
            boolean featured, ContentStatus status, User createdBy) {
        this.title = title;
        this.description = description;
        this.media = cover;
        this.category = category;
        this.location = location;
        this.featured = featured;
        this.status = status;
        this.createdBy = createdBy;
    }

    public void update(String title, String description, String category, String location,
            boolean featured, ContentStatus status) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.featured = featured;
        this.status = status;
    }

    /**
     * The caller must flush after this and before re-adding photos — otherwise a photo
     * that only changed position is re-inserted before its old row is deleted and trips
     * the (gallery_item_id, media_id) unique constraint. Same as Album.clearPhotos().
     */
    public void clearPhotos() {
        photos.clear();
    }

    /** Appends a photo at the end; the first photo added also becomes the cover. */
    public void addPhoto(Media photo, String altText) {
        if (photos.isEmpty()) {
            this.media = photo;
        }
        photos.add(new GalleryItemPhoto(this, photo, photos.size(), altText));
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Media getMedia() {
        return media;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public boolean isFeatured() {
        return featured;
    }

    public ContentStatus getStatus() {
        return status;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public List<GalleryItemPhoto> getPhotos() {
        return photos;
    }
}
```

- [ ] **Step 5: Create the photo DTOs**

`GalleryPhotoRequest.java`:
```java
package com.mcreatik.cms.gallery.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GalleryPhotoRequest(
        @NotNull Long mediaId,
        @Size(max = 500) String altText) {
}
```

`GalleryPhotoResponse.java`:
```java
package com.mcreatik.cms.gallery.dto;

import com.mcreatik.cms.media.dto.MediaResponse;

public record GalleryPhotoResponse(MediaResponse media, String altText) {
}
```

- [ ] **Step 6: Replace `GalleryRequest`**

```java
package com.mcreatik.cms.gallery.dto;

import java.util.List;

import com.mcreatik.cms.common.ContentStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * mediaId is the pre-multi-photo request shape, still sent by the admin app until its
 * new photo-list form ships. When photos is absent, mediaId is treated as a one-photo post.
 */
public record GalleryRequest(
        @NotBlank String title,
        String description,
        Long mediaId,
        @NotBlank String category,
        @Size(max = 255) String location,
        boolean featured,
        @NotNull ContentStatus status,
        @Valid List<GalleryPhotoRequest> photos) {

    public List<GalleryPhotoRequest> resolvedPhotos() {
        if (photos != null && !photos.isEmpty()) {
            return photos;
        }
        return mediaId == null ? List.of() : List.of(new GalleryPhotoRequest(mediaId, null));
    }
}
```

- [ ] **Step 7: Replace `GalleryResponse`**

```java
package com.mcreatik.cms.gallery.dto;

import java.time.Instant;
import java.util.List;

import com.mcreatik.cms.common.ContentStatus;
import com.mcreatik.cms.gallery.entity.GalleryItem;
import com.mcreatik.cms.media.dto.MediaResponse;

/** media is the cover (= photos[0]); kept so pre-multi-photo clients keep working. */
public record GalleryResponse(
        Long id,
        String title,
        String description,
        MediaResponse media,
        List<GalleryPhotoResponse> photos,
        String category,
        String location,
        boolean featured,
        ContentStatus status,
        Instant createdAt) {

    public static GalleryResponse from(GalleryItem item) {
        MediaResponse cover = MediaResponse.from(item.getMedia());
        // An item written by the old backend after V30 has no photo rows yet.
        List<GalleryPhotoResponse> photos = item.getPhotos().isEmpty()
                ? List.of(new GalleryPhotoResponse(cover, item.getMedia().getAltText()))
                : item.getPhotos().stream()
                        .map(p -> new GalleryPhotoResponse(MediaResponse.from(p.getMedia()), p.getAltText()))
                        .toList();
        return new GalleryResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                cover,
                photos,
                item.getCategory(),
                item.getLocation(),
                item.isFeatured(),
                item.getStatus(),
                item.getCreatedAt());
    }
}
```

- [ ] **Step 8: Update `GalleryItemRepository` entity graphs**

Replace every `@EntityGraph(attributePaths = "media")` with:
```java
    @EntityGraph(attributePaths = { "media", "photos", "photos.media" })
```
and update the comment above them to say `media and photos are LAZY`.

- [ ] **Step 9: Update `GalleryService`**

Add imports:
```java
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.mcreatik.cms.gallery.dto.GalleryPhotoRequest;
```

Replace `create` and `update`, and add the helpers (remove the now-unused `findMediaOrThrow`):

```java
    static final int MAX_PHOTOS = 20;

    @Transactional
    public GalleryResponse create(GalleryRequest request, String creatorEmail) {
        List<ResolvedPhoto> photos = resolvePhotos(request);
        User creator = findUserOrThrow(creatorEmail);
        GalleryItem item = new GalleryItem(
                request.title(), request.description(), photos.get(0).media(), request.category(),
                request.location(), request.featured(), request.status(), creator);
        photos.forEach(p -> item.addPhoto(p.media(), p.altText()));
        return GalleryResponse.from(galleryItemRepository.save(item));
    }

    @Transactional
    public GalleryResponse update(Long id, GalleryRequest request) {
        GalleryItem item = findOrThrow(id);
        List<ResolvedPhoto> photos = resolvePhotos(request);
        item.update(request.title(), request.description(), request.category(),
                request.location(), request.featured(), request.status());

        // See GalleryItem.clearPhotos() — the delete must flush before the re-add.
        item.clearPhotos();
        galleryItemRepository.saveAndFlush(item);
        photos.forEach(p -> item.addPhoto(p.media(), p.altText()));
        return GalleryResponse.from(galleryItemRepository.save(item));
    }

    private record ResolvedPhoto(Media media, String altText) {
    }

    /** Validates the requested photo list and loads its media, preserving the caller's order. */
    private List<ResolvedPhoto> resolvePhotos(GalleryRequest request) {
        List<GalleryPhotoRequest> requested = request.resolvedPhotos();
        if (requested.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A post needs at least one photo");
        }
        if (requested.size() > MAX_PHOTOS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A post can have at most " + MAX_PHOTOS + " photos");
        }
        List<Long> ids = requested.stream().map(GalleryPhotoRequest::mediaId).toList();
        if (new HashSet<>(ids).size() != ids.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The same photo is added more than once");
        }
        Map<Long, Media> found = mediaRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Media::getId, Function.identity()));
        if (found.size() != ids.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more photos do not exist");
        }
        return requested.stream()
                .map(p -> new ResolvedPhoto(found.get(p.mediaId()), blankToNull(p.altText())))
                .toList();
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
```

- [ ] **Step 10: Run the tests to verify they pass**

Run: `./mvnw -q test -Dtest=GalleryServiceTest`
Expected: `Tests run: 10, Failures: 0, Errors: 0`. Also run `./mvnw -q compile` to confirm nothing else referenced the removed `GalleryItem.update(..., Media, ...)` signature or `findMediaOrThrow`.

- [ ] **Step 11: Commit**

```bash
git add src/main/java/com/mcreatik/cms/gallery src/test/java/com/mcreatik/cms/gallery && git commit -m "Support 1-20 photos per gallery item, with location and per-photo alt text

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Backend controller test + first boot against the shared DB

**Files:**
- Test: `D:\Websites\mcreatik-backend\src\test\java\com\mcreatik\cms\gallery\controller\GalleryAdminControllerTest.java`

**Interfaces:**
- Consumes: `GalleryRequest`, `GalleryPhotoRequest`, `GalleryResponse`, `GalleryPhotoResponse` from Task 2.

> ⚠️ This is the first step that boots Spring, so it **applies V30 to the shared production database**. Only proceed if Task 1 passed. Immediately after the first run, do Step 3.

- [ ] **Step 1: Write the test**

```java
package com.mcreatik.cms.gallery.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.mcreatik.cms.common.ContentStatus;
import com.mcreatik.cms.gallery.dto.GalleryPhotoResponse;
import com.mcreatik.cms.gallery.dto.GalleryRequest;
import com.mcreatik.cms.gallery.dto.GalleryResponse;
import com.mcreatik.cms.gallery.service.GalleryService;
import com.mcreatik.cms.media.dto.MediaResponse;

// @SpringBootTest + @AutoConfigureMockMvc (not @WebMvcTest), same as the other admin
// controller tests: only this loads the real SecurityConfig. GalleryService is mocked,
// so nothing is written to the (shared dev/prod) database.
@SpringBootTest
@AutoConfigureMockMvc
class GalleryAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GalleryService galleryService;

    private static GalleryResponse sampleResponse() {
        MediaResponse cover = new MediaResponse(7L, "https://cdn.test/7.jpg", "image/jpeg", 10L, null, null);
        return new GalleryResponse(1L, "Wedding", null, cover, List.of(new GalleryPhotoResponse(cover, "Bride")),
                "Wedding Photography", "Kumbakonam", false, ContentStatus.PUBLISHED, null);
    }

    @Test
    @WithMockUser(username = "admin@test", roles = "ADMIN")
    void createBindsPhotoListAndLocation() throws Exception {
        when(galleryService.create(any(), eq("admin@test"))).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/v1/admin/gallery")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"title":"Wedding","category":"Wedding Photography","location":"Kumbakonam",
                         "status":"PUBLISHED","photos":[{"mediaId":7,"altText":"Bride"},{"mediaId":3}]}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.photos[0].altText").value("Bride"))
                .andExpect(jsonPath("$.location").value("Kumbakonam"))
                .andExpect(jsonPath("$.media.id").value(7));

        ArgumentCaptor<GalleryRequest> captor = ArgumentCaptor.forClass(GalleryRequest.class);
        verify(galleryService).create(captor.capture(), eq("admin@test"));
        assertThat(captor.getValue().photos()).extracting("mediaId").containsExactly(7L, 3L);
        assertThat(captor.getValue().location()).isEqualTo("Kumbakonam");
    }

    @Test
    @WithMockUser(username = "admin@test", roles = "ADMIN")
    void altTextLongerThan500IsRejected() throws Exception {
        String longAlt = "a".repeat(501);

        mockMvc.perform(post("/api/v1/admin/gallery")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"title":"Wedding","category":"Wedding Photography","status":"PUBLISHED",
                         "photos":[{"mediaId":7,"altText":"%s"}]}
                        """.formatted(longAlt)))
                .andExpect(status().isBadRequest());

        verify(galleryService, never()).create(any(), any());
    }

    @Test
    @WithMockUser(username = "admin@test", roles = "ADMIN")
    void photoWithoutMediaIdIsRejected() throws Exception {
        mockMvc.perform(post("/api/v1/admin/gallery")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"title":"Wedding","category":"Wedding Photography","status":"PUBLISHED",
                         "photos":[{"altText":"no id"}]}
                        """))
                .andExpect(status().isBadRequest());

        verify(galleryService, never()).create(any(), any());
    }
}
```

- [ ] **Step 2: Run it**

Run: `./mvnw -q test -Dtest=GalleryAdminControllerTest`
Expected: `Tests run: 3, Failures: 0, Errors: 0`, and the log shows Flyway `Migrating schema "public" to version "30 - add gallery item photos"` then `Successfully applied 1 migration` (first run only).

- [ ] **Step 3: Confirm production still works after V30 landed**

```bash
curl -s -o /dev/null -w "gallery %{http_code}\n" "https://api.mcreatik.com/api/v1/gallery?size=5"
curl -s -o /dev/null -w "albums %{http_code}\n" "https://api.mcreatik.com/api/v1/albums?size=5"
curl -s -o /dev/null -w "blog %{http_code}\n" "https://api.mcreatik.com/api/v1/blog?size=5"
curl -s "https://api.mcreatik.com/api/v1/gallery?size=5" | head -c 300
```
Expected: all `200`, and the Ring Ceremony item still returns. If anything is not 200, **stop and report** — do not attempt to roll back the migration yourself.

- [ ] **Step 4: Run the full backend suite**

Run: `./mvnw -q test`
Expected: everything passes except the 3 known pre-existing `OrderServiceAtomicUpdateCommitTest` failures (fragile `.get(0)` on ACTIVE products — documented in memory, unrelated). Report any other failure.

- [ ] **Step 5: Commit**

```bash
git add src/test/java/com/mcreatik/cms/gallery/controller && git commit -m "Test gallery admin photo-list binding and validation

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Website — response normalisation + sample posts

**Files:** (relative to `D:\Websites\mcreatik`, branch `gallery-event-posts` already checked out)
- Create: `src/components/studios/galleryPosts.js`
- Test: `src/components/studios/galleryPosts.test.js`
- Rewrite: `src/components/studios/gallerySamples.js`

**Interfaces:**
- Produces:
  - `toPost(item) → { ...item, location: string|null, photos: Array<{ media: { id?, url, altText? }, altText: string|null }> }` (photos always ≥ 1)
  - `photoAlt(post, photo) → string`
  - `GALLERY_SAMPLES: Array<post-shaped item>` (already in `photos` shape)

- [ ] **Step 1: Write the failing tests**

```js
import { describe, expect, it } from 'vitest'
import { photoAlt, toPost } from './galleryPosts'

const media = { id: 7, url: 'https://cdn.test/7.jpg', altText: 'Media alt' }

describe('toPost', () => {
  it('keeps the photos array from the new API shape', () => {
    const photos = [{ media, altText: 'Bride' }, { media: { id: 8, url: 'u8' }, altText: null }]
    const post = toPost({ id: 1, title: 'Wedding', media, photos, location: 'Kumbakonam' })

    expect(post.photos).toBe(photos)
    expect(post.location).toBe('Kumbakonam')
  })

  it('falls back to a single photo when the API has no photos field (old backend)', () => {
    const post = toPost({ id: 1, title: 'Legacy', media })

    expect(post.photos).toEqual([{ media, altText: 'Media alt' }])
    expect(post.location).toBeNull()
  })

  it('falls back when photos is an empty array', () => {
    expect(toPost({ id: 1, title: 'Empty', media, photos: [] }).photos).toHaveLength(1)
  })
})

describe('photoAlt', () => {
  it('prefers the per-photo alt text, then the post title', () => {
    const post = { title: 'Wedding' }
    expect(photoAlt(post, { altText: 'Bride' })).toBe('Bride')
    expect(photoAlt(post, { altText: null })).toBe('Wedding')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/components/studios/galleryPosts.test.js`
Expected: FAIL — cannot resolve `./galleryPosts`.

- [ ] **Step 3: Implement `galleryPosts.js`**

```js
/* ============================================
   Gallery posts — response normalisation
   The CMS returns photos[] per gallery item from
   the multi-photo backend onward; older backends
   only send a single `media`. toPost() gives the
   UI one shape either way.
   ============================================ */

export function toPost(item) {
  const photos = item.photos?.length ? item.photos : [{ media: item.media, altText: item.media?.altText ?? null }]
  return { ...item, location: item.location ?? null, photos }
}

export function photoAlt(post, photo) {
  return photo.altText || post.title
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/components/studios/galleryPosts.test.js`
Expected: 4 passed.

- [ ] **Step 5: Rewrite `gallerySamples.js` as sample posts**

```js
/* ============================================
   Gallery sample posts — LOCAL DEV ONLY
   Placeholder event posts (picsum.photos) so the
   grid and post viewer can be reviewed with
   realistic volume before real posts exist in
   the CMS. Gallery.jsx only uses these when
   import.meta.env.DEV is true, so they never
   ship to production. Delete this file once the
   real posts are in.
   ============================================ */

const CATEGORIES = [
  'Portrait Session',
  'Wedding Photography',
  'Pre and Post Wedding',
  'Baby & Kids Outdoor Shoots',
  'Model Outdoor Shoots',
  'Maternity and Baby Shower',
  'Birthday Parties',
  'Ring Ceremony',
  'House Warming',
  'Photo Album Design',
]

const LOCATIONS = ['Chennai', 'Kumbakonam', 'Pondicherry', null]

// Photo counts per post, rotated per category — covers the 1-photo, typical, and 20-photo cases.
const PHOTO_COUNTS = [
  [1, 6, 20],
  [4, 9, 2],
  [12, 3, 7],
]

// Mixed portrait / landscape / square shapes so the viewer's object-contain gets exercised.
const SIZES = [
  [800, 1100],
  [1200, 800],
  [900, 900],
  [800, 1200],
  [1200, 850],
]

export const GALLERY_SAMPLES = CATEGORIES.flatMap((category, c) =>
  PHOTO_COUNTS[c % PHOTO_COUNTS.length].map((count, p) => ({
    id: `sample-${c}-${p}`,
    title: `${category} — Sample Event ${p + 1}`,
    description: 'Sample caption. Replace this post with a real event from the admin panel.',
    category,
    location: LOCATIONS[(c + p) % LOCATIONS.length],
    photos: Array.from({ length: count }, (_, i) => {
      const [w, h] = SIZES[(c + p + i) % SIZES.length]
      return {
        media: { id: `sample-${c}-${p}-${i}`, url: `https://picsum.photos/seed/mcreatik-${c}-${p}-${i}/${w}/${h}` },
        altText: null,
      }
    }),
  }))
)
```

- [ ] **Step 6: Commit**

```bash
git add src/components/studios/galleryPosts.js src/components/studios/galleryPosts.test.js src/components/studios/gallerySamples.js && git commit -m "Normalise gallery items into multi-photo posts; sample posts for local dev

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Website — Instagram-style grid + post viewer

**Files:** (relative to `D:\Websites\mcreatik`)
- Create: `src/components/studios/GalleryPostViewer.jsx`
- Rewrite: `src/components/studios/Gallery.jsx`
- Delete: `src/components/studios/GalleryLightbox.jsx`

**Interfaces:**
- Consumes: `toPost`, `photoAlt` from `./galleryPosts`; `GALLERY_SAMPLES` from `./gallerySamples`; `fetchGalleryItems()` from `../../utils/cmsApi` (returns the API `content` array).
- Produces: `<GalleryPostViewer posts={Post[]} index={number} onIndexChange={(i) => void} onClose={() => void} />`

- [ ] **Step 1: Create `GalleryPostViewer.jsx`**

```jsx
/* ============================================
   GalleryPostViewer — one event post, opened
   from the Gallery grid. Photo carousel (arrows,
   dots, ←/→ keys, swipe) plus the post's title,
   location, category and caption. Desktop: modal
   with the details panel on the right and arrows
   to the previous/next post. Mobile: full screen,
   details under the carousel. Closes on Escape,
   the X, or a backdrop click.
   ============================================ */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiMapPin, FiX } from 'react-icons/fi'
import { photoAlt } from './galleryPosts'

const SWIPE_THRESHOLD = 50

export default function GalleryPostViewer({ posts, index, onIndexChange, onClose }) {
  const post = posts[index]
  const [photoIndex, setPhotoIndex] = useState(0)
  const touchStartX = useRef(null)
  const photos = post?.photos ?? []
  const hasManyPhotos = photos.length > 1

  // Opening another post always starts from its cover.
  useEffect(() => setPhotoIndex(0), [post?.id])

  const prevPhoto = useCallback(() => setPhotoIndex((i) => Math.max(i - 1, 0)), [])
  const nextPhoto = useCallback(() => setPhotoIndex((i) => Math.min(i + 1, photos.length - 1)), [photos.length])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [onClose, nextPhoto, prevPhoto])

  if (!post) return null
  const photo = photos[photoIndex]

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta > SWIPE_THRESHOLD) prevPhoto()
    if (delta < -SWIPE_THRESHOLD) nextPhoto()
  }

  const stop = (e) => e.stopPropagation()
  const photoArrow =
    'absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/85 text-[#1C1710] shadow hover:bg-white transition-colors'
  const postArrow =
    'hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[101] w-11 h-11 rounded-full items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      className="fixed inset-0 z-[100] bg-[#0F0D0A] lg:bg-black/85 lg:flex lg:items-center lg:justify-center lg:p-10"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-3 right-3 z-[102] w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <FiX className="w-6 h-6" />
      </button>

      {index > 0 && (
        <button
          onClick={(e) => {
            stop(e)
            onIndexChange(index - 1)
          }}
          aria-label="Previous post"
          className={`${postArrow} left-3`}
        >
          <FiChevronLeft className="w-7 h-7" />
        </button>
      )}
      {index < posts.length - 1 && (
        <button
          onClick={(e) => {
            stop(e)
            onIndexChange(index + 1)
          }}
          aria-label="Next post"
          className={`${postArrow} right-3`}
        >
          <FiChevronRight className="w-7 h-7" />
        </button>
      )}

      <div
        onClick={stop}
        className="h-full w-full overflow-y-auto lg:overflow-hidden lg:h-[85vh] lg:max-w-6xl lg:flex lg:rounded-sm lg:bg-white"
      >
        <div
          className="relative h-[65vh] lg:h-full lg:flex-1 bg-[#0F0D0A] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={photo.media.id ?? photo.media.url}
            src={photo.media.url}
            alt={photoAlt(post, photo)}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />

          {hasManyPhotos && photoIndex > 0 && (
            <button onClick={prevPhoto} aria-label="Previous photo" className={`${photoArrow} left-3`}>
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}
          {hasManyPhotos && photoIndex < photos.length - 1 && (
            <button onClick={nextPhoto} aria-label="Next photo" className={`${photoArrow} right-3`}>
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          {hasManyPhotos && (
            <>
              <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono-label text-[11px] text-white">
                {photoIndex + 1} / {photos.length}
              </span>
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 px-6 flex-wrap">
                {photos.map((p, i) => (
                  <button
                    key={p.media.id ?? i}
                    onClick={() => setPhotoIndex(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-current={i === photoIndex}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === photoIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="bg-white px-5 py-6 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:px-7 lg:py-8">
          <p className="font-mono-label text-[11px] uppercase tracking-wide text-[#C9971F]">{post.category}</p>
          <h2 className="font-display italic text-2xl lg:text-3xl text-[#1C1710] mt-2 leading-tight">{post.title}</h2>
          {post.location && (
            <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-[#6B6153]">
              <FiMapPin className="w-4 h-4 shrink-0" />
              {post.location}
            </p>
          )}
          {post.description && (
            <p className="mt-5 pt-5 border-t border-[#1C1710]/10 font-body text-[15px] leading-relaxed text-[#3D362C] whitespace-pre-line">
              {post.description}
            </p>
          )}

          <div className="mt-8 flex justify-between gap-3 lg:hidden">
            <button
              onClick={() => onIndexChange(index - 1)}
              disabled={index === 0}
              className="font-mono-label text-xs uppercase tracking-wide text-[#1C1710] disabled:opacity-30"
            >
              ← Previous event
            </button>
            <button
              onClick={() => onIndexChange(index + 1)}
              disabled={index === posts.length - 1}
              className="font-mono-label text-xs uppercase tracking-wide text-[#1C1710] disabled:opacity-30"
            >
              Next event →
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Rewrite `Gallery.jsx`**

Keep the header, category tabs, loading/error/empty structure from the current file; change the data shape, grid and viewer. Full file:

```jsx
/* ============================================
   Gallery Section — Studios
   Instagram-style profile grid of event posts.
   Each post (1-20 photos from one event) shows
   its cover as a square tile; clicking opens
   GalleryPostViewer. Pulls published posts from
   the CMS backend.
   ============================================ */

import React, { memo, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiAlertCircle, FiCamera, FiLayers } from 'react-icons/fi'
import { fetchGalleryItems } from '../../utils/cmsApi'
import { toPost, photoAlt } from './galleryPosts'
import { GALLERY_SAMPLES } from './gallerySamples'
import GalleryPostViewer from './GalleryPostViewer'

// Local dev only — never ships sample posts to production.
const SAMPLES = import.meta.env.DEV ? GALLERY_SAMPLES : []

const StudiosGallery = memo(function StudiosGallery() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchGalleryItems()
      .then((data) => {
        if (!cancelled) {
          setPosts([...data, ...SAMPLES].map(toPost))
          setStatus('ready')
        }
      })
      .catch(() => {
        if (cancelled) return
        if (SAMPLES.length > 0) {
          setPosts(SAMPLES.map(toPost))
          setStatus('ready')
        } else {
          setStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts])

  const visiblePosts = useMemo(
    () => (activeCategory === 'All' ? posts : posts.filter((post) => post.category === activeCategory)),
    [posts, activeCategory]
  )

  return (
    <section id="gallery" className="relative bg-[#FAF8F3] py-20 lg:py-28 scroll-mt-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="pb-10 mb-10 border-b border-[#1C1710]/10"
        >
          <p className="font-mono-label text-xs uppercase tracking-wide text-[#C9971F] mb-4">Selected frames</p>
          <h1 className="font-display italic text-4xl sm:text-5xl lg:text-6xl text-[#1C1710]">Gallery</h1>
          <p className="font-body mt-5 text-[#6B6153] max-w-xl leading-relaxed">
            Moments from recent events — open any post to see the full set.
          </p>
        </motion.header>

        {status === 'ready' && categories.length > 2 && (
          <nav
            aria-label="Filter by category"
            className="-mx-5 sm:mx-0 px-5 sm:px-0 mb-10 flex gap-6 overflow-x-auto sm:flex-wrap sm:gap-x-7 sm:gap-y-3 [scrollbar-width:none]"
          >
            {categories.map((category) => {
              const active = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`shrink-0 pb-1.5 font-mono-label text-xs uppercase tracking-wide border-b transition-colors ${
                    active
                      ? 'text-[#1C1710] border-[#1C1710]'
                      : 'text-[#6B6153]/70 border-transparent hover:text-[#1C1710]'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </nav>
        )}

        {status === 'loading' && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="aspect-square bg-[#1C1710]/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-[#8B2E2A]" />
            <p className="font-body text-[#6B6153]">Couldn't load the gallery right now. Please try again shortly.</p>
          </div>
        )}

        {status === 'ready' && visiblePosts.length === 0 && (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <FiCamera className="w-8 h-8 text-[#1C1710]/30" />
            <p className="font-body text-[#6B6153]">New frames are on their way — check back soon.</p>
          </div>
        )}

        {status === 'ready' && visiblePosts.length > 0 && (
          <div key={activeCategory} className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4">
            {visiblePosts.map((post, index) => {
              const cover = post.photos[0]
              const count = post.photos.length
              return (
                <motion.button
                  key={post.id}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Open ${post.title}${count > 1 ? `, ${count} photos` : ''}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                  className="group relative block aspect-square overflow-hidden bg-[#1C1710]/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9971F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF8F3]"
                >
                  <img
                    src={cover.media.url}
                    alt={photoAlt(post, cover)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {count > 1 && (
                    <FiLayers aria-hidden="true" className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                  )}
                  <div className="absolute inset-0 hidden sm:flex flex-col items-center justify-center gap-1 p-3 text-center bg-black/45 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                    <p className="font-display italic text-base lg:text-lg text-white leading-snug line-clamp-2">{post.title}</p>
                    <p className="font-mono-label text-[10px] uppercase tracking-wide text-white/80">
                      {count} {count === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <GalleryPostViewer
            posts={visiblePosts}
            index={openIndex}
            onIndexChange={setOpenIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
})

export default StudiosGallery
```

- [ ] **Step 3: Delete the old lightbox**

```bash
git rm -q src/components/studios/GalleryLightbox.jsx 2>/dev/null || rm src/components/studios/GalleryLightbox.jsx
```
(It was never committed, so `rm` is the expected path.) Then confirm nothing imports it: `grep -rn GalleryLightbox src` → no output.

- [ ] **Step 4: Lint + unit tests**

Run: `npx eslint src/components/studios/Gallery.jsx src/components/studios/GalleryPostViewer.jsx src/components/studios/galleryPosts.js src/components/studios/gallerySamples.js && npx vitest run src/components/studios`
Expected: only the known `'motion' is defined but never used` false positives; tests pass.

- [ ] **Step 5: Verify in the browser preview**

`preview_start` with name `mcreatik-dev` (port 5199), open `http://localhost:5199/studios/gallery`. Check with `read_page`/`javascript_tool`/screenshots (see memory `studios-page-redesign` for the preview-pane rendering-suspension gotcha — take a screenshot to "pump" frames if animations look stuck):
1. Grid is 3 columns of squares at desktop and at `resize_window` mobile preset; `document.documentElement.scrollWidth === window.innerWidth` on mobile.
2. Multi-photo tiles show the layers icon; the 1-photo sample posts do not.
3. Click a 20-photo post: counter reads `1 / 20`, 20 dots, ArrowRight → `2 / 20`, previous-photo arrow hidden on photo 1 and next-photo arrow hidden on photo 20.
4. Desktop "Next post" arrow opens the following post starting at photo 1.
5. Mobile: simulated swipe (dispatch `TouchEvent`s on the carousel, as done previously) moves photos; "Next event →" works.
6. Esc closes; `document.body.style.overflow === ''` afterwards.
7. Filter "Ring Ceremony" → 3 sample posts (plus the real one if the local backend is running).
Reset the viewport with `resize_window` preset `desktop` when done.

- [ ] **Step 6: Commit**

```bash
git add src/components/studios/Gallery.jsx src/components/studios/GalleryPostViewer.jsx && git commit -m "Redesign Studios gallery as an Instagram-style grid of event posts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Admin — multi-photo post form and list

**Files:** (relative to `D:\Websites\mcreatik-admin`)
- Modify: `src/types/gallery.ts`
- Modify: `src/pages/gallery/GalleryFormPage.tsx`
- Modify: `src/pages/gallery/GalleryListPage.tsx`

**Interfaces:**
- Consumes: backend JSON from Task 2 — request `{ title, description, category, location, featured, status, photos: [{ mediaId, altText }] }`, response adds `photos: [{ media, altText }]`, `location`.
- Existing helpers: `uploadMedia(file, altText?) → Promise<MediaResponse>` (`src/lib/media.ts`), `FileUploadTrigger` (supports `multiple`), `apiFetch`, `ApiError`.

- [ ] **Step 1: Create the branch**

```bash
cd /d/Websites/mcreatik-admin && git switch -c gallery-event-posts
```

- [ ] **Step 2: Replace `src/types/gallery.ts`**

```ts
import type { ContentStatus } from './common'
import type { MediaResponse } from './media'

export const MAX_GALLERY_PHOTOS = 20

export interface GalleryPhotoResponse {
  media: MediaResponse
  altText: string | null
}

export interface GalleryResponse {
  id: number
  title: string
  description: string | null
  /** The cover — always the same as photos[0].media. */
  media: MediaResponse
  photos: GalleryPhotoResponse[]
  category: string
  location: string | null
  featured: boolean
  status: ContentStatus
  createdAt: string
}

export interface GalleryPhotoRequest {
  mediaId: number
  altText: string | null
}

export interface GalleryRequest {
  title: string
  description: string | null
  category: string
  location: string | null
  featured: boolean
  status: ContentStatus
  photos: GalleryPhotoRequest[]
}
```

- [ ] **Step 3: Update `GalleryFormPage.tsx`**

Imports: add `ArrowDown, ArrowUp, X` from `lucide-react`; import `MAX_GALLERY_PHOTOS` and types from `../../types/gallery`; import `type MediaResponse` from `../../types/media`.

Replace the `mediaId`/`previewUrl`/`uploading` state with:
```tsx
  const [location, setLocation] = useState('')
  const [photos, setPhotos] = useState<Array<{ media: MediaResponse; altText: string }>>([])
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const uploading = uploadProgress !== null
```

In the load effect, replace `setMediaId`/`setPreviewUrl` with:
```tsx
        setLocation(item.location ?? '')
        setPhotos(item.photos.map((p) => ({ media: p.media, altText: p.altText ?? '' })))
```

Replace `handleFileChange` with:
```tsx
  async function handlePhotosChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (picked.length === 0) return
    const room = MAX_GALLERY_PHOTOS - photos.length
    const files = picked.slice(0, Math.max(room, 0))
    if (picked.length > files.length) {
      toast.warning(`A post holds up to ${MAX_GALLERY_PHOTOS} photos — skipped ${picked.length - files.length}.`)
    }
    if (files.length === 0) return
    setError(null)
    setUploadProgress({ done: 0, total: files.length })
    let failed = 0
    // One at a time: keeps each successful upload even if a later one fails, and
    // avoids firing up to 20 presign+PUT pairs at once.
    for (const file of files) {
      try {
        const media = await uploadMedia(file, title || file.name)
        setPhotos((prev) => [...prev, { media, altText: '' }])
      } catch {
        failed += 1
      }
      setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev))
    }
    setUploadProgress(null)
    if (failed > 0) setError(`${failed} photo upload${failed === 1 ? '' : 's'} failed`)
  }

  function movePhoto(index: number, direction: -1 | 1) {
    setPhotos((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function setPhotoAlt(index: number, altText: string) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, altText } : p)))
  }
```

In `handleSubmit`, replace the `mediaId` check and body with:
```tsx
    if (photos.length === 0) {
      setError('Please add at least one photo')
      return
    }
    ...
    const body: GalleryRequest = {
      title,
      description: description || null,
      category,
      location: location.trim() || null,
      featured,
      status,
      photos: photos.map((p) => ({ mediaId: p.media.id, altText: p.altText.trim() || null })),
    }
```
Change the toast text to `'Post saved'` / `'Could not save post'`, and the heading to `{isEditing ? 'Edit Post' : 'Add Post'}`. Widen the wrapper from `max-w-xl` to `max-w-2xl`.

Replace the single `Photo` `FormField` with this block, and add Location right after Category:
```tsx
        <FormField label={`Photos (${photos.length} / ${MAX_GALLERY_PHOTOS}) — first photo is the cover`} htmlFor="photos">
          {photos.length > 0 && (
            <ul className="mb-2 space-y-1.5">
              {photos.map((photo, index) => (
                <li key={photo.media.id} className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-1.5">
                  <img src={photo.media.url} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    {index === 0 && <span className="mb-1 inline-block rounded bg-primary/10 px-1.5 text-[10px] font-medium uppercase text-primary">Cover</span>}
                    <Input
                      aria-label={`Alt text for photo ${index + 1}`}
                      placeholder="Describe this photo (optional)"
                      maxLength={500}
                      value={photo.altText}
                      onChange={(e) => setPhotoAlt(index, e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" onClick={() => movePhoto(index, -1)} disabled={index === 0}>
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Move down" onClick={() => movePhoto(index, 1)} disabled={index === photos.length - 1}>
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove photo" onClick={() => removePhoto(index)}>
                    <X className="text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {photos.length < MAX_GALLERY_PHOTOS && (
            <FileUploadTrigger
              id="photos"
              label={uploadProgress ? `Uploading ${uploadProgress.done + 1} of ${uploadProgress.total}…` : 'Add photos'}
              multiple
              uploading={uploading}
              onChange={(e) => void handlePhotosChange(e)}
            />
          )}
        </FormField>
```
```tsx
        <FormField label="Location" htmlFor="location" error={fieldErrors?.location}>
          <Input id="location" value={location} maxLength={255} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kumbakonam" />
        </FormField>
```
(`FileUploadTrigger` shows `'Uploading…'` itself while `uploading` is true; the progress label is still passed for when that component is later changed to show it — if it renders only its own text, that is acceptable.)

- [ ] **Step 4: Update `GalleryListPage.tsx` columns**

Replace the `Photo` column and add a `Photos` count column after it:
```tsx
              {
                header: 'Cover',
                cell: (item) => <img src={(item.photos[0]?.media ?? item.media).url} alt={item.title} className="h-12 w-12 rounded object-cover" />,
              },
              { header: 'Photos', cell: (item) => <span className="text-muted-foreground">{item.photos?.length ?? 1}</span> },
```
Change the empty-state copy to `title="No posts yet"`, `description="Event posts you add here show up on the Studios gallery."`, `actionLabel="Add Post"`, and the delete confirm to `"Delete this post and all its photos from the gallery? This cannot be undone."`.

- [ ] **Step 5: Type-check and lint**

Run: `npm run build && npm run lint`
Expected: build succeeds with no TS errors; oxlint reports no new errors in `src/pages/gallery` or `src/types/gallery.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/types/gallery.ts src/pages/gallery && git commit -m "Gallery posts: upload up to 20 photos per post, with alt text, order and location

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Run everything together locally and hand over to the user

**Files:** none (verification only)

- [ ] **Step 1: Start all three locally**

`preview_start` names: `mcreatik-backend-dev` (8080), `mcreatik-dev` (5199), `mcreatik-admin-dev` (5200). Confirm backend health: `curl -s localhost:8080/api/v1/gallery?size=5` returns the Ring Ceremony item **with a `photos` array of length 1** and `location: null`.

- [ ] **Step 2: Website against the real local backend**

Reload `http://localhost:5199/studios/gallery`: the real Ring Ceremony post appears first (before samples) as a 1-photo tile; opening it shows its title and caption. No console errors other than none expected (backend is up now).

- [ ] **Step 3: Admin smoke check (no login by the agent)**

Open `http://localhost:5200/admin` (or the dev root) and confirm the app loads and the login page renders. **Do not enter credentials** — the user logs in and tests the form themselves.

- [ ] **Step 4: Report to the user**

Tell the user, plainly:
- V30 is already applied to the shared/production database (additive; live site verified OK in Task 3).
- What to test in admin: create a post with several photos, reorder, set alt text, add location, publish; edit it; try >20 photos; delete a post. Then check it on `localhost:5199/studios/gallery`.
- Nothing is pushed or deployed. On their go-ahead: deploy backend (Oracle VM, smoke-test on 8081, cut over), push admin `master` and website `main`.
- **Rollout order matters:** the backend must deploy before (or together with) the admin push — the new admin sends `photos`, which the currently-live backend would ignore (it would then fail with "mediaId must not be null").
