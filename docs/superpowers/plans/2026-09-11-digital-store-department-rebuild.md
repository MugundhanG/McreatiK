# McreatiK Digital Store — Rebuild as a Full E-Commerce Department

Source spec: `C:\Users\DELL\.claude\plans\okay-i-verified-what-quiet-ember.md` (approved plan, full context/research/rationale). This file re-expresses that plan as numbered tasks for `superpowers:subagent-driven-development` tooling — content is copied verbatim from the source phases, not altered. Repo/worktree basing decisions below were made at execution-start time (see Ledger for the rulings).

## Repo & worktree map

| Repo | Path | Branch / worktree | Why this base |
|---|---|---|---|
| Backend | `D:\Websites\mcreatik-backend` | worktree `.worktrees\digital-store-order-payment` (branch `digital-store-order-payment`) | Already exists; `Template`/`Order`/`TemplateService` that Phase B generalizes only exist on this branch (not on `master`) |
| Frontend | `D:\Websites\mcreatik` | worktree `.claude\worktrees\digital-store-storefront` (branch `worktree-digital-store-storefront`) | Already exists; `useCheckout.js`/`ProductForm.jsx` that Phases I/K adapt only exist on this branch (not on `main`) |
| Admin | `D:\Websites\mcreatik-admin` | worktree `.worktrees\digital-store-department` (branch `digital-store-department`, newly created off `master`) | No prior digital-store work exists in admin — net-new |

## Global Constraints (binding on every task)

| Decision | Choice | Why |
|---|---|---|
| Customer auth isolation | Separate `Customer` entity/table, separate JWT signing secret, separate claim types, separate filter | A distinct secret makes cross-use structurally impossible, not just logically guarded |
| Customization scope | **Category-level** flag (`requiresCustomization` on `Category`), not per-product | Every product in a category behaves the same way per the user's own framing |
| `fieldSchema` validation | One generic schema-driven validator (`GenericFieldSchemaValidator`) with an internal type-registry, replacing the hardcoded per-product validator | Scales to many admin-authored templates without a new validator class per product |
| Non-editable fields | **Read-only + pre-filled** (`fixedValue`), never hidden — and the backend always overwrites a submitted value for non-editable fields, never trusts client input for them | The generated document still needs that value; trusting client input there is a tamper vector |
| Cart location | **Server-side**, tied to the logged-in `Customer` | Login is already required at add-to-cart, so an anonymous cart case never occurs |
| Idempotency key (checkout) | `sessionId:hash(cart snapshot)` — same combined-hash scheme already proven in the single-product checkout hook, applied to the full line-item array | Directly avoids the exact stale-cart-replay bug found and fixed in the single-product version |
| Fulfillment | Two paths by `Product.productType`: `AGREEMENT_DOCUMENT` (render PDF) vs `STATIC_ASSET` (copy a pre-uploaded file). Each `OrderItem` gets its own status/download token | A buyer who bought one agreement + one pose guide can download the pose guide immediately |
| Department switcher | Generalize to a 3-department data array, don't opt Store out | Store is explicitly a first-class sibling department |
| Frontend state | Two Context providers (`AuthContext`, `CartContext`), each backed by a plain fetch module | First Context usage in this codebase — keep minimal, consistent with existing "plain `*Api.js` module" convention |
| Admin visibility into customers | Read-only customer list (id, email, name, status, created date) with enable/disable toggle. **`passwordHash` is never included in any DTO** — not redacted, simply never selected into the response object | Admin needs to see/manage accounts without ever being able to see credentials |

## Critical files (read before touching anything)

