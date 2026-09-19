# Buyer Image Upload Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a buyer upload their own image (e.g. a studio logo) as a customization field, which then renders into their generated document — a new "Image" field type, general-purpose across any current or future template/product.

**Architecture:** A new `"image"` entry in the backend's field-schema type registry validates that a submitted field value is a URL we ourselves generated (never an arbitrary external URL). A new customer-authenticated endpoint accepts a direct multipart file upload, validates the real file bytes (size + magic-byte content sniffing — never trusting the client's declared type), and uploads to the existing public R2 media bucket under a `customer-uploads/` prefix. The admin field-type dropdown gets one new option. The storefront's generic field-renderer gets one new branch: a file picker instead of a text input. No changes are needed to either PDF renderer (real or live-preview) — `{{fieldName}}` substitution already works correctly inside an `<img src="{{fieldName}}">` once the field's value is a real URL.

**Tech Stack:** Spring Boot 4 / Java 21 (backend), AWS SDK v2 S3 client (R2), React + TypeScript (admin), React + Vite (storefront), Vitest/JUnit for tests.

**Spec:** `docs/superpowers/specs/2026-09-20-buyer-image-upload-field-design.md`

## Global Constraints

- Max upload size: 5MB.
- Allowed types: PNG, JPEG, WebP only — verified by real file-byte magic-number sniffing server-side, never by trusting the client's declared `Content-Type`.
- The "image" field type is general-purpose: usable on any Template's `fieldStructure` and any Product's `fieldSchema`, not special-cased to one template.
- An "image" field's submitted value must start with `{R2_PUBLIC_BASE_URL}/customer-uploads/` — anything else is rejected. This is a security control, not a formatting preference.
- No new database table/entity for uploads — the returned URL is just a plain field value, carried through the existing `cart_items`/`order_items` JSONB `field_values` columns like any other field.
- The new upload endpoint requires an authenticated Customer (`hasRole("CUSTOMER")`), the same security rule already covering `/api/v1/cart/**` and `/api/v1/checkout`.

---

## Task 1: Backend — "image" field type in GenericFieldSchemaValidator

**Files:**
- Modify: `src/main/java/com/mcreatik/cms/product/validation/GenericFieldSchemaValidator.java`
- Modify: `src/test/java/com/mcreatik/cms/product/validation/GenericFieldSchemaValidatorTest.java`
- Modify: `src/test/java/com/mcreatik/cms/cart/service/CartServiceTest.java`
- Modify: `src/test/java/com/mcreatik/cms/product/service/OrderServiceTest.java`

**Interfaces:**
- Produces: `GenericFieldSchemaValidator(String r2PublicBaseUrl)` — a new required constructor parameter (previously no-args). Every existing production call site is Spring-managed (`@Component`, autowired) and needs no change; only the three test files that construct it directly with `new GenericFieldSchemaValidator()` need updating.
- Produces: the validator now accepts `"image"` as a field `type`, resolving unknown-vs-known exactly like the existing four types.

This repo lives at `D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment`. Run all commands from there.

- [ ] **Step 1: Write the failing tests for the new validator behavior**

Open `src/test/java/com/mcreatik/cms/product/validation/GenericFieldSchemaValidatorTest.java`. Change line 28 from:

```java
    private final GenericFieldSchemaValidator validator = new GenericFieldSchemaValidator();
```

to:

```java
    private static final String TEST_R2_BASE_URL = "https://cdn.test";

    private final GenericFieldSchemaValidator validator = new GenericFieldSchemaValidator(TEST_R2_BASE_URL);
```

Then add this new test class section anywhere after the existing tests in the file (before the final closing `}`):

```java
    // ------------------------------------------------------------------- image type

    @Test
    void anImageFieldAcceptsAUrlUnderTheConfiguredCustomerUploadsPrefix() {
        Map<String, Object> schema = Map.of("fields", List.of(field("studioLogo", "image", true)));
        Map<String, Object> values = Map.of(
                "studioLogo", "https://cdn.test/customer-uploads/11111111-1111-1111-1111-111111111111/abc.png");

        assertThatCode(() -> validator.validateAndResolve(schema, values)).doesNotThrowAnyException();
    }

    @Test
    void anImageFieldRejectsAnExternalUrl() {
        Map<String, Object> schema = Map.of("fields", List.of(field("studioLogo", "image", true)));
        Map<String, Object> values = Map.of("studioLogo", "https://evil.example.com/tracking-pixel.png");

        assertRejects(() -> validator.validateAndResolve(schema, values))
                .satisfies(thrown -> errorsOf(thrown).hasEntrySatisfying(
                        "studioLogo", message -> assertThat(message).contains("customer image upload endpoint")));
    }

    @Test
    void anImageFieldRejectsAUrlOnOurOwnDomainButOutsideTheCustomerUploadsPrefix() {
        Map<String, Object> schema = Map.of("fields", List.of(field("studioLogo", "image", true)));
        // Same host as TEST_R2_BASE_URL, but not under /customer-uploads/ - e.g. an
        // admin-curated media/ object a buyer isn't supposed to be able to reference here.
        Map<String, Object> values = Map.of("studioLogo", "https://cdn.test/media/some-admin-image.png");

        assertRejects(() -> validator.validateAndResolve(schema, values))
                .satisfies(thrown -> errorsOf(thrown).containsKey("studioLogo"));
    }

    @Test
    void anImageFieldRejectsAnOverlongValue() {
        Map<String, Object> schema = Map.of("fields", List.of(field("studioLogo", "image", true)));
        String tooLong = "https://cdn.test/customer-uploads/" + "a".repeat(300) + ".png";
        Map<String, Object> values = Map.of("studioLogo", tooLong);

        assertRejects(() -> validator.validateAndResolve(schema, values))
                .satisfies(thrown -> errorsOf(thrown).containsKey("studioLogo"));
    }

    @Test
    void anImageFieldRejectsANonStringValue() {
        Map<String, Object> schema = Map.of("fields", List.of(field("studioLogo", "image", true)));
        Map<String, Object> values = Map.of("studioLogo", 12345);

        assertRejects(() -> validator.validateAndResolve(schema, values))
                .satisfies(thrown -> errorsOf(thrown).containsKey("studioLogo"));
    }
```

