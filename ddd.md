# 📊 Alumni Tracking System - Veri Tasarım Dokümanı (Data Design Documentation - DDD)

Bu doküman, **Alumni Tracking System** projesinin PostgreSQL ilişkisel veri tabanı şemasını, tablolar arası ilişkileri ve iş/doğrulama kurallarını sunmaktadır.

---

## 1. 🎯 Dokümanın Amacı ve Statüsü

- **Amaç:** Sistemdeki tüm varlıkların (`departments`, `users`, `announcements`, `events`, `event_registrations`, `job_postings`, `applications`) PostgreSQL ilişkisel veritabanı (RDBMS) şema standartlarını, referans bütünlüğünü, sıralı SQL migration (`backend/migrations/`), seed (`backend/seeds/`) ve alan doğrulama kurallarını (domain rules) tek merkezde dokümante etmektir.
- **Statü:** **Güncel Mimari & Domain Tasarımı (v1.0)**. Tüm çekirdek tablolar PostgreSQL migration scriptleri, veri modelleri (`backend/src/models/`) ve doğrulama kuralları (Bölüm 6) ile birlikte tanımlanmıştır.

---

## 2. 🔍 Kapsam (Scope)

Mevcut projede yer alan modeller ve bunları destekleyen temel işlevsel tablolar ele alınmıştır:

1. **`users` (Mezunlar / Kullanıcılar):** Mevcut `userModel.js` ile birebir uyumlu temel kullanıcı ve mezun varlığı.
2. **`announcements` (Duyurular):** Mevcut `announcementModel.js` ile birebir uyumlu duyuru ve haber varlığı.
3. **`departments` (Bölümler):** Mezunların ve öğrencilerin mezun oldukları akademik birimleri normalize eden tamamlayıcı varlık.
4. **`events` (Etkinlikler):** Mezun buluşmaları, seminerler, paneller ve kariyer günlerini yöneten etkinlik varlığı.
5. **`event_registrations` (Etkinlik Kayıtları):** Mezunların etkinliklere katılım durumlarını takip eden çoka-çok (N-N) ilişki bağlayıcı varlığı.
6. **`job_postings` (İş İlanları):** Mezunların ve paydaş kurumların staj, tam zamanlı veya yarı zamanlı kariyer fırsatlarını paylaştığı iş ilanları varlığı.
7. **`applications` (İş Başvuruları):** Mezunların sistemdeki iş ilanlarına yaptıkları başvuruları, durumlarını (beklemede, incelendi, mülakat, kabul, red) ve özgeçmiş bilgilerini takip eden çoka-çok (N-N) ilişki bağlayıcı varlığı.

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

