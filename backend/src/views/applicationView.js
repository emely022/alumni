/**
 * Application View (Görünüm Katmanı)
 * 
 * MVC mimarisinin View katmanıdır.
 * İş başvuruları listesi, yeni başvuru formu, başvuru düzenleme formu
 * ve başvuru detay sayfası için gerekli HTML şablonlarını oluşturmaktan sorumludur.
 */

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 950px;
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
  @media (max-width: 700px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
  .form-group {
    display: flex;
    flex-direction: column;
  }
  .form-group.full-width {
    grid-column: 1 / -1;
  }
  .form-group label {
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.9em;
    color: #444;
  }
  .form-group input, .form-group select, .form-group textarea {
    padding: 9px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.95em;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
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
    padding: 8px 16px;
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
    vertical-align: middle;
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
    font-size: 0.8em;
    font-weight: 600;
    text-transform: capitalize;
  }
  .badge-pending {
    background: #fff8c5;
    color: #9a6700;
    border: 1px solid #f9e2af;
  }
  .badge-reviewed {
    background: #ddf4ff;
    color: #0969da;
    border: 1px solid #b6e3ff;
  }
  .badge-interview {
    background: #fbefff;
    color: #8250df;
    border: 1px solid #ecd8ff;
  }
  .badge-accepted {
    background: #dafbe1;
    color: #1a7f37;
    border: 1px solid #aceebb;
  }
  .badge-rejected {
    background: #ffebe9;
    color: #cf222e;
    border: 1px solid #ffcecb;
  }
  .badge-withdrawn {
    background: #f6f8fa;
    color: #57606a;
    border: 1px solid #d0d7de;
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
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  .detail-item {
    background: #f8fafc;
    padding: 12px 16px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }
  .detail-label {
    font-size: 0.8em;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .detail-value {
    font-size: 1.05em;
    color: #0f172a;
    font-weight: 500;
  }
`;

const getStatusBadge = (status) => {
  const s = (status || 'pending').toLowerCase();
  let badgeClass = 'badge-pending';
  let label = 'Beklemede (pending)';

  if (s === 'reviewed') {
    badgeClass = 'badge-reviewed';
    label = 'İncelendi (reviewed)';
  } else if (s === 'interview') {
    badgeClass = 'badge-interview';
    label = 'Mülakat (interview)';
  } else if (s === 'accepted') {
    badgeClass = 'badge-accepted';
    label = 'Kabul Edildi (accepted)';
  } else if (s === 'rejected') {
    badgeClass = 'badge-rejected';
    label = 'Reddedildi (rejected)';
  } else if (s === 'withdrawn') {
    badgeClass = 'badge-withdrawn';
    label = 'Geri Çekildi (withdrawn)';
  }

  return `<span class="badge ${badgeClass}">${label}</span>`;
};

/**
 * İş Başvuruları Listesi ve Yeni Başvuru Formu Sayfası (GET /applications)
 * @param {Array} applications - Başvurular dizisi
 * @param {Object} options - { success, error, selectedJobId }
 * @param {Object} extraData - { jobPostings: [], users: [] }
 * @returns {string} Tam HTML çıktısı
 */
const renderApplicationsPage = (applications = [], options = {}, extraData = { jobPostings: [], users: [] }) => {
  const jobPostings = extraData.jobPostings || [];
  const users = extraData.users || [];
  const selectedJobId = options.selectedJobId ? parseInt(options.selectedJobId, 10) : null;

  let alertBox = '';
  if (options.success) {
    alertBox = `<div class="alert alert-success">✅ ${options.success}</div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  const jobOptions = jobPostings
    .map(
      (j) =>
        `<option value="${j.id}" ${selectedJobId === j.id ? 'selected' : ''}>#${j.id} - ${j.title} @ ${j.company}</option>`
    )
    .join('');

  const userOptions = users
    .map((u) => `<option value="${u.id}">${u.name} (${u.email})</option>`)
    .join('');

  const appRows = applications.length === 0
    ? `<tr><td colspan="7" style="text-align: center; color: #777; padding: 25px;">Henüz kaydedilmiş başvuru bulunmuyor.</td></tr>`
    : applications
        .map(
          (app) => `
      <tr>
        <td><strong>#${app.id}</strong></td>
        <td>
          <a href="/job-postings/${app.jobPostingId}" style="color: #0366d6; text-decoration: none; font-weight: 600;">İlan #${app.jobPostingId}</a>
          <div style="font-size: 0.85em; color: #555;">${app.jobTitle ? `${app.jobTitle} @ ${app.company}` : ''}</div>
        </td>
        <td>
          <a href="/users/${app.userId}" style="color: #0366d6; text-decoration: none; font-weight: 600;">${app.userName ? app.userName : `Mezun #${app.userId}`}</a>
          <div style="font-size: 0.85em; color: #666;">${app.userEmail || ''}</div>
        </td>
        <td>${getStatusBadge(app.status)}</td>
        <td>${app.appliedAt ? app.appliedAt.substring(0, 10) : '-'}</td>
        <td>
          ${app.resumeUrl ? `<a href="${app.resumeUrl}" target="_blank" style="color: #0366d6; font-size: 0.9em;">Özgeçmiş ↗</a>` : '<span style="color: #999;">Yok</span>'}
        </td>
        <td style="white-space: nowrap;">
          <a href="/applications/${app.id}" class="btn-detail" title="Başvuru Detayı">Gör</a>
          <a href="/applications/${app.id}/edit" class="btn-edit" title="Başvuruyu Düzenle">Düzenle</a>
          <form method="POST" action="/applications/${app.id}/delete" style="display: inline;" onsubmit="return confirm('#${app.id} numaralı başvuruyu silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn-delete" title="Başvuruyu Sil">Sil</button>
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
  <title>İş Başvuruları - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/">← Ana Sayfa</a>
    <a href="/users">Mezunlar (Web)</a>
    <a href="/announcements">Duyurular (Web)</a>
    <a href="/job-postings">İş İlanları (Web)</a>
    <a href="/applications"><strong>Başvurular (Web)</strong></a>
    <a href="/api/applications" target="_blank">JSON API (/api/applications)</a>
    <a href="/api/swagger" target="_blank">Swagger Dokümantasyonu</a>
  </div>

  <h1>📄 İş Başvuruları (Job Applications)</h1>
  <p>Alumni Tracking System kariyer başvuruları arayüzü. Mezunların iş ve staj ilanlarına yaptıkları başvuruları inceleyebilir, yeni başvuru ekleyebilir veya başvuru durumlarını yönetebilirsiniz.</p>

  ${alertBox}

  <!-- Yeni Başvuru Formu (POST /applications) -->
  <div class="card">
    <h3 style="margin-top: 0; margin-bottom: 15px;">➕ Yeni İş Başvurusu Yap / Kaydet</h3>
    <form method="POST" action="/applications">
      <div class="form-grid">
        <div class="form-group">
          <label for="jobPostingId">Başvurulacak İş İlanı *</label>
          <select id="jobPostingId" name="jobPostingId" required>
            <option value="">-- İlan Seçiniz --</option>
            ${jobOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="userId">Başvuran Mezun / Kullanıcı *</label>
          <select id="userId" name="userId" required>
            <option value="">-- Mezun Seçiniz --</option>
            ${userOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="status">Başvuru Durumu</label>
          <select id="status" name="status">
            <option value="pending">Beklemede (pending)</option>
            <option value="reviewed">İncelendi (reviewed)</option>
            <option value="interview">Mülakat (interview)</option>
            <option value="accepted">Kabul Edildi (accepted)</option>
            <option value="rejected">Reddedildi (rejected)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="resumeUrl">Özgeçmiş / CV Bağlantısı (URL)</label>
          <input type="url" id="resumeUrl" name="resumeUrl" placeholder="Örn: https://drive.google.com/cv.pdf">
        </div>
        <div class="form-group full-width">
          <label for="coverNote">Ön Yazı / Motivasyon Notu</label>
          <textarea id="coverNote" name="coverNote" rows="3" placeholder="Pozisyona uygunluk gerekçesi ve kısa tanıtım..."></textarea>
        </div>
        <button type="submit" class="btn-submit">🚀 Başvuruyu Gönder</button>
      </div>
    </form>
  </div>

  <!-- Başvurular Tablosu -->
  <h2>📋 Kayıtlı Başvurular Listesi (${applications.length})</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th>İş İlanı</th>
        <th>Başvuran Mezun</th>
        <th>Durum</th>
        <th>Başvuru Tarihi</th>
        <th>Özgeçmiş</th>
        <th style="width: 140px;">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      ${appRows}
    </tbody>
  </table>
</body>
</html>`;
};

/**
 * Başvuru Detay Sayfası (GET /applications/:id)
 * @param {Object} app - Başvuru nesnesi
 * @param {Object} extraData - { jobPosting: null, user: null }
 * @returns {string} Tam HTML çıktısı
 */
const renderApplicationDetailPage = (app, extraData = { jobPosting: null, user: null }) => {
  const job = extraData.jobPosting;
  const user = extraData.user;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Başvuru #${app.id} Detayı - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/applications">← Başvurular Listesi</a>
    <a href="/job-postings">İş İlanları</a>
    <a href="/users">Mezunlar</a>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
      <div>
        <h1 style="border: none; margin-bottom: 5px;">Başvuru #${app.id}</h1>
        <h3 style="color: #4a5568; margin-top: 0;">📅 ${app.appliedAt ? app.appliedAt.substring(0, 10) : '-'}</h3>
      </div>
      <div>
        ${getStatusBadge(app.status)}
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Başvurulan İlan</div>
        <div class="detail-value">
          ${job ? `<a href="/job-postings/${job.id}">💼 ${job.title} @ ${job.company}</a>` : `İlan #${app.jobPostingId}`}
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Başvuran Mezun</div>
        <div class="detail-value">
          ${user ? `<a href="/users/${user.id}">🎓 ${user.name} (${user.email})</a>` : `Kullanıcı #${app.userId}`}
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Özgeçmiş / CV</div>
        <div class="detail-value">
          ${app.resumeUrl ? `<a href="${app.resumeUrl}" target="_blank">📄 Özgeçmişi Görüntüle ↗</a>` : 'Özgeçmiş yüklenmemiş'}
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Son Güncellenme</div>
        <div class="detail-value">
          🕒 ${app.updatedAt ? app.updatedAt.substring(0, 10) : 'Güncellenmedi'}
        </div>
      </div>
    </div>

    ${user ? `
    <h3>👤 Aday Mezun Bilgileri</h3>
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Bölüm</div>
        <div class="detail-value">${user.department || 'Belirtilmedi'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Mezuniyet Yılı</div>
        <div class="detail-value">${user.graduationYear || 'Belirtilmedi'}</div>
      </div>
    </div>` : ''}

    <h3>📝 Ön Yazı / Başvuru Notu</h3>
    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-line; margin-bottom: 20px;">
      ${app.coverNote || 'Ön yazı eklenmemiş.'}
    </div>

    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eaecef; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
      <a href="/applications/${app.id}/edit" class="btn-edit" style="padding: 8px 16px; font-size: 0.95em;">✏️ Durumu / Başvuruyu Düzenle</a>
      <form method="POST" action="/applications/${app.id}/delete" style="display: inline;" onsubmit="return confirm('#${app.id} numaralı başvuruyu silmek istediğinize emin misiniz?');">
        <button type="submit" class="btn-delete" style="padding: 8px 16px; font-size: 0.95em;">🗑️ Başvuruyu Sil</button>
      </form>
      <a href="/applications" class="btn-secondary" style="margin-left: auto;">Başvurular Listesine Dön</a>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Başvuru Düzenleme Sayfası (GET /applications/:id/edit)
 * @param {Object} app - Mevcut başvuru nesnesi
 * @param {Object} options - Ek seçenekler (error vb.)
 * @param {Object} extraData - { jobPosting: null, user: null }
 * @returns {string} Tam HTML çıktısı
 */
const renderEditApplicationPage = (app, options = {}, extraData = { jobPosting: null, user: null }) => {
  const job = extraData.jobPosting;
  const user = extraData.user;

  let alertBox = '';
  if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Başvuru Düzenle: #${app.id} - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/applications">← Başvurular Listesi</a>
    <a href="/applications/${app.id}">Başvuru Detayı</a>
  </div>

  <h1>✏️ Başvuru Düzenle (#${app.id})</h1>
  ${alertBox}

  <div class="card">
    <p style="margin-top: 0; color: #555;">
      <strong>İlan:</strong> ${job ? `${job.title} @ ${job.company}` : `İlan #${app.jobPostingId}`} | 
      <strong>Aday:</strong> ${user ? `${user.name} (${user.email})` : `Kullanıcı #${app.userId}`}
    </p>

    <form method="POST" action="/applications/${app.id}/update">
      <div class="form-grid">
        <div class="form-group">
          <label for="status">Başvuru Durumu *</label>
          <select id="status" name="status" required>
            <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Beklemede (pending)</option>
            <option value="reviewed" ${app.status === 'reviewed' ? 'selected' : ''}>İncelendi (reviewed)</option>
            <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>Mülakat (interview)</option>
            <option value="accepted" ${app.status === 'accepted' ? 'selected' : ''}>Kabul Edildi (accepted)</option>
            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Reddedildi (rejected)</option>
            <option value="withdrawn" ${app.status === 'withdrawn' ? 'selected' : ''}>Geri Çekildi (withdrawn)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="resumeUrl">Özgeçmiş / CV Bağlantısı</label>
          <input type="url" id="resumeUrl" name="resumeUrl" value="${app.resumeUrl || ''}">
        </div>
        <div class="form-group full-width">
          <label for="coverNote">Ön Yazı / Başvuru Notu</label>
          <textarea id="coverNote" name="coverNote" rows="4">${app.coverNote || ''}</textarea>
        </div>

        <div style="grid-column: 1 / -1; display: flex; gap: 10px; margin-top: 10px;">
          <button type="submit" class="btn-submit" style="flex: 1;">💾 Güncellemeyi Kaydet</button>
          <a href="/applications/${app.id}" class="btn-secondary" style="flex: 0 0 auto; display: flex; align-items: center;">İptal</a>
        </div>
      </div>
    </form>
  </div>
</body>
</html>`;
};

/**
 * 404 Başvuru Bulunamadı Sayfası
 * @param {string|number} id
 * @returns {string} Tam HTML çıktısı
 */
const renderApplicationNotFoundPage = (id) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Başvuru Bulunamadı - 404</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/applications">← Başvurular Listesi</a>
  </div>
  <div class="card" style="text-align: center; padding: 40px 20px;">
    <h2>❌ Başvuru Bulunamadı (404)</h2>
    <p>Aradığınız <strong>#${id}</strong> numaralı iş başvurusu sistemde mevcut değil.</p>
    <a href="/applications" class="btn-detail" style="display: inline-block; margin-top: 15px; padding: 8px 16px;">Başvurular Listesine Dön</a>
  </div>
</body>
</html>`;
};

module.exports = {
  renderApplicationsPage,
  renderApplicationDetailPage,
  renderEditApplicationPage,
  renderApplicationNotFoundPage,
};
