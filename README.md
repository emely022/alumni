# 🎓 Alumni Tracking System

## 📖 Project Overview

This repository holds a semester-long project for the **Web Programming** course: an Alumni Tracking System that keeps graduates connected with their school or university — letting them stay in touch, follow community updates, discover career opportunities, and find out about upcoming events.

The project grows week by week, following the course structure — starting with basic routing, then moving into CRUD operations, database integration, relational schema design, authentication, and eventually deployment — with every step reflected in this repo's commit history.

## ✨ Features

- **Alumni Profiles & Directory** — create, update, search, and view alumni profiles and graduation details.
- **Academic Departments** — manage faculties and academic departments linked to students and job opportunities.
- **Event Announcements** — publish, view, and organize alumni events and campus announcements.
- **Event Registrations** — RSVP and track event attendance with attendee status (registered, attended, cancelled).
- **Career & Job Postings** — publish, browse, and filter job/internship postings with company, location, employment type, salary range, and target department.
- **Job Applications** — submit and track applications with resume links, cover notes, and multi-stage status tracking (pending, reviewed, interview, accepted, rejected).
- **Interactive Swagger Documentation** — explore and test all RESTful and nested endpoints via Swagger UI at `/api/swagger`.
- **Server-Side Rendered Web UI** — user-friendly, responsive HTML interface for managing users, announcements, job postings, and applications.

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js & Express.js | Fast to build with, large ecosystem, async I/O well-suited for RESTful and MVC web services. |
| Database | PostgreSQL 16 | Reliable relational database with robust support for foreign keys, cascade rules, checks, unique constraints, and indexes. |
| Migration & Seeding | Custom Migration Runner & Factory-based Seeder | Sequential SQL migrations (`backend/migrations/`) with automatic tracking and idempotent seeding (`backend/seeds/`). |
| Frontend / Views | Server-Side Rendered (SSR) HTML/CSS | Dependency-light, responsive, accessible MVC views with form validation, alerts, and badges. |
| API Docs | OpenAPI 3.0 & Swagger UI | Auto-generated interactive API docs (`/api/swagger`) via `swagger-jsdoc` and `swagger-ui-express`. |
| DevOps | Docker & Docker Compose | Multi-container setup (Node.js backend + PostgreSQL db) ensuring cross-platform reproducibility. |
| Version Control | Git & GitHub | Semester-long weekly progression reflected in clean commit history. |

## 📂 Project Structure

```text
alumni/
├── backend/
│   ├── migrations/                  # Sequential SQL migration files
│   │   ├── 001_create_departments.sql
│   │   ├── 002_create_users.sql
│   │   ├── 003_create_announcements.sql
│   │   ├── 004_create_events.sql
│   │   ├── 005_create_event_registrations.sql
│   │   ├── 006_create_job_postings.sql
│   │   └── 007_create_applications.sql
│   ├── seeds/                       # Database seeder and factory generators
│   │   ├── factories.js             # Entity factories (Department, User, JobPosting, etc.)
│   │   └── index.js                 # Database seeder script (npm run seed)
│   ├── src/
│   │   ├── config/                  # Database pool, migrations runner, and Swagger config
│   │   │   ├── db.js
│   │   │   ├── migrate.js
│   │   │   └── swagger.js
│   │   ├── controllers/             # MVC Web & REST API controllers
│   │   │   ├── homeController.js
│   │   │   ├── userController.js & apiUserController.js
│   │   │   ├── announcementController.js & apiAnnouncementController.js
│   │   │   ├── jobPostingController.js & apiJobPostingController.js
│   │   │   ├── applicationController.js & apiApplicationController.js
│   │   │   ├── apiDepartmentController.js
│   │   │   ├── apiEventController.js
│   │   │   └── apiEventRegistrationRoutes.js
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
│   │   │   ├── index.js             # Main router
│   │   │   ├── userRoutes.js & apiUserRoutes.js
│   │   │   ├── announcementRoutes.js & apiAnnouncementRoutes.js
│   │   │   ├── jobPostingRoutes.js & apiJobPostingRoutes.js
│   │   │   ├── applicationRoutes.js & apiApplicationRoutes.js
│   │   │   ├── apiDepartmentRoutes.js
│   │   │   ├── apiEventRoutes.js
│   │   │   └── apiEventRegistrationRoutes.js
│   │   ├── views/                   # Server-side HTML View templates
│   │   │   ├── userView.js
│   │   │   ├── announcementView.js
│   │   │   ├── jobPostingView.js
│   │   │   └── applicationView.js
│   │   └── index.js                 # Application entrypoint
│   └── package.json
├── .env.example                     # Environment variables template
├── .gitignore                       # Excludes .env and node_modules
├── docker-compose.yml               # PostgreSQL db + Node app orchestration
├── Dockerfile                       # Backend container image
├── ddd.md                           # Domain-driven data architecture & ER diagram
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
                      │    Express Router      │
                      │ (backend/src/routes/)  │
                      │  ├── index.js          │
                      │  ├── userRoutes.js / apiUserRoutes.js
                      │  ├── announcementRoutes.js / apiAnnouncementRoutes.js
                      │  ├── jobPostingRoutes.js / apiJobPostingRoutes.js
                      │  └── applicationRoutes.js / apiApplicationRoutes.js
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │       Controller       │
                      │  (İş Mantığı & Akış)   │
                      │(backend/src/controllers)│
                      │  ├── homeController    │
                      │  ├── userController / apiUserController
                      │  ├── announcementController / apiAnnouncementController
                      │  ├── jobPostingController / apiJobPostingController
                      │  └── applicationController / apiApplicationController
                      └───────┬────────┬───────┘
                              │        │
             Veri Okuma/Yazma │        │ Şablon Render & Yanıt
                              ▼        ▼
┌───────────────────────────────┐    ┌───────────────────────────────┐
│             Model             │    │             View              │
│  - PostgreSQL Models:         │    │  - HTML Views:                │
│    * UserModel,               │    │    * userView.js              │
│    * DepartmentModel,         │    │    * announcementView.js      │
│    * JobPostingModel,         │    │    * jobPostingView.js        │
│    * ApplicationModel,        │    │    * applicationView.js       │
│    * EventModel,              │    │  - JSON REST API Responses    │
│    * EventRegistrationModel   │    │  - Swagger UI (/api/swagger)  │
│  - PostgreSQL Pool (config/db)│    │                               │
└───────────────────────────────┘    └───────────────────────────────┘
```

