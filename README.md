# 🎓 Alumni Tracking System

## 📖 Project Overview

This repository holds a semester-long project for the **Web Programming** course: an Alumni Tracking System that keeps graduates connected with their school or university — letting them stay in touch, follow community updates, discover career opportunities, and find out about upcoming events.

The project grows week by week, following the course structure — starting with basic routing, then moving into CRUD operations, database integration, relational schema design, authentication, and eventually deployment — with every step reflected in this repo's commit history.

## ✨ Features

- **Alumni Profiles & Directory** — create, update, search, and view alumni profiles and graduation details.
- **Member & Alumni Registration (`/register`)** — comprehensive registration flow with user role selection (alumni, student, coordinator, employer, admin), academic department picker, graduation year, and secure password validation.
- **Cryptographic Password Storage (scrypt)** — passwords require minimum 8 characters with matching confirmation; hashed using Node's native `crypto.scrypt` (128-bit salt + 512-bit derived key); never stored in plaintext and strictly omitted from all API responses (including `/api/users`), logs, and redirect query params.
- **Session Authentication (`/login`, `/logout`) & Auth Guardians** — cookie-based session authentication via `express-session` (`SESSION_SECRET`); generic error message on invalid login; `authMiddleware` and `requireAdmin` protect web routes (redirecting to `/login` or returning `403`) and API endpoints (`401` / `403` JSON) while logging all unauthorized attempts (`[401]` / `[403]`) to `backend/logs/error.logs`.
- **Dynamic Role-Based Navigation (`backend/src/components/headerMenu.js`)** — single shared header component adhering to `design.md` that dynamically adapts menu items to authentication status and user role (`guest`, `admin`, `alumni`, `student`, `coordinator`, `employer`) across all pages.
- **Admin Panel (`/admin`)** — role-protected administration dashboard for assigning user roles (`admin`, `alumni`, `student`, `coordinator`, `employer`), managing account status, and manipulating departments, announcements, job postings, and applications.
- **Academic Departments** — manage faculties and academic departments linked to students and job opportunities.
- **Event Announcements** — publish, view, and organize alumni events and campus announcements.
- **Event Registrations** — RSVP and track event attendance with attendee status (registered, attended, cancelled).
- **Career & Job Postings** — publish, browse, and filter job/internship postings with company, location, employment type, salary range, and target department.
- **Job Applications** — submit and track applications with resume links, cover notes, and multi-stage status tracking (pending, reviewed, interview, accepted, rejected).
- **Interactive Swagger Documentation** — explore and test all RESTful and nested endpoints via Swagger UI at `/api/swagger`.
- **Server-Side Rendered Web UI** — user-friendly, responsive HTML interface for managing users, announcements, job postings, applications, and a generic `/404` error page.
- **Request Logging Middleware** — single-line terminal access logs with timestamp, HTTP method, route, status code, and response duration (`HH:MM:SS METHOD ROUTE STATUS DURATIONms`).
- **404 Guardian & Generic 404 Redirect** — detects undefined routes and unsupported HTTP methods, records `[404]` entries with explanatory `reason` to terminal and `backend/logs/error.logs`, and redirects invalid requests (`302`) to the XSS-safe `/404` view without redirect loops.
- **5xx Guardian Middleware** — catches server-side runtime/database errors (including `AggregateError`), logs `[5xx]` records with full stack traces to terminal and `backend/logs/error.logs`, and returns structured JSON error responses (`500` or explicit `4xx`).
- **Domain & Validation Rules ([`ddd.md`](ddd.md))** — comprehensive schema dictionary, field limits (e.g., `job_postings` mandatory `title` max 120 chars, mandatory `company`, optional `city` & `description`), and entity lifecycle rules.
- **Brand & Visual Identity ([`brand.md`](brand.md))** — official corporate identity, Istanbul University color palette (navy, gold, burgundy), typography hierarchy, Beyazıt Gate logo usage, and institutional standards.
- **Design System & UI Guidelines ([`design.md`](design.md))** — modern Letters-inspired design system featuring `#214539` dark forest green canvas, `#F5BA13` yellow action buttons, high-contrast white cards, Arial typography, and accessible UI components.

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js & Express.js | Fast to build with, large ecosystem, async I/O well-suited for RESTful and MVC web services. |
| Database | PostgreSQL 16 | Reliable relational database with robust support for foreign keys, cascade rules, checks, unique constraints, and indexes. |
| Migration & Seeding | Custom Migration Runner & Factory-based Seeder | Sequential SQL migrations (`backend/migrations/`) with automatic tracking and idempotent seeding (`backend/seeds/`). |
| Middleware & Observability | Custom Express Middlewares (`logger`, `404 Guardian`, `5xx Guardian`) & File Logger | Standardized single-line request logs, generic `/404` redirect handling, and persistent `[404]` / `[5xx]` audit logs in `backend/logs/error.logs`. |
| Frontend / Views | Server-Side Rendered (SSR) HTML/CSS | Dependency-light, responsive, accessible MVC views with form validation, alerts, XSS escaping, and badges. |
| API Docs | OpenAPI 3.0 & Swagger UI | Auto-generated interactive API docs (`/api/swagger`) via `swagger-jsdoc` and `swagger-ui-express`. |
| DevOps | Docker & Docker Compose | Multi-container setup (Node.js backend + PostgreSQL db) ensuring cross-platform reproducibility. |
| Version Control | Git & GitHub | Semester-long weekly progression reflected in clean commit history. |

