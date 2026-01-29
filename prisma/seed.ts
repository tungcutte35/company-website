import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.jobApplication.deleteMany()
  await prisma.career.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.fAQ.deleteMany()

  // Seed Blog Posts
  console.log('📝 Seeding blog posts...')
  await prisma.blogPost.createMany({
    data: [
      {
        slug: "xu-huong-cong-nghe-du-lich-2024",
        title: "5 xu hướng công nghệ du lịch nổi bật năm 2024",
        excerpt: "Khám phá những công nghệ đang định hình lại ngành du lịch và cách doanh nghiệp có thể tận dụng chúng.",
        content: `## Giới thiệu

Ngành du lịch đang trải qua giai đoạn chuyển đổi số mạnh mẽ với nhiều công nghệ mới được áp dụng. Năm 2024 hứa hẹn sẽ là năm bùng nổ của nhiều xu hướng công nghệ quan trọng.

## 1. Trí tuệ nhân tạo (AI) trong dịch vụ khách hàng

AI đang được áp dụng rộng rãi trong việc tự động hóa dịch vụ khách hàng, từ chatbot hỗ trợ 24/7 đến hệ thống đề xuất cá nhân hóa trải nghiệm du lịch.

### Lợi ích của AI:
- Phản hồi nhanh chóng, không giới hạn thời gian
- Giảm chi phí nhân sự
- Tăng trải nghiệm khách hàng

## 2. Blockchain trong quản lý vé

Công nghệ blockchain đang được sử dụng để tạo ra hệ thống vé điện tử không thể giả mạo, đảm bảo tính minh bạch và an toàn.

## 3. Thanh toán số và ví điện tử

Xu hướng thanh toán không tiền mặt tiếp tục phát triển mạnh mẽ với sự tích hợp của nhiều ví điện tử và cổng thanh toán.

## 4. Thực tế ảo (VR) trong marketing du lịch

VR cho phép khách hàng "trải nghiệm" điểm đến trước khi đặt vé, tăng tỷ lệ chuyển đổi đáng kể.

## 5. IoT và smart ticketing

Internet of Things đang cách mạng hóa việc check-in tự động và quản lý luồng khách tại các điểm đến.

## Kết luận

Việc áp dụng công nghệ không còn là lựa chọn mà là yêu cầu bắt buộc để doanh nghiệp du lịch có thể cạnh tranh và phát triển bền vững trong thời đại số.`,
        image: "/images/blog/tech-trends.jpg",
        category: "Xu hướng",
        author: "Techera Team",
        authorAvatar: "/images/authors/techera-team.jpg",
        date: new Date("2024-01-15"),
        readTime: "5 phút",
        featured: true,
        tags: ["AI", "Blockchain", "VR", "IoT", "Du lịch số"],
        views: 1250,
        likes: 89,
      },
      {
        slug: "toi-uu-ban-ve-online",
        title: "Hướng dẫn tối ưu hóa kênh bán vé online",
        excerpt: "Những chiến lược và best practices để tăng tỷ lệ chuyển đổi khi bán vé trực tuyến.",
        content: `## Tại sao cần tối ưu kênh bán vé online?

Trong thời đại số, việc bán vé online không chỉ là xu hướng mà đã trở thành kênh bán hàng chính của nhiều doanh nghiệp du lịch.

## 1. Tối ưu trải nghiệm người dùng (UX)

### A. Đơn giản hóa quy trình đặt vé
- Giảm số bước thanh toán xuống tối thiểu
- Cho phép đặt vé không cần đăng nhập
- Hiển thị progress bar rõ ràng

### B. Mobile-first design
- 70% người dùng đặt vé qua điện thoại
- Thiết kế responsive là bắt buộc

## 2. Tối ưu tốc độ website

Website tải chậm 1 giây = giảm 7% tỷ lệ chuyển đổi

### Tips cải thiện tốc độ:
- Tối ưu hình ảnh
- Sử dụng CDN
- Caching hiệu quả

## 3. Xây dựng niềm tin

- Hiển thị đánh giá khách hàng
- Chứng chỉ bảo mật
- Chính sách hoàn tiền rõ ràng

## 4. Retargeting thông minh

Sử dụng email và quảng cáo nhắc nhở để chuyển đổi khách hàng đã xem nhưng chưa mua.

## Kết luận

Tối ưu hóa là quá trình liên tục. Hãy theo dõi metrics và A/B testing thường xuyên để cải thiện tỷ lệ chuyển đổi.`,
        image: "/images/blog/online-sales.jpg",
        category: "Hướng dẫn",
        author: "Marketing Team",
        authorAvatar: "/images/authors/marketing-team.jpg",
        date: new Date("2024-01-10"),
        readTime: "8 phút",
        featured: true,
        tags: ["E-commerce", "UX", "Conversion", "Digital Marketing"],
        views: 980,
        likes: 67,
      },
      {
        slug: "quan-ly-dai-ly-hieu-qua",
        title: "Bí quyết quản lý mạng lưới đại lý hiệu quả",
        excerpt: "Cách xây dựng và duy trì mối quan hệ tốt với hệ thống đại lý phân phối vé.",
        content: `## Tầm quan trọng của mạng lưới đại lý

Mạng lưới đại lý là kênh phân phối quan trọng, đóng góp tới 40-60% doanh thu cho nhiều doanh nghiệp vé du lịch.

## 1. Phân cấp đại lý hợp lý

### Các cấp đại lý phổ biến:
- **Đại lý cấp 1**: Đối tác chiến lược, hưởng mức chiết khấu cao nhất
- **Đại lý cấp 2**: Đối tác thường xuyên
- **Đại lý cấp 3**: Đối tác nhỏ, freelancer

## 2. Chính sách chiết khấu linh hoạt

- Chiết khấu theo doanh số
- Thưởng KPIs hàng quý
- Ưu đãi độc quyền cho top agents

## 3. Công cụ hỗ trợ đại lý

- Dashboard theo dõi doanh số real-time
- API tích hợp với hệ thống của đại lý
- Hotline hỗ trợ ưu tiên

## 4. Đào tạo và phát triển

- Webinar định kỳ về sản phẩm mới
- Tài liệu marketing ready-to-use
- Chứng chỉ đại lý ủy quyền

## Kết luận

Đầu tư vào mối quan hệ với đại lý là đầu tư cho sự phát triển bền vững của doanh nghiệp.`,
        image: "/images/blog/agent-management.jpg",
        category: "Kinh nghiệm",
        author: "Business Team",
        authorAvatar: "/images/authors/business-team.jpg",
        date: new Date("2024-01-05"),
        readTime: "6 phút",
        featured: false,
        tags: ["Đại lý", "Quản lý", "B2B", "Partnership"],
        views: 756,
        likes: 45,
      },
      {
        slug: "bao-mat-he-thong-ve-dien-tu",
        title: "Đảm bảo an toàn cho hệ thống vé điện tử",
        excerpt: "Các biện pháp bảo mật quan trọng mà mọi hệ thống vé điện tử cần triển khai.",
        content: `## Tại sao bảo mật là ưu tiên hàng đầu?

Hệ thống vé điện tử xử lý hàng triệu giao dịch và thông tin thanh toán nhạy cảm mỗi ngày. Một lỗ hổng bảo mật có thể gây thiệt hại nghiêm trọng.

## 1. Mã hóa dữ liệu

### SSL/TLS
- Bắt buộc sử dụng HTTPS
- Mã hóa end-to-end cho dữ liệu thanh toán

### Encryption at rest
- Mã hóa database
- Secure storage cho credentials

## 2. Xác thực đa lớp (MFA)

- OTP qua SMS/Email
- Authenticator apps
- Biometric (cho mobile apps)

## 3. Chống gian lận vé

- QR code động với thời hạn ngắn
- Blockchain verification
- AI phát hiện hành vi bất thường

## 4. Tuân thủ tiêu chuẩn

- PCI DSS cho thanh toán
- GDPR cho dữ liệu cá nhân
- ISO 27001

## Kết luận

Đầu tư vào bảo mật không phải chi phí mà là bảo hiểm cho sự tồn tại của doanh nghiệp.`,
        image: "/images/blog/security.jpg",
        category: "Bảo mật",
        author: "Tech Team",
        authorAvatar: "/images/authors/tech-team.jpg",
        date: new Date("2023-12-28"),
        readTime: "7 phút",
        featured: false,
        tags: ["Security", "Encryption", "PCI DSS", "Fraud Prevention"],
        views: 890,
        likes: 52,
      }
    ]
  })

  // Seed FAQs
  console.log('❓ Seeding FAQs...')
  await prisma.fAQ.createMany({
    data: [
      {
        category: "Sản phẩm",
        question: "Techera có hỗ trợ những loại vé nào?",
        answer: "Techera hỗ trợ tất cả các loại vé: vé máy bay, vé xe khách, vé tàu, vé du thuyền, vé tham quan, vé sự kiện, và nhiều loại vé khác. Hệ thống linh hoạt cho phép tùy chỉnh theo nhu cầu cụ thể của từng doanh nghiệp."
      },
      {
        category: "Sản phẩm",
        question: "Hệ thống có thể xử lý bao nhiêu giao dịch cùng lúc?",
        answer: "Hệ thống Techera được thiết kế để xử lý hàng chục nghìn giao dịch đồng thời với uptime 99.9%. Chúng tôi sử dụng kiến trúc microservices và auto-scaling để đảm bảo hiệu suất cao trong mọi điều kiện."
      },
      {
        category: "Tích hợp",
        question: "Techera có API để tích hợp không?",
        answer: "Có, Techera cung cấp RESTful API đầy đủ với documentation chi tiết. Bạn có thể tích hợp với website, mobile app, hoặc các hệ thống ERP/CRM hiện có của doanh nghiệp. Chúng tôi cũng hỗ trợ webhook cho các sự kiện realtime."
      },
      {
        category: "Bảo mật",
        question: "Dữ liệu của tôi có an toàn không?",
        answer: "Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế: PCI DSS cho thanh toán, mã hóa AES-256, SSL/TLS, và backup dữ liệu hàng ngày. Data center đặt tại Việt Nam đảm bảo tuân thủ quy định về lưu trữ dữ liệu."
      },
      {
        category: "Chi phí",
        question: "Chi phí sử dụng Techera như thế nào?",
        answer: "Techera cung cấp nhiều gói linh hoạt: từ gói Starter miễn phí cho doanh nghiệp nhỏ, đến gói Enterprise với pricing tùy chỉnh. Chi phí phụ thuộc vào số lượng vé, tính năng, và hỗ trợ cần thiết. Liên hệ để nhận báo giá chi tiết."
      }
    ]
  })

  // Seed Careers
  console.log('💼 Seeding careers...')
  await prisma.career.createMany({
    data: [
      {
        slug: "senior-fullstack-developer",
        title: "Senior Fullstack Developer",
        department: "Engineering",
        location: "Hà Nội",
        type: "Full-time",
        level: "Senior",
        salary: "25-40 triệu VND",
        description: "Chúng tôi đang tìm kiếm Senior Fullstack Developer để phát triển và mở rộng nền tảng vé điện tử hàng đầu Việt Nam.",
        responsibilities: [
          "Thiết kế và phát triển tính năng mới cho hệ thống",
          "Review code và mentor junior developers",
          "Tối ưu hiệu suất và khả năng mở rộng của hệ thống",
          "Hợp tác chặt chẽ với team Product và Design"
        ],
        requirements: [
          "5+ năm kinh nghiệm phát triển web",
          "Thành thạo React/Next.js và Node.js",
          "Kinh nghiệm với PostgreSQL/MongoDB",
          "Hiểu biết về Cloud services (AWS/GCP)",
          "Kỹ năng giao tiếp tốt"
        ],
        benefits: [
          "Lương thưởng cạnh tranh + ESOP",
          "Bảo hiểm sức khỏe cao cấp",
          "Du lịch team building 2 lần/năm",
          "Làm việc remote linh hoạt",
          "Ngân sách học tập $500/năm"
        ],
        posted: new Date("2024-01-20"),
        deadline: new Date("2024-02-20"),
        active: true
      },
      {
        slug: "product-manager",
        title: "Product Manager",
        department: "Product",
        location: "Hà Nội / Remote",
        type: "Full-time",
        level: "Middle-Senior",
        salary: "30-50 triệu VND",
        description: "Tìm kiếm Product Manager có đam mê xây dựng sản phẩm công nghệ du lịch, có khả năng định hướng sản phẩm và làm việc đa chức năng.",
        responsibilities: [
          "Định nghĩa và ưu tiên roadmap sản phẩm",
          "Thu thập và phân tích yêu cầu từ stakeholders",
          "Làm việc với Engineering và Design để deliver tính năng",
          "Phân tích metrics và ra quyết định dựa trên data"
        ],
        requirements: [
          "3+ năm kinh nghiệm Product Management",
          "Hiểu biết về B2B SaaS hoặc ngành du lịch",
          "Kỹ năng phân tích và tư duy chiến lược",
          "Khả năng giao tiếp và thuyết trình tốt"
        ],
        benefits: [
          "Cơ hội định hình sản phẩm từ nền tảng",
          "Làm việc với đội ngũ talented",
          "Chế độ lương thưởng hấp dẫn",
          "Văn phòng hiện đại tại trung tâm"
        ],
        posted: new Date("2024-01-18"),
        deadline: new Date("2024-02-28"),
        active: true
      }
    ]
  })

  console.log('✅ Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })