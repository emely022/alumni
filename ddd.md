# 📊 Alumni Tracking System - Veri Tasarım Dokümanı (Data Design Documentation - DDD)

Bu doküman, **Alumni Tracking System** projesinin ilişkisel veri tabanı şemasının (PostgreSQL) ilk mimari taslağını sunmaktadır.

---

## 1. 🎯 Dokümanın Amacı ve Statüsü

- **Amaç:** Mevcut durumda bellek üzerinde (in-memory) bağımsız olarak çalışan veri yapılarını (`userModel.js`, `announcementModel.js`), gerçek dünya ilişkisel veritabanı (RDBMS - PostgreSQL) standartlarına uyumlu hale getirmek, veri bütünlüğünü garanti altına almak ve gelecekteki veritabanı entegrasyonu için rehber oluşturmaktır.
- **Statü:** **İlk Taslak (Draft v0.1)**. Sistemin tüm bileşenlerini kapsama iddiasında değildir; temel varlıkları ve bu varlıklar arasındaki ilişkileri detaylı ve tutarlı biçimde ortaya koymayı amaçlar.

---

## 2. 🔍 Kapsam (Scope)

Mevcut projede yer alan modeller ve bunları destekleyen temel işlevsel tablolar ele alınmıştır:

1. **`users` (Mezunlar / Kullanıcılar):** Mevcut `userModel.js` ile birebir uyumlu temel kullanıcı ve mezun varlığı.
2. **`announcements` (Duyurular):** Mevcut `announcementModel.js` ile birebir uyumlu duyuru ve haber varlığı.
3. **`departments` (Bölümler):** Mezunların ve öğrencilerin mezun oldukları akademik birimleri normalize eden tamamlayıcı varlık.
4. **`events` (Etkinlikler):** Mezun buluşmaları, seminerler, paneller ve kariyer günlerini yöneten etkinlik varlığı.
5. **`event_registrations` (Etkinlik Kayıtları):** Mezunların etkinliklere katılım durumlarını takip eden çoka-çok (N-N) ilişki bağlayıcı varlığı.

---

## 3. 📑 Tablo ve Alan Tanımları (Data Dictionary)

### 3.1. `departments` (Bölümler Tablosu)
Üniversite bünyesindeki akademik birimleri ve fakülteleri temsil eder.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz bölüm kimlik numarası |
| `name` | `VARCHAR(100)` | Zorunlu | `NOT NULL`, `UNIQUE` | Bölümün tam adı (Örn: "Bilgisayar Mühendisliği") |
| `code` | `VARCHAR(20)` | Zorunlu | `NOT NULL`, `UNIQUE` | Bölüm kısa kodu (Örn: "CENG", "IE") |
| `faculty` | `VARCHAR(100)` | Zorunlu | `NOT NULL` | Bağlı olduğu fakülte (Örn: "Mühendislik Fakültesi") |
| `created_at` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Kaydın sisteme eklenme zamanı |

---

### 3.2. `users` (Mezunlar / Kullanıcılar Tablosu)
Sistemdeki mezunların kişisel ve akademik bilgilerini tutar. `userModel.js` modeli ile tam uyumludur.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz mezun kimlik numarası (`userModel.js` `id`) |
| `name` | `VARCHAR(100)` | Zorunlu | `NOT NULL` | Mezunun ad ve soyadı (`userModel.js` `name`) |
| `email` | `VARCHAR(255)` | Zorunlu | `NOT NULL`, `UNIQUE` | Mezunun benzersiz e-posta adresi (`userModel.js` `email`) |
| `department_id` | `INTEGER` | Opsiyonel | `FOREIGN KEY` ➔ `departments(id)` `ON DELETE SET NULL` | Mezunun bağlı olduğu bölümün referansı |
| `department` | `VARCHAR(100)` | Opsiyonel | `NULL` | Geriye dönük uyumluluk ve serbest metin alanı (`userModel.js` `department`) |
| `graduation_year` | `INTEGER` | Zorunlu | `NOT NULL`, `CHECK (graduation_year BETWEEN 1950 AND 2100)` | Mezuniyet yılı (`userModel.js` `graduationYear`) |
| `created_at` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Kayıt tarihi (`userModel.js` `createdAt`) |
| `updated_at` | `TIMESTAMPTZ` | Opsiyonel | `NULL` | Son güncellenme tarihi (`userModel.js` `updatedAt`) |

---

