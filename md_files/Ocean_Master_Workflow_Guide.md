# 🚀 Ocean's Master Workflow Guide — AI + Developer Partnership

> **ભાષા:** Gujarati + English (Technical terms English માં)
> **Created:** 2026-03-26
> **Templates Location:** `E:\Wordk-- Desktop\=md files All\`

---

## 1. 🤝 Big Projects માં સાથે કેવી રીતે કામ કરીએ?

### Project શરૂ કરતાં પહેલાં આ Steps Follow કરો:

```
Step 1: "=md files All" folder માંથી templates copy કરો project folder માં
Step 2: PROJECT_CONTEXT.md fill કરો (project details)
Step 3: ROADMAP.md માં phases define કરો
Step 4: project_status.md auto-update થશે (workflow installed)
Step 5: દરેક session ની શરૂઆત: "/session-start" workflow run કરો
```

### 🏗️ Big Project Start Prompt:

```
Project: [નામ]
Tech Stack: [Laravel/WordPress/Shopify/etc.]
Goal: [શું achieve કરવું છે]
Current State: [હાલ ક્યાં છો]
Priority: [P0/P1/P2]

Copy templates from "E:\Wordk-- Desktop\=md files All\" to this project folder.
Fill PROJECT_CONTEXT.md.
Read project_status.md first, then start working.
After every change, update project_status.md with date/time/file/what/why.
```

---

## 2. 📋 Templates Created (Quick Reference)

| # | File | Purpose |
|---|---|---|
| 1 | `PROJECT_CONTEXT.md` | Project identity + AI rules |
| 2 | `project_status.md` | Change log with timestamps |
| 3 | `TODO.md` | Active task tracking |
| 4 | `ROADMAP.md` | Phases & milestones |
| 5 | `ARCHITECTURE.md` | System design & decisions |
| 6 | `API_DOCUMENTATION.md` | API endpoints reference |
| 7 | `DATABASE_SCHEMA.md` | Tables, relations, indexes |
| 8 | `DEPLOYMENT.md` | Server & deploy procedures |
| 9 | `TESTING.md` | Test plan & checklist |
| 10 | `BUGS.md` | Known bugs & fixes tracker |
| 11 | `CHANGELOG.md` | Version release notes |
| 12 | `SECURITY.md` | Security rules & credentials |
| 13 | `PERFORMANCE.md` | Speed/optimization notes |
| 14 | `LEARNING_PATH.md` | What to learn next |
| 15 | `AI_PROMPTS.md` | Best prompts for every situation |
| 16 | `SERVER_ACCESS.md` | Server credentials & SSH info |
| 17 | `GIT_WORKFLOW.md` | Branching & commit conventions |
| 18 | `HANDOFF_NOTES.md` | Session continuity notes |
| 19 | `REVIEW_CHECKLIST.md` | Pre-deploy quality check |
| 20 | `MEETING_NOTES.md` | Client/team discussion log |

---

## 3. 🧠 Memory & Context — કેવી રીતે "Remember" કરું

| Item | Remember? | Solution |
|---|---|---|
| Current session | ✅ હા | Auto |
| Previous session | ❌ ના | `PROJECT_CONTEXT.md` + `HANDOFF_NOTES.md` |
| Your preferences | ❌ ના | `PROJECT_CONTEXT.md` → "Rules For AI" section |
| Project history | ❌ ના | `project_status.md` = complete log |
| What was decided | ❌ ના | `ARCHITECTURE.md` → "Decisions" section |

### Session Start Prompt (દર વખતે):
```
Read PROJECT_CONTEXT.md, project_status.md, and TODO.md first.
Then tell me where we left off and what's next.
```

---

## 4. 🖥️ Live Server Work

### મને આ Info આપો:
```
Server IP: [xxx.xxx.xxx.xxx]
SSH Command: ssh user@ip -p port
Web Root: /var/www/html/project/
DB Host: localhost
DB Name: [name]
DB User: [user]
PHP Version: [8.x]
```

### Safety Rules (Always Follow):
1. ✅ Backup files BEFORE modifying
2. ✅ Test locally FIRST
3. ✅ Git commit before deploy
4. ✅ One change at a time
5. ❌ Never direct DB edits — use migrations
6. ❌ Never delete without confirmation

---

## 5. 🐛 Terminal Hang Fix

| Problem | Solution |
|---|---|
| "Run" button not clickable | Use non-interactive flags (`-y`, `--yes`) |
| Command stuck waiting | Kill + retry with `--no-input` flag |
| npm/npx prompts | Always use `npx -y` or `npm install --yes` |
| Long running command | Run in background, check later |
| Interactive script | Pass all inputs via flags |

### Prompt:
```
When running commands:
- Use non-interactive flags always
- Background long-running commands
- Kill anything stuck >15 seconds
- Never use commands requiring keyboard input
```

---

## 6. 📚 What More to Learn (Big Projects)

### 🎯 Priority Learning Path:

| Level | Topic | Why |
|---|---|---|
| 🟢 Level 1 | Git branching & PRs | Code management |
| 🟢 Level 1 | Basic Linux commands | Server management |
| 🟡 Level 2 | Docker basics | Consistent environments |
| 🟡 Level 2 | CI/CD (GitHub Actions) | Auto deployment |
| 🟡 Level 2 | Database backups & migrations | Data safety |
| 🔴 Level 3 | Load testing & monitoring | Performance |
| 🔴 Level 3 | Security hardening | Production safety |
| 🔴 Level 3 | Microservices architecture | Scaling |

> **Detail plan → see `LEARNING_PATH.md` template**

---

## 7. 🏆 Golden Rules

```
1. દર project folder માં templates copy કરો
2. PROJECT_CONTEXT.md = AI ની "memory"
3. project_status.md = Complete change log
4. Session start = Context files read
5. Specific prompts = Better results
6. Non-interactive commands = No hangs
7. Backup ALWAYS before live changes
```
