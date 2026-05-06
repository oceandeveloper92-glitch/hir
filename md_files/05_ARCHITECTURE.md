# 🏗️ ARCHITECTURE
<!-- System design, tech decisions, and component overview -->

## System Overview
```
[Client/Browser] → [Frontend] → [API/Backend] → [Database]
                                      ↓
                               [Third-Party APIs]
```

## Tech Stack

| Layer | Technology | Version | Why Chosen |
|---|---|---|---|
| Frontend | React (Vite) | - | Modern, fast build times |
| Backend | Node.js (Express) | - | Scalable, JavaScript throughout |
| Database | MySQL | 8.0 | Reliable relational storage |
| ORM | Sequelize | 6.x | Mature Node.js ORM |
| Auth | JWT | - | Stateless authentication |
| Email | Gmail SMTP | - | Direct communication |
| Storage | Local | - | Simplicity for initial phase |

## Folder Structure
```
hir-work/
├── hir/                    ← Project Source
│   ├── backend/            ← Backend Root
│   │   └── backend/        ← Node.js App
│   │       ├── config/     ← DB Config
│   │       ├── controllers/ ← Route Handlers
│   │       ├── models/     ← Sequelize Models
│   │       ├── routers/    ← Express Routes
│   │       └── app.js      ← Main Entry
├── md_files/               ← Documentation
├── assets/                 ← Frontend Build Assets
├── index.html              ← Frontend Entry
└── hir_international.sql   ← Database Dump
```

## Key Components

### 1. Authentication
- Method: [Session/JWT/OAuth]
- Provider: [Custom/Laravel Auth/NextAuth]

### 2. API Design
- Style: [REST/GraphQL]
- Versioning: [URL/Header]
- Auth: [Bearer Token/API Key]

### 3. Database Design
- See `DATABASE_SCHEMA.md` for full schema

### 4. Background Jobs
- Queue driver: [Redis/Database]
- Jobs: [List key background jobs]

## Architecture Decisions Record (ADR)

### ADR-001: [Decision Title]
- **Date:** YYYY-MM-DD
- **Status:** Accepted / Rejected / Superseded
- **Context:** [Why this decision was needed]
- **Decision:** [What was decided]
- **Consequences:** [Impact of this decision]

### ADR-002: [Decision Title]
- **Date:** YYYY-MM-DD
- **Status:** Accepted
- **Context:** [Context]
- **Decision:** [Decision]
- **Consequences:** [Consequences]

## Diagram
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Server  │────▶│ Database │
│ (Browser)│◀────│ (API)    │◀────│ (MySQL)  │
└──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
               ┌──────────────┐
               │ External APIs │
               │ (Payment/SMS) │
               └──────────────┘
```