### 3.6. `job_postings` (İş İlanları Tablosu)
Mezunlar ve işverenler tarafından paylaşılan iş, staj ve proje bazlı kariyer fırsatlarını saklar.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz iş ilanı kimlik numarası |
| `title` | `VARCHAR(120)` | Zorunlu | `NOT NULL`, `CHECK (char_length(trim(title)) BETWEEN 3 AND 120)` | Pozisyon / İlan başlığı (Zorunlu, boşluk temizlendikten sonra en az 3, en fazla 120 karakter) |
| `company` | `VARCHAR(150)` | Zorunlu | `NOT NULL`, `CHECK (char_length(trim(company)) BETWEEN 2 AND 150)` | İlanı veren şirket veya kurum adı (Zorunlu, en fazla 150 karakter) |
| `city` | `VARCHAR(100)` | Opsiyonel | `NULL` | Çalışma şehri / lokasyonu (Opsiyonel; Örn: "İstanbul", "Ankara", "Remote" — mevcut `006` migration şemasında `location` sütunuyla eşleşir) |
| `employment_type` | `VARCHAR(50)` | Zorunlu | `NOT NULL`, `DEFAULT 'full-time'`, `CHECK (employment_type IN ('full-time', 'part-time', 'internship', 'contract', 'remote'))` | Çalışma şekli / istihdam türü |
| `description` | `TEXT` | Opsiyonel | `NULL` | İş tanımı, görev ve sorumluluklar (Opsiyonel; girildiğinde en fazla 5.000 karakter) |
| `requirements` | `TEXT` | Opsiyonel | `NULL` | Aranan nitelikler, teknik yetkinlikler ve deneyim şartları (En fazla 3.000 karakter) |
| `contact_email` | `VARCHAR(255)` | Opsiyonel | `NULL` | Başvuru ve iletişim için e-posta adresi (Girildiğinde geçerli e-posta formatında olmalı) |
| `application_url` | `VARCHAR(500)` | Opsiyonel | `NULL` | Doğrudan harici başvuru bağlantısı (Girildiğinde `http://` veya `https://` ile başlamalı) |
| `salary_range` | `VARCHAR(100)` | Opsiyonel | `NULL` | Belirtilmişse maaş / ücret aralığı (Örn: "40.000 - 60.000 TL") |
| `deadline` | `DATE` | Opsiyonel | `NULL` | İlanın son başvuru tarihi (Yeni kayıtlarda geçmiş bir tarih olamaz) |
| `is_active` | `BOOLEAN` | Zorunlu | `NOT NULL`, `DEFAULT TRUE` | İlanın aktif/yayında olup olmadığı |
| `posted_by` | `INTEGER` | Opsiyonel | `FOREIGN KEY` ➔ `users(id)` `ON DELETE SET NULL` | İlanı oluşturan/yayınlayan mezun veya yetkili kullanıcı |
| `department_id` | `INTEGER` | Opsiyonel | `FOREIGN KEY` ➔ `departments(id)` `ON DELETE SET NULL` | İlanın öncelikli olarak hedeflendiği akademik bölüm (opsiyonel filtreleme için) |
| `created_at` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | İlanın sisteme eklendiği tarih ve saat |
| `updated_at` | `TIMESTAMPTZ` | Opsiyonel | `NULL` | İlanın son güncellenme zaman damgası |

---

### 3.7. `applications` (İş Başvuruları Tablosu)
Mezunların yayınlanmış iş ilanlarına yaptıkları başvuruları ve başvuru süreçlerini tutan ara tablodur.

| Alan Adı | Veri Tipi | Zorunluluk | Kısıtlar (Constraints) | Açıklama |
|---|---|---|---|---|
| `id` | `SERIAL` | Zorunlu | `PRIMARY KEY` | Benzersiz başvuru kimlik numarası |
| `job_posting_id` | `INTEGER` | Zorunlu | `FOREIGN KEY` ➔ `job_postings(id)` `ON DELETE CASCADE` | Başvuru yapılan iş ilanı |
| `user_id` | `INTEGER` | Zorunlu | `FOREIGN KEY` ➔ `users(id)` `ON DELETE CASCADE` | Başvuruyu yapan mezun |
| `resume_url` | `VARCHAR(500)` | Opsiyonel | `NULL` | Başvuruya eklenen özgeçmiş / CV bağlantısı (URL) |
| `cover_note` | `TEXT` | Opsiyonel | `NULL` | Başvuru ön yazısı / adayın açıklaması |
| `status` | `VARCHAR(30)` | Zorunlu | `NOT NULL`, `DEFAULT 'pending'`, `CHECK (status IN ('pending', 'reviewed', 'interview', 'accepted', 'rejected'))` | Başvuru değerlendirme durumu |
| `applied_at` | `TIMESTAMPTZ` | Zorunlu | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | Başvuru yapılma zamanı |
| `updated_at` | `TIMESTAMPTZ` | Opsiyonel | `NULL` | Başvuru durumu son güncellenme zaman damgası |
| - | - | - | `UNIQUE (job_posting_id, user_id)` | Bir mezunun aynı ilana mükerrer başvuru yapmasını engeller |

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

5. **`users` ➔ `job_postings` (Bire-Çok / 1:N):**
   - Bir mezun veya yetkili birden fazla iş ilanı paylaşabilir (`1:N`).
   - `job_postings.posted_by ➔ users.id` ilişkisi ile ilanı yayınlayan kullanıcı eşleştirilir.
   - İlanı oluşturan kullanıcının hesabı silinse bile, ilanın sistemdeki geçmişi ve arşiv bütünlüğünü korumak adına `ON DELETE SET NULL` stratejisi uygulanır.