`ProductFieldValidationException` is already in this same package (`com.mcreatik.cms.product.validation`) — no new import needed. The tests above reuse this file's own existing `assertRejects`/`errorsOf` helpers (defined a little above the "migrated wedding coverage" section) rather than asserting on the exception directly, matching every other rejection test already in this file.

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
./mvnw -q -B test -o -Dtest=GenericFieldSchemaValidatorTest
```

Expected: compile error (constructor signature mismatch) or test failures — `"image"` isn't a recognized type yet, so it currently falls through to the string-fallback validator and none of the new assertions hold.

- [ ] **Step 3: Implement the "image" type in GenericFieldSchemaValidator**

Open `src/main/java/com/mcreatik/cms/product/validation/GenericFieldSchemaValidator.java`.

Change the class body from (starting at the existing `TYPE_REGISTRY` declaration, roughly lines 96-104):

```java
    // The extension point: a new supported field type is a new entry here.
    private static final Map<String, FieldTypeValidator> TYPE_REGISTRY = Map.of(
            "string", GenericFieldSchemaValidator::validateString,
            "email", GenericFieldSchemaValidator::validateEmail,
            "date", GenericFieldSchemaValidator::validateDate,
            "number", GenericFieldSchemaValidator::validateNumber);

    // Unknown types are treated as free text rather than rejected: the seed schema
    // uses "tel", which the old hard-coded validator also handled as a plain string.
    private static final FieldTypeValidator FALLBACK_VALIDATOR = GenericFieldSchemaValidator::validateString;
```

to:

```java
    // Default cap for an "image" field's URL length when the schema doesn't set its
    // own maxLength - a generated {R2_PUBLIC_BASE_URL}/customer-uploads/{uuid}.{ext}
    // URL is well under 150 characters in practice; 300 leaves headroom without
    // accepting an implausibly long string.
    private static final int DEFAULT_IMAGE_URL_MAX_LENGTH = 300;

    // The extension point: a new supported field type is a new entry here.
    private final Map<String, FieldTypeValidator> typeRegistry;

    // Every "image" field's value must start with exactly this - see validateImage.
    // Built once from the injected R2 public base URL rather than re-derived per call.
    private final String customerUploadsUrlPrefix;

    // Unknown types are treated as free text rather than rejected: the seed schema
    // uses "tel", which the old hard-coded validator also handled as a plain string.
    private static final FieldTypeValidator FALLBACK_VALIDATOR = GenericFieldSchemaValidator::validateString;

    public GenericFieldSchemaValidator(
            @org.springframework.beans.factory.annotation.Value("${r2.public-base-url}") String r2PublicBaseUrl) {
        String normalized = r2PublicBaseUrl.endsWith("/")
                ? r2PublicBaseUrl.substring(0, r2PublicBaseUrl.length() - 1)
                : r2PublicBaseUrl;
        this.customerUploadsUrlPrefix = normalized + "/customer-uploads/";
        this.typeRegistry = Map.of(
                "string", GenericFieldSchemaValidator::validateString,
                "email", GenericFieldSchemaValidator::validateEmail,
                "date", GenericFieldSchemaValidator::validateDate,
                "number", GenericFieldSchemaValidator::validateNumber,
                "image", this::validateImage);
    }
```

(The `@Value` import is written fully-qualified inline above to avoid guessing whether `org.springframework.beans.factory.annotation.Value` is already imported elsewhere in this file under a different name — once you're editing the file, move it to a normal top-of-file `import org.springframework.beans.factory.annotation.Value;` and use the plain `@Value(...)` annotation instead; either compiles identically.)

Change `validatorFor` (currently):

```java
    private FieldTypeValidator validatorFor(String type) {
        return TYPE_REGISTRY.getOrDefault(type, FALLBACK_VALIDATOR);
    }
```

to:

```java
    private FieldTypeValidator validatorFor(String type) {
        return typeRegistry.getOrDefault(type, FALLBACK_VALIDATOR);
    }
```

Add the new validator method next to the existing `validateString`/`validateEmail`/etc. methods (in the "type checks" section):

```java
    /**
     * An "image" field's value is always a URL this backend itself generated via
     * the customer image-upload endpoint (POST /api/v1/customer/uploads/image) -
     * never arbitrary buyer-submitted text. Requiring the exact customer-uploads
     * prefix (not just "any URL", not just "any string on our own domain") is what
     * stops a buyer from bypassing the upload endpoint entirely and submitting a
     * fabricated or external URL directly to /api/v1/cart/items, which would
     * otherwise end up embedded in their generated document and rendered by our
     * own PDF pipeline.
     */
    private String validateImage(FieldDefinition field, Object value) {
        if (!(value instanceof String s)) {
            return "must be a string";
        }
        int maxLength = field.maxLength() != null ? field.maxLength() : DEFAULT_IMAGE_URL_MAX_LENGTH;
        if (s.length() > maxLength) {
            return "must be at most " + maxLength + " characters";
        }
        if (!s.startsWith(customerUploadsUrlPrefix)) {
            return "must reference an image uploaded through the customer image upload endpoint";
        }
        return null;
    }
```

- [ ] **Step 4: Fix the two other direct-construction call sites**

In `src/test/java/com/mcreatik/cms/cart/service/CartServiceTest.java`, find:

```java
            new PurchasableProductResolver(productRepository, new GenericFieldSchemaValidator());
```

and change it to:

```java
            new PurchasableProductResolver(productRepository, new GenericFieldSchemaValidator("https://cdn.test"));
