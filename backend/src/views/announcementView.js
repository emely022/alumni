/**
 * Announcement View (Görünüm Katmanı)
 * 
 * MVC mimarisinin View katmanıdır.
 * Duyurular listesi, duyuru oluşturma formu, düzenleme formu
 * ve duyuru detay sayfası için gerekli HTML şablonlarını oluşturmaktan sorumludur.
 */

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
    line-height: 1.6;
    color: #333;
    background-color: #fcfcfc;
  }
  h1, h2, h3 {
    color: #2c3e50;
  }
  h1 {
    border-bottom: 2px solid #eaecef;
    padding-bottom: 10px;
    margin-top: 10px;
  }
  .nav {
    margin-bottom: 25px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eaecef;
  }
  .nav a {
    color: #0366d6;
    text-decoration: none;
    margin-right: 18px;
    font-weight: 500;
  }
  .nav a:hover {
    text-decoration: underline;
  }
  .alert {
    padding: 12px 18px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 0.95em;
  }
  .alert-success {
    background-color: #e6ffed;
    border: 1px solid #acf2bd;
    color: #155724;
  }
  .alert-error {
    background-color: #ffeef0;
    border: 1px solid #fdaeb7;
    color: #86181d;
  }
  .card {
    background: white;
    padding: 20px 24px;
    border-radius: 8px;
    border: 1px solid #e1e4e8;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 30px;
  }
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .form-full {
    grid-column: 1 / -1;
  }
  @media (max-width: 600px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
  .form-group {
    display: flex;
    flex-direction: column;
  }
  .form-group label {
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.9em;
    color: #444;
  }
  .form-group input, .form-group textarea, .form-group select {
    padding: 9px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.95em;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }
  .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.15);
  }
  .btn-submit {
    grid-column: 1 / -1;
    background-color: #2ea44f;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 8px;
  }
  .btn-submit:hover {
    background-color: #2c974b;
  }
  .btn-secondary {
    padding: 10px 20px;
    background: #e1e4e8;
    color: #24292e;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95em;
    display: inline-block;
    text-align: center;
    transition: background-color 0.2s;
  }
  .btn-secondary:hover {
    background: #d1d5da;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e1e4e8;
  }
  th {
    background-color: #f6f8fa;
    color: #24292e;
    text-align: left;
    padding: 12px 14px;
    border-bottom: 2px solid #eaecef;
    font-weight: 600;
    font-size: 0.9em;
  }
  td {
    padding: 12px 14px;
    border-bottom: 1px solid #eaecef;
    font-size: 0.95em;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover {
    background-color: #fcfcfc;
  }
  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.85em;
    background: #e1f5fe;
    color: #0288d1;
    font-weight: 600;
  }
  .badge-category {
    background: #ede7f6;
    color: #5e35b1;
  }
  .btn-detail {
    padding: 5px 9px;
    background: #0366d6;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.85em;
    font-weight: 500;
    display: inline-block;
  }
  .btn-detail:hover {
    background: #0255b5;
  }
  .btn-edit {
    padding: 5px 9px;
    background: #f1a30b;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.85em;
    font-weight: 500;
    display: inline-block;
    margin-left: 4px;
  }
  .btn-edit:hover {
    background: #d98e04;
  }
  .btn-delete {
    padding: 5px 9px;
    background: #d73a49;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: 500;
    cursor: pointer;
    display: inline-block;
    margin-left: 4px;
    transition: background 0.2s;
  }
  .btn-delete:hover {
    background: #cb2431;
  }
  .btn-back {
    display: inline-block;
    padding: 8px 16px;
    background: #0366d6;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
  }
  .btn-back:hover {
    background: #0255b5;
  }