6. **`departments` ➔ `job_postings` (Bire-Çok / 1:N - Opsiyonel Hedefleme):**
   - Bir akademik bölüm veya fakülteye özel olarak birden fazla iş ilanı hedeflenebilir (`1:N`).
   - `job_postings.department_id ➔ departments.id` ilişkisi ile belirli bir bölüm mezunlarına yönelik hedefli ilan filtrelemesi sağlanır.
   - Bölüm kaydı silindiğinde ilan silinmez, yalnızca bölüm ilişkisi boşa çıkar (`ON DELETE SET NULL`).

7. **`job_postings` ➔ `applications` (Bire-Çok / 1:N):**
   - Bir iş ilanına birden fazla mezun başvurabilir (`1:N`).
   - `applications.job_posting_id ➔ job_postings.id` ilişkisiyle ilan eşleştirilir.
   - İlan silindiğinde ilişkili başvurular da temizlenir (`ON DELETE CASCADE`).

8. **`users` ➔ `applications` (Bire-Çok / 1:N):**
   - Bir mezun birden çok iş ilanına başvuruda bulunabilir (`1:N`).
   - `applications.user_id ➔ users.id` ilişkisiyle başvuran mezun eşleştirilir.
   - Kullanıcı silindiğinde başvuruları da sistemden kaldırılır (`ON DELETE CASCADE`).

9. **`users` ➔ `job_postings` (Çoka-Çok / N:N - Başvuru İlişkisi):**
   - Mezunlar ve iş ilanları arasındaki başvuru ilişkisi `applications` ara tablosu üzerinden normalize edilmiştir.
   - `UNIQUE(job_posting_id, user_id)` kısıtı ile mükerrer başvurular engellenir.

---

## 5. 🗺️ Varlık Bağıntı Diyagramı (Mermaid ER Diagram)

```mermaid
erDiagram
    DEPARTMENTS ||--o{ USERS : "has members"
    DEPARTMENTS ||--o{ JOB_POSTINGS : "targets"
    USERS ||--o{ ANNOUNCEMENTS : "authors"
    USERS ||--o{ EVENTS : "organizes"
    USERS ||--o{ EVENT_REGISTRATIONS : "registers to"
    USERS ||--o{ JOB_POSTINGS : "posts"
    USERS ||--o{ APPLICATIONS : "submits"
    EVENTS ||--o{ EVENT_REGISTRATIONS : "has participants"
    JOB_POSTINGS ||--o{ APPLICATIONS : "receives"

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

    JOB_POSTINGS {
        int id PK
        string title "NOT NULL, max 120"
        string company "NOT NULL"
        string city "opsiyonel"
        string employment_type
        text description "opsiyonel"
        text requirements
        string contact_email
        string application_url
        string salary_range
        date deadline
        boolean is_active
        int posted_by FK
        int department_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    APPLICATIONS {
        int id PK
        int job_posting_id FK
        int user_id FK
        string resume_url
        text cover_note
        string status
        timestamptz applied_at
        timestamptz updated_at
    }
```

---

## 6. 🛡️ İş ve Doğrulama Kuralları (Domain & Validation Rules)

Bu bölüm, sistemdeki tüm varlıkların veri bütünlüğünü, iş mantığını (business logic) ve API/Web doğrulama standartlarını tanımlayan alan (domain) kurallarını içerir.

### 6.1. Genel (Tüm Varlıklar İçin Ortak) Kurallar
1. **Boşluk Temizleme (Whitespace Normalization):** Tüm metin alanlarında (`title`, `company`, `name`, `city`, vb.) kaydetme öncesi baştaki ve sondaki boşluklar (`trim`) temizlenir; yalnızca boşluk karakterlerinden oluşan girdiler boş kabul edilerek zorunlu alan kontrolünden geçirilir.
2. **Güvenli URL Kuralı:** Harici bağlantı barındıran tüm URL alanları (`application_url`, `resume_url`) yalnızca `http://` veya `https://` protokolü ile başlamalıdır (`javascript:`, `data:` vb. güvensiz şemalar kabul edilmez).
3. **E-Posta Normalizasyonu:** Tüm e-posta alanları geçerli e-posta formatına (`yerel@alan.uzantı`) uymalı ve tutarlılık için küçük harfe (`lowercase`) çevrilerek saklanmalıdır.
4. **Zaman Damgası Bütünlüğü:** `created_at` ve `applied_at` alanları kayıt oluşturma anında sistem tarafından UTC (`TIMESTAMPTZ`) olarak atanır ve dışarıdan değiştirilemez; `updated_at` ise yalnızca güncelleme işlemlerinde güncellenir.
5. **Sayfa Dışı / API Tutarlılığı:** İlişkisel (`FOREIGN KEY`) bir alana geçersiz veya sistemde bulunmayan bir ID gönderildiğinde `400 Bad Request` / `404 Not Found` veya referans hatası dönülmelidir; veritabanında yetim (orphan) kayıt oluşmasına izin verilmez.

