# Hướng dẫn Deploy lên Vercel - Từng bước

## Chuẩn bị trước khi deploy

### 1. Test local trước
```bash
# Test database connection
npm run db:test

# Nếu có lỗi, fix trước khi deploy
# Nếu OK, tiếp tục
```

### 2. Đảm bảo code đã commit
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Bước 1: Tạo Database

### Option A: Vercel Postgres (Khuyến nghị - Dễ nhất)

1. **Vào Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Tạo Database:**
   ```
   Storage > Create Database > Postgres
   ```

3. **Đặt tên database:**
   ```
   Name: techera-db (hoặc tên bạn muốn)
   Region: Chọn gần user nhất (ví dụ: Singapore)
   ```

4. **Connect to Project:**
   - Chọn project của bạn
   - Click "Connect"
   - Vercel sẽ tự động thêm environment variables

5. **Lấy connection string:**
   ```
   Database > Settings > Connection String
   Copy: POSTGRES_PRISMA_URL
   ```

### Option B: Supabase (Free tier tốt)

1. **Tạo project:**
   - https://supabase.com/dashboard
   - New Project

2. **Lấy connection string:**
   ```
   Settings > Database > Connection string > Connection pooling
   Copy: postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres
   ```

### Option C: Railway (Dễ dùng)

1. **Tạo project:**
   - https://railway.app/dashboard
   - New Project > Provision PostgreSQL

2. **Lấy connection string:**
   ```
   Database > Connect > Prisma
   Copy connection string
   ```

## Bước 2: Deploy lên Vercel

### 2.1. Import Project

1. **Vào Vercel Dashboard:**
   ```
   https://vercel.com/new
   ```

2. **Import Git Repository:**
   - Chọn GitHub/GitLab/Bitbucket
   - Authorize Vercel
   - Chọn repository của bạn
   - Click "Import"

### 2.2. Configure Project

1. **Project Settings:**
   ```
   Project Name: techera (hoặc tên bạn muốn)
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./
   ```

2. **Build Settings:**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
   
   ⚠️ **Không cần thay đổi** - Vercel tự động detect

### 2.3. Environment Variables

Click "Environment Variables" và thêm:

```env
# REQUIRED
DATABASE_URL
Value: (paste connection string từ Bước 1)
Environment: Production

NEXT_PUBLIC_SITE_URL
Value: https://yourdomain.com (hoặc https://your-project.vercel.app)
Environment: Production
```

**Lưu ý:**
- Nếu dùng Vercel Postgres, DATABASE_URL đã được tự động thêm
- Nếu dùng external database, paste connection string

### 2.4. Deploy

Click **"Deploy"** và đợi...

## Bước 3: Setup Database Schema

### 3.1. Từ Local (Khuyến nghị)

```bash
# 1. Tạo file .env.production.local
DATABASE_URL="postgresql://..." # paste production connection string

# 2. Run migration
npx prisma db push --schema=./prisma/schema.prisma

# 3. (Optional) Seed data
npm run db:seed
```

### 3.2. Từ Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Pull environment variables
vercel env pull .env.vercel

# 5. Run migration
source .env.vercel && npx prisma db push
```

## Bước 4: Verify Deployment

### 4.1. Check Health

Mở browser và test:
```
https://your-project.vercel.app/api/health
```

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "production",
  "timestamp": "2024-01-29T...",
  "prisma": "initialized"
}
```

**Nếu lỗi:**
```json
{
  "status": "error",
  "database": "disconnected",
  "error": "..."
}
```
→ Xem phần Troubleshooting bên dưới

### 4.2. Check Pages

Test các trang:
- ✅ Homepage: https://your-project.vercel.app
- ✅ Blog: https://your-project.vercel.app/blog
- ✅ Contact: https://your-project.vercel.app/lien-he
- ✅ API: https://your-project.vercel.app/api/blog

### 4.3. Check Logs

```
Vercel Dashboard > Your Project > Logs > Runtime Logs
```

Không nên thấy errors màu đỏ

## Bước 5: Setup Custom Domain (Optional)

### 5.1. Add Domain

```
Vercel Dashboard > Settings > Domains > Add
```

Nhập domain của bạn: `yourdomain.com`

### 5.2. Configure DNS

Vercel sẽ hướng dẫn thêm DNS records:

**Option A: Nameservers (Khuyến nghị)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option C: CNAME**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3. Update Environment Variables

```
Vercel Dashboard > Settings > Environment Variables

Update:
NEXT_PUBLIC_SITE_URL = https://yourdomain.com
```

