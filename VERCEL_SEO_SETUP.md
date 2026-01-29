# Hướng dẫn SEO cho Vercel Deployment

## Vấn đề: Page is blocked from indexing

Vercel tự động chặn indexing cho các preview deployments để tránh duplicate content. Đây là hành vi mong muốn cho preview, nhưng cần đảm bảo production được index.

## Giải pháp đã áp dụng

### 1. Cập nhật `app/layout.tsx`
Thêm metadata robots dựa trên môi trường:

```typescript
const isProduction = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  robots: isProduction ? {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  } : {
    index: false,
    follow: false,
  },
  // ... rest of metadata
};
```

### 2. Cập nhật `app/robots.ts`
Chặn bots trên preview, cho phép trên production:

```typescript
const isProduction = process.env.VERCEL_ENV === "production";

if (!isProduction) {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
```

### 3. Cập nhật `next.config.ts`
Thêm X-Robots-Tag headers:

```typescript
async headers() {
  const isProduction = process.env.VERCEL_ENV === 'production';
  
  return [
    // Chặn indexing trên preview
    {
      source: "/(.*)",
      headers: [
        ...(isProduction ? [] : [
          { key: "X-Robots-Tag", value: "noindex, nofollow" }
        ]),
      ],
    },
    // Cho phép indexing public pages trên production
    ...(isProduction ? [{
      source: "/((?!admin|api).*)",
      headers: [
        { key: "X-Robots-Tag", value: "index, follow" },
      ],
    }] : []),
    // Luôn chặn admin và API
    {
      source: "/(admin|api)(.*)",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    },
  ];
}
```

## Cấu hình Vercel Environment Variables

Đảm bảo các biến môi trường sau được set trong Vercel Dashboard:

### Production Environment
```
VERCEL_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
DATABASE_URL=your_production_database_url
```

### Preview Environment
```
VERCEL_ENV=preview
NEXT_PUBLIC_SITE_URL=https://preview-url.vercel.app
DATABASE_URL=your_preview_database_url
```

## Kiểm tra sau khi deploy

### 1. Kiểm tra robots.txt
Truy cập: `https://yourdomain.com/robots.txt`

**Production nên hiển thị:**
```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
Host: https://yourdomain.com
```

**Preview nên hiển thị:**
```
User-Agent: *
Disallow: /
```

### 2. Kiểm tra meta tags
Xem source code trang chủ, tìm:

**Production:**
```html
<meta name="robots" content="index, follow">
```

**Preview:**
```html
<meta name="robots" content="noindex, nofollow">
```

### 3. Kiểm tra headers
Dùng curl hoặc browser DevTools:

```bash
curl -I https://yourdomain.com
```

**Production:** Không có `X-Robots-Tag: noindex`
**Preview:** Có `X-Robots-Tag: noindex, nofollow`

### 4. Kiểm tra sitemap
Truy cập: `https://yourdomain.com/sitemap.xml`

Nên liệt kê tất cả các trang public (không có /admin, /api)

## Google Search Console

### 1. Xác minh domain
- Truy cập [Google Search Console](https://search.google.com/search-console)
- Thêm property với domain production của bạn
- Xác minh ownership (DNS hoặc HTML file)

### 2. Submit sitemap
- Vào Sitemaps section
- Submit URL: `https://yourdomain.com/sitemap.xml`

### 3. Request indexing
- Vào URL Inspection
- Nhập URL trang chủ
- Click "Request Indexing"

### 4. Kiểm tra Coverage
- Vào Coverage report
- Đảm bảo không có lỗi "Blocked by robots.txt" hoặc "noindex"

## Troubleshooting

### Vẫn bị chặn indexing trên production?

1. **Kiểm tra VERCEL_ENV:**
   ```bash
   # Trong Vercel Dashboard > Settings > Environment Variables
   # Đảm bảo VERCEL_ENV=production cho production deployment
   ```

2. **Clear cache:**
   - Redeploy lại production
   - Clear Vercel cache: Settings > Clear Cache

3. **Kiểm tra custom domain:**
   - Đảm bảo custom domain đã được set làm production domain
   - Vercel Dashboard > Settings > Domains > Set as Production

4. **Kiểm tra headers:**
   ```bash
   curl -I https://yourdomain.com | grep -i robot
   ```
   Không nên thấy "noindex"

### Preview URLs vẫn được index?

Đây là bình thường nếu:
- Google đã crawl trước khi bạn cập nhật
- Cần thời gian để Google cập nhật

Giải pháp:
- Dùng Google Search Console để remove URLs
- Đợi Google re-crawl (có thể mất vài ngày)

## Best Practices

1. **Luôn test trên preview trước:**
   - Deploy lên preview branch
   - Kiểm tra robots.txt và meta tags
   - Đảm bảo preview bị chặn indexing

2. **Sử dụng canonical URLs:**
   - Đã được set trong metadata
   - Giúp tránh duplicate content

3. **Monitor Search Console:**
   - Kiểm tra Coverage report hàng tuần
   - Theo dõi indexing status
   - Fix các lỗi crawl ngay lập tức

4. **Structured Data:**
   - Thêm JSON-LD schema cho rich snippets
   - Sử dụng Organization, WebSite, BreadcrumbList schemas

## Tối ưu SEO thêm

### 1. Thêm structured data
Tạo file `app/layout.tsx` thêm JSON-LD:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TECHERA",
      "url": "https://yourdomain.com",
      "logo": "https://yourdomain.com/images/logo.jpg",
      "description": "Nền tảng quản lý và phân phối vé",
    }),
  }}
/>
```

### 2. Tối ưu performance
- Đã enable source maps
- Sử dụng Next.js Image optimization
- Lazy load components

### 3. Thêm Open Graph images
- Đã có opengraph-image.tsx
- Đã có twitter-image.tsx

## Checklist Deploy Production

- [ ] Set VERCEL_ENV=production
- [ ] Set NEXT_PUBLIC_SITE_URL với domain chính thức
- [ ] Set custom domain làm production domain
- [ ] Deploy và kiểm tra robots.txt
- [ ] Kiểm tra meta robots tags
- [ ] Kiểm tra X-Robots-Tag headers
- [ ] Submit sitemap lên Google Search Console
- [ ] Request indexing cho trang chủ
- [ ] Monitor Coverage report sau 24-48 giờ
