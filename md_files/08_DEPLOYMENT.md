# 🚀 DEPLOYMENT GUIDE
<!-- Server setup, deploy procedures, rollback -->

## Server Info
| Item | Value |
|---|---|
| Provider | Hostinger / Shared |
| IP | [Shared IP] |
| OS | Linux (Hostinger Shared) |
| Node.js | v20+ |
| Web Server | Apache (via .htaccess) |
| Domain | erp.hirinternational.com |
| SSL | Hostinger SSL |

## SSH Access
```bash
ssh user@xxx.xxx.xxx.xxx -p 22
# or with key:
ssh -i ~/.ssh/mykey.pem user@xxx.xxx.xxx.xxx
```

## Directory Structure
```
/var/www/html/project/
├── current/          ← Active deployment (symlink)
├── releases/         ← Past releases
├── shared/           ← Shared files (uploads, .env)
└── backups/          ← Database & file backups
```

## Deploy Steps

### Manual Deploy
```bash
# 1. SSH into server
ssh user@server

# 2. Go to project
cd /var/www/html/project

# 3. Backup current
cp -r current/ backups/backup-$(date +%Y%m%d-%H%M%S)/

# 4. Pull latest code
cd current
git pull origin main

# 5. Install dependencies
composer install --no-dev --optimize-autoloader  # PHP
npm install --production                          # Node

# 6. Run migrations
php artisan migrate --force

# 7. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# 8. Restart services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

### Rollback
```bash
# Quick rollback to backup
cd /var/www/html/project
rm -rf current
cp -r backups/backup-YYYYMMDD-HHMMSS/ current/
sudo systemctl restart php8.2-fpm
```

## Environment Variables
```bash
# .env file — NEVER commit to git
APP_ENV=production
APP_DEBUG=false
APP_URL=https://example.com
DB_HOST=localhost
DB_DATABASE=mydb
DB_USERNAME=myuser
DB_PASSWORD=secret
```

## Cron Jobs
```bash
# Laravel scheduler
* * * * * cd /var/www/html/project/current && php artisan schedule:run >> /dev/null 2>&1

# Database backup (daily 2 AM)
0 2 * * * mysqldump -u user -ppass dbname > /backups/db-$(date +\%Y\%m\%d).sql
```

## Monitoring
- **Uptime:** [UptimeRobot / Pingdom URL]
- **Errors:** [Sentry / Bugsnag URL]
- **Logs:** `tail -f /var/log/nginx/error.log`

## Pre-Deploy Checklist
- [ ] All tests passing
- [ ] .env production values correct
- [ ] Database migrations tested
- [ ] Git committed & pushed
- [ ] Backup taken
- [ ] Team notified
