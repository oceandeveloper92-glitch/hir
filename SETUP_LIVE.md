# HIR Live - Local Setup & Start Guide

This folder contains the production build of the HIR International ERP. To run this folder locally, you need to connect it to the backend source code.

---

## 🚀 How to Start

### 1. Start the Backend
The "HIR Live" folder does not have its own backend. You must run the backend from the main project folder.

1.  Open a terminal.
2.  Navigate to the backend:
    ```powershell
    cd "D:\office\hir\hir\backend\backend"
    ```
3.  Start it:
    ```powershell
    npm run dev
    ```
    *The backend will run on http://localhost:3005*

### 2. Start the Frontend (This Folder)
1.  Open a **second** terminal.
2.  Navigate to this folder:
    ```powershell
    cd "D:\office\hir\hir live"
    ```
3.  Start the static server:
    ```powershell
    npx serve . -p 5005
    ```
    *The frontend will run on http://localhost:5005*

---

## 🛠️ Configuration Detail (serve.json)

I have created a `serve.json` file in this folder. This file is **CRITICAL** because it:
1.  **Proxies API Calls**: Redirects all `/api` requests from this folder to your local backend on port 3005.
2.  **Handles Routing**: Ensures that if you refresh the page on a sub-route (like `/dashboard`), it doesn't show a 404 error.

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "http://localhost:3005/api/$1" },
    { "source": "**", "destination": "/index.html" }
  ]
}
```

---

## 📊 Database
This setup uses the same MySQL database as your main project. Ensure your MySQL service is running and the `hir_international` database is set up.

*   **Default Login**: `kiran@hirinternational.com` / `admin123`

---

## 🛑 How to Stop
*   In the terminals, press `Ctrl + C` to stop the processes.
*   If you are using **PM2**, use `pm2 stop all`.
