--
-- PostgreSQL database dump
--

\restrict vl2gi42ShCfc8S4r5ap18ckhEMb90obb9EY7FeKuYy9heTAixzcHsMy9xDmI4Wv

-- Dumped from database version 16.11
-- Dumped by pg_dump version 18.0

-- Started on 2026-01-29 14:42:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    image text,
    category text NOT NULL,
    author text NOT NULL,
    "authorAvatar" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readTime" text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    tags text[],
    views integer DEFAULT 0 NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_posts_id_seq OWNER TO postgres;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 215
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- TOC entry 220 (class 1259 OID 16424)
-- Name: careers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.careers (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    department text NOT NULL,
    location text NOT NULL,
    type text NOT NULL,
    level text NOT NULL,
    salary text NOT NULL,
    description text NOT NULL,
    responsibilities text[],
    requirements text[],
    benefits text[],
    posted timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deadline timestamp(3) without time zone,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.careers OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16423)
-- Name: careers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.careers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.careers_id_seq OWNER TO postgres;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 219
-- Name: careers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.careers_id_seq OWNED BY public.careers.id;


--
-- TOC entry 222 (class 1259 OID 16436)
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    company text,
    service text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16435)
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 221
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- TOC entry 218 (class 1259 OID 16414)
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    category text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16413)
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 217
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- TOC entry 226 (class 1259 OID 16459)
-- Name: job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    "jobId" integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    resume text NOT NULL,
    "coverLetter" text,
    "appliedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.job_applications OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16458)
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_applications_id_seq OWNER TO postgres;

--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 225
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- TOC entry 224 (class 1259 OID 16447)
-- Name: newsletters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newsletters (
    id integer NOT NULL,
    email text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "subscribedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.newsletters OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16446)
-- Name: newsletters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.newsletters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.newsletters_id_seq OWNER TO postgres;

--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 223
-- Name: newsletters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.newsletters_id_seq OWNED BY public.newsletters.id;


--
-- TOC entry 4659 (class 2604 OID 16403)
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- TOC entry 4667 (class 2604 OID 16427)
-- Name: careers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers ALTER COLUMN id SET DEFAULT nextval('public.careers_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 16439)
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- TOC entry 4665 (class 2604 OID 16417)
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 16462)
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 16450)
-- Name: newsletters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletters ALTER COLUMN id SET DEFAULT nextval('public.newsletters_id_seq'::regclass);


--
-- TOC entry 4842 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, slug, title, excerpt, content, image, category, author, "authorAvatar", date, "readTime", featured, tags, views, likes, "createdAt", "updatedAt") FROM stdin;
8	5-xu-huong-cong-nghe-du-lich-noi-bat-nam-2024	5 xu hướng công nghệ du lịch nổi bật năm 2024	Khám phá những công nghệ đang định hình lại ngành du lịch và cách doanh nghiệp có thể tận dụng chúng.	dasad	/images/blog/1769594649570-logo-sunworld.png	Xu hướng	Techera Team	/images/blog/1769594646806-techera-off-02.png	2024-01-15 00:00:00	1 phút	t	{AI,Blockchain,VR,IoT,"Du lịch số"}	1273	89	2026-01-28 09:23:39.445	2026-01-29 03:09:09.43
\.


--
-- TOC entry 4846 (class 0 OID 16424)
-- Dependencies: 220
-- Data for Name: careers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.careers (id, slug, title, department, location, type, level, salary, description, responsibilities, requirements, benefits, posted, deadline, active, "createdAt", "updatedAt") FROM stdin;
6	backend-developer	Backend Developer	Engineering	TP.HCM	Full-time	Middle	15-20 Triệu	Phát triển và tối ưu hệ thống backend cho nền tảng quản lý & phân phối vé\n\nThiết kế, xây dựng API phục vụ web/mobile\nLàm việc với cơ sở dữ liệu, đảm bảo hiệu năng và tính toàn vẹn dữ liệu\nTích hợp các dịch vụ liên quan: thanh toán, xác thực, báo cáo\nPhối hợp cùng frontend để xây dựng hệ thống ổn định – bảo mật – dễ mở rộng	{}	{Golang,NodeJs,MySQL,SQL}	{}	2026-01-29 01:21:44.788	2026-02-28 01:21:44.788	t	2026-01-29 01:21:44.789	2026-01-29 01:30:02.995
\.


