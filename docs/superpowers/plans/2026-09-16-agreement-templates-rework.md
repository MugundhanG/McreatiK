# Agreement Templates Rework — Real-Time Preview + Reusable Templates

Source spec: `C:\Users\DELL\.claude\plans\lets-fix-the-agreement-compressed-fox.md` (approved plan, full context/rationale). This file re-expresses it as numbered tasks for `superpowers:subagent-driven-development` tooling — content copied faithfully, not altered.

## Repo & worktree map

| Repo | Path | Branch |
|---|---|---|
| Backend | `D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment` | `digital-store-order-payment` |
| Admin | `D:\Websites\mcreatik-admin\.worktrees\digital-store-department` | `digital-store-department` |
| Frontend | `D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront` | `worktree-digital-store-storefront` |

## Global Constraints (binding on every task)

- **The core requirement**: while a buyer is actively filling out the customization form, a preview of the document must be visible and continuously up to date — not gated behind a button, not deferred until submission, updating on every keystroke for the whole time they're filling it in.
- Live preview is a new lightweight, purely client-side rendering path (no network round-trip per keystroke) — separate from the existing full watermarked-PDF endpoint, which is KEPT as a secondary, explicit "see the real, final-fidelity document" action, not deleted.
- Admins get the same live-preview treatment while building a product's field schema.
- `customerEditable`/`fixedValue` (the tamper-prevention rule already enforced by `GenericFieldSchemaValidator` — a buyer's submitted value for a non-editable field is always discarded server-side, never merged) stay on `Product`, not on the new `Template`. This guarantee must not be weakened anywhere in this rework.
- `PdfRenderer`/`PdfRendererRegistry` (current one-Java-class-per-layout, Spring-bean-discovery model) is fully deleted in favor of one generic, `Template`-row-driven renderer.
- The interpolator's escaping logic (`escape()`, copied character-for-character from `WeddingAgreementPdfRenderer.escape`) and its "no raw/unescaped substitution syntax" rule are security-critical — every port of this logic (Java, admin TS, storefront JS) must preserve them exactly.
- **Coordination**: a separate, already-in-progress session is fixing an unrelated `customerEditable` hydration/save bug in `mcreatik-admin/src/pages/products/ProductFormPage.tsx` (lines ~143, ~218-224). Task 5 below also edits this file (different region: the `layoutReference` block ~lines 337-353, plus a new live-preview panel). **Before starting Task 5, confirm the other fix has landed on this branch and re-pull the file** — do not build against a stale copy.
- Must-pass-unmodified tests (proof nothing was weakened): `GenericFieldSchemaValidatorTest`, `SeedProductFieldSchemaContractTest`.

## Critical files (read before touching anything)

- Backend: `product/pdf/WeddingAgreementPdfRenderer.java` (source of `escape()`/`buildHtml()` logic — being deleted, ported into `TemplateInterpolator`/`TemplateHtmlPdfRenderer`); `product/entity/Category.java` + its full stack (`CategoryRequest/Response`, `CategoryRepository`, `CategoryService`, `CategoryAdminController`, `ProductCategoryReferenceGuard`) — the literal pattern `Template`'s stack mirrors; `product/entity/Product.java`, `service/OrderService.java` (fulfillment call site ~line 451), `controller/ProductPublicController.java` (preview call site ~line 89); `test/.../SeedProductFieldSchemaContractTest.java` (the equivalence proof).
- Admin: `src/pages/categories/CategoryListPage.tsx`/`CategoryFormPage.tsx` (pattern for `TemplateListPage`/`TemplateFormPage`); `src/pages/products/ProductFormPage.tsx` (field-list editing UI to extract into a shared component; layoutReference block to replace).
- Frontend: `src/pages/StoreProductPage.jsx`, `src/components/digital-store/PreviewPanel.jsx`, `src/components/digital-store/ProductForm.jsx`.

## Sequencing

Tasks 1→2→3 (backend) are strictly sequential and must all land before Task 4/5 (admin) or Task 6 (frontend) start — those consume `templateId`/`templateBody`, which don't exist until Task 3. Task 4 and 6 have no dependency on each other; Task 5 depends on Task 3 and the external coordination note above.

---

## Task 1 — Backend: the `Template` resource

Repo: Backend worktree.

New entity `Template` (`product/entity/Template.java`), table `document_templates`, mirroring `Category.java`'s shape (`BaseEntity`, not `UuidBaseEntity` — no append-only need, admin-managed reference content, not itself sold): `name`, `description`, `bodyHtml` (TEXT — an HTML **fragment**, not a full document; the renderer supplies the constant outer shell/fonts/watermark so an admin-authored body can never accidentally omit the watermark), `fieldStructure` (jsonb: `{"fields":[{name,label,type,required,maxLength,min,exclusiveMin,max,exclusiveMax}]}` — same shape as today's `Product.fieldSchema` minus `customerEditable`/`fixedValue`), `status`.

**`customerEditable`/`fixedValue` stay on `Product`, not `Template`** — a template is a reusable shape; which fields a specific product locks and what fixed text it uses is a per-product commercial choice (two products sharing one template may want different fields locked, different fixed clauses).

Full CRUD stack mirrors `Category` exactly: `TemplateRequest`/`TemplateResponse` DTOs (← `CategoryRequest`/`CategoryResponse`), `TemplateRepository` (← `CategoryRepository`), `TemplateService` (← `CategoryService`, including a `TemplateProductReferenceGuard` mirroring `ProductCategoryReferenceGuard` to block deleting a template still referenced by a product), `TemplateAdminController` at `/api/v1/admin/templates` (← `CategoryAdminController`, same `@PreAuthorize` class-level gate). No separate public template endpoint — the body reaches the storefront embedded in `ProductResponse` (Task 3).

**Migrations:**
- `V26__create_document_templates_table.sql` — creates the table; seeds one row by translating `WeddingAgreementPdfRenderer.buildHtml`'s hardcoded Java string-building (lines 112-145) into a `{{fieldName}}` / `{{#fieldName}}...{{/fieldName}}` fragment (the two `if (fieldValues.get(...) != null)` guards at lines 131 and 142 become the two conditional sections). `fieldStructure` = the seed product's current `fieldSchema.fields`, with `customerEditable`/`fixedValue` stripped.
- `V27__add_products_template_id.sql` — nullable `template_id BIGINT REFERENCES document_templates(id)` on `products` (mirrors `category_id`'s pattern); backfill the seed product's `template_id` from the new row. `layout_reference` stays in the schema, unused (cleanup deferred to a later migration).

Write tests mirroring `CategoryServiceTest`/`CategoryRepositoryTest`/`CategoryAdminControllerTest` exactly, plus a delete-blocked-while-referenced test mirroring `ProductCategoryReferenceGuard`'s coverage.

## Task 2 — Backend: the generic renderer

Repo: Backend worktree. Depends on Task 1 (needs the `Template` entity to exist).

Delete `PdfRenderer.java`, `PdfRendererRegistry.java`, `WeddingAgreementPdfRenderer.java`. Add:

- **`TemplateHtmlPdfRenderer`** (`product/pdf/`) — a plain `@Component`, not implementing any interface: `render(Template, Map)`, `renderPreview(Template, Map)`, package-visible `buildHtml(Template, Map, boolean watermark)`. Keeps the exact outer shell (charset/title/font-family CSS, watermark div) `WeddingAgreementPdfRenderer` has today, wrapping the **interpolated** `template.getBodyHtml()` in the middle. `renderHtml` (openhtmltopdf/PDFBox call, the three Noto Sans font registrations) is copied verbatim.
- **`TemplateInterpolator`** (`product/pdf/`): `escape(Object)` copied character-for-character from `WeddingAgreementPdfRenderer.escape` (the same 5-entry replace chain: `&`→`&amp;`, `<`→`&lt;`, `>`→`&gt;`, `"`→`&quot;`, `'`→`&#39;`). `{{name}}` → `escape(values.get(name))`. `{{#name}}...{{/name}}` → the enclosed (recursively-interpolated) fragment only if `values.get(name)` is non-null/non-blank, else omitted. **No raw/unescaped substitution syntax exists at all.** An unresolved `{{name}}`/`{{#name}}` throws `IllegalStateException` (a 500), never silently renders blank.

Callers change at exactly two sites: `OrderService.renderAndUpload` (~line 451) and `ProductPublicController.preview` (~line 89) — both now look up `Template` via `product.getTemplateId()` before calling the renderer, instead of `pdfRendererRegistry.rendererFor(layoutReference)`.

New admin-only endpoint: `POST /api/v1/admin/templates/{id}/preview` on `TemplateAdminController` (auth-gated, no `ProductPreviewRateLimiter`, works against any status) — needed for Task 5's admin "generate real PDF" check on a draft product.

Testing: every one of `WeddingAgreementPdfRendererTest`'s test methods (escaping, Tamil/Devanagari font embedding via PDFBox text extraction, watermark presence/absence, conditional-clause inclusion/omission) gets a literal, same-named counterpart in a new `TemplateHtmlPdfRendererTest`, parameterized by the migrated `Template` instead of hardcoded — port every one, don't drop or simplify any. New `TemplateInterpolatorTest` (escaping, section-omission, unresolved-token-throws, no-raw-HTML-variant).

## Task 3 — Backend: `Product` ↔ `Template` wiring + equivalence proof

Repo: Backend worktree. Depends on Task 1, Task 2.

- `Product` gains `templateId` (plain `Long`, mirrors the existing `categoryId` convention — not a `@ManyToOne`). `layoutReference` stays on the entity/DTOs for now, round-tripped but no longer admin-editable once Task 5 lands.
- `ProductCreateRequest`/`ProductAdminResponse` gain `templateId: number | null` (and their TS mirror in `mcreatik-admin/src/types/product.ts`, updated as part of this backend task since it's a shared-contract file with no logic — do not touch any other admin file here).
- `ProductResponse` (public) gains `templateBody: string | null`, populated for `AGREEMENT_DOCUMENT` products by joining through `templateId`. This deliberately exposes the raw HTML body publicly (unlike `layoutReference`, kept private) — justified since the template body is the seller's own document content, already visible to anyone who clicks the existing preview button.
- **No auto-resync**: editing a `Template` later does not retroactively touch any `Product.fieldSchema` already seeded from it (enforced by Task 5's admin UI behavior, not by anything here — this task just needs to not assume otherwise).

**This task must end by running the full test suite and confirming `GenericFieldSchemaValidatorTest` and `SeedProductFieldSchemaContractTest` pass with ZERO assertion changes** — this is the proof the whole migration (Tasks 1-3 together) didn't change buyer-visible behavior. If either needs an assertion changed to pass, treat that as a Critical finding in this task's own self-review, not something to quietly adjust.

Extend `ProductAdminControllerTest` for `templateId` create/update.

## Task 4 — Admin: Template CRUD UI

Repo: Admin worktree. Depends on Task 1 (needs `/api/v1/admin/templates` to exist and be stable).

New `src/pages/templates/TemplateListPage.tsx` / `TemplateFormPage.tsx` (mirror `CategoryListPage.tsx`/`CategoryFormPage.tsx` exactly), `src/types/template.ts`, routes in `App.tsx` (mirror the `/categories` block). Extract the existing field-list editing UI (add/move/remove rows) already built in `ProductFormPage.tsx` into a shared `src/components/shared/FieldStructureEditor.tsx`, since the template's field-structure editor and the product's field-schema editor (which adds `customerEditable`+`fixedValue`) differ by only two rows — the extraction must support both call sites via a prop/flag for the extra two rows, not fork into two components.

`TemplateFormPage` gets a `bodyHtml` textarea plus a live preview panel (below it) using sample/placeholder values for every field, via the new `src/lib/templatePreview.ts` interpolator (a JS/TS port of `TemplateInterpolator`: same `{{name}}`/`{{#name}}` syntax, same escape table, same no-raw-HTML rule), rendered into `<iframe sandbox="allow-same-origin" srcdoc={html}>` (never `dangerouslySetInnerHTML` directly in the page DOM).

No admin test infrastructure exists today (confirmed: zero `.test.tsx` files anywhere in this repo) — proceed test-free, consistent with the rest of this app.

## Task 5 — Admin: `ProductFormPage.tsx` template picker + live preview

Repo: Admin worktree. Depends on Task 3, Task 4, and the external coordination note in Global Constraints (confirm the concurrent `customerEditable` bug fix has landed on this branch first, and re-pull the file before starting).

Replace the free-text `layoutReference` input (~lines 337-353) with a `templateId` dropdown populated from `/api/v1/admin/templates`. On first pick (or an explicit "Load fields from template" action — never silently overwriting an already-customized field list), seed `fields` from the template's `fieldStructure`, defaulting every seeded field to `customerEditable: true, fixedValue: ''` (matching `emptyField()`'s existing shape). Add a live-preview panel (new `src/components/products/TemplateLivePreview.tsx`) rendering the current field configuration — for each field, use its `fixedValue` if locked, else a placeholder/sample value — via the shared `src/lib/templatePreview.ts` interpolator from Task 4, plus a "Generate real PDF" button hitting the Task 2 admin preview endpoint (`POST /api/v1/admin/templates/{id}/preview`).

## Task 6 — Frontend: live document preview for buyers

Repo: Frontend storefront worktree. Depends on Task 3 (needs `templateBody` on the public product response).

New `src/components/digital-store/LiveDocumentPreview.jsx` + `src/utils/templatePreview.js` (same interpolator port as Task 4/5, but an unresolved token renders as an empty string rather than throwing — a buyer's half-filled form is normal, expected state, not a schema defect).

`StoreProductPage.jsx` renders `LiveDocumentPreview` visible from the moment the customizable product page loads (blank/placeholder fields render as empty in the document), sitting alongside `ProductForm` — **not inside a tab, not below the fold, not behind a button** — and recomputes via `useMemo` on every single `fieldValues` change as the buyer types, for the whole duration they're filling in the form. This is the task that satisfies the plan's core requirement — verify it explicitly: type a character, confirm the preview updates with no click and no visible delay.

`PreviewPanel.jsx` is **kept, not deleted** — relabeled from "Preview my document" to something like "See the exact PDF you'll receive," now a secondary, explicitly-lower-frequency ground-truth check underneath the always-on live preview. No functional changes to it beyond the label. `ProductForm.jsx` needs no changes.

New `LiveDocumentPreview.test.jsx` / `templatePreview.test.js`; extend `PreviewPanel.test.jsx` only if its button-label assertions need updating.

---

## Verification (for whichever session executes this)

Same subagent-driven-development process the original Digital Store rebuild used. Manual end-to-end verification needs all three repos' relevant phases running together: as an admin, create a `Template`, build a `Product` from it (lock one field, leave one editable), confirm the admin's live preview updates as fields/fixed-values are edited and the real-PDF button works pre-`ACTIVE`; as a buyer, confirm the live preview updates with no visible delay as fields are typed, a locked field shows fixed text and is disabled, and the "see the exact PDF" button's output matches the live preview's content (fonts/pagination may differ; content must not). Confirm the original seed wedding-agreement product still renders identically through the new pipeline. Re-attempt a tamper submission against both the live preview and the real checkout/fulfillment path — confirm no regression in either.