```

In `src/test/java/com/mcreatik/cms/product/service/OrderServiceTest.java`, find the identical line and apply the identical change:

```java
            new PurchasableProductResolver(productRepository, new GenericFieldSchemaValidator("https://cdn.test"));
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
./mvnw -q -B test -o -Dtest=GenericFieldSchemaValidatorTest,CartServiceTest,OrderServiceTest
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/mcreatik/cms/product/validation/GenericFieldSchemaValidator.java src/test/java/com/mcreatik/cms/product/validation/GenericFieldSchemaValidatorTest.java src/test/java/com/mcreatik/cms/cart/service/CartServiceTest.java src/test/java/com/mcreatik/cms/product/service/OrderServiceTest.java
git commit -m "Add an 'image' field type to GenericFieldSchemaValidator

Validates that a submitted image-field value is a URL this backend
itself generated via the customer upload endpoint (starts with
{R2_PUBLIC_BASE_URL}/customer-uploads/), not arbitrary buyer text -
closes the hole where a buyer could otherwise submit a fabricated or
external URL directly to the cart API."
```

---

## Task 2: Backend — R2StorageService direct byte upload

**Files:**
- Modify: `src/main/java/com/mcreatik/cms/media/service/R2StorageService.java`
- Test: `src/test/java/com/mcreatik/cms/media/service/R2StorageServiceTest.java` (create if it doesn't already exist — check first)

**Interfaces:**
- Consumes: nothing new from Task 1.
- Produces: `R2StorageService.uploadBytes(String objectKey, byte[] bytes, String contentType)` — used by Task 3's controller.

- [ ] **Step 1: Check for an existing test file first**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
find src/test -iname "R2StorageServiceTest.java"
```

If it exists, read it fully before continuing, and add the new test to it following its existing mocking conventions instead of the fresh-file steps below (its existing `S3Client`/bucket mocking setup should already give you everything the new test needs — just add one more `@Test` method to it, verifying `s3Client.putObject(...)` was called with the right bucket/key/contentType and the right byte content, the same way its existing tests verify `presignUpload`/`delete`).

If it does not exist, continue with the steps below to create a new minimal test file covering just the new method (do not attempt to backfill full coverage of the rest of the class — out of scope for this task).

- [ ] **Step 2: Write the failing test**

Create `src/test/java/com/mcreatik/cms/media/service/R2StorageServiceTest.java`:

```java
package com.mcreatik.cms.media.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

class R2StorageServiceTest {

    private final S3Client s3Client = mock(S3Client.class);
    private final S3Presigner s3Presigner = mock(S3Presigner.class);
    private final R2StorageService service =
            new R2StorageService(s3Client, s3Presigner, "test-bucket", "https://cdn.test");

    @Test
    void uploadBytesPutsTheExactBytesUnderTheGivenKeyAndContentType() {
        byte[] content = { 1, 2, 3, 4 };

        service.uploadBytes("customer-uploads/abc/def.png", content, "image/png");

        verify(s3Client).putObject(
                eq(PutObjectRequest.builder()
                        .bucket("test-bucket")
                        .key("customer-uploads/abc/def.png")
                        .contentType("image/png")
                        .build()),
                any(RequestBody.class));
    }
}
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
./mvnw -q -B test -o -Dtest=R2StorageServiceTest
```

Expected: FAIL — `uploadBytes` doesn't exist yet (compile error).

- [ ] **Step 4: Implement `uploadBytes`**

Open `src/main/java/com/mcreatik/cms/media/service/R2StorageService.java`. Add this import alongside the existing `software.amazon.awssdk.services.s3.*` imports:

```java
import software.amazon.awssdk.core.sync.RequestBody;
```

Add the new method next to `presignUpload`:

```java
    /**
     * Direct server-side upload (as opposed to presignUpload's client-PUTs-directly
     * flow above): the caller already has validated bytes in hand (see
     * CustomerUploadController - real file-content magic-byte sniffing happens
     * before this is ever called) and uploads them itself, rather than handing the
     * client a signed URL and trusting whatever it PUTs there matches what it
     * declared at presign time.
     */
    public void uploadBytes(String objectKey, byte[] bytes, String contentType) {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .contentType(contentType)
                .build();
        s3Client.putObject(putRequest, RequestBody.fromBytes(bytes));
    }
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
./mvnw -q -B test -o -Dtest=R2StorageServiceTest
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/main/java/com/mcreatik/cms/media/service/R2StorageService.java src/test/java/com/mcreatik/cms/media/service/R2StorageServiceTest.java
git commit -m "Add R2StorageService.uploadBytes for direct server-side uploads

The customer image-upload endpoint (next task) validates real file
bytes before storing them, so it needs to push already-validated
bytes to R2 itself rather than handing the client a presigned URL and
trusting an unverified PUT."
```

---

## Task 3: Backend — customer image upload endpoint

**Files:**
- Create: `src/main/java/com/mcreatik/cms/customer/dto/CustomerImageUploadResponse.java`
- Create: `src/main/java/com/mcreatik/cms/customer/controller/CustomerUploadController.java`
- Modify: `src/main/java/com/mcreatik/cms/config/SecurityConfig.java`
- Create: `src/test/java/com/mcreatik/cms/customer/controller/CustomerUploadControllerTest.java`

**Interfaces:**
- Consumes: `R2StorageService.uploadBytes(String, byte[], String)` (Task 2), `CurrentCustomerService.require(Authentication)` (existing, used identically to `CartController`).
- Produces: `POST /api/v1/customer/uploads/image` → `{ "url": "<public URL>" }`, `hasRole("CUSTOMER")`-gated.

- [ ] **Step 1: Write the failing controller test**

Create `src/test/java/com/mcreatik/cms/customer/controller/CustomerUploadControllerTest.java`. This mirrors `CartControllerAuthorizationTest`'s style exactly (real JWTs, real security chain, `@SpringBootTest` + `@AutoConfigureMockMvc`, no bean overrides so it shares the connection-pooled context other tests in that style already use):