## 📂 Project Structure

```text
alumni/
├── backend/
│   ├── logs/                        # Auto-created runtime error logs (gitignored)
│   │   └── error.logs               # Persistent [404] and [5xx] error log entries
│   ├── migrations/                  # Sequential SQL migration files
│   │   ├── 001_create_departments.sql
│   │   ├── 002_create_users.sql
│   │   ├── 003_create_announcements.sql
│   │   ├── 004_create_events.sql
│   │   ├── 005_create_event_registrations.sql
│   │   ├── 006_create_job_postings.sql
│   │   ├── 007_create_applications.sql
│   │   ├── 008_add_role_and_is_active_to_users.sql
│   │   ├── 009_add_password_hash_to_users.sql
│   │   └── 010_add_phone_and_linkedin_to_users.sql
│   ├── seeds/                       # Database seeder and factory generators
│   │   ├── factories.js             # Entity factories (Department, User, JobPosting, etc.)
│   │   └── index.js                 # Database seeder script (npm run seed)
│   ├── src/
│   │   ├── components/              # Shared UI components used across all SSR views
│   │   │   ├── headerMenu.js        # Single shared dynamic role-based header navigation menu
│   │   │   └── index.js
│   │   ├── config/                  # Database pool, migrations runner, and Swagger config
│   │   │   ├── db.js
│   │   │   ├── migrate.js
│   │   │   └── swagger.js
│   │   ├── controllers/             # MVC Web & REST API controllers
│   │   │   ├── homeController.js    # Home, health, utility & generic /404 page handler
│   │   │   ├── adminController.js   # Admin panel (/admin) & full data/RBAC manipulation
│   │   │   ├── userController.js & apiUserController.js
│   │   │   ├── announcementController.js & apiAnnouncementController.js
│   │   │   ├── jobPostingController.js & apiJobPostingController.js
│   │   │   ├── applicationController.js & apiApplicationController.js
│   │   │   ├── apiDepartmentController.js
│   │   │   └── apiEventController.js
│   │   ├── middlewares/             # Express request/error/auth guardian middlewares
│   │   │   ├── authMiddleware.js    # Auth (401 -> /login or JSON) & Admin (403) guardian + error.logs
│   │   │   ├── logger.js            # Single-line request logger (HH:MM:SS METHOD ROUTE STATUS ms)
│   │   │   ├── notFoundGuardian.js  # 404 detection, error.logs recording & /404 redirect
│   │   │   └── serverErrorGuardian.js # 5xx error catcher, stack trace logging & JSON response
│   │   ├── models/                  # PostgreSQL data models with relational queries
│   │   │   ├── index.js             # Central export and relationship metadata
│   │   │   ├── userModel.js
│   │   │   ├── departmentModel.js
│   │   │   ├── announcementModel.js
│   │   │   ├── eventModel.js
│   │   │   ├── eventRegistrationModel.js
│   │   │   ├── jobPostingModel.js
│   │   │   └── applicationModel.js
│   │   ├── routes/                  # Modular Web & REST API routes
│   │   │   ├── index.js             # Main router (including /login, /register, /logout, /admin, /404)
│   │   │   ├── adminRoutes.js       # Admin panel & data manipulation routes
│   │   │   ├── userRoutes.js & apiUserRoutes.js
│   │   │   ├── announcementRoutes.js & apiAnnouncementRoutes.js
│   │   │   ├── jobPostingRoutes.js & apiJobPostingRoutes.js
│   │   │   ├── applicationRoutes.js & apiApplicationRoutes.js
│   │   │   ├── apiDepartmentRoutes.js
│   │   │   ├── apiEventRoutes.js
│   │   │   └── apiEventRegistrationRoutes.js
│   │   ├── utils/                   # Shared backend utilities
│   │   │   ├── errorLogger.js       # Auto-creates logs/ and writes error.logs + console.error
│   │   │   ├── password.js          # Cryptographic password hashing and timing-safe verification (scrypt)
│   │   │   └── sessionContext.js    # Request-scoped session context (AsyncLocalStorage) for SSR views
│   │   ├── views/                   # Server-side HTML View templates
│   │   │   ├── index.js             # Central view exports
│   │   │   ├── layout.js            # Base layout wrapper using shared components/headerMenu.js
│   │   │   ├── homeView.js          # Home landing page using shared components/headerMenu.js
│   │   │   ├── registerView.js      # Dedicated registration form with role & scrypt password fields
│   │   │   ├── loginView.js         # Dedicated login form (/login)
│   │   │   ├── profileView.js       # User-specific profile (/profile) & settings/password change (/settings)
│   │   │   ├── adminView.js         # Admin panel dashboard (/admin) for RBAC & data manipulation
│   │   │   ├── userView.js
│   │   │   ├── announcementView.js
│   │   │   ├── jobPostingView.js
│   │   │   ├── applicationView.js
│   │   │   └── notFoundView.js      # Generic XSS-safe 404 error HTML page
│   │   └── index.js                 # Application entrypoint & middleware pipeline
│   └── package.json
├── .env.example                     # Environment variables template
├── .gitignore                       # Excludes .env, node_modules, logs/
├── docker-compose.yml               # PostgreSQL db + Node app orchestration
├── Dockerfile                       # Backend container image
├── brand.md                         # Brand identity, typography, color palette & institutional guidelines
├── design.md                        # Letters-inspired design system (#214539 canvas, yellow buttons, white cards)
├── ddd.md                           # Domain-driven data architecture, ER diagram & rules
└── README.md
```