- Backend worktree: `product/entity/Order.java` + `OrderRepository.java` (atomic-UPDATE pattern `OrderItem` must replicate exactly — hand-written `@Modifying` queries, not load-mutate-save); `product/entity/Template.java` + `TemplateService.java` + `WeddingAgreementFieldValidator.java` (what's being generalized); `config/SecurityConfig.java` + `auth/security/JwtService.java` (pattern `CustomerJwtService` mirrors while staying isolated); `media/service/R2StorageService.java` and `product/storage/OrderDeliverableStorageService.java` (reuse for static-asset uploads); `common/entity/UuidBaseEntity.java`/`BaseEntity.java` (new public-facing entities use `UuidBaseEntity`).
- Admin repo: `src/pages/albums/AlbumFormPage.tsx` (template for the field-schema builder); `src/lib/api.ts` (pattern for `customerApi.js`).
- Frontend repo (`main` tree, not the storefront worktree): `src/App.jsx`, `src/utils/constants.js`, `src/components/ui/DepartmentSwitcher.jsx` (where Store's route/nav/switcher wiring lands) — **note:** these files must be checked/merged carefully since the storefront worktree branched before some of this may have changed on `main`.
- Frontend storefront worktree: `src/hooks/useCheckout.js` (idempotency-key hashing scheme to carry forward) and `src/components/digital-store/ProductForm.jsx` (generic form renderer to adapt, not rewrite).

## Cross-repo sequencing

Backend leads. Admin and frontend streams for a given phase start only once that phase's **Output contract** is frozen (backend task done + reviewed clean). Task numbers below are execution order for the backend spine; admin/frontend tasks are interleaved at their unlock point.

---

## Task 1 — Backend: Customer entity + auth infrastructure

Repo: Backend worktree.

Build `Customer` entity + Flyway migration (mirrors `User`, but `UuidBaseEntity` not `BaseEntity`, matching `Template`/`Order`'s convention) → `CustomerJwtService`/`CustomerRefreshToken` (own signing secret, own claim types, mirrors `RefreshToken`'s rotation design exactly — this is the structural isolation guarantee, not just a logical guard). No controllers yet — this task is the entity, migration, and JWT/refresh-token service layer only.

## Task 2 — Backend: Customer auth controller + password reset

Repo: Backend worktree. Depends on Task 1.

`CustomerAuthController` (signup/login/refresh/logout) → password reset flow. No email service exists yet in this backend (confirmed by search) — log the reset link server-side for now and flag real email delivery as a follow-up rather than adding a new email provider mid-plan.

## Task 3 — Backend: Customer auth filter + admin customer management

Repo: Backend worktree. Depends on Task 1, Task 2.

`CustomerJwtAuthenticationFilter` wired into `SecurityConfig` **alongside** (not replacing) the existing admin filter → `CustomerAdminController` (`GET /api/v1/admin/customers` paginated list, `PUT /api/v1/admin/customers/{id}/status` to disable/re-enable access — role-gated same as other admin endpoints). A disabled customer's JWT is rejected at `CustomerJwtAuthenticationFilter` (re-checks status on each request for this one check, unlike the stateless-everything-else design, since "revoke access" must take effect immediately). `CustomerAdminResponse` DTO carries only `{id, email, name, status, createdAt}` — `passwordHash` is not a field on this DTO at all.

**Output contract for this task:** customer JWT issuance/refresh — unblocks Task 9 (frontend customer auth).

## Task 4 — Backend: Category module

Repo: Backend worktree. No dependency on Tasks 1-3 (can run in parallel, but keep sequential per "never dispatch multiple implementers in parallel").

`Category` entity (`name`, `slug`, `description`, `requiresCustomization`, `sortOrder`, `status`) + migration → `CategoryAdminController` (CRUD, role-gated, with a delete-guard against categories still referenced by a product — mirrors `TemplateService`'s existing `existsByTemplateId` pattern) → `CategoryPublicController` (public `GET /api/v1/categories`).

**Output contract:** `Category` JSON shape — unblocks Task 8 (admin Category CRUD).

## Task 5 — Backend: Generalize `Template` → `Product`

Repo: Backend worktree. Depends on Task 4 (needs `categoryId` FK target).

Rename `Template`→`Product`, add `categoryId` FK, replace `ShootType` with `productType` enum (`AGREEMENT_DOCUMENT`/`STATIC_ASSET`), add `deliverableObjectKey` (for static assets) — preserve the existing append-only versioning behavior (`updateMetadata` only when un-ordered, else new version row) exactly as-is. Extend `fieldSchema.fields[]` with `customerEditable`/`fixedValue`. Replace `WeddingAgreementFieldValidator` with `GenericFieldSchemaValidator` — walks `fieldSchema.fields` generically (a small type-registry for string/email/date/number, the extension point for future field types), and is the single place that enforces "non-editable fields always get their `fixedValue`, never the submitted value." Rename controllers/routes `/api/v1/templates/**` → `/api/v1/products/**`. Generalize PDF rendering behind a `PdfRenderer` interface keyed by `layoutReference` (one implementation today, seam for more later).

**Output contract:** `Product{id,name,categoryId,productType,price,fieldSchema,...}`, `/api/v1/products/**` — unblocks Task 10 (admin Product CRUD) and Task 12 (frontend catalog/product page).

## Task 6 — Backend: Cart + multi-item Order/OrderItem

Repo: Backend worktree. Depends on Task 5.

`Cart`/`CartItem` entities (one active cart per customer; `quantity` column kept for forward-compatibility even though every current category is single-license). `CartController` — add/edit/remove, **validates at add-to-cart time** (not just at checkout). `Order` becomes a header record (customer, amount, currency, Razorpay/payment fields); new `OrderItem` carries everything that used to live on `Order` per-product (`productId`, `fieldValues`, its own `fulfillmentStatus`/`deliverableObjectKey`/`downloadToken*`) — **critically, using the exact same atomic `@Modifying` UPDATE-per-transition pattern** `OrderRepository` already uses today, re-scoped to `OrderItem`. `POST /api/v1/checkout` replaces `POST /api/v1/orders` — reads the cart server-side (never trusts a client-submitted line-item list), re-validates every item's `fieldValues` against the current schema, snapshots current prices, computes the idempotency key over the full resolved cart snapshot. `/verify` and webhook handling loop per `OrderItem`; `VerifyResult` becomes per-item so the frontend can show partial completion.

**Output contract:** cart API, `POST /api/v1/checkout`, per-item verify/download — unblocks Task 13 (frontend cart) and Task 14 (frontend checkout).

## Task 7 — Backend: Fulfillment for static-asset products

Repo: Backend worktree. Depends on Task 6.

Admin static-asset upload reuses the existing `R2StorageService`/presigned-upload flow already used by Albums/Gallery — no new storage path. `attemptFulfillment` branches by `productType`: agreement documents render as today; static assets get **copied** (not re-referenced) from the admin's source file to a per-order object key via the existing `OrderDeliverableStorageService`, so a later edit to the admin's source file can never retroactively alter a completed sale.

## Task 8 — Admin: Category CRUD + Customer management

Repo: Admin worktree. Depends on Task 3 (customer contract) and Task 4 (category contract).

**Categories**: `src/types/category.ts` → `CategoryListPage.tsx` → `CategoryFormPage.tsx` (name, auto-slug, description, `requiresCustomization` checkbox, sort order, status) — exactly the existing Album/Blog/Gallery resource pattern, using the already-existing shared components (`DataTable`, `FormField`, `Checkbox`, etc.). **Customers**: `src/types/customer.ts` (deliberately has no `passwordHash` field, matching the backend DTO) → `CustomerListPage.tsx` — a read-only `DataTable` (id, email, name, status, joined date) with a `StatusBadge` and an enable/disable action per row calling `PUT /api/v1/admin/customers/{id}/status`. No create/edit form — customers self-register via the storefront's own signup, so this screen is view + revoke-access only.

## Task 9 — Frontend: Store department scaffolding

Repo: Frontend storefront worktree. **Zero backend dependency — can start immediately, in parallel with Task 1.**

`StorePageShell.jsx` + `.theme-store` CSS (using the already-reserved `#8B7FE8` accent). Wire the already-existing `HOME_EXPLORE_AREAS`/`HOME_NAV_LINKS` placeholders (in `src/utils/constants.js`) to a real (initially empty) `/store` route. Generalize `DepartmentSwitcher`/`DepartmentTransitionOverlay` to a 3-department data array instead of two hardcoded blocks.

## Task 10 — Frontend: Customer auth

Repo: Frontend storefront worktree. Depends on Task 3.

`customerApi.js` (plain fetch module, mirrors the admin app's `api.ts` shape) → `AuthContext`/`useAuth()` → signup/login/forgot-password/reset-password pages (via the existing shared `useForm` hook, no new form pattern) → a `requireAuthOrRedirect` helper invoked specifically at the add-to-cart action (not a route-level guard — browsing stays public).

## Task 11 — Admin: Product CRUD + field-schema builder

Repo: Admin worktree. Depends on Task 5.

`src/types/product.ts` → `ProductListPage.tsx` → `ProductFormPage.tsx` (category dropdown, product type, price, static-asset upload or layout selection) → **the field-schema builder**: a direct adaptation of `AlbumFormPage.tsx`'s photo-list editor (array state, move-up/down, remove, add) into a field-list editor where each row has name/label/type/required plus **a `customerEditable` checkbox, and a conditionally-shown `fixedValue` input when unchecked**.

## Task 12 — Frontend: Catalog + conditional product page

Repo: Frontend storefront worktree. Depends on Task 5, Task 9.

`StoreCatalogPage.jsx` — category picker + product grid, replacing the single-category catalog; `ProductCard`'s CTA copy becomes conditional on `category.requiresCustomization`. `StoreProductPage.jsx` — fetches the product, branches on `requiresCustomization`: customizable products render `ProductForm` (adapted to show non-editable fields read-only/pre-filled) + `PreviewPanel`; non-customizable products skip straight to marketing content + an "Add to cart" CTA. Both branches end at the same add-to-cart action (gated by Task 10's auth check), not a direct-checkout button. `ProductForm.jsx` gets a small additive change: render non-editable fields as disabled, pre-filled with `fixedValue`, excluded from client-side required-checks.

## Task 13 — Frontend: Cart

Repo: Frontend storefront worktree. Depends on Task 6, Task 12.

`cartApi.js` → `CartContext`/`useCart()` (refetch-after-mutation, not optimistic — server-side re-validation matters more here than UI snappiness) → a cart-count badge in the Store nav + `StoreCartPage.jsx` (editable line items, remove, running total, proceed-to-checkout).

## Task 14 — Frontend: Checkout + multi-item order page

Repo: Frontend storefront worktree. Depends on Task 6, Task 13.

`useCheckout.js` redesigned around the cart rather than a single template — the idempotency-key hashing logic (the combined-hash scheme found and fixed in the single-product version) carries over near-verbatim, just fed the full cart snapshot. `StoreOrderPage.jsx` replaces the single-product order page — polls `/verify`, renders **per-item** status so download buttons appear as each item finishes independently, keeping the existing "taking longer than expected" and "can't find this order" states, generalized to a list.

**Backend contract detail (found during Task 6's review — do not naively "replace all item state on every poll"):** `/verify`'s per-item response only includes the raw `downloadToken` value the FIRST time an item transitions to `FULFILLED` with no live token yet. On every subsequent poll of an already-fulfilled item, the response carries `downloadTokenExpiresAt` but `downloadToken: null` — the server only stores a hash and deliberately does not rotate it (rotating would invalidate a link the buyer already clicked). The frontend polling state MUST retain/merge the token from whichever response first carried it for each item, keyed by item id — not overwrite a captured token with a later `null`.

## Task 15 — Cleanup and QA (all repos)

Depends on all prior tasks.

Retire the old single-product digital-store code (frontend pages/hooks, backend `Template`/single-item `Order` naming — note: by this point Task 5 has already renamed `Template`→`Product`, so this is about anything left over, not the rename itself) once the new pieces are verified working. End-to-end QA: signup → browse both a customizable and static-asset category while logged out (confirm the login gate fires exactly at add-to-cart, not at browse) → log in → cart has both → checkout → Razorpay test payment → both items reach "ready" independently → download both. Explicitly verify an admin JWT cannot authenticate against `/api/v1/cart/**` and a customer JWT cannot authenticate against `/api/v1/admin/**`. Also verify: the admin's Customer list never renders a password/hash field under any circumstance (inspect the actual network response, not just the UI), and that disabling a customer's access there takes effect on their very next request, not just at token expiry. Update whatever architecture notes each repo maintains.

---

## Verification note (from source plan)

Manual end-to-end verification (Task 15) needs all three repos' relevant phases deployed/running together locally. `preview_start` resolves `.claude/launch.json` relative to the fixed project root regardless of `cd`, so each worktree needs its own dedicated launch-config entry with a `--prefix`.
