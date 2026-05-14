# Daklink: Launch Handover & Infrastructure Status

This file provides the necessary context for updating the landing page to its official production state.

## 🚀 Infrastructure Status
- **Main Domain**: `https://daklink.vn/` (Landing Page)
- **App Domain**: `https://app.daklink.vn/` (Farmer Dashboard)
- **Status**: DNS is propagated and SSL (HTTPS) is fully active on the VPS (`222.255.214.166`).

## ⚠️ Infrastructure Conflict Warning (CRITICAL)
There are two separate workspaces and two separate agents working on this project. To prevent site downtime, **DO NOT** modify the infrastructure settings of the other project.

### 1. Farmer Dashboard (`app.daklink.vn`)
- **Workspace**: `farmOS/eden-hub` & `farmOS/eden-hub-premium`
- **Frontend Port**: Next.js runs on **Port 3000**.
- **Nginx Config**: `/etc/nginx/sites-available/daklink` (Server block for `app.daklink.vn`).
- **PM2 Process**: `daklink-hub` (id: 0).

### 2. Main Landing Page (`daklink.vn`)
- **Workspace**: `farm-path` (handled by another agent).
- **Static Root**: `/var/www/daklink-landing/`
- **Backend Port**: Landing API runs on **Port 3001**.
- **PM2 Process**: `daklink-api` (id: 1).

## 🛠 Required Updates in this Workspace
To complete the launch, the following updates are needed in this landing page repository:

### 1. Link Updates
Update all CTA buttons and navigation links:
- **Login/Dashboard**: Point to `https://app.daklink.vn/login`
- **Register**: Point to `https://app.daklink.vn/register` (or the equivalent setup flow)
- **Traceability Link**: Point to `https://app.daklink.vn/trace`

### 2. Branding & SEO
- **Product Name**: Daklink
- **Parent Brand**: Daklink
- **Title Tag**: `Daklink | Giải pháp Nông nghiệp số Daklink`
- **Canonical URL**: `https://daklink.vn/`

### 3. Media Assets
Ensure logos and favicons reflect the **Daklink** brand (Green/Nature theme).

## 🛰️ Manual VPS Update Procedure

Follow these steps to update the live website and app manually.

### 1. Dashboard (app.daklink.vn)
This updates the **Farmer Dashboard** (Next.js + Turso).

1.  **Sync Code**: Run from your local `farmOS/eden-hub` directory:
    ```bash
    rsync -avz -e "ssh -i ~/.ssh/daklink_vps" --exclude 'node_modules' --exclude '.next' --exclude '.git' ./ root@222.255.214.166:/var/www/daklink/
    ```
2.  **SSH into VPS**:
    ```bash
    ssh -i ~/.ssh/daklink_vps root@222.255.214.166
    ```
3.  **Build & Restart**:
    ```bash
    cd /var/www/daklink
    npm install
    npm run build
    pm2 restart daklink-hub
    ```

### 2. Landing Page (daklink.vn)
This updates the **Main Landing Page** (Vite static build).

1.  **Build Locally**: Run in `farm-path`:
    ```bash
    npm run build
    ```
2.  **Sync Build**:
    ```bash
    rsync -avz -e "ssh -i ~/.ssh/daklink_vps" dist/ root@222.255.214.166:/var/www/daklink-landing/
    ```

### 3. Database Safety & Backups (Turso)
If you add new fields (like `latitude` or `longitude`), you MUST sync the Turso cloud database. 

> [!CAUTION]
> **Always Backup Before Syncing**: Before running `prisma db push` or making major changes, it is highly recommended to create a Turso snapshot.

1.  **Create Manual Backup**:
    ```bash
    turso db backup create farmos-db
    ```
2.  **Sync Schema**: Run in `farmOS/eden-hub`:
    ```bash
    npx prisma db push
    ```
3.  **Safety Rule**: `prisma db push` is safer than `prisma migrate` for rapid development, but it will warn you if any change might cause data loss (like deleting a column). **Read the terminal warnings carefully!**

## 🏁 Verification
After updating, verify that the "Login" button correctly redirects to the production dashboard and that all links use the secured `https://` protocol.

---
*Created by Antigravity (Farm Management Dev Agent) on 2026-03-14*