`;

/**
 * Duyurular Listesi ve Yeni Duyuru Ekleme Formu Sayfası (GET /announcements)
 * @param {Array} announcements - Duyurular dizisi
 * @param {Object} options - Ek bildirim seçenekleri (success, error)
 * @returns {string} Tam HTML çıktısı
 */
const renderAnnouncementsPage = (announcements = [], options = {}) => {
  const today = new Date().toISOString().split('T')[0];

  let alertBox = '';
  if (options.success) {
    alertBox = `<div class="alert alert-success">✅ ${options.success}</div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  const rows = announcements.length === 0
    ? `<tr><td colspan="6" style="text-align: center; color: #777; padding: 25px;">Henüz kayıtlı duyuru bulunmuyor.</td></tr>`
    : announcements
        .map(
          (a) => `
      <tr>
        <td><strong>#${a.id}</strong></td>
        <td>
          <a href="/announcements/${a.id}" style="color: #0366d6; text-decoration: none; font-weight: 600;">${a.title}</a>
        </td>
        <td><span class="badge badge-category">${a.category || 'Genel'}</span></td>
        <td>${a.date || '-'}</td>
        <td>${a.author || 'Yönetim'}</td>
        <td style="white-space: nowrap;">
          <a href="/announcements/${a.id}" class="btn-detail" title="Duyuruyu Görüntüle">Gör</a>
          <a href="/announcements/${a.id}/edit" class="btn-edit" title="Duyuruyu Düzenle">Düzenle</a>
          <form method="POST" action="/announcements/${a.id}/delete" style="display: inline;" onsubmit="return confirm('${a.title} başlıklı duyuruyu silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn-delete" title="Duyuruyu Sil">Sil</button>
          </form>
        </td>
      </tr>
    `
        )
        .join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Duyurular - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/">← Ana Sayfa</a>
    <a href="/about">Hakkında</a>
    <a href="/users">Mezunlar (Web)</a>
    <a href="/announcements"><strong>Duyurular (Web)</strong></a>
    <a href="/job-postings">İş İlanları (Web)</a>
    <a href="/applications">Başvurular (Web)</a>
    <a href="/api/announcements" target="_blank">JSON API (/api/announcements)</a>
    <a href="/api/swagger" target="_blank">Swagger Dokümantasyonu</a>
  </div>

  <h1>📢 Duyurular Paneli (Announcements)</h1>
  <p>Alumni Tracking System duyuru yönetim görünümü (View). Buradan yeni duyurular yayınlayabilir, mevcut duyuruları inceleyebilir, güncelleyebilir veya silebilirsiniz.</p>

  ${alertBox}

  <!-- Yeni Duyuru Ekleme Formu (POST /announcements) -->
  <div class="card">
    <h3 style="margin-top: 0; margin-bottom: 15px;">➕ Yeni Duyuru Yayınla</h3>
    <form method="POST" action="/announcements">
      <div class="form-grid">
        <div class="form-group form-full">
          <label for="title">Duyuru Başlığı *</label>
          <input type="text" id="title" name="title" required placeholder="Örn: 2026 Bahar Mezunlar Kokteyli">
        </div>
        <div class="form-group">
          <label for="category">Kategori</label>
          <input type="text" id="category" name="category" placeholder="Örn: Etkinlik, Kariyer, Burs, Genel" value="Genel">
        </div>
        <div class="form-group">
          <label for="author">Yayınlayan / Yazar</label>
          <input type="text" id="author" name="author" placeholder="Örn: Mezunlar Derneği" value="Yönetim">
        </div>
        <div class="form-group">
          <label for="date">Tarih</label>
          <input type="date" id="date" name="date" value="${today}">
        </div>
        <div class="form-group form-full">
          <label for="content">Duyuru İçeriği *</label>
          <textarea id="content" name="content" required placeholder="Duyurunun detaylarını buraya yazın..."></textarea>
        </div>
        <button type="submit" class="btn-submit">📢 Duyuruyu Yayınla</button>
      </div>
    </form>
  </div>

  <!-- Kayıtlı Duyurular Tablosu -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
    <h3 style="margin: 0;">📋 Yayınlanan Duyurular</h3>
    <span class="badge">Toplam: ${announcements.length} Duyuru</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th>Başlık</th>
        <th>Kategori</th>
        <th>Tarih</th>
        <th>Yazar</th>
        <th style="width: 170px;">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div style="margin-top: 30px; font-size: 0.85em; color: #666; text-align: center;">
    Alumni Tracking System • MVC View Katmanı (<code>backend/src/views/announcementView.js</code>)
  </div>
</body>
</html>`;
};

/**
 * Duyuru Düzenleme Sayfası (GET /announcements/:id/edit)
 * @param {Object} announcement - Duyuru nesnesi
 * @param {Object} options - Ek bildirim seçenekleri (error)
 * @returns {string} Tam HTML çıktısı
 */
const renderEditAnnouncementPage = (announcement, options = {}) => {
  let alertBox = '';
  if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${announcement.title} - Duyuruyu Düzenle</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/">← Ana Sayfa</a>
    <a href="/announcements">← Duyurular Listesi</a>
    <a href="/announcements/${announcement.id}">Duyuruyu Gör</a>
  </div>

  <h1>✏️ Duyuruyu Düzenle</h1>
  <p><strong>#${announcement.id}</strong> numaralı <strong>${announcement.title}</strong> başlıklı duyuruyu güncelliyorsunuz.</p>

  ${alertBox}

  <div class="card">
    <form method="POST" action="/announcements/${announcement.id}/update">
      <div class="form-grid">
        <div class="form-group form-full">
          <label for="title">Duyuru Başlığı *</label>
          <input type="text" id="title" name="title" value="${announcement.title}" required>
        </div>
        <div class="form-group">
          <label for="category">Kategori</label>
          <input type="text" id="category" name="category" value="${announcement.category || 'Genel'}">
        </div>
        <div class="form-group">
          <label for="author">Yayınlayan / Yazar</label>
          <input type="text" id="author" name="author" value="${announcement.author || 'Yönetim'}">
        </div>
        <div class="form-group">
          <label for="date">Tarih</label>
          <input type="date" id="date" name="date" value="${announcement.date || ''}">
        </div>
        <div class="form-group form-full">
          <label for="content">Duyuru İçeriği *</label>
          <textarea id="content" name="content" required>${announcement.content || ''}</textarea>
        </div>
        <div style="grid-column: 1 / -1; display: flex; gap: 12px; margin-top: 10px;">
          <button type="submit" class="btn-submit" style="margin-top: 0; flex: 1;">💾 Değişiklikleri Kaydet</button>
          <a href="/announcements" class="btn-secondary">İptal</a>
        </div>
      </div>
    </form>
  </div>

  <div style="margin-top: 30px; font-size: 0.85em; color: #666; text-align: center;">
    Alumni Tracking System • Düzenleme Formu (<code>POST /announcements/${announcement.id}/update</code>)
  </div>
</body>
</html>`;
};

