-- ============================================
-- Vercel Postgres Database Setup Script
-- ============================================
-- Run this script in Vercel Dashboard > Storage > Your Database > Data > Query
-- Or use: psql $DATABASE_URL -f prisma/setup-vercel-db.sql

-- 1. Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  "authorAvatar" TEXT,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  "readTime" VARCHAR(50) NOT NULL,
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 3. Create careers table
CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL,
  salary VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  posted TIMESTAMP DEFAULT NOW(),
  deadline TIMESTAMP,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 4. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company VARCHAR(255),
  service VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 5. Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  "subscribedAt" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 6. Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  "jobId" INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  resume TEXT NOT NULL,
  "coverLetter" TEXT,
  "appliedAt" TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("jobId") REFERENCES careers(id) ON DELETE CASCADE
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(active);
CREATE INDEX IF NOT EXISTS idx_careers_posted ON careers(posted DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- 8. Insert sample blog post (optional)
INSERT INTO blog_posts (
  slug, title, excerpt, content, category, author, "readTime", featured
) VALUES (
  'chao-mung-den-voi-techera',
  'Chào mừng đến với TECHERA',
  'Khám phá nền tảng quản lý và phân phối vé thông minh hàng đầu Việt Nam',
  '# Chào mừng đến với TECHERA

TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp.

## Tính năng nổi bật

- Quản lý vé thông minh
- Phân phối đa kênh
- Báo cáo chi tiết
- Tích hợp dễ dàng

Hãy liên hệ với chúng tôi để được tư vấn chi tiết!',
  'Công nghệ',
  'Techera Team',
  '3 phút đọc',
  true
) ON CONFLICT (slug) DO NOTHING;

-- 9. Insert sample FAQ (optional)
INSERT INTO faqs (category, question, answer) VALUES 
(
  'Chung',
  'TECHERA là gì?',
  'TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp.'
),
(
  'Chung',
  'TECHERA phù hợp với doanh nghiệp nào?',
  'TECHERA phù hợp với các khu du lịch, điểm tham quan, công viên giải trí, tổ chức sự kiện và các doanh nghiệp cần quản lý, phân phối vé.'
),
(
  'Tính năng',
  'Có thể tích hợp với hệ thống hiện tại không?',
  'Có, TECHERA cung cấp API và SDK để tích hợp dễ dàng với các hệ thống hiện có của bạn.'
)
ON CONFLICT DO NOTHING;

-- 10. Verify tables created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- Done!
-- Run: SELECT * FROM blog_posts; to verify
