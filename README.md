# 🎓 Alumni Tracking System

## 📖 Project Overview

This repository holds a semester-long project for the **Web Programming** course: an Alumni Tracking System that keeps graduates connected with their school or university — letting them stay in touch, follow community updates, and find out about upcoming events.

The project grows week by week, following the course structure — starting with basic routing, then moving into CRUD operations, database integration, authentication, and eventually deployment — with every step reflected in this repo's commit history.

## ✨ Features

- **Alumni Profiles** — create and view alumni profiles.
- **Contact Directory** — search and view contact information of other alumni.
- **Event Announcements** — see upcoming alumni events and announcements.

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Node.js (JavaScript) | Fast to build with, large ecosystem, works well with async I/O for a CRUD-style API. |
| Database | PostgreSQL | Reliable relational database with strong support for structured, related data (users, profile information, events, contact information). |
| Frontend | JavaScript, HTML/CSS | Simple, dependency-light way to build the interface while the project is early-stage. |
| DevOps | Docker & Docker Compose | Ensures the project runs the same way on any machine, avoids "works on my machine" issues. |
| Version Control | Git & GitHub | Required by the course; weekly commit history is part of the grading. |

## 📂 Project Structure

```text
alumni/
├── backend/
│   ├── src/
│   │   ├── config/           # Database and Swagger configurations
│   │   ├── controllers/      # Request handlers (homeController, userController, apiUserController, announcementController, apiAnnouncementController)
│   │   ├── models/           # In-memory data models (userModel.js, announcementModel.js)
│   │   ├── routes/           # Modular route definitions (index.js, userRoutes.js, apiUserRoutes.js, announcementRoutes.js, apiAnnouncementRoutes.js)
│   │   ├── views/            # HTML View templates (userView.js, announcementView.js - SSR markup and forms)
│   │   └── index.js          # Application entrypoint
│   └── package.json
├── frontend/
│   └── public/                # Static UI files (to be built out)
├── .env.example                # Template for environment variables
├── .dockerignore
├── docker-compose.yml          # Orchestration for app + PostgreSQL
├── Dockerfile
└── README.md
```

> This structure reflects the target layout for the project. Folders not yet populated are placeholders for upcoming weeks.

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
                      │  ├── userRoutes.js     │
                      │  ├── apiUserRoutes.js  │
                      │  ├── announcementRoutes.js
                      │  └── apiAnnouncementRoutes.js
                      └───────────┬────────────┘
                                  │
                                  ▼
                      ┌────────────────────────┐
                      │       Controller       │
                      │  (İş Mantığı & Akış)   │
                      │(backend/src/controllers)│
                      │  ├── homeController    │
                      │  ├── userController / apiUserController
                      │  └── announcementController / apiAnnouncementController
                      └───────┬────────┬───────┘
                              │        │
             Veri Okuma/Yazma │        │ Şablon Render & Yanıt
                              ▼        ▼
