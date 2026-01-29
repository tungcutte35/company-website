# Fix Lỗi 500 Internal Server Error trên Vercel

## Nguyên nhân phổ biến

1. **Database connection failed** - Không kết nối được database
2. **Missing environment variables** - Thiếu biến môi trường
3. **Prisma Client not generated** - Prisma Client chưa được generate
4. **Database schema mismatch** - Schema không khớp với database

## Cách kiểm tra lỗi

### 1. Xem Vercel Logs
```
Vercel Dashboard > Your Project > Deployments > Click vào deployment > Runtime Logs
```

Tìm các lỗi như:
- `PrismaClientInitializationError`
- `Can't reach database server`
- `Environment variable not found`
- `Invalid DATABASE_URL`

### 2. Kiểm tra Function Logs
```
Vercel Dashboard > Your Project > Logs
```

## Giải pháp từng bước

### Bước 1: Cấu hình Database trên Vercel

#### Option A: Sử dụng Vercel Postgres (Khuyến nghị)

1. **Tạo Vercel Postgres Database:**
   ```
   Vercel Dashboard > Storage > Create Database > Postgres
   ```

2. **Connect to Project:**
   - Chọn project của bạn
   - Vercel sẽ tự động thêm các environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL` (dùng cái này cho Prisma)
     - `POSTGRES_URL_NON_POOLING`

3. **Update Environment Variables:**
   ```
   Vercel Dashboard > Settings > Environment Variables
   
   Thêm:
   DATABASE_URL = ${POSTGRES_PRISMA_URL}
   ```

#### Option B: Sử dụng External Database (Supabase, Railway, etc.)

1. **Lấy connection string từ provider:**
   - Supabase: Settings > Database > Connection string
   - Railway: Database > Connect > Prisma
   - Neon: Dashboard > Connection Details

2. **Format connection string:**
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&pgbouncer=true
   ```

3. **Thêm vào Vercel:**
   ```
   Vercel Dashboard > Settings > Environment Variables
   
   DATABASE_URL = postgresql://user:pass@host:5432/dbname?schema=public
   ```

### Bước 2: Cấu hình Environment Variables

Đảm bảo các biến sau được set trong Vercel:

```env
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional (for production)
VERCEL_ENV=production
NODE_ENV=production
```

**Lưu ý:** 
- Set cho cả 3 environments: Production, Preview, Development
- Hoặc chỉ set cho Production nếu muốn preview/dev dùng giá trị khác

### Bước 3: Update Build Settings

1. **Vercel Dashboard > Settings > General > Build & Development Settings:**

   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

2. **Đảm bảo package.json có:**
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "postinstall": "prisma generate"
     }
   }
   ```

### Bước 4: Run Database Migrations

#### Option A: Từ Local (Khuyến nghị cho lần đầu)

```bash
# 1. Set DATABASE_URL trong .env.local với production database
DATABASE_URL="postgresql://..."

# 2. Run migration
npm run db:push
# hoặc
npx prisma db push

# 3. (Optional) Seed data
npm run db:seed
```

#### Option B: Từ Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Pull environment variables
vercel env pull .env.production

# 4. Run migration
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma db push
```

### Bước 5: Redeploy

```bash
# Trigger redeploy
vercel --prod

# Hoặc từ Vercel Dashboard
Deployments > ... > Redeploy
```

## Prisma Connection Pooling

Nếu gặp lỗi "Too many connections", cập nhật `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Và thêm connection pooling trong DATABASE_URL:

```
postgresql://user:pass@host:5432/db?schema=public&connection_limit=1&pool_timeout=0
```

## Troubleshooting Cụ thể

### Lỗi: "Can't reach database server"

**Nguyên nhân:** Database không accessible từ Vercel

**Giải pháp:**
1. Kiểm tra database có public access không
2. Whitelist Vercel IPs (nếu database có firewall)
3. Dùng connection pooler (PgBouncer)

### Lỗi: "Invalid DATABASE_URL"

**Nguyên nhân:** Format connection string sai

**Giải pháp:**
```
# Đúng format
postgresql://user:password@host:5432/database?schema=public

# Sai - thiếu protocol
user:password@host:5432/database

# Sai - thiếu schema
postgresql://user:password@host:5432/database
```

### Lỗi: "Prisma Client not generated"

**Nguyên nhân:** Build command không chạy prisma generate

**Giải pháp:**
1. Kiểm tra package.json:
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "postinstall": "prisma generate"
     }
   }
   ```

2. Redeploy

### Lỗi: "Table does not exist"

**Nguyên nhân:** Database chưa có tables

**Giải pháp:**
```bash
# Run migration từ local với production DATABASE_URL
npx prisma db push
```

### Lỗi: "Too many connections"

**Nguyên nhân:** Quá nhiều Prisma Client instances

**Giải pháp:**
1. Dùng connection pooling
2. Giảm connection_limit trong DATABASE_URL
3. Dùng PgBouncer hoặc Supabase Pooler

## Kiểm tra sau khi fix

### 1. Test API endpoints

```bash
# Test từ local
curl https://yourdomain.com/api/blog

# Hoặc mở browser
https://yourdomain.com/api/blog
```

### 2. Kiểm tra Vercel Logs

```
Vercel Dashboard > Logs > Runtime Logs
```

Không nên thấy errors

### 3. Test các trang

- Homepage: https://yourdomain.com
- Blog: https://yourdomain.com/blog
- Contact: https://yourdomain.com/lien-he
- Admin: https://yourdomain.com/admin

## Best Practices

### 1. Sử dụng Connection Pooling

Với Supabase:
```
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

Với Neon:
```
DATABASE_URL="postgresql://...?sslmode=require&connect_timeout=10"
```

### 2. Enable Prisma Logging (Development)

```typescript
// lib/prisma.ts
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})
```

### 3. Graceful Shutdown

```typescript
// lib/prisma.ts
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
```

### 4. Health Check Endpoint

Tạo file `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

Test: `https://yourdomain.com/api/health`

## Checklist Deploy

- [ ] Database đã được tạo và accessible
- [ ] DATABASE_URL đã được set trong Vercel Environment Variables
- [ ] NEXT_PUBLIC_SITE_URL đã được set
- [ ] Build command: `prisma generate && next build`
- [ ] Database migrations đã chạy (`prisma db push`)
- [ ] Prisma Client được generate trong build
- [ ] Test API endpoints sau deploy
- [ ] Kiểm tra Vercel Runtime Logs không có errors
- [ ] Test health check endpoint

## Liên hệ Support

Nếu vẫn gặp lỗi:

1. **Export Vercel Logs:**
   ```
   Vercel Dashboard > Logs > Export
   ```

2. **Check Prisma Status:**
   ```bash
   npx prisma -v
   npx prisma validate
   ```

3. **Test Database Connection:**
   ```bash
   npx prisma db pull
   ```

4. **Vercel Support:**
   - https://vercel.com/support
   - Vercel Discord: https://vercel.com/discord