## 🏛️ Architecture (MVC Pattern)

Bu proje, kodun okunabilirliğini, bakımını ve ölçeklenebilirliğini artırmak amacıyla **Model-View-Controller (MVC)** mimari deseni temel alınarak yapılandırılmıştır.

```text
                      ┌────────────────────────┐
                      │      HTTP Request      │
                      │   (Browser / Postman)  │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │ requestLogger (logger) │
                      │ (HH:MM:SS METOD ...ms) │
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │    Express Router      │
                      │ (backend/src/routes/)  │
                      │  ├── index.js (/404 ..)│
                      │  ├── userRoutes.js / apiUserRoutes.js
                      │  ├── announcementRoutes.js / apiAnnouncementRoutes.js
                      │  ├── jobPostingRoutes.js / apiJobPostingRoutes.js
                      │  └── applicationRoutes.js / apiApplicationRoutes.js
                      └─────┬────────────┬─────┘
                            │            │ (Eşleşmeyen Route / Metod)
                            ▼            └──────────────────────────────┐
                ┌────────────────────────┐                              ▼
                │       Controller       │                 ┌────────────────────────┐
                │  (İş Mantığı & Akış)   │                 │   404 Guardian         │
                │(backend/src/controllers)│                │ - [404] logs/error.logs│
                │  ├── homeController    │                 │ - Redirect -> GET /404 │
                │  ├── userController / apiUserController  └────────────────────────┘
                │  ├── announcementController / apiAnnouncementController
                │  ├── jobPostingController / apiJobPostingController
                │  └── applicationController / apiApplicationController
                └───────┬────────┬───────┘
                        │        │                     (Sunucu / Runtime Hatası)
       Veri Okuma/Yazma │        │ Şablon Render       ────────────────────────► ┌──────────────────────────┐
                        ▼        ▼                                               │   5xx Guardian           │
┌───────────────────────────────┐    ┌───────────────────────────────┐           │ - [5xx] logs/error.logs  │
│             Model             │    │             View              │           │   + Stack Trace          │
│  - PostgreSQL Models:         │    │  - HTML Views:                │           │ - 500 JSON (reason)      │
│    * UserModel,               │    │    * userView.js              │           └──────────────────────────┘
│    * DepartmentModel,         │    │    * announcementView.js      │
│    * JobPostingModel,         │    │    * jobPostingView.js        │
│    * ApplicationModel,        │    │    * applicationView.js       │
│    * EventModel,              │    │    * notFoundView.js (/404)   │
│    * EventRegistrationModel   │    │  - JSON REST API Responses    │
│  - PostgreSQL Pool (config/db)│    │  - Swagger UI (/api/swagger)  │
└───────────────────────────────┘    └───────────────────────────────┘
```

### 1. 🔀 Routing Katmanı (`backend/src/routes/`)
Yönlendirme katmanı modüler bir yapıda tasarlanmıştır:
- **[`index.js`](backend/src/routes/index.js) (Ana Yönlendirici):** Genel sayfa ve servis rotalarını (`/`, `/about`, `/api/health`, `/hello`, `/sum`, `/404`) barındırır ve Web ile REST API alt router'larını sisteme bağlar (`router.use`).
- **Web Router'ları (HTML Görünümleri):**
  - **[`userRoutes.js`](backend/src/routes/userRoutes.js) (`/users`):** Mezunlar web listesi, kayıt formu, düzenleme formu ve profil detayları.
  - **[`announcementRoutes.js`](backend/src/routes/announcementRoutes.js) (`/announcements`):** Duyurular web listesi, duyuru yayınlama, düzenleme ve detay sayfaları.
  - **[`jobPostingRoutes.js`](backend/src/routes/jobPostingRoutes.js) (`/job-postings`):** İş ilanları web listesi, yeni ilan yayınlama, düzenleme ve başvuran adayların listelendiği ilan detay sayfaları.
  - **[`applicationRoutes.js`](backend/src/routes/applicationRoutes.js) (`/applications`):** İş başvuruları web listesi, dinamik ilan/mezun seçimli başvuru formu, başvuru detayları ve durum güncelleme sayfaları.
- **REST API Router'ları (Saf JSON):**
  - **[`apiUserRoutes.js`](backend/src/routes/apiUserRoutes.js) (`/api/users`):** CRUD operasyonları + iç içe (nested) rotalar (`/department`, `/announcements`, `/events`, `/registered-events`, `/job-postings`, `/applications`, `/applied-jobs`).
  - **[`apiJobPostingRoutes.js`](backend/src/routes/apiJobPostingRoutes.js) (`/api/job-postings`):** CRUD operasyonları + nested rotalar (`/poster`, `/department`, `/applications`, `/applicants`, `/apply`).
  - **[`apiApplicationRoutes.js`](backend/src/routes/apiApplicationRoutes.js) (`/api/applications`):** CRUD operasyonları + nested rotalar (`/job-posting`, `/user`).
  - **[`apiDepartmentRoutes.js`](backend/src/routes/apiDepartmentRoutes.js) (`/api/departments`):** Bölüm listeleme ve bölüme ait kullanıcılar/ilanlar.
  - **[`apiEventRoutes.js`](backend/src/routes/apiEventRoutes.js) & [`apiEventRegistrationRoutes.js`](backend/src/routes/apiEventRegistrationRoutes.js):** Etkinlik yönetimi ve katılımcı kayıtları.
