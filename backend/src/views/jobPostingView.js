/**
 * JobPosting View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun:
 * - Koyu yeşil zemin: #214539
 * - Header, Menü, Logo, Footer
 * - Beyaz kartlar, sarı butonlar ve Arial tipografi
 */

const { renderLayout, escapeHtml } = require('./layout');

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
    alertBox = `<div class="alert alert-success"><span>✅</span><div>${escapeHtml(options.success)}</div></div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const userOptions = users
    .map((u) => `<option value="${escapeHtml(u.id)}">${escapeHtml(u.name)} (${escapeHtml(u.email)})</option>`)
    .join('');

  const deptOptions = departments
    .map((d) => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)} (${escapeHtml(d.code)})</option>`)
    .join('');

  const jobRows = jobPostings.length === 0
    ? `<tr><td colspan="7" class="empty-state"><div class="empty-state-icon">💼</div><h3>Henüz yayınlanmış iş ilanı bulunmuyor</h3><p>Aşağıdaki formu kullanarak ilk kariyer veya staj fırsatını yayınlayabilirsiniz.</p></td></tr>`
    : jobPostings
        .map(
          (j) => `
      <tr>
        <td><strong>#${escapeHtml(j.id)}</strong></td>
        <td>
          <a href="/job-postings/${escapeHtml(j.id)}" style="font-weight: 700; color: #111827; text-decoration: none;">
            ${escapeHtml(j.title)}
          </a>
          <div style="font-size: 13px; color: #4B5563; margin-top: 2px;">🏢 ${escapeHtml(j.company)}</div>
        </td>
        <td>
          <div>${escapeHtml(j.location || 'Belirtilmedi')}</div>
          <span class="badge badge-info" style="margin-top: 4px;">${escapeHtml(j.employmentType || 'full-time')}</span>
        </td>
        <td>${j.deadline ? `<strong>${escapeHtml(j.deadline)}</strong>` : '<span style="color:#6B7280;">Süresiz</span>'}</td>
        <td>
          ${j.isActive ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-danger">Pasif</span>'}
        </td>
        <td style="font-size: 13px; color: #6B7280;">${j.createdAt ? escapeHtml(j.createdAt.substring(0, 10)) : '-'}</td>
        <td style="white-space: nowrap; text-align: right;">
          <a href="/job-postings/${escapeHtml(j.id)}" class="btn btn-secondary btn-sm" title="İlanı Görüntüle">Görüntüle</a>
          <a href="/job-postings/${escapeHtml(j.id)}/edit" class="btn btn-outline btn-sm" style="color: #111827; border-color: #D1D5DB; margin-left: 4px;" title="İlanı Düzenle">Düzenle</a>
          <form method="POST" action="/job-postings/${escapeHtml(j.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${escapeHtml(j.title)} (@${escapeHtml(j.company)}) ilanını silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;" title="İlanı Sil">Sil</button>
          </form>
        </td>
      </tr>
    `
        )
        .join('');

  const content = `
    ${alertBox}

    <!-- Güncel İş İlanları Tablosu -->
    <div class="card">
      <div class="card-title">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>💼 Güncel Kariyer ve Staj İlanları</span>
          <span class="badge badge-dark">Toplam: ${jobPostings.length}</span>
        </div>
        <a href="#new-job-form" class="btn btn-primary btn-sm">+ Yeni İlan Yayınla</a>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">ID</th>
              <th>Pozisyon & Şirket</th>
              <th>Konum & Çalışma Türü</th>
              <th>Son Başvuru</th>
              <th>Durum</th>
              <th>Yayın Tarihi</th>
              <th style="width: 200px; text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${jobRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Yeni İş İlanı Ekleme Formu (POST /job-postings) -->
    <div class="card" id="new-job-form">
      <div class="card-title">
        <span>➕ Mezunlar İçin Yeni İş/Staj İlanı Yayınla</span>
        <span class="badge badge-warning">Kariyer Formu</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 20px;">
        İstanbul Üniversitesi mezunları ve öğrencileri için tam zamanlı, yarı zamanlı veya staj fırsatlarını duyurun.
      </p>

      <form method="POST" action="/job-postings">
        <div class="form-grid">
          <div class="form-group">
            <label for="title">İlan / Pozisyon Başlığı *</label>
            <input type="text" id="title" name="title" required placeholder="Örn: Kıdemli Yazılım Geliştirici">
          </div>
          <div class="form-group">
            <label for="company">Şirket / Kurum Adı *</label>
            <input type="text" id="company" name="company" required placeholder="Örn: Aselsan / İÜ Teknokent">
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
            <input type="text" id="salaryRange" name="salaryRange" placeholder="Örn: 75.000 - 110.000 TL">
          </div>
          <div class="form-group">
            <label for="deadline">Son Başvuru Tarihi</label>
            <input type="date" id="deadline" name="deadline">
          </div>
          <div class="form-group">
            <label for="contactEmail">İletişim / Başvuru E-Postası</label>
            <input type="email" id="contactEmail" name="contactEmail" placeholder="Örn: kariyer@kurum.com">
          </div>
          <div class="form-group">
            <label for="applicationUrl">Online Başvuru Bağlantısı (URL)</label>
            <input type="url" id="applicationUrl" name="applicationUrl" placeholder="Örn: https://kurum.com/kariyer">
          </div>
          <div class="form-group">
            <label for="postedBy">İlanı Yayınlayan Mezun (posted_by)</label>
            <select id="postedBy" name="postedBy">
              <option value="">-- Mezun Seçiniz (Opsiyonel) --</option>
              ${userOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="departmentId">Hedef Fakülte / Bölüm</label>
            <select id="departmentId" name="departmentId">
              <option value="">-- Tüm Bölümler / Genel --</option>
              ${deptOptions}
            </select>
          </div>
          <div class="form-group full-width">
            <label for="description">İş Tanımı ve Detaylar *</label>
            <textarea id="description" name="description" rows="4" required placeholder="Pozisyon görevleri, çalışma ortamı ve beklentiler..."></textarea>
          </div>
          <div class="form-group full-width">
            <label for="requirements">Aday Kriterleri ve Gereksinimler</label>
            <textarea id="requirements" name="requirements" rows="3" placeholder="Aranan teknolojiler, deneyim seviyesi, yetkinlikler..."></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">🚀 İlanı Yayınla</button>
            <a href="/job-postings" class="btn btn-secondary">Temizle</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: 'Kariyer ve İş İlanları | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'jobs',
    pageTitle: '💼 Kariyer ve İş Fırsatları',
    pageSubtitle: 'İstanbul Üniversitesi mezun ağı ve partner kurumların sunduğu iş ve staj olanakları.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Kariyer & İlanlar</span>',
    content,
  });
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
    ? `<tr><td colspan="5" class="empty-state" style="padding: 24px;"><p>Bu ilana henüz başvuru yapılmamış.</p></td></tr>`
    : applications
        .map(
          (app) => `
      <tr>
        <td><strong>#${escapeHtml(app.id)}</strong></td>
        <td>Kullanıcı #${escapeHtml(app.userId)}</td>
        <td><span class="badge badge-info">${escapeHtml(app.status)}</span></td>
        <td>${app.appliedAt ? escapeHtml(app.appliedAt.substring(0, 10)) : '-'}</td>
        <td style="text-align: right;">
          <a href="/applications/${escapeHtml(app.id)}" class="btn btn-secondary btn-sm" title="Başvuru Detayı">Görüntüle</a>
        </td>
      </tr>
    `
        )
        .join('');

  const content = `
    <div class="card" style="max-width: 900px; margin: 0 auto 30px auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; padding-bottom: 20px; border-bottom: 1.5px solid #E5E7EB; margin-bottom: 24px;">
        <div>
          <div style="font-size: 13px; color: #6B7280; font-weight: 700; text-transform: uppercase;">İlan #${escapeHtml(job.id)}</div>
          <h1 style="font-size: 26px; font-weight: 700; color: #111827; margin: 4px 0 6px 0;">${escapeHtml(job.title)}</h1>
          <div style="font-size: 18px; color: #1F2937; font-weight: 600;">🏢 ${escapeHtml(job.company)}</div>
        </div>
        <div>
          ${job.isActive ? '<span class="badge badge-success" style="font-size: 14px; padding: 6px 16px;">Aktif İlan</span>' : '<span class="badge badge-danger" style="font-size: 14px; padding: 6px 16px;">Pasif İlan</span>'}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Konum</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">📍 ${escapeHtml(job.location || 'Belirtilmedi')}</div>
        </div>
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Çalışma Türü</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">💼 ${escapeHtml(job.employmentType || 'full-time')}</div>
        </div>
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Maaş Aralığı</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">💰 ${escapeHtml(job.salaryRange || 'Belirtilmedi')}</div>
        </div>
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Son Başvuru</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">📅 ${job.deadline ? escapeHtml(job.deadline) : 'Süresiz'}</div>
        </div>
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">İletişim E-Posta</div>
          <div style="font-size: 14px; font-weight: 600; margin-top: 4px;">
            ${job.contactEmail ? `<a href="mailto:${escapeHtml(job.contactEmail)}" style="color: #111827; text-decoration: underline;">${escapeHtml(job.contactEmail)}</a>` : 'Belirtilmedi'}
          </div>
        </div>
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Hedef Bölüm</div>
          <div style="font-size: 14px; font-weight: 600; color: #111827; margin-top: 4px;">
            ${department ? escapeHtml(department.name) : 'Tüm Bölümler'}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 10px;">📝 İş Tanımı</h3>
        <div style="background-color: #FAFAFA; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; line-height: 1.7; color: #374151; white-space: pre-line;">
${escapeHtml(job.description)}
        </div>
      </div>

      ${job.requirements ? `
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 10px;">🎯 Aday Kriterleri ve Gereksinimler</h3>
        <div style="background-color: #FAFAFA; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; line-height: 1.7; color: #374151; white-space: pre-line;">
${escapeHtml(job.requirements)}
        </div>
      </div>
      ` : ''}

      <div style="display: flex; gap: 12px; align-items: center; border-top: 1.5px solid #E5E7EB; padding-top: 20px; flex-wrap: wrap;">
        <a href="/job-postings" class="btn btn-secondary">← Tüm İlanlar</a>
        <a href="/job-postings/${escapeHtml(job.id)}/edit" class="btn btn-outline" style="color: #111827; border-color: #D1D5DB;">✏️ Düzenle</a>
        <a href="/applications?job_id=${escapeHtml(job.id)}" class="btn btn-primary">📄 Bu İlana Başvuru Yap</a>
        ${job.applicationUrl ? `<a href="${escapeHtml(job.applicationUrl)}" target="_blank" rel="noopener" class="btn btn-secondary">Şirket Başvuru Sayfası ↗</a>` : ''}
        <form method="POST" action="/job-postings/${escapeHtml(job.id)}/delete" style="display: inline; margin-left: auto;" onsubmit="return confirm('${escapeHtml(job.title)} ilanını silmek istediğinize emin misiniz?');">
          <button type="submit" class="btn btn-danger">🗑️ İlanı Sil</button>
        </form>
      </div>
    </div>

    <!-- Bu İlana Yapılan Başvurular -->
    <div class="card" style="max-width: 900px; margin: 0 auto;">
      <div class="card-title">
        <span>📨 Bu İlana Yapılan Başvurular</span>
        <span class="badge badge-dark">${applications.length} Başvuru</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">ID</th>
              <th>Aday Bilgisi</th>
              <th>Başvuru Durumu</th>
              <th>Tarih</th>
              <th style="text-align: right;">Detay</th>
            </tr>
          </thead>
          <tbody>
            ${appRows}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return renderLayout({
    title: `${escapeHtml(job.title)} @ ${escapeHtml(job.company)} | İÜ Mezun`,
    activeNav: 'jobs',
    pageTitle: `${escapeHtml(job.title)}`,
    pageSubtitle: `🏢 ${escapeHtml(job.company)} &bull; ${escapeHtml(job.location || 'Konum Belirtilmedi')}`,
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/job-postings">İlanlar</a> <span class="separator">/</span> <span class="current">Detay</span>`,
    content,
  });
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
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const userOptions = users
    .map(
      (u) =>
        `<option value="${escapeHtml(u.id)}" ${job.postedBy === u.id ? 'selected' : ''}>${escapeHtml(u.name)} (${escapeHtml(u.email)})</option>`
    )
    .join('');

  const deptOptions = departments
    .map(
      (d) =>
        `<option value="${escapeHtml(d.id)}" ${job.departmentId === d.id ? 'selected' : ''}>${escapeHtml(d.name)} (${escapeHtml(d.code)})</option>`
    )
    .join('');

  const content = `
    ${alertBox}

    <div class="card" style="max-width: 860px; margin: 0 auto;">
      <div class="card-title">
        <span>✏️ İş İlanını Düzenle</span>
        <span class="badge badge-warning">İlan ID: #${escapeHtml(job.id)}</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 24px;">
        <strong>${escapeHtml(job.title)}</strong> pozisyonunun başvuru koşullarını ve ilan detaylarını güncelliyorsunuz.
      </p>

      <form method="POST" action="/job-postings/${escapeHtml(job.id)}/update">
        <div class="form-grid">
          <div class="form-group">
            <label for="title">İlan Başlığı *</label>
            <input type="text" id="title" name="title" required value="${escapeHtml(job.title || '')}">
          </div>
          <div class="form-group">
            <label for="company">Şirket / Kurum Adı *</label>
            <input type="text" id="company" name="company" required value="${escapeHtml(job.company || '')}">
          </div>
          <div class="form-group">
            <label for="location">Konum / Şehir</label>
            <input type="text" id="location" name="location" value="${escapeHtml(job.location || '')}">
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
            <input type="text" id="salaryRange" name="salaryRange" value="${escapeHtml(job.salaryRange || '')}">
          </div>
          <div class="form-group">
            <label for="deadline">Son Başvuru Tarihi</label>
            <input type="date" id="deadline" name="deadline" value="${job.deadline ? escapeHtml(job.deadline) : ''}">
          </div>
          <div class="form-group">
            <label for="contactEmail">İletişim E-Postası</label>
            <input type="email" id="contactEmail" name="contactEmail" value="${escapeHtml(job.contactEmail || '')}">
          </div>
          <div class="form-group">
            <label for="applicationUrl">Başvuru Bağlantısı (URL)</label>
            <input type="url" id="applicationUrl" name="applicationUrl" value="${escapeHtml(job.applicationUrl || '')}">
          </div>
          <div class="form-group">
            <label for="postedBy">Yayınlayan Mezun</label>
            <select id="postedBy" name="postedBy">
              <option value="">-- Mezun Seçiniz (Opsiyonel) --</option>
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
          <div class="form-group full-width">
            <label for="description">İş Tanımı *</label>
            <textarea id="description" name="description" rows="4" required>${escapeHtml(job.description || '')}</textarea>
          </div>
          <div class="form-group full-width">
            <label for="requirements">Aday Kriterleri</label>
            <textarea id="requirements" name="requirements" rows="3">${escapeHtml(job.requirements || '')}</textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 Değişiklikleri Kaydet</button>
            <a href="/job-postings/${escapeHtml(job.id)}" class="btn btn-secondary">İptal</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: `${escapeHtml(job.title)} - Düzenle | İÜ Mezun`,
    activeNav: 'jobs',
    pageTitle: '✏️ İş İlanını Düzenle',
    pageSubtitle: `#${escapeHtml(job.id)} numaralı ilan kaydını güncelleyin.`,
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/job-postings">İlanlar</a> <span class="separator">/</span> <span class="current">Düzenle</span>`,
    content,
  });
};

