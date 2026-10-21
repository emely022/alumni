/**
 * JobPosting View (Görünüm Katmanı)
 * 
 * MVC mimarisinin View katmanıdır.
 * İş ilanları listesi, yeni ilan oluşturma formu, ilan düzenleme formu
 * ve ilan detay sayfası için gerekli HTML şablonlarını oluşturmaktan sorumludur.
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
  }
  .badge-active {
    background: #e6ffed;
    color: #155724;
    border: 1px solid #acf2bd;
  }
  .badge-inactive {
    background: #ffeef0;
    color: #86181d;
    border: 1px solid #fdaeb7;
  }
  .badge-type {
    background: #e1f5fe;
    color: #0288d1;
    border: 1px solid #b3e5fc;
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

/**
 * İş İlanları Listesi ve Yeni İlan Ekleme Formu Sayfası (GET /job-postings)
 * @param {Array} jobPostings - İş ilanları dizisi
 * @param {Object} options - Ek bildirim seçenekleri (success, error)
 * @param {Object} extraData - { users: [], departments: [] }
 * @returns {string} Tam HTML çıktısı
 */
const renderJobPostingsPage = (jobPostings = [], options = {}, extraData = { users: [], departments: [] }) => {
  const users = extraData.users || [];
  const departments = extraData.departments || [];

  let alertBox = '';
  if (options.success) {
    alertBox = `<div class="alert alert-success">✅ ${options.success}</div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  const userOptions = users
    .map((u) => `<option value="${u.id}">${u.name} (${u.email})</option>`)
    .join('');

  const deptOptions = departments
    .map((d) => `<option value="${d.id}">${d.name} (${d.code})</option>`)
    .join('');

  const jobRows = jobPostings.length === 0
    ? `<tr><td colspan="7" style="text-align: center; color: #777; padding: 25px;">Henüz yayınlanmış iş ilanı bulunmuyor.</td></tr>`
    : jobPostings
        .map(
          (j) => `
      <tr>
        <td><strong>#${j.id}</strong></td>
        <td>
          <a href="/job-postings/${j.id}" style="color: #0366d6; text-decoration: none; font-weight: 600;">${j.title}</a>
          <div style="font-size: 0.85em; color: #555;">🏢 ${j.company}</div>
        </td>
        <td>
          <div>${j.location || 'Belirtilmedi'}</div>
          <span class="badge badge-type">${j.employmentType || 'full-time'}</span>
        </td>
        <td>${j.deadline ? j.deadline : 'Süresiz'}</td>
        <td>
          ${j.isActive ? '<span class="badge badge-active">Aktif</span>' : '<span class="badge badge-inactive">Pasif</span>'}
        </td>
        <td>${j.createdAt ? j.createdAt.substring(0, 10) : '-'}</td>
        <td style="white-space: nowrap;">
          <a href="/job-postings/${j.id}" class="btn-detail" title="İlanı Görüntüle">Gör</a>
          <a href="/job-postings/${j.id}/edit" class="btn-edit" title="İlanı Düzenle">Düzenle</a>
          <form method="POST" action="/job-postings/${j.id}/delete" style="display: inline;" onsubmit="return confirm('${j.title} (@${j.company}) ilanını silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn-delete" title="İlanı Sil">Sil</button>
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
  <title>Kariyer ve İş İlanları - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/">← Ana Sayfa</a>
    <a href="/users">Mezunlar (Web)</a>
    <a href="/announcements">Duyurular (Web)</a>
    <a href="/job-postings"><strong>İş İlanları (Web)</strong></a>
    <a href="/applications">Başvurular (Web)</a>
    <a href="/api/job-postings" target="_blank">JSON API (/api/job-postings)</a>
    <a href="/api/swagger" target="_blank">Swagger Dokümantasyonu</a>
  </div>

  <h1>💼 Kariyer ve İş İlanları (Job Postings)</h1>
  <p>Alumni Tracking System kariyer ve iş fırsatları yönetim arayüzü. Mezunlar ve partner kuruluşlar için yeni staj ve iş ilanları yayınlayabilir, başvuruları inceleyebilirsiniz.</p>

  ${alertBox}

  <!-- Yeni İş İlanı Ekleme Formu (POST /job-postings) -->
  <div class="card">
    <h3 style="margin-top: 0; margin-bottom: 15px;">➕ Yeni İş İlanı Yayınla</h3>
    <form method="POST" action="/job-postings">
      <div class="form-grid">
        <div class="form-group">
          <label for="title">İlan Başlığı *</label>
          <input type="text" id="title" name="title" required placeholder="Örn: Kıdemli Full Stack Geliştirici">
        </div>
        <div class="form-group">
          <label for="company">Şirket / Kurum Adı *</label>
          <input type="text" id="company" name="company" required placeholder="Örn: Trendyol Tech">
        </div>
        <div class="form-group">
          <label for="location">Konum / Şehir</label>
          <input type="text" id="location" name="location" placeholder="Örn: İstanbul / Hibrit veya Uzaktan">
        </div>
        <div class="form-group">
          <label for="employmentType">Çalışma Türü *</label>
          <select id="employmentType" name="employmentType" required>
            <option value="full-time">Tam Zamanlı (full-time)</option>
            <option value="part-time">Yarı Zamanlı (part-time)</option>
            <option value="internship">Staj (internship)</option>
            <option value="contract">Sözleşmeli (contract)</option>
            <option value="remote">Uzaktan (remote)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="salaryRange">Maaş Aralığı</label>
          <input type="text" id="salaryRange" name="salaryRange" placeholder="Örn: 80.000 - 120.000 TL">
        </div>
        <div class="form-group">
          <label for="deadline">Son Başvuru Tarihi</label>
          <input type="date" id="deadline" name="deadline">
        </div>
        <div class="form-group">
          <label for="contactEmail">İletişim / Başvuru E-Postası</label>
          <input type="email" id="contactEmail" name="contactEmail" placeholder="Örn: kariyer@sirket.com">
        </div>
        <div class="form-group">
          <label for="applicationUrl">Online Başvuru Bağlantısı (URL)</label>
          <input type="url" id="applicationUrl" name="applicationUrl" placeholder="Örn: https://sirket.com/kariyer">
        </div>
        <div class="form-group">
          <label for="postedBy">İlanı Yayınlayan Mezun (posted_by)</label>
          <select id="postedBy" name="postedBy">
            <option value="">-- Mezun Seçiniz (Opsiyonel) --</option>
            ${userOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="departmentId">Hedef Bölüm (department_id)</label>
          <select id="departmentId" name="departmentId">
            <option value="">-- Tüm Bölümler / Genel --</option>
            ${deptOptions}
          </select>
        </div>
        <div class="form-group full-width">
          <label for="description">İş Tanımı ve Detaylar *</label>
          <textarea id="description" name="description" rows="3" required placeholder="Pozisyon sorumlulukları, proje hedefleri ve ekip yapısı..."></textarea>
        </div>
        <div class="form-group full-width">
          <label for="requirements">Aday Kriterleri ve Gereksinimler</label>
          <textarea id="requirements" name="requirements" rows="2" placeholder="Teknolojiler, deneyim süresi, yetkinlikler..."></textarea>
        </div>
        <button type="submit" class="btn-submit">🚀 İlanı Yayınla</button>
      </div>
    </form>
  </div>

  <!-- İş İlanları Tablosu -->
  <h2>📋 Güncel İş İlanları Listesi (${jobPostings.length})</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 50px;">ID</th>
        <th>Pozisyon / Şirket</th>
        <th>Konum & Tür</th>
        <th>Son Başvuru</th>
        <th>Durum</th>
        <th>Yayın Tarihi</th>
        <th style="width: 140px;">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      ${jobRows}
    </tbody>
  </table>
</body>
</html>`;
};

/**
 * İş İlanı Detay Sayfası (GET /job-postings/:id)
 * @param {Object} job - İş ilanı nesnesi
 * @param {Object} extraData - { poster: null, department: null, applications: [] }
 * @returns {string} Tam HTML çıktısı
 */
const renderJobPostingDetailPage = (job, extraData = { poster: null, department: null, applications: [] }) => {
  const poster = extraData.poster;
  const department = extraData.department;
  const applications = extraData.applications || [];

  const appRows = applications.length === 0
    ? `<tr><td colspan="5" style="text-align: center; color: #777; padding: 15px;">Bu ilana henüz başvuru yapılmamış.</td></tr>`
    : applications
        .map(
          (app) => `
      <tr>
        <td><strong>#${app.id}</strong></td>
        <td>User #${app.userId}</td>
        <td><span class="badge badge-type">${app.status}</span></td>
        <td>${app.appliedAt ? app.appliedAt.substring(0, 10) : '-'}</td>
        <td>
          <a href="/applications/${app.id}" class="btn-detail" title="Başvuru Detayı">Gör</a>
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
  <title>${job.title} @ ${job.company} - İş İlanı Detayı</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/job-postings">← İş İlanları Listesi</a>
    <a href="/applications">Başvurular</a>
    <a href="/users">Mezunlar</a>
  </div>

  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
      <div>
        <h1 style="border: none; margin-bottom: 5px;">${job.title}</h1>
        <h3 style="color: #4a5568; margin-top: 0;">🏢 ${job.company}</h3>
      </div>
      <div>
        ${job.isActive ? '<span class="badge badge-active" style="font-size: 1em; padding: 6px 12px;">Aktif İlan</span>' : '<span class="badge badge-inactive" style="font-size: 1em; padding: 6px 12px;">Pasif İlan</span>'}
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Konum</div>
        <div class="detail-value">📍 ${job.location || 'Belirtilmedi'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Çalışma Türü</div>
        <div class="detail-value">💼 ${job.employmentType || 'full-time'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Maaş Aralığı</div>
        <div class="detail-value">💰 ${job.salaryRange || 'Belirtilmedi'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Son Başvuru Tarihi</div>
        <div class="detail-value">📅 ${job.deadline ? job.deadline : 'Süresiz'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">İletişim E-Postası</div>
        <div class="detail-value">✉️ ${job.contactEmail ? `<a href="mailto:${job.contactEmail}">${job.contactEmail}</a>` : 'Belirtilmedi'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Başvuru Bağlantısı</div>
        <div class="detail-value">🔗 ${job.applicationUrl ? `<a href="${job.applicationUrl}" target="_blank">Başvuru Sayfasına Git ↗</a>` : 'Belirtilmedi'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Yayınlayan Mezun</div>
        <div class="detail-value">👤 ${poster ? `<a href="/users/${poster.id}">${poster.name}</a>` : (job.postedBy ? `User #${job.postedBy}` : 'Genel / Kurumsal')}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Hedef Bölüm</div>
        <div class="detail-value">🏛️ ${department ? `${department.name} (${department.code})` : (job.departmentId ? `Dept #${job.departmentId}` : 'Tüm Bölümler')}</div>
      </div>
    </div>

    <h3>📝 İş Tanımı</h3>
    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-line; margin-bottom: 20px;">
      ${job.description}
    </div>

    ${job.requirements ? `
    <h3>🎯 Aday Kriterleri ve Gereksinimler</h3>
    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-line; margin-bottom: 20px;">
      ${job.requirements}
    </div>` : ''}

    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eaecef; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
      <a href="/job-postings/${job.id}/edit" class="btn-edit" style="padding: 8px 16px; font-size: 0.95em;">✏️ İlanı Düzenle</a>
      <a href="/applications?job_id=${job.id}" class="btn-detail" style="padding: 8px 16px; font-size: 0.95em; background-color: #2ea44f;">📄 Başvuru Yap</a>
      <form method="POST" action="/job-postings/${job.id}/delete" style="display: inline;" onsubmit="return confirm('${job.title} ilanını silmek istediğinize emin misiniz?');">
        <button type="submit" class="btn-delete" style="padding: 8px 16px; font-size: 0.95em;">🗑️ İlanı Sil</button>
      </form>
      <a href="/job-postings" class="btn-secondary" style="margin-left: auto;">İlanlar Listesine Dön</a>
    </div>
  </div>

  <!-- Bu İlana Yapılan Başvurular Tablosu -->
  <div class="card">
    <h3>📨 Bu İlana Yapılan Başvurular (${applications.length})</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Aday ID</th>
          <th>Durum</th>
          <th>Tarih</th>
          <th>Detay</th>
        </tr>
      </thead>
      <tbody>
        ${appRows}
      </tbody>
    </table>
  </div>
</body>
</html>`;
};

/**
 * İş İlanı Düzenleme Sayfası (GET /job-postings/:id/edit)
 * @param {Object} job - Mevcut iş ilanı
 * @param {Object} options - Ek seçenekler (error vb.)
 * @param {Object} extraData - { users: [], departments: [] }
 * @returns {string} Tam HTML çıktısı
 */
const renderEditJobPostingPage = (job, options = {}, extraData = { users: [], departments: [] }) => {
  const users = extraData.users || [];
  const departments = extraData.departments || [];

  let alertBox = '';
  if (options.error) {
    alertBox = `<div class="alert alert-error">❌ ${options.error}</div>`;
  }

  const userOptions = users
    .map(
      (u) =>
        `<option value="${u.id}" ${job.postedBy === u.id ? 'selected' : ''}>${u.name} (${u.email})</option>`
    )
    .join('');

  const deptOptions = departments
    .map(
      (d) =>
        `<option value="${d.id}" ${job.departmentId === d.id ? 'selected' : ''}>${d.name} (${d.code})</option>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İlan Düzenle: ${job.title} - Alumni Tracking System</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/job-postings">← İlanlar Listesi</a>
    <a href="/job-postings/${job.id}">İlan Detayı</a>
  </div>

  <h1>✏️ İş İlanını Düzenle (#${job.id})</h1>
  ${alertBox}

  <div class="card">
    <form method="POST" action="/job-postings/${job.id}/update">
      <div class="form-grid">
        <div class="form-group">
          <label for="title">İlan Başlığı *</label>
          <input type="text" id="title" name="title" required value="${job.title || ''}">
        </div>
        <div class="form-group">
          <label for="company">Şirket / Kurum Adı *</label>
          <input type="text" id="company" name="company" required value="${job.company || ''}">
        </div>
        <div class="form-group">
          <label for="location">Konum</label>
          <input type="text" id="location" name="location" value="${job.location || ''}">
        </div>
        <div class="form-group">
          <label for="employmentType">Çalışma Türü *</label>
          <select id="employmentType" name="employmentType" required>
            <option value="full-time" ${job.employmentType === 'full-time' ? 'selected' : ''}>Tam Zamanlı (full-time)</option>
            <option value="part-time" ${job.employmentType === 'part-time' ? 'selected' : ''}>Yarı Zamanlı (part-time)</option>
            <option value="internship" ${job.employmentType === 'internship' ? 'selected' : ''}>Staj (internship)</option>
            <option value="contract" ${job.employmentType === 'contract' ? 'selected' : ''}>Sözleşmeli (contract)</option>
            <option value="remote" ${job.employmentType === 'remote' ? 'selected' : ''}>Uzaktan (remote)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="salaryRange">Maaş Aralığı</label>
          <input type="text" id="salaryRange" name="salaryRange" value="${job.salaryRange || ''}">
        </div>
        <div class="form-group">
          <label for="deadline">Son Başvuru Tarihi</label>
          <input type="date" id="deadline" name="deadline" value="${job.deadline ? job.deadline : ''}">
        </div>
        <div class="form-group">
          <label for="contactEmail">İletişim E-Postası</label>
          <input type="email" id="contactEmail" name="contactEmail" value="${job.contactEmail || ''}">
        </div>
        <div class="form-group">
          <label for="applicationUrl">Başvuru Bağlantısı (URL)</label>
          <input type="url" id="applicationUrl" name="applicationUrl" value="${job.applicationUrl || ''}">
        </div>
        <div class="form-group">
          <label for="postedBy">Yayınlayan Mezun</label>
          <select id="postedBy" name="postedBy">
            <option value="">-- Seçiniz (Opsiyonel) --</option>
            ${userOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="departmentId">Hedef Bölüm</label>
          <select id="departmentId" name="departmentId">
            <option value="">-- Tüm Bölümler / Genel --</option>
            ${deptOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="isActive">İlan Durumu</label>
          <select id="isActive" name="isActive">
            <option value="true" ${job.isActive ? 'selected' : ''}>Aktif</option>
            <option value="false" ${!job.isActive ? 'selected' : ''}>Pasif / Arşiv</option>
          </select>
        </div>
        <div class="form-group full-width">
          <label for="description">İş Tanımı *</label>
          <textarea id="description" name="description" rows="4" required>${job.description || ''}</textarea>
        </div>
        <div class="form-group full-width">
          <label for="requirements">Aday Kriterleri ve Gereksinimler</label>
          <textarea id="requirements" name="requirements" rows="3">${job.requirements || ''}</textarea>
        </div>

        <div style="grid-column: 1 / -1; display: flex; gap: 10px; margin-top: 10px;">
          <button type="submit" class="btn-submit" style="flex: 1;">💾 Değişiklikleri Kaydet</button>
          <a href="/job-postings/${job.id}" class="btn-secondary" style="flex: 0 0 auto; display: flex; align-items: center;">İptal</a>
        </div>
      </div>
    </form>
  </div>
</body>
</html>`;
};

/**
 * 404 İş İlanı Bulunamadı Sayfası
 * @param {string|number} id
 * @returns {string} Tam HTML çıktısı
 */
const renderJobPostingNotFoundPage = (id) => {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İş İlanı Bulunamadı - 404</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="nav">
    <a href="/job-postings">← İş İlanları Listesi</a>
  </div>
  <div class="card" style="text-align: center; padding: 40px 20px;">
    <h2>❌ İş İlanı Bulunamadı (404)</h2>
    <p>Aradığınız <strong>#${id}</strong> numaralı iş ilanı sistemde mevcut değil.</p>
    <a href="/job-postings" class="btn-detail" style="display: inline-block; margin-top: 15px; padding: 8px 16px;">İş İlanları Listesine Dön</a>
  </div>
</body>
</html>`;
};

module.exports = {
  renderJobPostingsPage,
  renderJobPostingDetailPage,
  renderEditJobPostingPage,
  renderJobPostingNotFoundPage,
};
