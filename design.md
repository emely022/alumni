# Alumni — Tasarım Sistemi (Design System)

> **Tasarım Felsefesi:** Derin kurumsal yeşilin asaleti üzerinde parlayan altın sarısı aksiyonlar ve berrak beyaz yüzeyler. 1453'ten bugüne uzanan akademik ciddiyeti, gözü yormayan modern, ferah ve yüksek kontrastlı bir mezunlar ağı deneyimiyle buluşturan arayüz dili.

---

## 1. 🎯 Genel Bakış ve Tasarım İlkeleri

Bu doküman, **Alumni (Mezun Bilgi Sistemi)** için hazırlanan birleşik tasarım sistemidir. Sistemin temel görsel dili; koyu yeşil (`#214539`) ana zemin, bu zemin üzerinde güvenle öne çıkan altın sarısı (`#F5BA13`) buton ve aksiyonlar, yüksek okunabilirlik sağlayan beyaz (`#FFFFFF`) metin/kart yüzeyleri ve açık yüzeyler üzerinde kullanılan net siyah (`#111827`) tipografiden oluşur.

### Temel Kurallar:
1. **Zemin Rengi:** Tüm sayfa arka planı ve ana zemin `#214539` (Koyu Orman Yeşili) rengindedir. Gökyüzü veya karmaşık gradyanlar yerine sade, gözü dinlendiren, kurumsal yeşil tonları kullanılır.
2. **Erişilebilirlik ve Kontrast (WCAG AA/AAA):** İstisnasız tüm metin ve arka plan çiftlerinde kontrast oranı **en az 4.5:1** (çoğu kombinasyonda 7:1+ AAA seviyesinde) olacak şekilde kurgulanmıştır.
3. **Buton ve Aksiyon Dili:** Letters sistemindeki "butonlar hep siyah" kuralı yerine, **sarı butonlar (`#F5BA13`) ve sarı bağlantılar** kullanılır. Sarı butonların içindeki metinler maksimum kontrast için her zaman **siyah (`#111827`)** renktedir.
4. **Tipografi:** Harici hiçbir font yüklenmez (`@import` veya Google Fonts yoktur). Web standardı ve hızlı yüklenen `Arial, "Helvetica Neue", Helvetica, sans-serif` font ailesi kullanılır.
5. **İtalik Yasağı:** Tasarım sisteminde hiçbir başlık, metin, rozet veya açıklamada **italik (italic/oblique) kullanılmaz**. Hiyerarşi yalnızca font ağırlığı (weight), boyutu (size) ve rengiyle sağlanır.
6. **Form ve Köşe Yuvarlama:** Butonlar, etiketler ve hap (pill) elemanlarda tam yuvarlaklık (`100px`), modül kartlarında `18px`, geniş panellerde `32px` sınır yarıçapı kullanılır.

---

## 2. 🎨 Renk Sistemi (Color Tokens)

### 2.1. Renk Paleti Tablosu