- **Swagger / OpenAPI:** Her router dosyasında ilgili route tanımlarının üzerindeki JSDoc `@swagger` blokları `backend/src/config/swagger.js` tarafından otomatik olarak taranır ve `/api/swagger` arayüzünde birleştirilir.

### 2. 🎮 Controller Katmanı (`backend/src/controllers/`)
Uygulamanın iş mantığının (business logic), gelen istek parametrelerinin (`req.params`, `req.body`, `req.query`) doğrulanmasının ve HTTP durum kodlarının (200, 201, 302, 400, 404, 409, 500) yönetildiği katmandır.
- **Genel & Utility Controller ([`homeController.js`](backend/src/controllers/homeController.js)):** Ana sayfa, hakkında, sağlık kontrolü (`/api/health`) ve generic 404 hata sayfasını (`getNotFoundPage` — `GET /404` isteğini `path`, `method` ve `reason` query parametreleriyle HTTP `404` olarak render eder) yönetir.
- **Web Controller Katmanı ([`userController.js`](backend/src/controllers/userController.js), [`announcementController.js`](backend/src/controllers/announcementController.js), [`jobPostingController.js`](backend/src/controllers/jobPostingController.js), [`applicationController.js`](backend/src/controllers/applicationController.js)):**
  - Model ve View arasında köprü görevi görerek web üzerindeki tüm CRUD akışını yönetir.
  - `GET /`: Verileri modelden çekip ilgili View şablonuyla tarayıcıya sunar.
  - `POST /`: Formdan gelen verileri doğrulayıp ekler ve `302 Found` ile listeye yönlendirir (`res.redirect`).
  - `GET /:id`: Kaydın detaylı görünümünü veya 404 sayfasını render eder.
  - `GET /:id/edit`: Önceden doldurulmuş düzenleme formunu sunar.
  - `POST /:id/update`: Güncellenen verileri işleyip listeye yönlendirir.
  - `POST /:id/delete`: Kaydı silip listeye yönlendirir.
- **REST API Katmanı ([`apiUserController.js`](backend/src/controllers/apiUserController.js), [`apiJobPostingController.js`](backend/src/controllers/apiJobPostingController.js), [`apiApplicationController.js`](backend/src/controllers/apiApplicationController.js), vb.):**
  - Standart JSON formatında çalışan RESTful API denetleyicileridir.
  - PUT için tam güncelleme, PATCH için kısmi güncelleme doğrulaması yapar; ilişkisel veri traversal sorgularını yürütür.

### 3. 📦 Model Katmanı (`backend/src/models/` & PostgreSQL)
Verinin saklanması, iş kurallarına göre modellenmesi, sorgulanması ve manipülasyonundan sorumlu katmandır.
- **PostgreSQL Modelleri ([`jobPostingModel.js`](backend/src/models/jobPostingModel.js), [`applicationModel.js`](backend/src/models/applicationModel.js), [`userModel.js`](backend/src/models/userModel.js), [`departmentModel.js`](backend/src/models/departmentModel.js), vb.):**
  - Tüm modeller `pg.Pool` bağlantı havuzu üzerinden doğrudan PostgreSQL veritabanına bağlıdır.
  - Temel CRUD fonksiyonları: `findAll()`, `findById(id)`, `create(data)`, `replace(id, data)`, `update(id, partialData)` ve `remove(id)`.
  - **İlişkisel Metotlar:**
    - `JobPostingModel.getPoster(id)`: İlanı yayınlayan mezunu döner (N:1).
    - `JobPostingModel.getDepartment(id)`: Hedeflenen bölümü döner (N:1).
    - `JobPostingModel.getApplications(id)`: İlana gelen başvuruları döner (1:N).
    - `JobPostingModel.getApplicants(id)`: İlana başvuran kullanıcıları döner (N:N).
    - `ApplicationModel.getJobPosting(id)`: Başvurulan iş ilanını döner (N:1).
    - `ApplicationModel.getUser(id)`: Başvuruyu yapan mezun kullanıcısını döner (N:1).
    - `UserModel.getJobPostings(id)` & `UserModel.getApplications(id)` & `UserModel.getAppliedJobs(id)`.
- **Merkezi İlişki Haritası ([`models/index.js`](backend/src/models/index.js)):** Tüm modelleri tek noktadan dışa aktarır ve tablolar arası ilişki meta verilerini (`hasMany`, `belongsTo`, `belongsToMany`) tanımlar.