```java
package com.mcreatik.cms.customer.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;

import com.mcreatik.cms.auth.security.CustomerJwtService;
import com.mcreatik.cms.auth.security.JwtService;
import com.mcreatik.cms.customer.entity.Customer;
import com.mcreatik.cms.customer.repository.CustomerRepository;
import com.mcreatik.cms.user.entity.Role;
import com.mcreatik.cms.user.entity.User;

/**
 * Mirrors CartControllerAuthorizationTest's style: real JWTs, real security chain,
 * no bean overrides so this shares the same cached Spring context as the other
 * tests in that style rather than paying for (and contributing to the connection-
 * slot pressure of) a fresh one.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CustomerUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerJwtService customerJwtService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Customer customer;
    private String customerToken;

    // A minimal, genuinely valid 1x1 PNG - the exact bytes matter here, since the
    // endpoint sniffs real magic bytes rather than trusting the declared content type.
    private static final byte[] VALID_PNG_BYTES = {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, (byte) 0x90, 0x77, 0x53,
            (byte) 0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
            0x54, 0x08, (byte) 0xD7, 0x63, (byte) 0xF8, (byte) 0xCF,
            (byte) 0xC0, 0x00, 0x00, 0x00, 0x03, 0x00, 0x01,
            (byte) 0x9C, (byte) 0xB4, (byte) 0xFB, 0x00, 0x00, 0x00,
            0x00, 0x49, 0x45, 0x4E, 0x44, (byte) 0xAE, 0x42, 0x60, (byte) 0x82
    };

    @BeforeEach
    void setUp() {
        customer = customerRepository.save(
                new Customer("upload-test-" + UUID.randomUUID() + "@example.test", "hash", "Upload Tester"));
        customerToken = customerJwtService.generateAccessToken(customer);
    }

    @AfterEach
    void deleteTheCommittedRow() {
        jdbcTemplate.update("DELETE FROM customers WHERE id = ?", customer.getId());
    }

    @Test
    void requiresAuthentication() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "logo.png", "image/png", VALID_PNG_BYTES);

        mockMvc.perform(multipart("/api/v1/customer/uploads/image").file(file))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void aGenuineAdminAccessTokenCannotReachIt() throws Exception {
        String adminToken = jwtService.generateAccessToken(
                new User("upload-admin@example.com", "hash", "Test Admin", Role.ADMIN));
        MockMultipartFile file = new MockMultipartFile("file", "logo.png", "image/png", VALID_PNG_BYTES);

        mockMvc.perform(multipart("/api/v1/customer/uploads/image")
                        .file(file)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void aSignedInCustomerCanUploadARealPngAndGetsBackAUrlUnderTheirOwnCustomerUploadsPrefix() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "logo.png", "image/png", VALID_PNG_BYTES);

        MvcResult result = mockMvc.perform(multipart("/api/v1/customer/uploads/image")
                        .file(file)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").exists())
                .andReturn();

        String url = com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), "$.url");
        assertThat(url).contains("/customer-uploads/" + customer.getId() + "/");
        assertThat(url).endsWith(".png");
    }

    @Test
    void rejectsAFileThatIsNotActuallyAnImageRegardlessOfItsDeclaredContentType() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "not-really-an-image.png", "image/png", "just some plain text".getBytes());

        mockMvc.perform(multipart("/api/v1/customer/uploads/image")
                        .file(file)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsAFileOverTheSizeLimit() throws Exception {
        byte[] tooLarge = new byte[5_000_001];
        MockMultipartFile file = new MockMultipartFile("file", "huge.png", "image/png", tooLarge);

        mockMvc.perform(multipart("/api/v1/customer/uploads/image")
                        .file(file)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isBadRequest());
    }
}
```

Add the missing `MockMvc` import (`org.springframework.test.web.servlet.MockMvc`) alongside the others at the top of the file — it was left out of the list above by mistake; add:

```java
import org.springframework.test.web.servlet.MockMvc;
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
./mvnw -q -B test -o -Dtest=CustomerUploadControllerTest
```

Expected: FAIL — the controller/route doesn't exist yet (404s, or compile error once you're also mid-way through later steps).

- [ ] **Step 3: Create the response DTO**

Create `src/main/java/com/mcreatik/cms/customer/dto/CustomerImageUploadResponse.java`:

```java
package com.mcreatik.cms.customer.dto;

public record CustomerImageUploadResponse(String url) {
}
```

- [ ] **Step 4: Create the controller**

Create `src/main/java/com/mcreatik/cms/customer/controller/CustomerUploadController.java`:

```java
package com.mcreatik.cms.customer.controller;

import java.io.IOException;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.mcreatik.cms.customer.dto.CustomerImageUploadResponse;
import com.mcreatik.cms.customer.service.CurrentCustomerService;
import com.mcreatik.cms.media.service.R2StorageService;

/**
 * A signed-in buyer's own image uploads - a studio's logo, today, but general-
 * purpose: whatever a template's "image"-type field is for. Reachability is
 * gated in SecurityConfig by hasRole("CUSTOMER"), the same rule covering
 * /api/v1/cart/** and /api/v1/checkout, for the identical reason CartController
 * states on itself: an admin token authenticates fine against this application,
 * and this endpoint has no meaning for a principal that isn't a Customer.
 *
 * <p>Deliberately a direct server-side upload, not the presign-PUT-confirm flow
 * MediaController (admin) uses: the whole point of the validation below is that
 * the backend inspects real file bytes before anything is written to storage,
 * which a presign flow - where the client PUTs straight to R2 and the backend
 * never sees the bytes - cannot do. See R2StorageService#uploadBytes's own
 * comment.
 */
@RestController
@RequestMapping("/api/v1/customer/uploads")
public class CustomerUploadController {

    private static final long MAX_SIZE_BYTES = 5_000_000;

    private final R2StorageService storageService;
    private final CurrentCustomerService currentCustomerService;

    public CustomerUploadController(R2StorageService storageService, CurrentCustomerService currentCustomerService) {
        this.storageService = storageService;
        this.currentCustomerService = currentCustomerService;
    }

    @PostMapping("/image")
    public CustomerImageUploadResponse uploadImage(Authentication authentication, @RequestParam("file") MultipartFile file)
            throws IOException {
        UUID customerId = currentCustomerService.require(authentication).getId();

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file must not be empty");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file must be at most 5MB");
        }

        byte[] bytes = file.getBytes();
        String extension = sniffImageExtension(bytes);
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file must be a PNG, JPEG, or WebP image");
        }

        String objectKey = "customer-uploads/" + customerId + "/" + UUID.randomUUID() + "." + extension;
        storageService.uploadBytes(objectKey, bytes, contentTypeFor(extension));
        return new CustomerImageUploadResponse(storageService.publicUrl(objectKey));
    }

    /**
     * Real magic-byte sniffing, never the client-declared Content-Type header -
     * that header is exactly what a malicious or buggy client controls and lies
     * about. Returns null (not an exception) for anything unrecognised, so the
     * caller can turn that into a plain 400 with a buyer-readable message rather
     * than a generic 500.
     */
    private static String sniffImageExtension(byte[] bytes) {
        if (bytes.length >= 8
                && (bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47
                && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A) {
            return "png";
        }
        if (bytes.length >= 3
                && (bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        if (bytes.length >= 12
                && bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P') {
            return "webp";
        }
        return null;
    }

    private static String contentTypeFor(String extension) {
        return switch (extension) {
            case "png" -> "image/png";
            case "jpg" -> "image/jpeg";
            case "webp" -> "image/webp";
            default -> throw new IllegalStateException("Unreachable: unrecognised extension " + extension);
        };
    }
}
```

