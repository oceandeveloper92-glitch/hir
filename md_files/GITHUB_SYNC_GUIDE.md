# ☁️ GitHub Central Memory Sync Guide

## Why sync to GitHub?
1. **Off-site Backup**: If your local drive fails, your "Brain" is safe.
2. **Version History**: See how your rules and knowledge evolved over time.
3. **Multi-Device Access**: Read your project status from any device.

## Step-by-Step Setup

### 1. Create the Repository
- Go to [github.com/new](https://github.com/new).
- Name it: `ai-central-memory` (or similar).
- Select **Private** (recommended).
- **Do NOT** initialize with README or license.

### 2. Connect your Local Folder
Open PowerShell in `E:\Wordk-- Desktop\=md files All` and run:

```powershell
git init
git add .
git commit -m "Initial memory sync"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-central-memory.git
git push -u origin main
```

### 3. Daily Sync Command
Whenever you want to save your progress to the cloud, just run this:

```powershell
git add . ; git commit -m "Update memory" ; git push
```

---
*Tip: You can add this sync command to the end of your `init_project.ps1` to auto-backup every time you start a project!*