### 1. 🔀 Routing Katmanı (`backend/src/routes/`)
Yönlendirme katmanı modüler bir yapıda tasarlanmıştır:
- **[`index.js`](backend/src/routes/index.js) (Ana Yönlendirici):** Genel sayfa ve servis rotalarını (`/`, `/about`, `/api/health`, `/hello`, `/sum`) barındırır ve Web ile REST API alt router'larını sisteme bağlar (`router.use`).
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

### 4. 👁️ View Katmanı (`backend/src/views/`)
Kullanıcıya veya istemciye sunulan çıktının oluşturulduğu bağımsız sunucu taraflı şablonlama (SSR) katmandır:
- **[`userView.js`](backend/src/views/userView.js):** Mezunlar listesi, profili, düzenleme ve 404 sayfaları.
- **[`announcementView.js`](backend/src/views/announcementView.js):** Duyurular paneli, detay, düzenleme ve 404 sayfaları.
- **[`jobPostingView.js`](backend/src/views/jobPostingView.js):** İş ilanları listesi, yeni ilan formu, zengin ilan detay kartı (başvuran adaylar listesiyle) ve düzenleme formu.
- **[`applicationView.js`](backend/src/views/applicationView.js):** İş başvuruları takip paneli, dinamik ilan/aday seçimli başvuru yapma formu, başvuru detay kartı ve durum güncelleme formu.

---

## 🗄️ Database, Migrations & Seeds

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

### 2. Factory ve Seed Altyapısı (`backend/seeds/`)
- **Factory Üreticileri ([`factories.js`](backend/seeds/factories.js)):** `departmentFactory`, `userFactory`, `announcementFactory`, `eventFactory`, `eventRegistrationFactory`, `jobPostingFactory`.
- **Veritabanı Tohumlama ([`index.js`](backend/seeds/index.js)):** Tüm tabloları bağımlılık sırasına göre gerçekçi verilerle doldurur ve mükerrer kayıt oluşumunu engeller (idempotent).
  ```bash
  # Docker container içinde seed çalıştırma
  docker compose exec app npm run seed

  # Yalnızca iş ilanlarını tohumlama
  docker compose exec app node seeds/index.js job_postings
  ```

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
| **Ana Sayfa** | [http://localhost:3000/](http://localhost:3000/) | Karşılama ve yönlendirme sayfası |
| **Mezunlar** | [http://localhost:3000/users](http://localhost:3000/users) | Mezun profilleri ve ekleme formu |
| **Duyurular** | [http://localhost:3000/announcements](http://localhost:3000/announcements) | Kampüs duyuruları paneli |
| **İş İlanları** | [http://localhost:3000/job-postings](http://localhost:3000/job-postings) | Kariyer fırsatları ve ilan yayınlama |
| **İş Başvuruları** | [http://localhost:3000/applications](http://localhost:3000/applications) | İlan başvuruları ve durum takibi |
| **Hakkında** | [http://localhost:3000/about](http://localhost:3000/about) | Proje ve ekip bilgisi |

---

## 📚 API Documentation

Tüm REST API ve Nested uç noktaları interaktif olarak görüntülemek ve tarayıcı üzerinden test etmek için:

🔗 **Swagger UI:** [http://localhost:3000/api/swagger](http://localhost:3000/api/swagger)