---

### 6.2. `job_postings` (İş İlanları) Kuralları

#### A. Alan Zorunluluk ve Doğrulama Kuralları
1. **`title` (İlan Başlığı) — Zorunlu & Uzunluk Sınırı:**
   - Boş bırakılamaz (`NOT NULL`), yalnızca boşluklardan oluşamaz.
   - `trim` işlemi sonrasında **en az 3**, **en fazla 120 karakter** uzunluğunda olmalıdır (`VARCHAR(120)`).
2. **`company` (Şirket / Kurum Adı) — Zorunlu:**
   - Boş bırakılamaz (`NOT NULL`), yalnızca boşluklardan oluşamaz.
   - `trim` işlemi sonrasında **en az 2**, **en fazla 150 karakter** uzunluğunda olmalıdır.
3. **`city` (Şehir / Çalışma Lokasyonu) — Opsiyonel:**
   - Girilmesi zorunlu değildir (`NULL` olabilir; örn. tamamen uzaktan veya şehir belirtilmeyen ilanlar için).
   - Girilmesi halinde `trim` sonrasında **en az 2**, **en fazla 100 karakter** uzunluğunda olmalıdır. *(Not: Mevcut `006` SQL migration dosyasında bu alan `location` olarak adlandırılmıştır.)*
4. **`description` (İş Tanımı) — Opsiyonel:**
   - Girilmesi zorunlu değildir (`NULL` olabilir; yalnızca başlık, şirket ve özet/link ile hızlı ilan girilebilmesine izin verir).
   - Girilmesi halinde anlamlı içerik bütünlüğü için **en fazla 5.000 karakter** ile sınırlandırılır.
5. **`employment_type` (Çalışma Türü) — Zorunlu & Kısıtlı Değer:**
   - Boş bırakılırsa varsayılan olarak `'full-time'` atanır.
   - Yalnızca şu 5 değerden birini alabilir: `'full-time'`, `'part-time'`, `'internship'`, `'contract'`, `'remote'`.
6. **`requirements` (Aday Kriterleri) — Opsiyonel:**
   - Opsiyoneldir; girilmesi durumunda **en fazla 3.000 karakter** olabilir.
7. **`contact_email` (İletişim E-Postası) — Opsiyonel & Format:**
   - Opsiyoneldir; girildiği takdirde geçerli e-posta formatında olmalı ve **255 karakteri** geçmemelidir.
8. **`application_url` (Harici Başvuru Linki) — Opsiyonel & Format:**
   - Opsiyoneldir; girildiği takdirde `http://` veya `https://` ile başlayan geçerli bir URL olmalı ve **500 karakteri** geçmemelidir.
9. **`salary_range` (Maaş Aralığı) — Opsiyonel:**
   - Opsiyoneldir; girilmesi durumunda **en fazla 100 karakter** olabilir.
10. **`deadline` (Son Başvuru Tarihi) — Opsiyonel & Tarih Kuralı:**
    - Opsiyoneldir (`NULL` ise ilan süresiz kabul edilir).
    - Girildiğinde geçerli `YYYY-MM-DD` tarih formatında olmalıdır.
    - **Geçmiş Tarih Yasağı:** Yeni ilan oluşturma sırasında veya son başvuru tarihi güncellenirken bugünden önceki bir tarih (`deadline < CURRENT_DATE`) kabul edilmez.