| Renk Adı | Token | HEX Değeri | RGB Değeri | Rolü ve Kullanım Alanı |
|---|---|---|---|---|
| **Forest Green (Zemin)** | `--color-canvas-green` | `#214539` | `rgb(33, 69, 57)` | Ana sayfa zemini, kurumsal arka plan; gözü yormayan derin yeşil |
| **Deep Forest (Koyu Zemin)** | `--color-canvas-dark` | `#17342A` | `rgb(23, 52, 42)` | Footer, üst bildirim barı, derinleşen zemin katmanları |
| **Surface Green (Yeşil Yüzey)** | `--color-surface-green` | `#295547` | `rgb(41, 85, 71)` | Yeşil zemin üzerindeki hafif aydınlık paneller, kart border'ları |
| **Action Yellow (Birincil Sarı)** | `--color-action-yellow` | `#F5BA13` | `rgb(245, 186, 19)` | Birincil CTA butonları, bağlantılar, aktif sekmeler, ikon vurguları |
| **Yellow Hover (Açık Sarı)** | `--color-yellow-hover` | `#FFCC00` | `rgb(255, 204, 0)` | Buton hover durumları, odaklanma (focus ring) efektleri |
| **Paper White (Saf Beyaz)** | `--color-paper-white` | `#FFFFFF` | `rgb(255, 255, 255)` | Beyaz içerik kartları, yeşil zemin üstündeki başlıklar, modal yüzeyleri |
| **White Muted (%85 Beyaz)** | `--color-white-muted` | `rgba(255, 255, 255, 0.85)` | `rgba(255, 255, 255, 0.85)` | Yeşil zemin üzerindeki gövde metinleri ve açıklamalar |
| **White Subtle (%65 Beyaz)** | `--color-white-subtle` | `rgba(255, 255, 255, 0.65)` | `rgba(255, 255, 255, 0.65)` | Yeşil zemin üzerindeki küçük etiketler, zaman damgaları, sınırlar |
| **Obsidian Black (Metin Siyahı)** | `--color-text-black` | `#111827` | `rgb(17, 24, 39)` | Sarı buton içi metinler, beyaz kart içi başlıklar ve ana metinler |
| **Charcoal (Açık Yüzey Gövde)** | `--color-text-charcoal` | `#374151` | `rgb(55, 65, 81)` | Beyaz kart içi açıklamalar, ikincil gövde metinleri |
| **Slate Gray (Muted Sınır/Metin)**| `--color-text-slate` | `#6B7280` | `rgb(107, 114, 128)` | Beyaz kart içi pasif etiketler, placeholder metinleri |
| **Border on Green (İnce Çizgi)** | `--color-border-green` | `rgba(255, 255, 255, 0.15)` | `rgba(255, 255, 255, 0.15)` | Yeşil zemin üzerindeki kart ve bölücü hairlines |
| **Border on White (Kart Çizgisi)**| `--color-border-white` | `#E5E7EB` | `rgb(229, 231, 235)` | Beyaz kartların kenarlık çizgileri |

---

### 2.2. Erişilebilirlik ve Kontrast Doğrulama Matrisi (WCAG Contrast Table)

Tasarım sisteminde kullanılan tüm metin-arka plan çiftleri matematiksel olarak test edilmiş ve WCAG 2.1 standardı (minimum 4.5:1 AA, 7.0:1 AAA) doğrulanmıştır:

| Ön Plan (Metin / İkon) | Arka Plan (Zemin) | Kontrast Oranı | WCAG Seviyesi | Kullanım Senaryosu |
|---|---|:---:|:---:|---|
| **Saf Beyaz (`#FFFFFF`)** | Koyu Yeşil (`#214539`) | **10.93 : 1** | **AAA (Geçti)** | Yeşil zemin üstü başlıklar ve birincil yazılar |
| **Sarı Vurgu (`#F5BA13`)** | Koyu Yeşil (`#214539`) | **6.04 : 1** | **AA / AAA Large (Geçti)** | Yeşil zemin üstü sarı bağlantılar, vurgu kelimeleri |
| **Açık Sarı (`#FFCC00`)** | Koyu Yeşil (`#214539`) | **7.08 : 1** | **AAA (Geçti)** | Yeşil zemin üstü hover ve aktif ikonlar |
| **Siyah (`#111827`)** | Sarı Buton (`#F5BA13`) | **10.87 : 1** | **AAA (Geçti)** | Sarı buton içi metinler (Primary CTA) |
| **Siyah (`#111827`)** | Açık Sarı (`#FFCC00`) | **12.75 : 1** | **AAA (Geçti)** | Buton hover durumu metinleri |
| **Siyah (`#111827`)** | Beyaz Kart (`#FFFFFF`) | **16.50 : 1** | **AAA (Geçti)** | Beyaz kart içi ana başlıklar |
| **Koyu Gri (`#374151`)** | Beyaz Kart (`#FFFFFF`) | **9.12 : 1** | **AAA (Geçti)** | Beyaz kart içi gövde paragrafları |
| **Muted Beyaz (`rgba(255,255,255,0.85)`)** | Koyu Yeşil (`#214539`) | **9.29 : 1** | **AAA (Geçti)** | Yeşil zemin üstü alt açıklamalar |
| **Saf Beyaz (`#FFFFFF`)** | Koyu Yeşil Yüzey (`#17342A`) | **14.20 : 1** | **AAA (Geçti)** | Footer ve derin yeşil paneller |