### 4. 👁️ View & Ortak Bileşen Katmanı (`backend/src/views/` & `backend/src/components/`)
Kullanıcıya veya istemciye sunulan çıktının oluşturulduğu bağımsız sunucu taraflı şablonlama (SSR) katmandır:
- **[`components/headerMenu.js`](backend/src/components/headerMenu.js) (Tekil Dinamik Navigasyon Bileşeni):** Tüm sayfalarda (`layout.js`, `homeView.js` ve tüm alt görünümlerde) kullanılan, `design.md` uyumlu tek ortak header ve menü bileşenidir. Giriş durumuna ve kullanıcının rolüne göre menü öğelerini dinamik olarak oluşturur:

  | Kullanıcı Durumu / Rolü | Ortak Menü Öğeleri | Role Özel Ek Menü Öğeleri | Kişisel Hesap & Oturum Alanı |
  |---|---|---|---|
  | **Misafir (Giriş Yapmamış)** | `Ana Sayfa` (`/`) | *(Yok — korunan sayfalar gizlenir)* | `Giriş` (`/login`), `+ Kayıt` (`/register`) |
  | **`admin` (Sistem Yöneticisi)** | `Ana Sayfa`, `Mezunlar`, `Duyurular`, `İş İlanları` | `Başvurular` (`/applications`), `🛡️ Admin Panel` (`/admin`) | `Profil` (`/profile`), `Ayarlar` (`/settings`), `👤 Ad Soyad (Admin)` + `Çıkış` (`POST /logout`) |
  | **`alumni` (Mezun)** | `Ana Sayfa`, `Mezunlar`, `Duyurular`, `İş İlanları` | `Başvurularım` (`/applications`), `➕ İlan Paylaş` (`/job-postings#new-job-form`) | `Profil` (`/profile`), `Ayarlar` (`/settings`), `👤 Ad Soyad (Mezun)` + `Çıkış` (`POST /logout`) |
  | **`student` (Öğrenci)** | `Ana Sayfa`, `Mezunlar`, `Duyurular`, `İş İlanları` | `Staj ve Başvurularım` (`/applications`) | `Profil` (`/profile`), `Ayarlar` (`/settings`), `👤 Ad Soyad (Öğrenci)` + `Çıkış` (`POST /logout`) |
  | **`coordinator` (Bölüm Koordinatörü)** | `Ana Sayfa`, `Mezunlar`, `Duyurular`, `İş İlanları` | `📢 Duyuru Yayınla` (`/announcements#new-announcement-form`) | `Profil` (`/profile`), `Ayarlar` (`/settings`), `👤 Ad Soyad (Koordinatör)` + `Çıkış` (`POST /logout`) |
  | **`employer` (İşveren / İK)** | `Ana Sayfa`, `Mezunlar`, `Duyurular`, `İş İlanları` | `➕ İlan Yayınla` (`/job-postings#new-job-form`), `Aday Başvuruları` (`/applications`) | `Profil` (`/profile`), `Ayarlar` (`/settings`), `👤 Ad Soyad (İşveren)` + `Çıkış` (`POST /logout`) |

- **[`profileView.js`](backend/src/views/profileView.js):** Giriş yapmış kullanıcının kendi kişisel profil (`/profile`) ve hesap ayarları / şifre değiştirme (`/settings`) sayfaları.

- **[`loginView.js`](backend/src/views/loginView.js) & [`registerView.js`](backend/src/views/registerView.js):** Kullanıcı giriş (`/login`) ve rol seçimli kayıt (`/register`) sayfaları.
- **[`adminView.js`](backend/src/views/adminView.js):** Kullanıcı rolleri (RBAC), bölümler, duyurular, iş ilanları ve başvurular için merkezi yönetim paneli (`/admin`).
- **[`userView.js`](backend/src/views/userView.js):** Mezunlar listesi, profili, düzenleme ve 404 sayfaları.
- **[`announcementView.js`](backend/src/views/announcementView.js):** Duyurular paneli, detay, düzenleme ve 404 sayfaları.
- **[`jobPostingView.js`](backend/src/views/jobPostingView.js):** İş ilanları listesi, yeni ilan formu, zengin ilan detay kartı (başvuran adaylar listesiyle) ve düzenleme formu.
- **[`applicationView.js`](backend/src/views/applicationView.js):** İş başvuruları takip paneli, dinamik ilan/aday seçimli başvuru yapma formu, başvuru detay kartı ve durum güncelleme formu.
- **[`notFoundView.js`](backend/src/views/notFoundView.js):** Geçersiz rotalardan yönlendirilen istekler için `escapeHtml` XSS korumalı generic `404 Not Found` HTML hata sayfası (`renderNotFoundPage`).

### 5. 🛡️ Middleware, Kimlik Doğrulama, Hata Yönetimi ve Loglama Katmanı (`backend/src/middlewares/` & `backend/src/utils/`)
Uygulama yaşam döngüsündeki tüm istekleri izlemek, menüde gizlenen sayfaların erişim kontrolünü sunucu düzeyinde korumak, yakalanmayan rotaları güvenli biçimde yönetmek ve hataları kalıcı olarak kaydetmek için [`backend/src/index.js`](backend/src/index.js) içinde sıralı middleware zinciri tanımlanmıştır:

- **Auth & Admin Guardian ([`authMiddleware.js`](backend/src/middlewares/authMiddleware.js)):**
  - Menüde gizlenen korunan sayfalara (`/users`, `/announcements`, `/job-postings`, `/applications`, `/admin` ve `/api/*`) doğrudan URL ile erişilmeye çalışıldığında devreye girer.
  - Giriş yapmamış kullanıcıları web isteklerinde `/login` sayfasına yönlendirir, API isteklerinde `401 Unauthorized` JSON yanıtı döner ve denemeyi `[401]` etiketiyle `backend/logs/error.logs` dosyasına yazar.
  - `requireAdmin` middleware'i `/admin` rotalarını korur; `admin` rolünde olmayan kullanıcıların erişim denemelerini `[403]` etiketiyle `backend/logs/error.logs` dosyasına kaydeder ve `403 Forbidden` döner.