#### B. İş Mantığı ve Yaşam Döngüsü Kuralları
11. **Varsayılan Aktiflik:** Yeni eklenen her ilan, aksi belirtilmedikçe `is_active = TRUE` olarak yayına alınır.
12. **Süresi Dolmuş İlan Kuralı:** `deadline` tarihi geçmiş (`deadline < CURRENT_DATE`) veya `is_active = FALSE` durumundaki ilanlar "kapalı/süresi dolmuş" kabul edilir; bu ilanlara yeni başvuru alınmaz.
13. **Referans Geçerliliği:** `posted_by` belirtilmişse `users` tablosunda, `department_id` belirtilmişse `departments` tablosunda mevcut bir kayda işaret etmelidir.
14. **Mükerrer İlan Önleme (Anti-Spam Önerisi):** Aynı şirket (`company`) ve aynı başlık (`title`) altında hâlihazırda aktif olan birebir aynı ilanın kısa süre içinde tekrarlanmaması önerilir.
15. **Arşiv ve Kaskad Silme Kuralı:** İlanı paylaşan kullanıcı sistemden silinse bile ilan kaydı silinmez (`posted_by = NULL` yapılır); ancak ilanın kendisi silindiğinde ona bağlı tüm başvurular (`applications`) otomatik olarak silinir (`ON DELETE CASCADE`).

---

### 6.3. `applications` (İş Başvuruları) Kuralları
1. **Zorunlu İlişkisel Alanlar:** `job_posting_id` ve `user_id` zorunludur ve veritabanında geçerli kayıtlara karşılık gelmelidir.
2. **Tekil Başvuru Kuralı (Duplicate Guard):** Bir mezun aynı iş ilanına yalnızca bir kez başvurabilir (`UNIQUE(job_posting_id, user_id)`).
3. **Açık İlan Şartı:** Yalnızca `is_active = TRUE` olan ve son başvuru tarihi (`deadline`) henüz geçmemiş olan ilanlara yeni başvuru oluşturulabilir.
4. **Kendi İlanına Başvuru Engeli:** İlanı yayınlayan kullanıcının (`job_postings.posted_by`), kendi yayınladığı ilana aday olarak başvurmasına izin verilmemesi önerilir.
5. **Özgeçmiş ve Ön Yazı Sınırları:**
   - `resume_url`: Opsiyoneldir; girilirse geçerli `http://` veya `https://` URL formatında ve en fazla **500 karakter** olmalıdır.
   - `cover_note`: Opsiyoneldir; girilirse **en fazla 2.000 karakter** olabilir.
6. **Durum (Status) ve Geçiş Kuralları:**
   - Yeni oluşturulan başvurular varsayılan olarak `'pending'` durumunda başlar.
   - İzin verilen durumlar: `'pending'`, `'reviewed'`, `'interview'`, `'accepted'`, `'rejected'`.
   - Nihai sonuca (`'accepted'` veya `'rejected'`) ulaşmış başvuruların durumu iş akışı gereği geriye dönük `'pending'` durumuna çekilemez.

---

### 6.4. `users` ve `departments` Kuralları
1. **`departments` (Bölümler):**
   - `name` zorunlu (2–100 karakter) ve benzersizdir.
   - `code` zorunlu (2–20 karakter) ve benzersizdir; büyük harf/alfanümerik kısa kod formatında (`CENG`, `IE`, vb.) tutulmalıdır.
   - `faculty` zorunlu (2–100 karakter) olmalıdır.
2. **`users` (Mezunlar / Kullanıcılar):**
   - `name` zorunlu (2–100 karakter, yalnızca boşluk olamaz).
   - `email` zorunlu, geçerli e-posta formatında, en fazla 255 karakter ve sistem genelinde benzersizdir.
   - `graduation_year` zorunlu bir tam sayıdır ve **`1950` ile `2100` arasında** olmalıdır.
   - `department_id` opsiyoneldir; verildiğinde geçerli bir `departments.id` değerine işaret etmelidir.

---

### 6.5. `announcements`, `events` ve `event_registrations` Kuralları
1. **`announcements` (Duyurular):**
   - `title` zorunlu (3–255 karakter), `content` zorunlu (boş olamaz, en fazla 10.000 karakter), `category` zorunlu (varsayılan `'Genel'`, en fazla 50 karakter), `author` zorunlu (varsayılan `'Yönetim'`, en fazla 100 karakter), `date` zorunludur (varsayılan `CURRENT_DATE`).