### 3.3. `announcements` (Duyurular Tablosu)
Üniversite veya mezunlar ofisi tarafından yayınlanan duyuru ve haberleri saklar. `announcementModel.js` ile tam uyumludur.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz duyuru kimlik numarası (`announcementModel.js` `id`) |
| `title` | `VARCHAR(255)` | Zorunlu | `NOT NULL` | Duyuru başlığı (`announcementModel.js` `title`) |
| `content` | `TEXT` | Zorunlu | `NOT NULL` | Duyurunun detaylı metni (`announcementModel.js` `content`) |
| `category` | `VARCHAR(50)` | Zorunlu | `NOT NULL`, `DEFAULT 'Genel'` | Kategori (Örn: Etkinlik, Kariyer, Burs - `announcementModel.js` `category`) |
| `author` | `VARCHAR(100)` | Zorunlu | `NOT NULL`, `DEFAULT 'Yönetim'` | Duyuruyu yayınlayan birim veya yetkili metni (`announcementModel.js` `author`) |
| `author_id` | `INTEGER` | Opsiyonel | `FOREIGN KEY` ➔ `users(id)` `ON DELETE SET NULL` | Duyuruyu sisteme giren mezun/yetkili kullanıcı referansı |
| `date` | `DATE` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_DATE` | Duyuru yayın tarihi (`announcementModel.js` `date`) |
| `created_at` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Oluşturulma zaman damgası (`announcementModel.js` `createdAt`) |
| `updated_at` | `TIMESTAMPTZ` | Opsiyonel | `NULL` | Son güncelleme zaman damgası (`announcementModel.js` `updatedAt`) |

---

### 3.4. `events` (Etkinlikler Tablosu)
Düzenlenen mezun buluşmaları, seminerler, atölyeler ve etkinlikleri temsil eder.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz etkinlik kimlik numarası |
| `title` | `VARCHAR(255)` | Zorunlu | `NOT NULL` | Etkinlik başlığı |
| `description` | `TEXT` | Zorunlu | `NOT NULL` | Etkinlik açıklaması ve programı |
| `location` | `VARCHAR(255)` | Zorunlu | `NOT NULL` | Fiziksel mekan (Örn: "Ana Kampüs Oditoryum") veya sanal toplantı linki |
| `event_date` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL` | Etkinliğin gerçekleşeceği tarih ve saat |
| `capacity` | `INTEGER` | Opsiyonel | `CHECK (capacity > 0)` | Maksimum katılımcı kontenjanı |
| `organizer_id` | `INTEGER` | Opsiyonel | `FOREIGN KEY` ➔ `users(id)` `ON DELETE SET NULL` | Etkinliği organize eden mezun veya yönetici |
| `created_at` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Oluşturulma tarihi |
| `updated_at` | `TIMESTAMPTZ` | Opsiyonel | `NULL` | Son güncelleme tarihi |

---

### 3.5. `event_registrations` (Etkinlik Kayıtları / Katılım Tablosu)
Mezunların etkinliklere kayıtlarını ve katılım durumlarını tutan ara (junction) tablodur.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz kayıt numarası |
| `event_id` | `INTEGER` | Zorunlu | `FOREIGN KEY` ➔ `events(id)` `ON DELETE CASCADE` | Kayıt olunan etkinlik |
| `user_id` | `INTEGER` | Zorunlu | `FOREIGN KEY` ➔ `users(id)` `ON DELETE CASCADE` | Kayıt olan mezun |
| `registration_date` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Kayıt oluşturulma zamanı |
| `status` | `VARCHAR(30)` | Zorunlu | `NOT NULL`, `DEFAULT 'registered'`, `CHECK (status IN ('registered', 'attended', 'cancelled'))` | Katılım durumu (`registered`: Kayıtlı, `attended`: Katıldı, `cancelled`: İptal) |
| - | - | - | `UNIQUE (event_id, user_id)` | Bir mezunun aynı etkinliğe mükerrer kayıt yapmasını engeller |

---

## 4. 🔗 Tablolar Arası İlişkiler (Entity Relationships)

Sistemdeki varlıklar arasındaki ana ilişkiler ve foreign key mekanizmaları aşağıda açıklanmıştır:

1. **`departments` ➔ `users` (Bire-Çok / 1:N):**
   - Her bölümün bünyesinde birden çok mezun bulunabilir (`1:N`).
   - Bir mezun tek bir bölüme aittir (`users.department_id ➔ departments.id`).
   - Bölüm silindiğinde mezun kaydının silinmemesi için `ON DELETE SET NULL` stratejisi benimsenmiştir.