- **Request Logger ([`logger.js`](backend/src/middlewares/logger.js)):**
  - Her HTTP isteği tamamlandığında terminale tek satırlık özet log basar (`HH:MM:SS METOD ROUTE DURUM_KODU SÜRE`).
  - Örnek çıktı: `10:20:30 POST /api/users 201 18ms`
- **404 Guardian ([`notFoundGuardian.js`](backend/src/middlewares/notFoundGuardian.js)):**
  - Tanımlı olmayan bir route veya mevcut bir route'a desteklenmeyen HTTP metoduyla istek geldiğinde (`collectSupportedMethods` ile desteklenen metodları tespit ederek) açıklayıcı `reason` mesajı üretir.
  - Yönlendirme yapmadan önce hatayı `[404]` türüyle terminale ve `backend/logs/error.logs` dosyasına kaydeder.
  - Geçersiz istekleri `302 Found` ile `/404?path=...&method=...&reason=...` adresine yönlendirir (`GET /404` HTML sayfasını HTTP `404` durum koduyla döner; `/404` adresine farklı bir HTTP metoduyla gelinirse yönlendirme döngüsünü önlemek için doğrudan `404` HTML yanıtı üretir).
- **5xx Guardian ([`serverErrorGuardian.js`](backend/src/middlewares/serverErrorGuardian.js)):**
  - Express hata yakalama zincirinde (`(err, req, res, next)`) oluşan sunucu taraflı hataları yakalar (`AggregateError`, `err.reason`, `err.code` dahil neden çıkarımı yapar).
  - Hatayı `[5xx]` (veya açık `4xx`) türü, durum kodu, nedeni ve `5xx` hataları için tam `Stack Trace` bilgisiyle terminale ve `backend/logs/error.logs` dosyasına kaydeder; istemciye `500` durum koduyla JSON hata yanıtı (`error`, `statusCode`, `reason`, `method`, `path`, `timestamp`) döner.
- **Merkezi Hata Loglayıcı ([`errorLogger.js`](backend/src/utils/errorLogger.js)):**
  - `backend/logs/` klasörü yoksa otomatik oluşturur (`fs.mkdirSync(..., { recursive: true })`) ve tüm middleware hatalarını `backend/logs/error.logs` dosyasına ekler.
  - Örnek `error.logs` formatı (`[404]` ve `[5xx]` ayrımı açıkça görülür):
    ```text
    [2026-11-11 10:55:28] [404] GET /olmayan-sayfa | Status: 404 | Reason: Tanımlı olmayan route: 'GET /olmayan-sayfa' ile eşleşen bir endpoint sistemde bulunamadı.
    [2026-11-11 10:55:28] [5xx] GET /api/users | Status: 500 | Reason: [ECONNREFUSED] connect ECONNREFUSED ...
    Stack Trace:
    Error: ...
    ```

---

## 🔐 Authentication, Session Management & RBAC

Sistemde uçtan uca güvenli kimlik doğrulama, cookie tabanlı oturum yönetimi ve 5 farklı kullanıcı rolüne (`admin`, `alumni`, `student`, `coordinator`, `employer`) dayalı yetkilendirme (RBAC) mimarisi yer almaktadır:

### 1. Kayıt (`/register`) ve Kriptografik Parola Saklama (`crypto.scrypt`)
- **Parola Doğrulama:** Kayıt formunda (`GET /register`, `POST /register`) şifre ve şifre tekrarı alanları zorunludur; şifre en az **8 karakter** olmalı ve iki alan birebir eşleşmelidir.
- **Güvenli Hash'leme ([`backend/src/utils/password.js`](backend/src/utils/password.js)):** Parolalar asla düz metin (plaintext) olarak saklanmaz. Node.js'in yerleşik `crypto.scrypt` fonksiyonu ile 16-byte (128-bit) kriptografik rastgele tuz (`salt`) ve 64-byte (512-bit) türetilmiş anahtar üretilerek `${salt}:${derivedKey}` formatında `users.password_hash` sütununa kaydedilir.
- **Sızdırmazlık:** `password` ve `password_hash` alanları hiçbir API cevabında (`/api/users` dahil), hata mesajında, URL parametresinde veya sunucu loglarında yer almaz.

### 2. Giriş (`/login`), Çıkış (`POST /logout`) ve Cookie Tabanlı Oturum (`express-session`)
- **Session Yapılandırması:** Oturumlar `express-session` ile `httpOnly: true`, `sameSite: 'lax'` özellikli `iu_alumni.sid` çerezi üzerinden yönetilir. Oturum anahtarı `.env` ve `.env.example` dosyalarında `SESSION_SECRET` değişkeni ile tanımlanmıştır.
- **Parola Kontrolü ve Genel Hata Mesajı:** `POST /login` isteğinde parola kontrolü kayıt aşamasındaki aynı `crypto.scrypt` yöntemi (`verifyPassword` + `crypto.timingSafeEqual`) ile yapılır. Hatalı girişlerde e-postanın mı yoksa şifrenin mi yanlış olduğunu açık etmeyen genel **`"E-posta adresi veya şifre hatalı."`** mesajı dönülür.
- **Oturum Sonlandırma (`POST /logout`):** `req.session.destroy()` ile sunucu oturumunu sonlandırır ve oturum çerezini temizler.