- [ ] **Step 5: Wire the route into SecurityConfig**

Open `src/main/java/com/mcreatik/cms/config/SecurityConfig.java`. Find this line (around line 96):

```java
                .requestMatchers("/api/v1/cart/**", "/api/v1/checkout").hasRole("CUSTOMER")
```

Change it to:

```java
                .requestMatchers("/api/v1/cart/**", "/api/v1/checkout", "/api/v1/customer/uploads/**").hasRole("CUSTOMER")
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
./mvnw -q -B test -o -Dtest=CustomerUploadControllerTest
```

Expected: all PASS. If a test fails with a connection-pool error rather than a real assertion failure, do not treat that as a real bug — re-run just this one test class in isolation (which is exactly what the command above already does) rather than the full suite; see this repo's own notes on the shared database's connection-slot ceiling under heavy parallel test load.

- [ ] **Step 7: Commit**

```bash
git add src/main/java/com/mcreatik/cms/customer/dto/CustomerImageUploadResponse.java src/main/java/com/mcreatik/cms/customer/controller/CustomerUploadController.java src/main/java/com/mcreatik/cms/config/SecurityConfig.java src/test/java/com/mcreatik/cms/customer/controller/CustomerUploadControllerTest.java
git commit -m "Add POST /api/v1/customer/uploads/image, a signed-in buyer's image upload endpoint

Direct server-side upload (not presign+PUT+confirm) so real file
bytes are validated - magic-byte sniffed as PNG/JPEG/WebP, size-capped
at 5MB - before anything reaches storage, rather than trusting a
client-declared Content-Type the way the admin's own presigned media
uploads do. Gated by the same hasRole(\"CUSTOMER\") rule already
covering /api/v1/cart/** and /api/v1/checkout."
```

---

## Task 4: Admin — "Image" field type in the schema editor UI

**Files:**
- Modify: `src/components/shared/FieldStructureEditor.tsx`
- Modify: `src/types/product.ts`
- Modify: `src/types/template.ts`
- Modify: `src/lib/templatePreview.ts`

This repo lives at `D:\Websites\mcreatik-admin`. Run all commands from there.

**Interfaces:**
- Produces: `'image'` is now a valid `FieldStructureType` / `ProductFieldType` / `TemplateFieldType` value, selectable in the admin's field-type dropdown on both the Template and Product forms (they share `FieldStructureEditor`).

There is no admin test infrastructure in this repo (a known, pre-existing gap, not something to set up as a side effect of this task) — verification for this task is `npm run build` succeeding and a manual check once deployed, not automated tests.

- [ ] **Step 1: Add `'image'` to the shared field-type dropdown**

Open `src/components/shared/FieldStructureEditor.tsx`. Change:

```typescript
export type FieldStructureType = 'string' | 'email' | 'date' | 'number'

const FIELD_TYPES: { value: FieldStructureType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
]
```

to:

```typescript
export type FieldStructureType = 'string' | 'email' | 'date' | 'number' | 'image'

const FIELD_TYPES: { value: FieldStructureType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'image', label: 'Image' },
]
```

- [ ] **Step 2: Update the two type unions that mirror this**

Open `src/types/product.ts`. Change:

```typescript
export type ProductFieldType = 'string' | 'email' | 'date' | 'number'
```

to:

```typescript
export type ProductFieldType = 'string' | 'email' | 'date' | 'number' | 'image'
```

Open `src/types/template.ts`. Change:

```typescript
export type TemplateFieldType = 'string' | 'email' | 'date' | 'number'
```

to:

```typescript
export type TemplateFieldType = 'string' | 'email' | 'date' | 'number' | 'image'
```

- [ ] **Step 3: Add a sample value for the admin's own approximate live preview**

Open `src/lib/templatePreview.ts`. Change:

```typescript
const SAMPLE_BY_TYPE: Record<TemplateFieldType, (field: TemplateFieldDefinition) => unknown> = {
  string: (field) => field.label.trim() || 'Sample text',
  email: () => 'sample@example.com',
  date: () => '2026-01-01',
  number: (field) => (typeof field.min === 'number' ? field.min : 42),
}
```

to:

```typescript
const SAMPLE_IMAGE_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='80'%3E" +
  "%3Crect width='160' height='80' fill='%23e5e7eb'/%3E" +
  "%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='12' fill='%236b7280'%3ESample logo%3C/text%3E%3C/svg%3E"

const SAMPLE_BY_TYPE: Record<TemplateFieldType, (field: TemplateFieldDefinition) => unknown> = {
  string: (field) => field.label.trim() || 'Sample text',
  email: () => 'sample@example.com',
  date: () => '2026-01-01',
  number: (field) => (typeof field.min === 'number' ? field.min : 42),
  // A self-contained data: URI - no network dependency, works the same in the
  // admin's own preview iframe whether or not any real upload exists yet.
  image: () => SAMPLE_IMAGE_DATA_URI,
}
```