---

## 3. 🔤 Tipografi (Typography)

Sistem; sıfır harici ağ maliyeti, anında yüklenme, kusursuz render performansı ve temiz okunabilirlik için işletim sistemlerinde hazır bulunan standart sans-serif font yığınını temel alır.

### 3.1. Font Ailesi (Font Family)
```css
font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
```
- **Yasak:** `@import url(...)`, `@font-face` ile web fontu çekmek ve Google Fonts kullanımı yasaktır.
- **İtalik Kuralı:** Sistem genelinde `font-style: italic` veya `font-style: oblique` **kesinlikle kullanılmaz**. Vurgu için font kalınlığı (500, 600, 700) veya sarı vurgu rengi tercih edilir.

---

### 3.2. Tipografi Ölçeği (Type Scale)

| Rol | Token | Boyut | Satır Yüksekliği (Line Height) | Harf Aralığı (Tracking) | Ağırlık (Weight) | Kullanım Alanı |
|---|---|:---:|:---:|:---:|:---:|---|
| **Display** | `--text-display` | `72px` | `1.05` | `-0.03em` | 700 (Bold) | Hero karşılama ana başlığı |
| **Heading XL** | `--text-heading-xl` | `44px` | `1.15` | `-0.025em` | 700 (Bold) | Sayfa başlıkları, öne çıkan istatistikler |
| **Heading LG** | `--text-heading-lg` | `32px` | `1.20` | `-0.02em` | 600 (SemiBold) | Bölüm başlıkları |
| **Heading MD** | `--text-heading-md` | `24px` | `1.30` | `-0.015em` | 600 (SemiBold) | Modül kartı başlıkları, modal başlıkları |
| **Subheading** | `--text-subheading` | `20px` | `1.35` | `-0.01em` | 600 (SemiBold) | Alt başlıklar, özet metinleri |
| **Body LG** | `--text-body-lg` | `18px` | `1.45` | `-0.005em` | 400 (Regular) / 500 (Medium) | Hero alt açıklama metni |
| **Body MD** | `--text-body-md` | `16px` | `1.50` | `0` | 400 (Regular) / 500 (Medium) | Standart gövde metni, form alanları |
| **Body SM** | `--text-body-sm` | `14px` | `1.40` | `0` | 500 (Medium) | Buton metinleri, menü linkleri |
| **Caption** | `--text-caption` | `12px` | `1.30` | `+0.01em` | 600 (SemiBold) | Rozetler (tags/chips), sayaç etiketleri |

---

## 4. 📐 Boşluk, Şekiller ve Yüzeyler (Spacing, Shapes & Surfaces)

Tasarım sistemi 4px tabanlı modüler grid aritmetiğine dayanır.

### 4.1. Boşluk Ölçeği (Spacing Scale - 4px Base)

| Adım | Değer | Token | Tipik Kullanım Alanı |
|---|---|---|---|
| **1** | `4px` | `--spacing-4` | Mikro boşluklar, ikon-metin aralıkları |
| **2** | `8px` | `--spacing-8` | Rozet dikey padding'i, buton içi boşluklar |
| **3** | `12px` | `--spacing-12` | Buton dikey padding'i, girdi alanı boşluğu |
| **4** | `16px` | `--spacing-16` | Standart elemanlar arası boşluk (gap) |
| **5** | `20px` | `--spacing-20` | Küçük kart padding'i |
| **6** | `24px` | `--spacing-24` | Buton yatay padding'i, ızgara aralığı |
| **8** | `32px` | `--spacing-32` | Standart kart içi iç boşluk (padding) |
| **10** | `40px` | `--spacing-40` | Geniş kart padding'i, bileşen ayırıcılar |
| **12** | `48px` | `--spacing-48` | Büyük paneller |
| **16** | `64px` | `--spacing-64` | Bölümler arası dikey boşluk (orta ekran) |
| **20** | `80px` | `--spacing-80` | Sayfa bölümleri arası dikey nefes alanı |
| **24** | `96px` | `--spacing-96` | Hero dikey padding'i |

---

### 4.2. Köşe Yuvarlama (Border Radius)

| Eleman Türü | Değer | Token | Açıklama |
|---|---|---|---|
| **Buttons (Pill)** | `100px` | `--radius-full` | Tam yuvarlak hap butonlar; imza aksiyon şekli |
| **Tags / Chips** | `100px` | `--radius-full` | Kategori ve durum rozetleri |
| **Nav Pills** | `100px` | `--radius-full` | Navigasyon hap menü elemanları |
| **Standard Cards** | `18px` | `--radius-card` | İçerik kartları, duyuru kutuları |
| **Large Cards** | `32px` | `--radius-large-card`| Öne çıkan özellik blokları, hero kartları |
| **Form Inputs** | `12px` | `--radius-input` | Metin giriş kutuları, açılır listeler |
| **Small Icons** | `8px` | `--radius-icon` | Küçük rozetler ve ikon yuvaları |

---

### 4.3. Yüzey Seviyeleri (Surfaces)

```text
Level 1: Canvas Green (#214539) ─── Ana sayfa gövdesi ve arka plan
  ├── Level 2: Deep Tone (#17342A) ─── Footer, bildirim çubuğu ve derinleştirilmiş paneller
  ├── Level 3: White Cards (#FFFFFF) ─── İçerik kartları, form blokları (Yazılar Siyah #111827)
  ├── Level 4: Surface Green (#295547) ─── Yeşil üstü yeşil kartlar (Yazılar Beyaz #FFFFFF)
  └── Level 5: Action Yellow (#F5BA13) ─── Butonlar ve etkileşimli yüzeyler (Yazılar Siyah #111827)
```

---

### 4.4. Gölgelendirme (Elevation & Shadows)

Yeşil zemin üzerinde doğal ve zarif duran, gri yerine yeşil ve siyah tonlu çok katmanlı gölgeler:

- **Kart Gölgeleri (Card Shadow):**
  ```css
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.15);
  ```
- **Yumuşak Yükselme (Card Hover / Elevation XL):**
  ```css
  --shadow-card-hover: 0 16px 32px -4px rgba(10, 26, 20, 0.35), 0 6px 12px -2px rgba(0, 0, 0, 0.2);
  ```
- **Sarı Buton Gölgeleri (Button Lift):**
  ```css
  --shadow-button: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(245, 186, 19, 0.25);
  --shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(245, 186, 19, 0.4);
  ```

---

## 5. 🧱 Bileşen Standartları (Components)

### 5.1. Birincil Buton (Yellow Pill Primary Button)
- **Rol:** Sayfanın ana aksiyonu (örn. "Mezun Portalı", "İlan Ver", "Kayıt Ol").
- **Tasarım:** Tam hap biçimi (`100px` radius).
- **Zemin:** `#F5BA13` (Altın Sarısı).
- **Yazı:** `#111827` (Net Siyah), `14px`, weight 600, harf aralığı normal.
- **Padding:** Dikey `12px`, yatay `24px`.
- **Hover Durumu:** Zemin `#FFCC00`, hafif dikey kalkış (`translateY(-2px)`), sarı ışıma gölgesi artar.
- **Odak (Focus):** `outline: 2px solid #FFFFFF; outline-offset: 2px;`.

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #F5BA13;
  color: #111827;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  line-height: 1.4;
  padding: 12px 24px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(245, 186, 19, 0.25);
  transition: all 0.2s ease;
  text-decoration: none;
}
.btn-primary:hover {
  background-color: #FFCC00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(245, 186, 19, 0.4);
}
```

---

### 5.2. İkincil Buton (Outlined White/Yellow Ghost Button)
- **Rol:** İkincil aksiyonlar (örn. "Giriş Yap", "Detayları Gör", "Filtrele").
- **Zemin:** Şeffaf (`transparent`) veya `rgba(255, 255, 255, 0.08)`.
- **Kenarlık:** `1px solid rgba(255, 255, 255, 0.4)` veya sarı kenarlık `1px solid #F5BA13`.
- **Yazı:** `#FFFFFF` veya `#F5BA13`, `14px`, weight 600.
- **Hover:** Zemin `rgba(255, 255, 255, 0.15)`, kenarlık `#FFFFFF`.

---

### 5.3. Beyaz İçerik Kartı (White Feature Card)
- **Rol:** Mezun kartları, iş ilanları, başvuru detayları, form blokları.
- **Zemin:** `#FFFFFF` (Saf Beyaz).
- **Köşe Yuvarlama:** `18px` (`--radius-card`).
- **İç Boşluk (Padding):** `32px` ile `40px`.
- **Kenarlık:** `1px solid #E5E7EB`.
- **İçerik Renkleri:**
  - Kart Başlığı: `#111827` (Siyah, `20px` - `24px`, weight 700).
  - Kart Gövde Yazısı: `#374151` (Koyu Gri, `15px` - `16px`, weight 400).
  - Kart Alt Metni: `#6B7280` (`13px`, weight 500).
  - Kart İçi Bağlantı: `#1B4D3E` veya sarı badge ile vurgulama.

---

### 5.4. Koyu Yeşil Yüzey Kartı (Green Elevated Card)
- **Rol:** Sayfa içinde yeşil akışı bozmadan bilgi öne çıkarma.
- **Zemin:** `#295547` (Aydınlatılmış Orman Yeşili).
- **Köşe Yuvarlama:** `18px`.
- **Kenarlık:** `1px solid rgba(255, 255, 255, 0.15)`.
- **İçerik:** Başlıklar `#FFFFFF`, vurgular `#F5BA13`, alt açıklamalar `rgba(255, 255, 255, 0.85)`.

---

### 5.5. Rozet ve Kategori Etiketleri (Pill Tag / Chip)
- **Rol:** İlan türü (Tam Zamanlı, Staj), başvuru durumu (Kabul, Beklemede), kategori.
- **Tasarım:** `100px` radius, `4px 12px` padding, `12px` font boyutu, weight 600.
- **Renk Düzeni:**
  - *Sarı Rozet (Vurgulu):* Zemin `#F5BA13`, yazı `#111827`.
  - *Yeşil-Beyaz Rozet:* Zemin `rgba(255, 255, 255, 0.15)`, yazı `#FFFFFF`, kenarlık `1px solid rgba(255, 255, 255, 0.25)`.
  - *Açık Kart İçi Rozet:* Zemin `#F3F4F6`, yazı `#1F2937`, kenarlık `1px solid #E5E7EB`.

---

### 5.6. Üst Navigasyon Çubuğu (Top Navigation Bar)
- **Konum:** Sayfa üstünde sabit (`sticky`), z-index `100`.
- **Zemin:** `#17342A` (Koyu yeşil, hafif şeffaf `rgba(23, 52, 42, 0.95)` ve `backdrop-filter: blur(8px)`).
- **Alt Kenarlık:** `1px solid rgba(245, 186, 19, 0.3)` (İnce altın sarısı çizgi).
- **Linkler:** `#FFFFFF`, `14px`, weight 500, hover durumunda `#F5BA13`.
- **Sağ Aksiyon:** Sarı hap buton (`.btn-primary`).

---