Redeploy sau khi update.

## Bước 6: SEO Setup

### 6.1. Verify robots.txt

```
https://yourdomain.com/robots.txt
```

Nên thấy:
```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
Host: https://yourdomain.com
```

### 6.2. Submit Sitemap

1. **Google Search Console:**
   - https://search.google.com/search-console
   - Add property: yourdomain.com
   - Verify ownership
   - Sitemaps > Add sitemap: `sitemap.xml`

2. **Bing Webmaster:**
   - https://www.bing.com/webmasters
   - Add site
   - Submit sitemap

## Troubleshooting

### ❌ Error: 500 Internal Server Error

**Check 1: Database Connection**
```
https://your-project.vercel.app/api/health
```

Nếu "database": "disconnected":
1. Check DATABASE_URL trong Vercel Environment Variables
2. Check database có accessible không
3. Check connection string format

**Check 2: Vercel Logs**
```
Vercel Dashboard > Logs > Runtime Logs
```

Tìm error message cụ thể

**Check 3: Environment Variables**
```
Vercel Dashboard > Settings > Environment Variables
```

Đảm bảo có:
- DATABASE_URL
- NEXT_PUBLIC_SITE_URL

**Fix:**
```bash
# Test database từ local
npm run db:test

# Nếu OK, redeploy
vercel --prod
```

### ❌ Error: Prisma Client not generated

**Fix:**
```
Vercel Dashboard > Settings > General > Build & Development Settings

Build Command: npm run build
(Đảm bảo package.json có: "build": "prisma generate && next build")

Redeploy
```

### ❌ Error: Table does not exist

**Fix:**
```bash
# Run migration với production DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma db push

# Redeploy
vercel --prod
```

### ❌ Error: Too many connections

**Fix:**
Add connection pooling to DATABASE_URL:
```
postgresql://...?pgbouncer=true&connection_limit=1
```

Update trong Vercel Environment Variables và redeploy.

### ❌ Error: Page blocked from indexing

**Fix:**
```
Vercel Dashboard > Settings > Environment Variables

Check: VERCEL_ENV = production (cho production deployment)

Nếu không có, Vercel tự set. Nếu vẫn bị block:
1. Check robots.txt
2. Check meta tags trong page source
3. Đợi 24-48h để Google re-crawl
```

## Monitoring & Maintenance

### Daily Checks

1. **Health Check:**
   ```
   https://yourdomain.com/api/health
   ```

2. **Vercel Analytics:**
   ```
   Vercel Dashboard > Analytics
   ```

3. **Error Logs:**
   ```
   Vercel Dashboard > Logs
   ```

### Weekly Checks

1. **Google Search Console:**
   - Coverage report
   - Performance
   - Indexing status

2. **Database Usage:**
   - Vercel Postgres: Dashboard > Storage > Usage
   - Supabase: Dashboard > Database > Usage

### Monthly Tasks

1. **Update Dependencies:**
   ```bash
   npm outdated
   npm update
   git commit -am "Update dependencies"
   git push
   ```

2. **Backup Database:**
   ```bash
   # Vercel Postgres
   vercel env pull
   pg_dump $DATABASE_URL > backup.sql
   
   # Supabase
   # Use Supabase Dashboard > Database > Backups
   ```

3. **Review Analytics:**
   - Page views
   - Error rates
   - Performance metrics

## Checklist

### Pre-deployment
- [ ] Code tested locally
- [ ] Database connection tested (`npm run db:test`)
- [ ] Environment variables prepared
- [ ] Code committed and pushed to Git

### Deployment
- [ ] Database created (Vercel Postgres/Supabase/Railway)
- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] First deployment successful
- [ ] Database schema migrated (`prisma db push`)

### Post-deployment
- [ ] Health check passes (`/api/health`)
- [ ] All pages load correctly
- [ ] API endpoints work
- [ ] No errors in Vercel logs
- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated
- [ ] robots.txt accessible
- [ ] Sitemap submitted to Google Search Console

### SEO
- [ ] VERCEL_ENV=production for production
- [ ] robots.txt allows indexing
- [ ] Meta tags correct
- [ ] Sitemap submitted
- [ ] Google Search Console verified

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support
- **Vercel Discord:** https://vercel.com/discord

## Quick Commands Reference

```bash
# Test database
npm run db:test

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Deploy to Vercel
vercel --prod

# Check deployment logs
vercel logs

# Pull environment variables
vercel env pull
```