/**
 * Duyuru Detay Sayfası (GET /announcements/:id)
 * @param {Object} announcement - Duyuru nesnesi
 * @returns {string} Tam HTML çıktısı
 */
const renderAnnouncementDetailPage = (announcement) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${announcement.title} - Duyuru Detayı</title>
  <style>
    ${baseStyles}
    .detail-card {
      background: white;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      color: #586069;
      font-size: 0.9em;
      margin: 15px 0 25px 0;
      padding-bottom: 15px;
      border-bottom: 1px solid #eaecef;
    }
    .content-body {
      font-size: 1.05em;
      line-height: 1.7;
      color: #24292e;
      white-space: pre-line;
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <div class="nav">
    <a href="/announcements">← Duyurular Listesine Dön</a>
    <a href="/api/announcements/${announcement.id}" target="_blank">JSON Görüntüle</a>
  </div>

  <div class="detail-card">
    <div style="display: flex; gap: 8px; align-items: center;">
      <span class="badge">Duyuru #${announcement.id}</span>
      <span class="badge badge-category">${announcement.category || 'Genel'}</span>
    </div>
    <h1 style="border-bottom: none; margin-bottom: 0;">${announcement.title}</h1>

    <div class="meta-bar">
      <span>📅 <strong>Tarih:</strong> ${announcement.date || 'Belirtilmedi'}</span>
      <span>✍️ <strong>Yazar:</strong> ${announcement.author || 'Yönetim'}</span>
      ${announcement.createdAt ? `<span>🕒 <strong>Oluşturulma:</strong> ${announcement.createdAt}</span>` : ''}
      ${announcement.updatedAt ? `<span>✏️ <strong>Güncellenme:</strong> ${announcement.updatedAt}</span>` : ''}
    </div>

    <div class="content-body">
${announcement.content}
    </div>

    <div style="margin-top: 25px; display: flex; gap: 10px; align-items: center; border-top: 1px solid #eaecef; padding-top: 20px;">
      <a href="/announcements" class="btn-back">← Tüm Duyuruları Listele</a>
      <a href="/announcements/${announcement.id}/edit" class="btn-edit" style="padding: 8px 16px; font-size: 0.95em;">✏️ Düzenle</a>
      <form method="POST" action="/announcements/${announcement.id}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${announcement.title} başlıklı duyuruyu silmek istediğinize emin misiniz?');">
        <button type="submit" class="btn-delete" style="padding: 8px 16px; font-size: 0.95em;">🗑️ Sil</button>
      </form>
    </div>
  </div>
</body>
</html>`;
};

/**
 * 404 Duyuru Bulunamadı Sayfası
 * @param {string|number} id - Aranan ID
 * @returns {string} Tam HTML çıktısı
 */
const renderAnnouncementNotFoundPage = (id) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Duyuru Bulunamadı - 404</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/announcements">← Duyurular Listesi</a>
  </div>
  <div class="card" style="text-align: center; padding: 40px 20px;">
    <h2>❌ Duyuru Bulunamadı (404)</h2>
    <p>Aradığınız <strong>#${id}</strong> numaralı duyuru sistemde mevcut değil.</p>
    <a href="/announcements" class="btn-detail" style="display: inline-block; margin-top: 15px; padding: 8px 16px;">Duyurular Listesine Dön</a>
  </div>
</body>
</html>`;
};

module.exports = {
  renderAnnouncementsPage,
  renderEditAnnouncementPage,
  renderAnnouncementDetailPage,
  renderAnnouncementNotFoundPage,
};
