/**
 * User View (Görünüm Katmanı)
 * 
 * MVC mimarisinin View katmanıdır.
 * Mezunlar listesi, mezun oluşturma formu, düzenleme formu
 * ve profil detayları için gerekli HTML şablonlarını oluşturmaktan sorumludur.
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
  .form-group input {
    padding: 9px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.95em;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-group input:focus {
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
 * Mezunlar Listesi ve Yeni Mezun Ekleme Formu Sayfası (GET /users)
 * @param {Array} users - Mezunlar dizisi
 * @param {Object} options - Ek bildirim seçenekleri (success, error)
 * @returns {string} Tam HTML çıktısı
 */
const renderUsersPage = (users = [], options = {}) => {
  const currentYear = new Date().getFullYear();

  let alertBox = '';
  if (options.success) {
    alertBox = `<div class="alert alert-success">✅ ${options.success}</div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  const userRows = users.length === 0
    ? `<tr><td colspan="6" style="text-align: center; color: #777; padding: 25px;">Henüz kayıtlı mezun bulunmuyor.</td></tr>`
    : users
        .map(
          (u) => `
      <tr>
        <td><strong>#${u.id}</strong></td>
        <td><a href="/users/${u.id}" style="color: #0366d6; text-decoration: none; font-weight: 600;">${u.name}</a></td>
        <td>${u.email}</td>
        <td>${u.department || 'Belirtilmedi'}</td>
        <td>${u.graduationYear || '-'}</td>
        <td style="white-space: nowrap;">
          <a href="/users/${u.id}" class="btn-detail" title="Profili Görüntüle">Gör</a>
          <a href="/users/${u.id}/edit" class="btn-edit" title="Mezunu Düzenle">Düzenle</a>
          <form method="POST" action="/users/${u.id}/delete" style="display: inline;" onsubmit="return confirm('${u.name} mezun kaydını silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn-delete" title="Mezunu Sil">Sil</button>
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
  <title>Mezunlar Dizini - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/">← Ana Sayfa</a>
    <a href="/about">Hakkında</a>
    <a href="/users"><strong>Mezunlar Listesi (Web)</strong></a>
    <a href="/announcements">Duyurular (Web)</a>
    <a href="/job-postings">İş İlanları (Web)</a>
    <a href="/applications">Başvurular (Web)</a>
    <a href="/api/users" target="_blank">JSON API (/api/users)</a>
    <a href="/api/swagger" target="_blank">Swagger Dokümantasyonu</a>
  </div>

  <h1>🎓 Mezunlar Dizini (Alumni Directory)</h1>
  <p>Alumni Tracking System web görünüm katmanı (View). Aşağıdaki formu kullanarak yeni mezun ekleyebilir, mevcut mezunları inceleyebilir, düzenleyebilir veya silebilirsiniz.</p>

  ${alertBox}

  <!-- Yeni Mezun Ekleme Formu (POST /users) -->
  <div class="card">
    <h3 style="margin-top: 0; margin-bottom: 15px;">➕ Yeni Mezun Ekle</h3>
    <form method="POST" action="/users">
      <div class="form-grid">
        <div class="form-group">
          <label for="name">Ad Soyad *</label>
          <input type="text" id="name" name="name" required placeholder="Örn: Zeynep Çelik">
        </div>
        <div class="form-group">
          <label for="email">E-Posta *</label>
          <input type="email" id="email" name="email" required placeholder="Örn: zeynep@alumni.edu">
        </div>
        <div class="form-group">
          <label for="department">Bölüm</label>
          <input type="text" id="department" name="department" placeholder="Örn: Bilgisayar Mühendisliği">
        </div>
        <div class="form-group">
          <label for="graduationYear">Mezuniyet Yılı</label>
          <input type="number" id="graduationYear" name="graduationYear" value="${currentYear}" min="1950" max="2050">
        </div>
        <button type="submit" class="btn-submit">💾 Mezun Kaydet</button>
      </div>
    </form>
  </div>

  <!-- Kayıtlı Mezunlar Tablosu -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
    <h3 style="margin: 0;">📋 Kayıtlı Mezunlar</h3>
    <span class="badge">Toplam: ${users.length} Mezun</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th>Ad Soyad</th>
        <th>E-Posta</th>
        <th>Bölüm</th>
        <th>Mezuniyet Yılı</th>
        <th style="width: 170px;">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      ${userRows}
    </tbody>
  </table>

  <div style="margin-top: 30px; font-size: 0.85em; color: #666; text-align: center;">
    Alumni Tracking System • MVC View Katmanı (<code>backend/src/views/userView.js</code>)
  </div>
</body>
</html>`;
};

/**
 * Mezun Düzenleme Sayfası (GET /users/:id/edit)
 * @param {Object} user - Mezun nesnesi
 * @param {Object} options - Ek bildirim seçenekleri (error)
 * @returns {string} Tam HTML çıktısı
 */
const renderEditUserPage = (user, options = {}) => {
  let alertBox = '';
  if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.name} - Mezun Bilgilerini Düzenle</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/">← Ana Sayfa</a>
    <a href="/users">← Mezunlar Listesi</a>
    <a href="/users/${user.id}">Profili Gör</a>
  </div>

  <h1>✏️ Mezun Bilgilerini Düzenle</h1>
  <p><strong>#${user.id}</strong> numaralı <strong>${user.name}</strong> mezun kaydının bilgilerini güncelliyorsunuz.</p>

  ${alertBox}

  <div class="card">
    <form method="POST" action="/users/${user.id}/update">
      <div class="form-grid">
        <div class="form-group">
          <label for="name">Ad Soyad *</label>
          <input type="text" id="name" name="name" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label for="email">E-Posta *</label>
          <input type="email" id="email" name="email" value="${user.email}" required>
        </div>
        <div class="form-group">
          <label for="department">Bölüm</label>
          <input type="text" id="department" name="department" value="${user.department || ''}">
        </div>
        <div class="form-group">
          <label for="graduationYear">Mezuniyet Yılı</label>
          <input type="number" id="graduationYear" name="graduationYear" value="${user.graduationYear || ''}" min="1950" max="2050">
        </div>
        <div style="grid-column: 1 / -1; display: flex; gap: 12px; margin-top: 10px;">
          <button type="submit" class="btn-submit" style="margin-top: 0; flex: 1;">💾 Değişiklikleri Kaydet</button>
          <a href="/users" class="btn-secondary">İptal</a>
        </div>
      </div>
    </form>
  </div>

  <div style="margin-top: 30px; font-size: 0.85em; color: #666; text-align: center;">
    Alumni Tracking System • Düzenleme Formu (<code>POST /users/${user.id}/update</code>)
  </div>
</body>
</html>`;
};

/**
 * Mezun Profil Detay Sayfası (GET /users/:id)
 * @param {Object} user - Mezun nesnesi
 * @returns {string} Tam HTML çıktısı
 */
const renderUserProfilePage = (user) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${user.name} - Mezun Profili</title>
  <style>
    ${baseStyles}
    .profile-card {
      background: white;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .info-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-label {
      font-weight: 600;
      color: #586069;
      width: 150px;
    }
    .info-value {
      color: #24292e;
    }
  </style>
</head>
<body>
  <div class="nav">
    <a href="/users">← Mezunlar Listesine Dön</a>
    <a href="/api/users/${user.id}" target="_blank">JSON Görüntüle</a>
  </div>

  <div class="profile-card">
    <span class="badge">Mezun ID: #${user.id}</span>
    <h1 style="border-bottom: none; margin-bottom: 0;">${user.name}</h1>
    <p style="color: #586069; margin-top: 4px;">${user.department || 'Bölüm belirtilmedi'}</p>

    <div class="info-row">
      <span class="info-label">E-Posta:</span>
      <span class="info-value"><a href="mailto:${user.email}">${user.email}</a></span>
    </div>
    <div class="info-row">
      <span class="info-label">Bölüm:</span>
      <span class="info-value">${user.department || 'Belirtilmedi'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Mezuniyet Yılı:</span>
      <span class="info-value">${user.graduationYear || 'Belirtilmedi'}</span>
    </div>
    ${user.createdAt ? `<div class="info-row"><span class="info-label">Kayıt Tarihi:</span><span class="info-value">${user.createdAt}</span></div>` : ''}
    ${user.updatedAt ? `<div class="info-row"><span class="info-label">Son Güncelleme:</span><span class="info-value">${user.updatedAt}</span></div>` : ''}

    <div style="margin-top: 25px; display: flex; gap: 10px; align-items: center;">
      <a href="/users" class="btn-back">← Tüm Mezunları Listele</a>
      <a href="/users/${user.id}/edit" class="btn-edit" style="padding: 8px 16px; font-size: 0.95em;">✏️ Düzenle</a>
      <form method="POST" action="/users/${user.id}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${user.name} mezun kaydını silmek istediğinize emin misiniz?');">
        <button type="submit" class="btn-delete" style="padding: 8px 16px; font-size: 0.95em;">🗑️ Sil</button>
      </form>
    </div>
  </div>
</body>
</html>`;
};

/**
 * 404 Kullanıcı Bulunamadı Sayfası
 * @param {string|number} id - Aranan ID
 * @returns {string} Tam HTML çıktısı
 */
const renderUserNotFoundPage = (id) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kullanıcı Bulunamadı - 404</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/users">← Mezunlar Listesi</a>
  </div>
  <div class="card" style="text-align: center; padding: 40px 20px;">
    <h2>❌ Mezun Bulunamadı (404)</h2>
    <p>Aradığınız <strong>#${id}</strong> numaralı mezun kaydı sistemde mevcut değil.</p>
    <a href="/users" class="btn-detail" style="display: inline-block; margin-top: 15px; padding: 8px 16px;">Mezunlar Listesine Dön</a>
  </div>
</body>
</html>`;
};

module.exports = {
  renderUsersPage,
  renderEditUserPage,
  renderUserProfilePage,
  renderUserNotFoundPage,
};