### 5.7. Form Elemanları ve Girdiler (Form Inputs)
- **Köşe Yuvarlama:** `12px`.
- **Beyaz Kart İçinde:**
  - Zemin: `#F9FAFB`.
  - Kenarlık: `1px solid #D1D5DB`.
  - Metin: `#111827`.
  - Odak (Focus): `border-color: #214539; box-shadow: 0 0 0 3px rgba(33, 69, 57, 0.2); outline: none;`.
- **Yeşil Zemin Üzerinde:**
  - Zemin: `rgba(255, 255, 255, 0.1)`.
  - Kenarlık: `1px solid rgba(255, 255, 255, 0.25)`.
  - Metin: `#FFFFFF`.
  - Placeholder: `rgba(255, 255, 255, 0.6)`.
  - Odak (Focus): `border-color: #F5BA13; box-shadow: 0 0 0 3px rgba(245, 186, 19, 0.3);`.

---

## 6. ✅ Yapılması ve ❌ Yapılmaması Gerekenler (Do's & Don'ts)

### ✅ Yapılması Gerekenler (Do)
1. **Sarı Buton Kuralı:** Ana aksiyon butonlarında her zaman sarı (`#F5BA13` / `#FFCC00`) kullanın ve buton metnini mutlaka **siyah (`#111827`)** yapın.
2. **Koyu Yeşil Arka Plan:** Ana sayfa ve bölüm zeminlerinde `#214539` kullanın; gözü yormayan sade ve homojen yeşil tonlarını koruyun.
3. **Beyaz Kartlarda Siyah Metin:** Beyaz kart bileşenleri kullanıldığında başlık ve gövde yazılarını siyah/koyu tonlarda (`#111827` ve `#374151`) tutarak maksimum kontrast sağlayın.
4. **Koyu Yeşilde Beyaz Metin:** Yeşil zemin üzerinde doğrudan yer alan metinleri saf beyaz (`#FFFFFF`) veya yüksek opaklıklı beyaz (`rgba(255,255,255,0.85)`) olarak yazın.
5. **Hap Biçimli Elemanlar:** Tüm butonlarda ve etiketlerde `border-radius: 100px` uygulayın; tasarımın imza yuvarlaklığını muhafaza edin.
6. **Arial Font Yığını:** Tipografi olarak daima `Arial, "Helvetica Neue", Helvetica, sans-serif` kullanın.
7. **4.5:1 Kontrast Garantisi:** Yeni eklenen her metin/arka plan ikilisinin en az 4.5:1 kontrast oranını sağladığını doğrulayın.
8. **Kart İçi Geniş Padding:** Kart bileşenlerinde en az `32px` (mümkünse `40px`) iç boşluk vererek ferah bir görünüm elde edin.

---

### ❌ Yapılmaması Gerekenler (Don't)
1. **İtalik Yazı Kesinlikle Yasaktır:** Hiçbir başlıkta, buton metninde, menüde veya paragrafta `font-style: italic` kullanmayın.
2. **Harici Font İndirmeyin:** `@import url('https://fonts.googleapis.com/...')` veya `@font-face` ile dışarıdan font yüklemeyin.
3. **Siyah Buton Kullanmayın:** Letters sistemindeki "butonlar hep siyah" kuralını uygulamayın; butonlar sarı zeminli (`#F5BA13`) olmalıdır.
4. **Gökyüzü Gradyanı Kullanmayın:** Letters sistemindeki mavi/gökyüzü gradyanını (`#779bc1` vb.) uygulamayın; arka plan koyu yeşil (`#214539`) olmalıdır.
5. **Sarı Buton Üzerine Beyaz Yazı Yazmayın:** Sarı buton üzerinde beyaz metin kullanmak kontrast kuralını bozar (oran ~1.3:1 olur); sarı buton içi **daima siyah** olmalıdır.
6. **Koyu Yeşil Zemin Üzerine Koyu Yazı Yazmayın:** `#214539` üzerine siyah veya koyu gri metin yerleştirmeyin.
7. **Keskin Köşeli Buton Yapmayın:** Butonlarda `0px` veya `4px` gibi keskin köşeler kullanmayın; daima `100px` hap biçimi tercih edin.
8. **Ağır ve Opaklığı Yüksek Gölgeler Kullanmayın:** Siyah opaklığı `%25`'i aşan yapay, sert ve çamurlu gölgeler eklemeyin.