### 3. Kullanıcıya Özel Sayfalar (`/profile`, `/settings`, Kişiselleştirilmiş `/`)
- **`/profile` (Kişisel Profil Sayfası):** Giriş yapmış kullanıcının kendi bilgilerini (Ad Soyad, E-Posta, Sistem Rolü, Bölüm, Mezuniyet Yılı, Telefon, LinkedIn) ve aktivite özetini gösterir.
- **`/settings` (Kişisel Ayarlar & Şifre Değiştirme):**
  - Kullanıcı yalnızca kendi profil bilgilerini güncelleyebilir; işlemler URL'deki `id` parametresine göre değil doğrudan oturumdaki kullanıcıya (`req.session.user.id`) göre yapılır ve kullanıcı kendi rolünü değiştiremez.
  - Bilgi güncellemesi sonrasında oturum ve Header menüsündeki kullanıcı adı anında güncellenir.
  - Şifre değiştirme (`POST /settings/password`) işleminde mevcut şifre doğrulanır ve yeni şifrenin en az 8 karakter olması zorunludur.
- **Kişiselleştirilmiş Ana Sayfa (`/`):** Giriş yapmış kullanıcıyı adıyla karşılar, rolüne uygun hızlı kısayollar gösterir ve kullanıcının kendi verilerinden özetler (*Başvurularım Özeti*, *Paylaştığım İlanlar*, *Hesap & Profil Özetim*) sunar. Giriş yapmamış ziyaretçiler için kurumsal karşılama sayfası korunur.
- **Başvurular (`/applications`) Kişisel Filtreleme:** `alumni` (Mezun) ve `student` (Öğrenci) rolündeki kullanıcılar `/applications` sayfasında yalnızca kendi başvurularını görür ve yönetir.

### 4. Auth & Admin Middleware ve Yönetim Paneli (`/admin`)
- **`authMiddleware` ([`backend/src/middlewares/authMiddleware.js`](backend/src/middlewares/authMiddleware.js)):** Giriş yapmamış kullanıcıların korunan web sayfalarına erişimini `/login` sayfasına yönlendirir, API isteklerinde `401 Unauthorized` JSON döner ve tüm yetkisiz denemeleri `[401]` koduyla `backend/logs/error.logs` dosyasına kaydeder.
- **`requireAdmin` & `/admin` Paneli:** Yalnızca `admin` rolündeki kullanıcıların `/admin` yönetim paneline erişmesine izin verir (`403 Forbidden` + `[403]` `error.logs` kaydı). Admin paneli üzerinden tüm kullanıcı rolleri (`admin`, `alumni`, `student`, `coordinator`, `employer`), bölümler, duyurular, iş ilanları ve başvurular yönetilebilir.

---

## 🗄️ Database, Migrations, Seeds & Domain Rules

Veritabanı tasarımı [ddd.md](ddd.md) dosyasındaki şemaya dayanmaktadır.

### 1. Veritabanı Migration Sistemi (`backend/migrations/`)
Uygulama açılışında ([`backend/src/config/migrate.js`](backend/src/config/migrate.js)), sıralı SQL migration dosyalarını otomatik olarak çalıştırır ve `migrations` tablosunda kayıt altına alarak dosyaların mükerrer çalışmasını engeller:
1. `001_create_departments.sql` — Akademik bölümler tablosu.
2. `002_create_users.sql` — Mezunlar / kullanıcılar tablosu (`department_id` FK).
3. `003_create_announcements.sql` — Duyurular tablosu (`author_id` FK).
4. `004_create_events.sql` — Etkinlikler tablosu (`organizer_id` FK).
5. `005_create_event_registrations.sql` — Etkinlik kayıt ara tablosu (`UNIQUE(event_id, user_id)`).
6. `006_create_job_postings.sql` — Kariyer ve iş fırsatları tablosu (`posted_by`, `department_id` FK).
7. `007_create_applications.sql` — İş başvuruları ara tablosu (`UNIQUE(job_posting_id, user_id)`, `CASCADE`).
8. `008_add_role_and_is_active_to_users.sql` — Kullanıcı rolleri (`admin`, `alumni`, `student`, `coordinator`, `employer`) ve hesap aktiflik (`is_active`) sütunları.
9. `009_add_password_hash_to_users.sql` — Güvenli parola saklama için `password_hash VARCHAR(255) NULL` sütunu.
10. `010_add_phone_and_linkedin_to_users.sql` — Kullanıcı profili ve ayarları için `phone VARCHAR(50) NULL` ve `linkedin_url VARCHAR(500) NULL` sütunları.

### 2. Factory ve Seed Altyapısı (`backend/seeds/`)
- **Factory Üreticileri ([`factories.js`](backend/seeds/factories.js)):** `departmentFactory`, `userFactory`, `announcementFactory`, `eventFactory`, `eventRegistrationFactory`, `jobPostingFactory`.
- **Veritabanı Tohumlama ([`index.js`](backend/seeds/index.js)):** Tüm tabloları bağımlılık sırasına göre gerçekçi verilerle doldurur ve mükerrer kayıt oluşumunu engeller (idempotent).
  ```bash
  # Docker container içinde seed çalıştırma
  docker compose exec app npm run seed

  # Yalnızca iş ilanlarını tohumlama
  docker compose exec app node seeds/index.js job_postings
  ```