┌───────────────────────────────┐    ┌───────────────────────────────┐
│             Model             │    │             View              │
│  - In-Memory User Model       │    │  - HTML Views (userView.js,   │
│  - In-Memory Announcement Model│   │    announcementView.js)       │
│    (backend/src/models/)      │    │  - JSON Response (REST API)   │
│  - PostgreSQL Pool (config/db)│    │  - Swagger UI (/api/swagger)  │
└───────────────────────────────┘    └───────────────────────────────┘
```

### 1. 🔀 Routing Katmanı (`backend/src/routes/`)
Yönlendirme katmanı modüler bir yapıda tasarlanmıştır:
- **[`index.js`](backend/src/routes/index.js) (Ana Yönlendirici):** Genel sayfa ve servis rotalarını (`/`, `/about`, `/api/health`, `/hello`, `/sum`) barındırır ve `/users`, `/api/users`, `/announcements` ve `/api/announcements` alt router'larını sisteme bağlar (`router.use`).
- **[`userRoutes.js`](backend/src/routes/userRoutes.js) (Mezunlar Web Router):** `/users` altındaki web CRUD rotalarını (`GET /`, `POST /`, `GET /:id`, `GET /:id/edit`, `POST /:id/update`, `POST /:id/delete`) `UserController`'a yönlendirir.
- **[`apiUserRoutes.js`](backend/src/routes/apiUserRoutes.js) (Mezunlar REST API Router):** `/api/users` altındaki saf JSON CRUD rotalarını (`GET /`, `POST /`, `GET /:id`, `PUT /:id`, `PATCH /:id`, `DELETE /:id`) `ApiUserController`'a yönlendirir.
- **[`announcementRoutes.js`](backend/src/routes/announcementRoutes.js) (Duyurular Web Router):** `/announcements` altındaki web CRUD rotalarını (`GET /`, `POST /`, `GET /:id`, `GET /:id/edit`, `POST /:id/update`, `POST /:id/delete`) `AnnouncementController`'a yönlendirir.
- **[`apiAnnouncementRoutes.js`](backend/src/routes/apiAnnouncementRoutes.js) (Duyurular REST API Router):** `/api/announcements` altındaki saf JSON CRUD rotalarını (`GET /`, `POST /`, `GET /:id`, `PUT /:id`, `PATCH /:id`, `DELETE /:id`) `ApiAnnouncementController`'a yönlendirir.
- **Swagger / OpenAPI:** Her router dosyasında ilgili route tanımlarının üzerindeki JSDoc `@swagger` blokları `backend/src/config/swagger.js` tarafından otomatik olarak taranır ve `/api/swagger` arayüzünde birleştirilir.

### 2. 🎮 Controller Katmanı (`backend/src/controllers/`)
Uygulamanın iş mantığının (business logic), gelen istek parametrelerinin (`req.params`, `req.body`) doğrulanmasının ve HTTP durum kodlarının (200, 201, 302, 400, 404) yönetildiği katmandır.
- **[`homeController.js`](backend/src/controllers/homeController.js):**
  - Web tarayıcısı için Ana Sayfa (`/`) ve Hakkında (`/about`) HTML görünümlerini üretir.
  - Basit servis ve hesaplama endpoint'lerini (`/hello`, `/hello/:name`, `/sum/:number1/:number2`) yönetir.
  - Uygulama çalışma süresi ve veritabanı bağlantı durumunu kontrol eden `/api/health` JSON endpoint'ini sağlar.
- **[`apiUserController.js`](backend/src/controllers/apiUserController.js) & [`apiAnnouncementController.js`](backend/src/controllers/apiAnnouncementController.js) (REST API Katmanı):**
  - Saf JSON formatında çalışan RESTful API denetleyicileridir (`/api/users`, `/api/announcements`).
  - Tüm CRUD operasyonlarını (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) ilgili in-memory model üzerinden yürütür.
  - PUT için tam güncelleme, PATCH için kısmi güncelleme doğrulaması yapar; uygun HTTP durum kodları (200, 201, 400, 404) döner.
- **[`userController.js`](backend/src/controllers/userController.js) & [`announcementController.js`](backend/src/controllers/announcementController.js) (Web Controller Katmanı):**
  - Model ve Görünüm (View) arasında köprü görevi görerek web üzerindeki tüm CRUD akışını yönetir.
  - `GET /` (Listeleme): Verileri modelden çekip ilgili View şablonuyla tarayıcıya sunar.
  - `POST /` (Oluşturma): Formdan gelen verileri ekleyip `302 Found` ile listeye yönlendirir (`res.redirect`).
  - `GET /:id/edit` (Düzenleme Formu): Önceden doldurulmuş düzenleme formunu sunar.
  - `POST /:id/update` (Güncelleme): Güncellenen verileri model üzerinden işleyip listeye yönlendirir.
  - `POST /:id/delete` (Silme): Kaydı silip listeye yönlendirir.
  - `GET /:id` (Detay): Kaydın detay sayfasını veya 404 sayfasını render eder.

### 3. 📦 Model Katmanı (`backend/src/models/` & Veri Yönetimi)
Verinin saklanması, iş kurallarına göre modellenmesi, sorgulanması ve manipülasyonundan sorumlu katmandır.
- **In-Memory Modeller ([`userModel.js`](backend/src/models/userModel.js), [`announcementModel.js`](backend/src/models/announcementModel.js)):**
  - Ders gereksinimi doğrultusunda ("do not database" kuralı), veritabanı bağlantısı olmadan bellek üzerinde (in-memory) bağımsız veri dizileriyle çalışır.
  - `findAll()`, `findById(id)`, `create(data)`, `replace(id, data)`, `update(id, partialData)` ve `remove(id)` fonksiyonları ile tam teşekküllü CRUD operasyonları sağlar.
  - Başlangıç tohum verileri (seed data) ile hazır gelir.
  - Veri yönetimini controller katmanından tamamen soyutlayarak MVC mimarisine tam uyum sağlar.
- **Veritabanı Altyapısı (PostgreSQL):** [`backend/src/config/db.js`](backend/src/config/db.js) dosyasında Docker üzerindeki PostgreSQL servisine bağlanan `pg.Pool` bağlantı havuzu ve yeniden deneme mekanizmalı bağlantı testi hazırdır.
- **Veri Tasarımı:** Veri yapısı ve şema detayları için bkz. [ddd.md](ddd.md).
- **Veritabanı Migration Sistemi:** Uygulama açılışında ([`backend/src/config/migrate.js`](backend/src/config/migrate.js)), [`backend/migrations/`](backend/migrations/) klasöründeki sıralı SQL dosyalarını (`001_create_departments.sql`, `002_create_users.sql`, vb.) otomatik olarak çalıştırır. Çalıştırılan migration'lar `migrations` tablosunda kayıt altına alınarak aynı dosyanın mükerrer çalışması engellenir.

### 4. 👁️ View Katmanı (`backend/src/views/` - Görünüm ve Kullanıcı Arayüzü)
Kullanıcıya veya istemciye sunulan çıktının oluşturulduğu bağımsız katmandır:
- **[`userView.js`](backend/src/views/userView.js) & [`announcementView.js`](backend/src/views/announcementView.js):**
  - Liste ve oluşturma formu sayfaları (`renderUsersPage`, `renderAnnouncementsPage`).
  - Düzenleme formu sayfaları (`renderEditUserPage`, `renderEditAnnouncementPage`).
  - Detay kart sayfaları (`renderUserProfilePage`, `renderAnnouncementDetailPage`).
  - 404 bulunamadı sayfaları (`renderUserNotFoundPage`, `renderAnnouncementNotFoundPage`).
- **JSON API Yanıtları:** `/api/users`, `/api/announcements` ve `/api/health` gibi REST endpoint'lerinde veriler doğrudan standart JSON formatında döner.
- **İnteraktif Arayüz (Swagger UI):** [`/api/swagger`](http://localhost:3000/api/swagger) adresi üzerinden tüm API endpoint'lerini listeleyen ve doğrudan tarayıcı üzerinden test etmeye imkan veren etkileşimli dokümantasyon arayüzüdür.

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running with Docker Compose

1. Clone the repository and move into the project folder:
   ```bash
   git clone https://github.com/emely022/alumni.git
   cd alumni
   ```

2. Ortam değişkenlerini yapılandırın:
   > **Not:** Projeyi çalıştırmadan önce `.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurmak gerekir (`cp .env.example .env`).

3. Build and start all containers with a single command:
   ```bash
   docker compose up
   ```

   A few other useful variants:
   ```bash
   docker compose up -d        # start containers in the background
   docker compose up --build   # force a rebuild before starting
   docker compose down         # stop containers and remove them
   ```

## 📚 API Documentation

API dokümantasyonuna [http://localhost:3000/api/swagger](http://localhost:3000/api/swagger) adresinden erişilebilir. Tüm endpoint'ler interaktif olarak görüntülenebilir ve doğrudan Swagger UI üzerinden test edilebilir.