Without this step, `SAMPLE_BY_TYPE` will fail to compile once `TemplateFieldType` includes `'image'` — a `Record<TemplateFieldType, ...>` requires every union member to have an entry.

- [ ] **Step 4: Verify the build**

```bash
cd "D:\Websites\mcreatik-admin"
npm run build
```

Expected: succeeds with no TypeScript errors (this is the step that would have caught the `SAMPLE_BY_TYPE` gap if Step 3 were skipped).

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/FieldStructureEditor.tsx src/types/product.ts src/types/template.ts src/lib/templatePreview.ts
git commit -m "Add an Image option to the admin's field-type dropdown

One new entry in the shared FieldStructureEditor (used by both the
Template and Product forms), the two TypeScript type unions that
mirror it, and a self-contained placeholder sample value so the
admin's own approximate live preview has something to show for an
image field before any real upload exists."
```

---

## Task 5: Storefront — customer API client support for file uploads

**Files:**
- Modify: `src/utils/customerApi.js`
- Modify: `src/utils/customerApi.test.js`

This repo lives at `D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront`. Run all commands from there.

**Interfaces:**
- Produces: `uploadCustomerImage(file: File): Promise<{ url: string }>` — used by Task 6's `ProductForm.jsx`.
- Modifies existing behavior of: `rawRequest` (internal) — now skips the automatic `Content-Type: application/json` header when the request body is a `FormData` instance, so the browser can set its own `multipart/form-data; boundary=...` header instead. This is additive/safe: no existing caller in this codebase passes a `FormData` body today, so no existing call site's behavior changes.

- [ ] **Step 1: Write the failing tests**

Open `src/utils/customerApi.test.js` and read it fully first to match its existing mocking conventions (how `globalThis.fetch` is mocked, how `setAccessToken`/`configureAuth` are set up per test) before writing the new tests below in the same style. Add these tests:

```javascript
describe('uploadCustomerImage', () => {
  it('POSTs a FormData body to /api/v1/customer/uploads/image and returns the parsed response', async () => {
    setAccessToken('token-123')
    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ url: 'https://cdn.test/customer-uploads/abc/def.png' }),
    })

    const result = await uploadCustomerImage(file)

    expect(result).toEqual({ url: 'https://cdn.test/customer-uploads/abc/def.png' })
    const [calledUrl, calledOptions] = globalThis.fetch.mock.calls[0]
    expect(calledUrl).toContain('/api/v1/customer/uploads/image')
    expect(calledOptions.body).toBeInstanceOf(FormData)
  })

  it('does not force a JSON Content-Type header onto a FormData upload', async () => {
    setAccessToken('token-123')
    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ url: 'https://cdn.test/customer-uploads/abc/def.png' }),
    })

    await uploadCustomerImage(file)

    const [, calledOptions] = globalThis.fetch.mock.calls[0]
    const headers = new Headers(calledOptions.headers)
    expect(headers.has('Content-Type')).toBe(false)
  })

  it('surfaces a rejection the same way other customerApiFetch calls do', async () => {
    setAccessToken('token-123')
    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'file must be a PNG, JPEG, or WebP image' }),
    })

    await expect(uploadCustomerImage(file)).rejects.toThrow('file must be a PNG, JPEG, or WebP image')
  })
})
```

Check the top of the test file for how `uploadCustomerImage` (and the other functions under test) are imported, and add `uploadCustomerImage` to that same `import { ... } from './customerApi'` statement.

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
npx vitest run src/utils/customerApi.test.js
```

Expected: FAIL — `uploadCustomerImage` doesn't exist yet.

- [ ] **Step 3: Implement**

Open `src/utils/customerApi.js`. Change `rawRequest` from:

```javascript
async function rawRequest(path, options) {
  const headers = new Headers(options.headers)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  // credentials: 'include' is required for the httpOnly refresh cookie to be sent
  // cross-origin to the API's own origin.
  return fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' })
}
```

to:

```javascript
async function rawRequest(path, options) {
  const headers = new Headers(options.headers)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  // A FormData body (file uploads) must NOT get a manually-set Content-Type - the
  // browser sets its own multipart/form-data; boundary=... header, which it can
  // only do correctly if no Content-Type is set at all beforehand.
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // credentials: 'include' is required for the httpOnly refresh cookie to be sent
  // cross-origin to the API's own origin.
  return fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' })
}
```

Add this new exported function near the other exported functions at the bottom of the file:

```javascript
/**
 * Uploads a buyer-selected image file for an "image"-type customization field.
 * Returns { url } on success - that url becomes the field's value exactly like
 * any other field, via the same onChange(name, value) contract every other
 * field type already uses (see ProductForm.jsx).
 */
export async function uploadCustomerImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return customerApiFetch('/api/v1/customer/uploads/image', {
    method: 'POST',
    body: formData,
  })
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
npx vitest run src/utils/customerApi.test.js
```

Expected: all PASS.

- [ ] **Step 5: Run the full storefront test suite to check nothing else broke**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
npx vitest run
```

Expected: all PASS (this file is widely depended on, so this is worth a full-suite check rather than just the one file).

- [ ] **Step 6: Commit**

```bash
git add src/utils/customerApi.js src/utils/customerApi.test.js
git commit -m "Add uploadCustomerImage to the customer API client

FormData bodies now skip the automatic JSON Content-Type header (the
browser needs to set its own multipart/form-data boundary instead) -
additive and safe, since no existing caller passes a FormData body
today. uploadCustomerImage POSTs to the new backend endpoint and
returns { url }, reusing the same auth/refresh/error handling every
other customerApi call already gets."
```

---

## Task 6: Storefront — ProductForm image field UI

**Files:**
- Modify: `src/components/digital-store/ProductForm.jsx`
- Modify: `src/components/digital-store/ProductForm.test.jsx`

This repo lives at `D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront`. Run all commands from there.

**Interfaces:**
- Consumes: `uploadCustomerImage(file)` from Task 5.
- Produces: no new exports — `ProductForm`'s existing `onChange(name, value)` contract is unchanged; an image field's `value` is simply a URL string once uploaded, exactly like any other field's value.

- [ ] **Step 1: Read the existing ProductForm.test.jsx first**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
```