### 3. Alan ve Doğrulama Kuralları (`ddd.md`)
Tüm varlıklar için veri bütünlüğü ve iş kuralları [`ddd.md`](ddd.md) (Bölüm 6) içerisinde tanımlanmıştır:
- **Ortak Kurallar:** Metinlerde `trim` temizliği, URL alanlarında yalnızca `http://` veya `https://` şeması, e-posta alanlarında küçük harf normalizasyonu, UTC zaman damgaları ve geçerli foreign key bütünlüğü.
- **`job_postings` Kuralları:** `title` zorunlu (boşluk temizlendikten sonra **3–120 karakter**), `company` zorunlu (2–150 karakter), `city` ve `description` opsiyonel, `employment_type` kısıtlı değer kümesi (`full-time`, `part-time`, `internship`, `contract`, `remote`), `deadline` için geçmiş tarih yasağı ve süresi dolmuş/pasif ilanlara başvuru engeli.
- **`applications` & Diğer Modüller:** Tekil başvuru kuralı (`UNIQUE(job_posting_id, user_id)`), kendi ilanına başvuru engeli, başvuru durum geçiş kuralları (`pending` -> `reviewed` / `interview` / `accepted` / `rejected`), `users`, `departments`, `announcements`, `events` ve kapasite kontrollü `event_registrations` kuralları.

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running with Docker Compose

1. Repoyu klonlayın ve proje dizinine geçin:
   ```bash
   git clone https://github.com/emely022/alumni.git
   cd alumni
   ```

2. Ortam değişkenlerini yapılandırın:
   > **Not:** Projeyi çalıştırmadan önce `.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurmak gerekir (`cp .env.example .env`).

3. Tüm servisleri (App + PostgreSQL) derleyin ve ayağa kaldırın:
   ```bash
   docker compose up --build
   ```

4. Veritabanına örnek test/tohum verilerini yükleyin:
   ```bash
   docker compose exec app npm run seed
   ```

### Web Arayüzü Bağlantıları

Konteynerler ayağa kalktıktan sonra tarayıcınızdan aşağıdaki adreslere erişebilirsiniz:

| Sayfa | URL | Açıklama |
|---|---|---|
| **Ana Sayfa** | [http://localhost:3000/](http://localhost:3000/) | Karşılama ve giriş yapmış kullanıcıya özel özet sayfası |
| **Giriş Yap (Login)** | [http://localhost:3000/login](http://localhost:3000/login) | E-posta ve şifre ile oturum açma sayfası |
| **Üyelik & Mezun Kaydı** | [http://localhost:3000/register](http://localhost:3000/register) | Rol seçimi ve şifreleme destekli kayıt sayfası |
| **Profilim (Profile)** | [http://localhost:3000/profile](http://localhost:3000/profile) | Giriş yapmış kullanıcının kişisel profil sayfası |
| **Ayarlar (Settings)** | [http://localhost:3000/settings](http://localhost:3000/settings) | Kişisel bilgi güncelleme ve şifre değiştirme sayfası |
| **Yönetim Paneli (Admin)** | [http://localhost:3000/admin](http://localhost:3000/admin) | `admin` rolüne özel kullanıcı/rol ve veri yönetim paneli |
| **Mezunlar** | [http://localhost:3000/users](http://localhost:3000/users) | Mezun profilleri ve ekleme formu |
| **Duyurular** | [http://localhost:3000/announcements](http://localhost:3000/announcements) | Kampüs duyuruları paneli |
| **İş İlanları** | [http://localhost:3000/job-postings](http://localhost:3000/job-postings) | Kariyer fırsatları ve ilan yayınlama |
| **İş Başvuruları** | [http://localhost:3000/applications](http://localhost:3000/applications) | İlan başvuruları ve durum takibi |
| **Generic 404 Sayfası** | [http://localhost:3000/404](http://localhost:3000/404) | Geçersiz rotaların yönlendirildiği 404 hata sayfası |
| **Hakkında** | [http://localhost:3000/about](http://localhost:3000/about) | Proje ve ekip bilgisi |

---

## 📚 Documentation & Guidelines

Tüm mimari, veri, kurumsal kimlik ve arayüz tasarım sistemi dokümanlarına aşağıdaki bağlantılardan erişebilirsiniz:

- 🏛️ **[Marka ve Kurumsal Kimlik Rehberi (`brand.md`)](brand.md)** — İstanbul Üniversitesi resmi kurumsal kimliği, renk paleti (lacivert, altın sarısı, bordo), Beyazıt Kapısı logo standartları ve tipografi hiyerarşisi.
- 🎨 **[Tasarım Sistemi ve UI Rehberi (`design.md`)](design.md)** — Letters stilinden esinlenen koyu yeşil zemin (`#214539`), sarı aksiyon butonları (`#F5BA13`), beyaz kartlar (`#FFFFFF`), Arial tipografi ve WCAG AA (en az 4.5:1) kontrast kurallarını içeren modern arayüz sistemi.
- 📐 **[Veri Tasarım Dokümanı (`ddd.md`)](ddd.md)** — PostgreSQL ilişkisel veri tabanı şeması, ER diyagramı, foreign key kısıtları ve varlık iş/doğrulama kuralları.
- 🔗 **[Swagger UI API Dokümantasyonu](http://localhost:3000/api/swagger)** — Tüm RESTful ve nested API uç noktalarını interaktif olarak test etme arayüzü (`/api/swagger`).
