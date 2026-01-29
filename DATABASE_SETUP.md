# 🗄️ Hướng dẫn Setup PostgreSQL Database

## 📋 Yêu cầu
- Node.js 18+
- PostgreSQL 14+ (local hoặc cloud)

## 🚀 Các bước setup

### 1. Cài đặt dependencies
```bash
npm install pg @types/pg prisma @prisma/client tsx
npm install -D prisma
```

### 2. Setup PostgreSQL Database

#### Option A: Local PostgreSQL
```bash
# Cài đặt PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Tạo database
createdb techera_db

# Tạo user (optional)
psql -d techera_db -c "CREATE USER techera WITH PASSWORD 'password';"
psql -d techera_db -c "GRANT ALL PRIVILEGES ON DATABASE techera_db TO techera;"
```

#### Option B: Cloud Database (Supabase/Railway/Neon)
1. Tạo tài khoản tại [Supabase](https://supabase.com) hoặc [Railway](https://railway.app)
2. Tạo PostgreSQL database mới
3. Copy connection string

### 3. Cấu hình Environment Variables
```bash
# Tạo file .env.local
cp .env.example .env.local

# Chỉnh sửa DATABASE_URL trong .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/techera_db?schema=public"
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Push schema to database
```bash
npx prisma db push
```

### 6. Seed dữ liệu mẫu
```bash
npm run db:seed
```

### 7. Kiểm tra database (optional)
```bash
npm run db:studio
```

## 🔧 Scripts có sẵn

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (careful!)
npm run db:reset
```

## 📊 Database Schema

### Tables được tạo:
- `blog_posts` - Bài viết blog
- `faqs` - Câu hỏi thường gặp
- `careers` - Vị trí tuyển dụng
- `contact_messages` - Tin nhắn liên hệ
- `newsletters` - Đăng ký newsletter
- `job_applications` - Đơn ứng tuyển

## 🔄 Migration từ In-Memory

Sau khi setup xong database:

1. ✅ API FAQ đã được cập nhật
2. ⏳ Cần cập nhật các API khác:
   - Blog API
   - Contact API
   - Newsletter API
   - Careers API

## 🚨 Lưu ý quan trọng

1. **Backup dữ liệu**: Luôn backup trước khi migrate
2. **Environment**: Đảm bảo DATABASE_URL đúng cho từng môi trường
3. **Security**: Không commit file .env vào git
4. **Performance**: Thêm indexes cho các trường search thường xuyên

## 🐛 Troubleshooting

### Lỗi connection
```bash
# Kiểm tra PostgreSQL đang chạy
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql
```

### Lỗi permissions
```bash
# Grant permissions
psql -d techera_db -c "GRANT ALL ON SCHEMA public TO techera;"
```

### Reset database
```bash
npm run db:reset
npm run db:seed
```