2. **`events` (Etkinlikler):**
   - `title` zorunlu (3–255 karakter), `description` zorunlu, `location` zorunlu (en fazla 255 karakter), `event_date` zorunludur (yeni etkinlik oluştururken geçmiş tarihli olmamalıdır).
   - `capacity` opsiyoneldir; belirtilirse pozitif tam sayı (`> 0`) olmalıdır.
3. **`event_registrations` (Etkinlik Kayıtları):**
   - Bir kullanıcı aynı etkinliğe tek sefer kayıt olabilir (`UNIQUE(event_id, user_id)`).
   - `status` yalnızca `'registered'`, `'attended'`, `'cancelled'` değerlerinden birini alabilir (varsayılan `'registered'`).
   - Etkinlik için `capacity` tanımlanmışsa ve aktif `'registered'` katılımcı sayısı kapasite sınırına ulaşmışsa yeni `'registered'` kaydı kabul edilmez.

---

## 7. 📌 Varsayımlar ve İleride Genişletilecek Alanlar

1. **Kimlik Doğrulama ve Güvenlik (Auth & Password Hashing):**
   - Mevcut taslak şemada şifre (`password_hash`) alanı henüz dahil edilmemiştir.
   - İlerleyen aşamalarda `users` tablosuna `password_hash VARCHAR(255)`, `role VARCHAR(30)` (Örn: `ADMIN`, `ALUMNI`, `STUDENT`) ve `is_active BOOLEAN` alanları eklenecektir.

2. **Mentorluk ve Kariyer Gelişim Modülü:**
   - Şemaya dahil edilen `job_postings` ve `applications` tablolarına ek olarak, yeni mezunlar ile kıdemli mezunlar arasında eşleşme ve kariyer rehberliği sağlamak için `mentorships` tablosu tasarlanabilir.

3. **İletişim ve Gizlilik Tercihleri:**
   - Mezunların e-posta veya profil bilgilerinin diğer kullanıcılara açık olup olmayacağını yöneten `privacy_settings` alanı eklenebilir.

4. **Veritabanı İndeksleme Stratejisi (Indexes):**
   - Sık sorgulanan alanlarda B-Tree indeksler planlanacaktır:
     - `CREATE INDEX idx_users_email ON users(email);`
     - `CREATE INDEX idx_announcements_date ON announcements(date DESC);`
     - `CREATE INDEX idx_events_date ON events(event_date ASC);`
     - `CREATE INDEX idx_job_postings_active ON job_postings(is_active, created_at DESC);`
     - `CREATE INDEX idx_job_postings_department ON job_postings(department_id);`
     - `CREATE INDEX idx_applications_job ON applications(job_posting_id);`
     - `CREATE INDEX idx_applications_user ON applications(user_id);`
     - `CREATE INDEX idx_applications_status ON applications(status);`

5. **PostgreSQL Geçişi, Migration ve Seed Altyapısı:**
   - Projede `pg.Pool` bağlantı havuzu [`backend/src/config/db.js`](backend/src/config/db.js) üzerinde yapılandırılmış ve aktif edilmiştir.
   - `001`–`007` arası sıralı `.sql` migration dosyaları [`backend/migrations/`](backend/migrations/) dizininde yer almakta ve [`backend/src/config/migrate.js`](backend/src/config/migrate.js) tarafından uygulama açılışında otomatik olarak uygulanmaktadır (`migrations` takip tablosu ile idempotent şekilde).
   - Başlangıç ve test verileri için factory tabanlı seed altyapısı [`backend/seeds/`](backend/seeds/) altında çalışmaktadır.

6. **Uygulama Katmanı Gözlemlenebilirlik ve Hata Loglama:**
   - Route/metod uyuşmazlıkları (`404 Guardian`) ve sunucu/veritabanı katmanı hataları (`5xx Guardian`, `pg` `AggregateError` dahil) uygulama katmanında [`backend/src/utils/errorLogger.js`](backend/src/utils/errorLogger.js) aracılığıyla `backend/logs/error.logs` dosyasına kaydedilir.
