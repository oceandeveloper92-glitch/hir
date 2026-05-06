# 📡 API DOCUMENTATION
<!-- Document all API endpoints here -->

## Base URL
```
Production:  https://erp.hirinternational.com/api
Local:       http://localhost:3005/api
```

## Authentication
- **Type:** Bearer Token / API Key
- **Header:** `Authorization: Bearer {token}`
- **Get Token:** POST `/auth/login`

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "errors": null,
  "meta": {
    "page": 1,
    "total": 100
  }
}
```

## Error Codes
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get token |
| POST | `/auth/logout` | Invalidate token |
| POST | `/auth/forgot-password` | Request password reset |

#### POST `/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "id": 1, "name": "Ocean", "email": "user@example.com" }
  }
}
```

---

### 👤 Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List users (paginated) |
| GET | `/users/{id}` | Get single user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

---

### 📦 [Resource Name]
| Method | Endpoint | Description |
|---|---|---|
| GET | `/resource` | List all |
| POST | `/resource` | Create new |
| GET | `/resource/{id}` | Get one |
| PUT | `/resource/{id}` | Update |
| DELETE | `/resource/{id}` | Delete |

<!-- Copy the block above for each API resource -->

---

## Webhooks
| Event | URL | Payload |
|---|---|---|
| `order.created` | `/webhooks/order` | `{ order_id, status, ... }` |

## Rate Limits
- **Per minute:** 60 requests
- **Per hour:** 1000 requests
