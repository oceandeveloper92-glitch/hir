# 🗄️ DATABASE SCHEMA
<!-- Document all tables, columns, relations -->

## Database Info
- **Engine:** MySQL 8.0 / PostgreSQL 15
- **Name:** [database_name]
- **Charset:** utf8mb4
- **Collation:** utf8mb4_unicode_ci

## Tables Overview

| Table | Purpose | Key Relations |
|---|---|---|
| `admins` | System admin accounts | - |
| `employees` | Staff accounts with permissions | → departments |
| `departments` | Organization units | ← employees |
| `leads` | Potential customer enquiries | → quotations, visas |
| `quotations` | Price estimates for leads | ← leads, users |
| `visas` | Visa processing records | ← leads, users |
| `air_tickets` | Flight booking records | ← leads, users |
| `passports` | Passport processing records | ← leads, users |
| `campaigns` | Marketing campaigns | - |
| `users` | Legacy/Client accounts | - |

---

## Table: `users`
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGINT (PK) | NO | AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) | NO | - | Full name |
| email | VARCHAR(255) | NO | - | UNIQUE |
| password | VARCHAR(255) | NO | - | bcrypt hashed |
| role | ENUM('admin','user') | NO | 'user' | Access level |
| email_verified_at | TIMESTAMP | YES | NULL | - |
| created_at | TIMESTAMP | NO | CURRENT | - |
| updated_at | TIMESTAMP | NO | CURRENT | - |
| deleted_at | TIMESTAMP | YES | NULL | Soft delete |

**Indexes:**
- `UNIQUE` on `email`
- `INDEX` on `role`

---

## Table: `orders`
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | BIGINT (PK) | NO | AUTO_INCREMENT | - |
| user_id | BIGINT (FK) | NO | - | → users.id |
| total | DECIMAL(10,2) | NO | 0.00 | Order total |
| status | ENUM('pending','paid','shipped','delivered','cancelled') | NO | 'pending' | - |
| created_at | TIMESTAMP | NO | CURRENT | - |

**Indexes:**
- `INDEX` on `user_id`
- `INDEX` on `status`
- `INDEX` on `created_at`

---

## Table: [table_name]
<!-- Copy this block for each table -->
| Column | Type | Null | Default | Notes |
|---|---|---|---|---|

---

## Relations Diagram
```
users ──1:N──▶ orders
users ──1:1──▶ profiles
orders ──N:M──▶ products (via order_items)
products ──N:1──▶ categories
```

## Migrations Log
| # | Migration | Date | Status |
|---|---|---|---|
| 001 | create_users_table | YYYY-MM-DD | ✅ Applied |
| 002 | create_orders_table | YYYY-MM-DD | ✅ Applied |
