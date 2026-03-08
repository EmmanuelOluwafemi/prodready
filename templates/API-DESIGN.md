# API Design Standards

> These rules MUST be followed at all times.
> Applies to all internal and external-facing APIs.

---

## 1. Versioning

### MUST FOLLOW
- Version your API from day one —
  retrofitting versioning after clients depend on it is painful
- Prefix all API routes with the version number:
  /api/v1/users
  /api/v1/orders
- When breaking changes are needed, create a new version:
  /api/v2/users
- Maintain the previous version for a defined deprecation period —
  minimum 6 months for external APIs
- Communicate deprecations via:
  - Sunset response header with the deprecation date
  - Deprecation response header
  - Email notification to API consumers
  - Public changelog entry
- Non-breaking changes (new optional fields, new endpoints)
  do not require a version bump
- Breaking changes that require a new version:
  - Removing a field from a response
  - Changing a field's data type
  - Changing authentication method
  - Changing required request parameters
  - Changing URL structure

---

## 2. Pagination

### MUST FOLLOW
- ALWAYS paginate endpoints that return lists —
  never return unbounded results
- Even if there are only 5 records today,
  design for pagination from the start
- Use cursor-based pagination for large or frequently
  updated datasets — it is more performant and stable than offset:

```json
{
  "data": [],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzfQ==",
    "has_more": true
  }
}
```

- Use offset-based pagination only for small, stable datasets
  where users need to jump to specific pages:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

- Set a maximum page size —
  never allow a caller to request unlimited records
- Default page size: 20–50 records
- Maximum page size: 100 records (adjust based on record size)

---

## 3. Consistent Response Shapes

### MUST FOLLOW
- Use the same response structure for ALL endpoints —
  success and error responses must be predictable

### Success response shape
```json
{
  "data": {
    "id": "usr_01HXYZ",
    "email": "user@example.com",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### Success list response shape
```json
{
  "data": [],
  "pagination": {},
  "meta": {
    "total": 150
  }
}
```

### Error response shape
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field is required",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### MUST also follow
- Use ISO 8601 format for all timestamps: 2025-01-01T00:00:00Z
- Use consistent ID formats throughout —
  prefixed IDs (usr_xxx, ord_xxx) are easier to debug than bare UUIDs
- Use snake_case for JSON field names
- Use UTC for all timestamps — never return local time
- Return null for missing optional fields rather than omitting them
- Use HTTP status codes correctly:

| Code | Use |
|------|-----|
| 200 | Success |
| 201 | Resource created |
| 204 | Success, no content |
| 400 | Validation error, bad request |
| 401 | Not authenticated |
| 403 | Authenticated but not authorised |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate) |
| 422 | Unprocessable entity |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## 4. Idempotency

### MUST FOLLOW
- Critical operations MUST be idempotent —
  submitting the same request twice must produce the same result,
  not two side effects
- Operations that MUST be idempotent:
  - Payment processing
  - Order creation
  - Email sending
  - Account creation
  - Subscription activation
- Implement idempotency using idempotency keys:
  - Client sends a unique Idempotency-Key header with each request
  - Server stores the result of the first request against that key
  - Subsequent requests with the same key return the stored result
  - Keys should expire after 24 hours
- Use database transactions for operations that modify multiple records —
  ensure partial completion is never possible
- Make DELETE operations idempotent —
  deleting an already-deleted resource should return 204, not 404

---

## 5. Security & Data Exposure

### MUST FOLLOW
- NEVER return sensitive fields in API responses:
  - Password hashes
  - Raw tokens or API keys
  - Internal database IDs that expose sequential patterns
  - Other users' private data
  - Internal service configuration
- Use an explicit allowlist of fields to return —
  never return entire database rows directly
- Implement field-level access control —
  an admin response may include more fields than a regular user response
- Sanitise all LLM-generated content before returning it
  in API responses — prompt injection via crafted user input
  that manipulates LLM output is a documented attack vector
- Validate that the authenticated user has permission to access
  the specific resource being requested —
  not just that they are authenticated
- Implement CORS properly —
  only allow trusted origins, never use * in production

---

## 6. Documentation

### MUST FOLLOW
- Document every API endpoint before or alongside implementation
- Every endpoint documentation must include:
  - HTTP method and path
  - Description of what it does
  - Authentication requirements
  - Request parameters (path, query, body) with types and constraints
  - Response schema with field descriptions
  - Possible error codes and their meaning
  - A working example request and response
- Use OpenAPI (Swagger) 3.x specification —
  it enables automatic documentation and client SDK generation
- Keep documentation in sync with implementation —
  outdated documentation is worse than no documentation