--
-- TOC entry 4848 (class 0 OID 16436)
-- Dependencies: 222
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, phone, company, service, message, read, "createdAt", "updatedAt") FROM stdin;
1	Walker Dillard	bixukaset@mailinator.com	0379179755	Stein and Best Trading	pricing	Esse soluta tempore Esse soluta tempore Esse soluta tempore Esse soluta tempore	t	2026-01-29 02:00:07.575	2026-01-29 02:00:42.034
2	Jarrod Ramirez	hazuf@mailinator.com	0379179754	Hewitt Mendoza Plc	pricing	Sint irure minim sin	t	2026-01-29 02:01:00.584	2026-01-29 02:01:11.375
\.


--
-- TOC entry 4844 (class 0 OID 16414)
-- Dependencies: 218
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, category, question, answer, "createdAt", "updatedAt") FROM stdin;
6	Sản phẩm	Techera có hỗ trợ những loại vé nào?	Techera hỗ trợ tất cả các loại vé: vé máy bay, vé xe khách, vé tàu, vé du thuyền, vé tham quan, vé sự kiện, và nhiều loại vé khác. Hệ thống linh hoạt cho phép tùy chỉnh theo nhu cầu cụ thể của từng doanh nghiệp.	2026-01-28 09:23:39.448	2026-01-28 09:23:39.448
7	Sản phẩm	Hệ thống có thể xử lý bao nhiêu giao dịch cùng lúc?	Hệ thống Techera được thiết kế để xử lý hàng chục nghìn giao dịch đồng thời với uptime 99.9%. Chúng tôi sử dụng kiến trúc microservices và auto-scaling để đảm bảo hiệu suất cao trong mọi điều kiện.	2026-01-28 09:23:39.448	2026-01-28 09:23:39.448
8	Tích hợp	Techera có API để tích hợp không?	Có, Techera cung cấp RESTful API đầy đủ với documentation chi tiết. Bạn có thể tích hợp với website, mobile app, hoặc các hệ thống ERP/CRM hiện có của doanh nghiệp. Chúng tôi cũng hỗ trợ webhook cho các sự kiện realtime.	2026-01-28 09:23:39.448	2026-01-28 09:23:39.448
9	Bảo mật	Dữ liệu của tôi có an toàn không?	Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế: PCI DSS cho thanh toán, mã hóa AES-256, SSL/TLS, và backup dữ liệu hàng ngày. Data center đặt tại Việt Nam đảm bảo tuân thủ quy định về lưu trữ dữ liệu.	2026-01-28 09:23:39.448	2026-01-28 09:23:39.448
10	Chi phí	Chi phí sử dụng Techera như thế nào?	Techera cung cấp nhiều gói linh hoạt: từ gói Starter miễn phí cho doanh nghiệp nhỏ, đến gói Enterprise với pricing tùy chỉnh. Chi phí phụ thuộc vào số lượng vé, tính năng, và hỗ trợ cần thiết. Liên hệ để nhận báo giá chi tiết.	2026-01-28 09:23:39.448	2026-01-28 09:23:39.448
\.


--
-- TOC entry 4852 (class 0 OID 16459)
-- Dependencies: 226
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (id, "jobId", name, email, phone, resume, "coverLetter", "appliedAt", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4850 (class 0 OID 16447)
-- Dependencies: 224
-- Data for Name: newsletters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newsletters (id, email, active, "subscribedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 215
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 13, true);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 219
-- Name: careers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.careers_id_seq', 6, true);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 221
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 2, true);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 217
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_id_seq', 11, true);


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 225
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 1, false);


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 223
-- Name: newsletters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.newsletters_id_seq', 1, true);


--
-- TOC entry 4683 (class 2606 OID 16412)
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 16434)
-- Name: careers careers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.careers
    ADD CONSTRAINT careers_pkey PRIMARY KEY (id);


--
-- TOC entry 4691 (class 2606 OID 16445)
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16422)
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 16469)
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 16457)
-- Name: newsletters newsletters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletters
    ADD CONSTRAINT newsletters_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 1259 OID 16470)
-- Name: blog_posts_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug);


--
-- TOC entry 4689 (class 1259 OID 16471)
-- Name: careers_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX careers_slug_key ON public.careers USING btree (slug);


--
-- TOC entry 4692 (class 1259 OID 16472)
-- Name: newsletters_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX newsletters_email_key ON public.newsletters USING btree (email);


--
-- TOC entry 4697 (class 2606 OID 16473)
-- Name: job_applications job_applications_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public.careers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-01-29 14:42:49

--
-- PostgreSQL database dump complete
--

\unrestrict vl2gi42ShCfc8S4r5ap18ckhEMb90obb9EY7FeKuYy9heTAixzcHsMy9xDmI4Wv