/**
 * 404 İş İlanı Bulunamadı Sayfası
 * @param {string|number} id
 * @returns {string} Tam HTML çıktısı
 */
const renderJobPostingNotFoundPage = (id) => {
  const content = `
    <div class="card" style="max-width: 680px; margin: 40px auto; text-align: center; padding: 48px 24px;">
      <div style="font-size: 52px; margin-bottom: 12px;">💼 ❌</div>
      <span class="badge badge-danger" style="margin-bottom: 14px;">404 BULUNAMADI</span>
      <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">İş İlanı Bulunamadı</h2>
      <p style="color: #4B5563; font-size: 15px; margin-bottom: 24px;">
        Aradığınız <strong>#${escapeHtml(id)}</strong> numaralı iş ilanı sistemde mevcut değil veya süresi dolduğu için yayından kaldırılmış.
      </p>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <a href="/job-postings" class="btn btn-primary">← İş İlanları Listesine Dön</a>
        <a href="/" class="btn btn-secondary">Ana Sayfa</a>
      </div>
    </div>
  `;

  return renderLayout({
    title: 'İş İlanı Bulunamadı (404) | İÜ Mezun',
    activeNav: 'jobs',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/job-postings">İlanlar</a> <span class="separator">/</span> <span class="current">İlan Bulunamadı</span>',
    content,
  });
};

module.exports = {
  renderJobPostingsPage,
  renderJobPostingDetailPage,
  renderEditJobPostingPage,
  renderJobPostingNotFoundPage,
};