2. **`users` ➔ `announcements` (Bire-Çok / 1:N):**
   - Bir yetkili/mezun birden çok duyuru yayınlayabilir (`1:N`).
   - Duyuru tablosundaki `author_id` alanı, duyuruyu oluşturan kullanıcıyı referans alır.
   - Kullanıcı silinse dahi kamuya açık duyurunun sistemde kalması için `ON DELETE SET NULL` uygulanır; `author` metin alanı korunur.

3. **`users` ➔ `events` (Bire-Çok / 1:N - Organizatörlük):**
   - Bir mezun veya yetkili birden fazla etkinliği organize edebilir (`1:N`).
   - `events.organizer_id ➔ users.id` ilişkisiyle organizatör belirlenir.
   - Organizatör silindiğinde etkinlik varlığını korur (`ON DELETE SET NULL`).

4. **`users` ➔ `events` (Çoka-Çok / N:N - Katılım İlişkisi):**
   - Bir mezun birden çok etkinliğe katılabilir; bir etkinliğe birden çok mezun kayıt olabilir (`N:N`).
   - Bu çoka-çok ilişki `event_registrations` ara tablosu ile normalize edilmiştir.
   - Etkinlik veya kullanıcı silindiğinde, ilişkili katılım kaydının anlamsızlaşmaması için `ON DELETE CASCADE` kuralı uygulanır.
   - `UNIQUE(event_id, user_id)` kısıtı ile mükerrer kayıtlar engellenir.

---

## 5. 🗺️ Varlık Bağıntı Diyagramı (Mermaid ER Diagram)

```mermaid
erDiagram
    DEPARTMENTS ||--o{ USERS : "has members"
    USERS ||--o{ ANNOUNCEMENTS : "authors"
    USERS ||--o{ EVENTS : "organizes"
    USERS ||--o{ EVENT_REGISTRATIONS : "registers to"
    EVENTS ||--o{ EVENT_REGISTRATIONS : "has participants"

    DEPARTMENTS {
        int id PK
        string name "UNIQUE"
        string code "UNIQUE"
        string faculty
        timestamptz created_at
    }

    USERS {
        int id PK
        string name
        string email "UNIQUE"
        int department_id FK
        string department
        int graduation_year
        timestamptz created_at
        timestamptz updated_at
    }

    ANNOUNCEMENTS {
        int id PK
        string title
        text content
        string category
        string author
        int author_id FK
        date date
        timestamptz created_at
        timestamptz updated_at
    }

    EVENTS {
        int id PK
        string title
        text description
        string location
        timestamptz event_date
        int capacity
        int organizer_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    EVENT_REGISTRATIONS {
        int id PK
        int event_id FK
        int user_id FK
        string status
        timestamptz registration_date
    }
```

---

## 6. 📌 Varsayımlar ve İleride Genişletilecek Alanlar

1. **Kimlik Doğrulama ve Güvenlik (Auth & Password Hashing):**
   - Mevcut taslak şemada şifre (`password_hash`) alanı henüz dahil edilmemiştir.
   - İlerleyen aşamalarda `users` tablosuna `password_hash VARCHAR(255)`, `role VARCHAR(30)` (Örn: `ADMIN`, `ALUMNI`, `STUDENT`) ve `is_active BOOLEAN` alanları eklenecektir.

2. **Kariyer ve Mentorluk Modülü:**
   - Mezunların iş ilanları paylaşabilmesi için `jobs` ve `job_applications` tabloları tasarlanabilir.
   - Yeni mezunlar ile kıdemli mezunlar arasında eşleşme sağlamak için `mentorships` tablosu eklenebilir.

3. **İletişim ve Gizlilik Tercihleri:**
   - Mezunların e-posta veya profil bilgilerinin diğer kullanıcılara açık olup olmayacağını yöneten `privacy_settings` alanı eklenebilir.

4. **Veritabanı İndeksleme Stratejisi (Indexes):**
   - Sık sorgulanan alanlarda B-Tree indeksler planlanacaktır:
     - `CREATE INDEX idx_users_email ON users(email);`
     - `CREATE INDEX idx_announcements_date ON announcements(date DESC);`
     - `CREATE INDEX idx_events_date ON events(event_date ASC);`

5. **In-Memory'den PostgreSQL'e Geçiş Stratejisi:**
   - Projede `pg.Pool` altyapısı [`backend/src/config/db.js`](backend/src/config/db.js) dosyasında hazır bulunmaktadır.
   - Migration aracı (Knex, Prisma veya düz `.sql` scriptleri) belirlendikten sonra bu şema otomatik tablolar olarak ayağa kaldırılacaktır.