Read `src/components/digital-store/ProductForm.test.jsx` in full before writing new tests, to match its existing fixture/mocking conventions exactly (how `fieldSchema`/`values`/`onChange` are set up per test, how `vi.mock` is used for module-level mocking).

- [ ] **Step 2: Write the failing tests**

Add a new `describe` block to `ProductForm.test.jsx`. This mocks `../../utils/customerApi` at the module level — check the top of the existing test file for whether other tests already do this for a different function from the same module (if so, follow that exact pattern instead of introducing a second one); otherwise add:

```javascript
vi.mock('../../utils/customerApi', () => ({
  uploadCustomerImage: vi.fn(),
}))
```

alongside the file's other imports, then:

```javascript
import { uploadCustomerImage } from '../../utils/customerApi'

describe('ProductForm — image field type', () => {
  const IMAGE_FIELD_SCHEMA = {
    fields: [{ name: 'studioLogo', type: 'image', label: 'Your Studio Logo', required: true }],
  }

  it('renders a file picker instead of a text input for an image field', () => {
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={vi.fn()} />)

    expect(screen.getByLabelText(/your studio logo/i)).toHaveAttribute('type', 'file')
  })

  it('uploads the selected file and reports the returned URL via onChange', async () => {
    uploadCustomerImage.mockResolvedValue({ url: 'https://cdn.test/customer-uploads/abc/def.png' })
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const file = new File(['fake-bytes'], 'logo.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [file] } })

    await waitFor(() => expect(handleChange).toHaveBeenCalledWith('studioLogo', 'https://cdn.test/customer-uploads/abc/def.png'))
    expect(uploadCustomerImage).toHaveBeenCalledWith(file)
  })

  it('shows an inline error and does not call onChange when the upload is rejected', async () => {
    uploadCustomerImage.mockRejectedValue(new Error('file must be a PNG, JPEG, or WebP image'))
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const file = new File(['fake-bytes'], 'logo.txt', { type: 'text/plain' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [file] } })

    expect(await screen.findByText(/file must be a png, jpeg, or webp image/i)).toBeInTheDocument()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('rejects an oversized file client-side without calling the upload endpoint at all', async () => {
    const handleChange = vi.fn()
    render(<ProductForm fieldSchema={IMAGE_FIELD_SCHEMA} values={{}} onChange={handleChange} />)

    const oversized = new File([new Uint8Array(5_000_001)], 'huge.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/your studio logo/i), { target: { files: [oversized] } })

    expect(await screen.findByText(/must be at most 5mb/i)).toBeInTheDocument()
    expect(uploadCustomerImage).not.toHaveBeenCalled()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('shows the uploaded image as a preview once set', () => {
    render(
      <ProductForm
        fieldSchema={IMAGE_FIELD_SCHEMA}
        values={{ studioLogo: 'https://cdn.test/customer-uploads/abc/def.png' }}
        onChange={vi.fn()}
      />
    )

    const preview = screen.getByAltText(/your studio logo/i)
    expect(preview).toHaveAttribute('src', 'https://cdn.test/customer-uploads/abc/def.png')
  })
})
```

Confirm `waitFor` is already imported from `@testing-library/react` at the top of the file (it's a very commonly-used import in this suite); add it to the existing import statement if it isn't already there.

- [ ] **Step 3: Run the tests to verify they fail**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
npx vitest run src/components/digital-store/ProductForm.test.jsx
```

Expected: FAIL — `ProductForm` doesn't render a file input for an image field yet (it currently falls through `resolveInputType`'s unknown-type-becomes-text branch).

- [ ] **Step 4: Implement the image field branch**

Open `src/components/digital-store/ProductForm.jsx`. Replace the whole file with:

```jsx
import { useState, useRef } from 'react'
import { uploadCustomerImage } from '../../utils/customerApi'

const KNOWN_INPUT_TYPES = new Set(['text', 'tel', 'email', 'date', 'number'])
const MAX_IMAGE_SIZE_BYTES = 5_000_000
const ACCEPTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

function resolveInputType(fieldType) {
  if (fieldType === 'string') return 'text'
  return KNOWN_INPUT_TYPES.has(fieldType) ? fieldType : 'text'
}

function coerceValue(field, rawValue) {
  if (field.type === 'number') {
    return rawValue === '' ? null : Number(rawValue)
  }
  return rawValue
}

function clientValidate(field, value) {
  const isEmpty = value === undefined || value === null || value === ''
  if (field.required && isEmpty) {
    return `${field.label} is required`
  }
  return null
}

// Mirrors the backend's own default (GenericFieldSchemaValidator#parseFields reads
// customerEditable with a default of `true`): absent means editable, so existing
// schemas written before this flag existed keep behaving exactly as they did.
function isEditable(field) {
  return field.customerEditable !== false
}

/**
 * One field's image-upload UI: a file picker, an inline error (client-side size/
 * type rejection, or a server-side rejection surfaced the same way), and a small
 * preview once a value exists. Uploads immediately on file selection (there's no
 * separate "save" step for this form), then calls the exact same
 * onChange(name, value) every other field type calls - the resulting URL is the
 * field's whole value, nothing else about this component's contract changes.
 */
function ImageField({ field, value, editable, error: serverError, onUploaded, onError }) {
  const [uploading, setUploading] = useState(false)
  const [clientError, setClientError] = useState(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setClientError(null)
    onError(field.name, null)

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setClientError(`${field.label} must be at most 5MB`)
      return
    }
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setClientError(`${field.label} must be a PNG, JPEG, or WebP image`)
      return
    }

    setUploading(true)
    try {
      const result = await uploadCustomerImage(file)
      onUploaded(field.name, result.url)
    } catch (err) {
      onError(field.name, err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const error = clientError || serverError

  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-[#17151f] mb-1.5">
        {field.label}
        {field.required && editable ? ' *' : ''}
      </label>
      {value ? (
        <img
          src={value}
          alt={field.label}
          className="mb-2 h-16 w-16 rounded-md border border-black/15 object-cover"
        />
      ) : null}
      <input
        id={field.name}
        name={field.name}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={!editable || uploading}
        onChange={editable ? handleFileChange : undefined}
        className="block w-full text-sm text-[#17151f] file:mr-3 file:rounded-md file:border file:border-black/15 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium"
      />
      {uploading ? <p className="mt-1.5 text-xs text-[#7a7887]">Uploading…</p> : null}
      {error ? (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Renders one input per fieldSchema entry - the whole point of this component is
 * that it never references a specific field name, so a new product's fieldSchema
 * "just works" with zero changes here.
 *
 * A field marked `customerEditable: false` is the tamper-vector control described
 * in GenericFieldSchemaValidator's javadoc: the backend always resolves it to the
 * schema's own `fixedValue` and silently discards anything a buyer submits for it.
 * If this form ever rendered such a field as an empty, required, editable input, a
 * buyer would see a required field they can't satisfy (blocked by client-side
 * validation) for a submission the server was going to ignore anyway. So a
 * non-editable field is always rendered disabled and pre-filled from `fixedValue`,
 * and is never subject to this component's own required-field check.
 */
export default function ProductForm({ fieldSchema, values, onChange, serverErrors = {}, onFirstInteraction }) {
  const [touched, setTouched] = useState({})
  const [imageErrors, setImageErrors] = useState({})
  const hasInteracted = useRef(false)

  function handleChange(field, rawValue) {
    if (!hasInteracted.current) {
      hasInteracted.current = true
      onFirstInteraction?.()
    }
    onChange(field.name, coerceValue(field, rawValue))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field.name]: true }))
  }

  function handleImageUploaded(name, url) {
    if (!hasInteracted.current) {
      hasInteracted.current = true
      onFirstInteraction?.()
    }
    setImageErrors((prev) => ({ ...prev, [name]: null }))
    onChange(name, url)
  }

  function handleImageError(name, message) {
    setImageErrors((prev) => ({ ...prev, [name]: message }))
  }

  return (
    <form className="space-y-5">
      {(fieldSchema?.fields ?? []).map((field) => {
        const editable = isEditable(field)
        // A non-editable field always shows its fixedValue, never the buyer's own
        // (never-submitted) draft value - there is nothing for them to edit.
        const value = editable ? values[field.name] ?? '' : field.fixedValue ?? ''

        if (field.type === 'image') {
          return (
            <ImageField
              key={field.name}
              field={field}
              value={value}
              editable={editable}
              error={imageErrors[field.name] || serverErrors[field.name]}
              onUploaded={handleImageUploaded}
              onError={handleImageError}
            />
          )
        }

        const clientError = editable && touched[field.name] ? clientValidate(field, value) : null
        const error = editable ? serverErrors[field.name] || clientError : null

        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-[#17151f] mb-1.5">
              {field.label}
              {field.required && editable ? ' *' : ''}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={resolveInputType(field.type)}
              required={editable && field.required}
              maxLength={field.maxLength}
              value={value}
              disabled={!editable}
              onChange={editable ? (e) => handleChange(field, e.target.value) : undefined}
              onBlur={editable ? () => handleBlur(field) : undefined}
              className="w-full rounded-md border border-black/15 px-3.5 py-2.5 text-base text-[#17151f] transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--store-accent)]/50 focus:border-[var(--store-accent)] disabled:bg-black/[0.03] disabled:text-[#7a7887]"
            />
            {!editable ? (
              <p className="mt-1.5 text-xs text-[#7a7887]">This value is fixed by the seller and can't be changed.</p>
            ) : null}
            {error ? (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>
        )
      })}
    </form>
  )
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
npx vitest run src/components/digital-store/ProductForm.test.jsx
```

Expected: all PASS.

- [ ] **Step 6: Run the full storefront test suite**

```bash
cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront"
npx vitest run
```

Expected: all PASS — `ProductForm` is used by `StoreProductPage`, so this confirms the change didn't regress anything there.

- [ ] **Step 7: Commit**

```bash
git add src/components/digital-store/ProductForm.jsx src/components/digital-store/ProductForm.test.jsx
git commit -m "Add image-field upload UI to ProductForm

A field with type 'image' renders a file picker instead of a text
input: uploads immediately on selection (client-side size/type
pre-check for fast feedback, always re-validated server-side), shows
a small preview once set, and reports the resulting URL through the
exact same onChange(name, value) contract every other field type
already uses - no changes needed anywhere else in the checkout flow."
```

---

## Final integration check (not a task with its own commit — a verification pass after all six)

- [ ] Confirm the backend builds and its full affected-test set passes together:
  ```bash
  cd "D:\Websites\mcreatik-backend\.worktrees\digital-store-order-payment"
  ./mvnw -q -B test -o -Dtest=GenericFieldSchemaValidatorTest,CartServiceTest,OrderServiceTest,R2StorageServiceTest,CustomerUploadControllerTest
  ```
- [ ] Confirm the admin app builds: `cd "D:\Websites\mcreatik-admin" && npm run build`
- [ ] Confirm the storefront's full suite passes: `cd "D:\Websites\mcreatik\.claude\worktrees\digital-store-storefront" && npx vitest run`
- [ ] Do **not** run the backend's *entire* test suite in one go while verifying this plan — earlier work this session found that running all ~478 backend tests serially against the shared remote database exhausts its connection-pool ceiling (a pre-existing environmental fragility, unrelated to this feature). Verify with the scoped `-Dtest=...` runs above instead.
- [ ] These are new capabilities on top of already-deployed code (Tasks C and B from earlier today) — deploying to production, and creating a real "Image" field on a real template to click-test end to end, are follow-up steps after this plan's six tasks are merged, not part of any individual task here.