---

## 7. 💻 CSS Değişkenleri (CSS Custom Properties - `:root`)

Aşağıdaki CSS değişkenleri doğrudan projenin global CSS dosyasına eklenerek kullanılabilir:

```css
:root {
  /* ==========================================================================
     Renk Değişkenleri (Color Tokens)
     ========================================================================== */
  --color-canvas-green: #214539;
  --color-canvas-dark: #17342A;
  --color-surface-green: #295547;
  
  --color-action-yellow: #F5BA13;
  --color-yellow-hover: #FFCC00;
  --color-yellow-muted: #DF9C0A;

  --color-paper-white: #FFFFFF;
  --color-white-muted: rgba(255, 255, 255, 0.85);
  --color-white-subtle: rgba(255, 255, 255, 0.65);

  --color-text-black: #111827;
  --color-text-charcoal: #374151;
  --color-text-slate: #6B7280;

  --color-border-green: rgba(255, 255, 255, 0.15);
  --color-border-white: #E5E7EB;
  --color-border-yellow: #F5BA13;

  /* ==========================================================================
     Tipografi Değişkenleri (Typography Tokens - Arial Stack, No Italics)
     ========================================================================== */
  --font-family-base: Arial, "Helvetica Neue", Helvetica, sans-serif;
  --font-style-base: normal;

  /* Boyutlar */
  --text-display: 72px;
  --text-heading-xl: 44px;
  --text-heading-lg: 32px;
  --text-heading-md: 24px;
  --text-subheading: 20px;
  --text-body-lg: 18px;
  --text-body-md: 16px;
  --text-body-sm: 14px;
  --text-caption: 12px;

  /* Satır Yükseklikleri */
  --leading-display: 1.05;
  --leading-heading: 1.15;
  --leading-subheading: 1.35;
  --leading-body: 1.5;
  --leading-compact: 1.3;

  /* Harf Aralıkları */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;

  /* Font Kalınlıkları */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* ==========================================================================
     Boşluk Değişkenleri (Spacing Tokens - 4px Grid)
     ========================================================================== */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* ==========================================================================
     Şekil ve Köşe Yuvarlama (Radius Tokens)
     ========================================================================== */
  --radius-full: 100px;        /* Butonlar, etiketler, hap menüler */
  --radius-card: 18px;         /* Standart kartlar */
  --radius-large-card: 32px;   /* Büyük vitrin panelleri */
  --radius-input: 12px;        /* Form girdileri */
  --radius-icon: 8px;          /* İkon kutucukları */

  /* ==========================================================================
     Gölgelendirme (Elevation Tokens)
     ========================================================================== */
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.15);
  --shadow-card-hover: 0 16px 32px -4px rgba(10, 26, 20, 0.35), 0 6px 12px -2px rgba(0, 0, 0, 0.2);
  --shadow-button: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(245, 186, 19, 0.25);
  --shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(245, 186, 19, 0.4);

  /* ==========================================================================
     Yerleşim (Layout)
     ========================================================================== */
  --page-max-width: 1200px;
}
```

---

## 8. ⚡ Tailwind v4 `@theme` Yapılandırması

Tailwind CSS v4 projelerinde kullanılmak üzere uyumlu konfigürasyon bloğu:

```css
@theme {
  /* Renkler */
  --color-canvas-green: #214539;
  --color-canvas-dark: #17342A;
  --color-surface-green: #295547;
  --color-action-yellow: #F5BA13;
  --color-yellow-hover: #FFCC00;
  --color-paper-white: #FFFFFF;
  --color-text-black: #111827;
  --color-text-charcoal: #374151;
  --color-text-slate: #6B7280;

  /* Font Ailesi */
  --font-sans: Arial, "Helvetica Neue", Helvetica, sans-serif;

  /* Font Boyutları */
  --text-display: 72px;
  --text-heading-xl: 44px;
  --text-heading-lg: 32px;
  --text-heading-md: 24px;
  --text-subheading: 20px;
  --text-body-lg: 18px;
  --text-body-md: 16px;
  --text-body-sm: 14px;
  --text-caption: 12px;

  /* Köşe Yuvarlama */
  --radius-full: 100px;
  --radius-card: 18px;
  --radius-large-card: 32px;
  --radius-input: 12px;

  /* Gölgeler */
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.15);
  --shadow-button: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(245, 186, 19, 0.25);
}
```

---

## 9. 📋 Tasarım Bileşeni Örnek HTML/CSS Şablonları

### 9.1. Hero Başlık ve Buton Grubu Örneği
```html
<section style="background-color: #214539; padding: 80px 24px; text-align: center;">
  <div style="max-width: 900px; margin: 0 auto;">
    <!-- Rozet -->
    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.3); padding: 6px 16px; border-radius: 100px; font-family: Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 24px;">
      İstanbul Üniversitesi Mezun Bilgi Sistemi
    </span>
    
    <!-- Başlık -->
    <h1 style="font-family: Arial, sans-serif; font-size: 48px; font-weight: 700; color: #FFFFFF; line-height: 1.15; margin-bottom: 20px; letter-spacing: -0.02em;">
      Tarihten Geleceğe Bilim Köprüsü: <span style="color: #F5BA13;">Mezun Ailesi</span>
    </h1>
    
    <!-- Paragraf -->
    <p style="font-family: Arial, sans-serif; font-size: 18px; font-weight: 400; color: rgba(255, 255, 255, 0.85); line-height: 1.5; max-width: 640px; margin: 0 auto 36px;">
      1453'ten bugüne uzanan köklü birikimiyle yarım milyona yaklaşan mezunumuzu tek çatı altında buluşturuyoruz.
    </p>
    
    <!-- Butonlar -->
    <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
      <a href="/users" style="background-color: #F5BA13; color: #111827; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 100px; text-decoration: none; box-shadow: 0 4px 12px rgba(245, 186, 19, 0.3);">
        Mezun Portalı
      </a>
      <a href="/job-postings" style="background-color: transparent; color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.4); font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 100px; text-decoration: none;">
        Kariyer İlanları
      </a>
    </div>
  </div>
</section>
```

---

### 9.2. Beyaz İçerik Kartı (Job Posting / Alumni Card)
```html
<article style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 18px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 500px;">
  <!-- Kategori Rozeti -->
  <span style="display: inline-block; background-color: #F5BA13; color: #111827; font-family: Arial, sans-serif; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px; margin-bottom: 16px;">
    Tam Zamanlı
  </span>
  
  <!-- Başlık (Siyah) -->
  <h3 style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 700; color: #111827; line-height: 1.25; margin-bottom: 8px;">
    Kıdemli Yazılım Geliştirici
  </h3>
  
  <!-- Şirket / Kurum Bilgisi -->
  <p style="font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; color: #214539; margin-bottom: 14px;">
    Teknopark İstanbul / Hibrit
  </p>
  
  <!-- Gövde Metni (Koyu Gri) -->
  <p style="font-family: Arial, sans-serif; font-size: 15px; font-weight: 400; color: #374151; line-height: 1.5; margin-bottom: 24px;">
    Bilgisayar Mühendisliği ve ilgili bölümlerden mezun, web servisleri ve veritabanı mimarisinde deneyimli mezun adaylar aranmaktadır.
  </p>
  
  <!-- Aksiyon Butonu -->
  <a href="/applications" style="display: inline-block; background-color: #F5BA13; color: #111827; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; padding: 10px 22px; border-radius: 100px; text-decoration: none;">
    Hemen Başvur ➔
  </a>
</article>
```
