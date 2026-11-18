/**
 * Application View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun:
 * - Koyu yeşil zemin: #214539
 * - Header, Menü, Logo, Footer
 * - Beyaz kartlar, sarı butonlar ve Arial tipografi
 */

const { renderLayout, escapeHtml } = require('./layout');

/**
 * Başvuru durum rozeti HTML çıktısı
 * @param {string} status 
 * @returns {string}
 */
const getStatusBadge = (status) => {
  const s = (status || 'pending').toLowerCase();
  let badgeClass = 'badge-warning';
  let label = 'Beklemede (pending)';

  if (s === 'reviewed') {
    badgeClass = 'badge-info';
    label = 'İncelendi (reviewed)';
  } else if (s === 'interview') {
    badgeClass = 'badge-dark';
    label = 'Mülakat (interview)';
  } else if (s === 'accepted') {
    badgeClass = 'badge-success';
    label = 'Kabul Edildi (accepted)';
  } else if (s === 'rejected') {
    badgeClass = 'badge-danger';
    label = 'Reddedildi (rejected)';
  } else if (s === 'withdrawn') {
    badgeClass = 'badge-neutral';
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
    alertBox = `<div class="alert alert-success"><span>✅</span><div>${escapeHtml(options.success)}</div></div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const jobOptions = jobPostings
    .map(
      (j) =>
        `<option value="${escapeHtml(j.id)}" ${selectedJobId === j.id ? 'selected' : ''}>#${escapeHtml(j.id)} - ${escapeHtml(j.title)} @ ${escapeHtml(j.company)}</option>`
    )
    .join('');

  const userOptions = users
    .map((u) => `<option value="${escapeHtml(u.id)}">${escapeHtml(u.name)} (${escapeHtml(u.email)})</option>`)
    .join('');

  const appRows = applications.length === 0
    ? `<tr><td colspan="7" class="empty-state"><div class="empty-state-icon">📄</div><h3>Henüz kayıtlı başvuru bulunmuyor</h3><p>Aşağıdaki formu kullanarak bir iş ilanına yeni bir mezun başvurusu kaydedebilirsiniz.</p></td></tr>`
    : applications
        .map(
          (app) => `
      <tr>
        <td><strong>#${escapeHtml(app.id)}</strong></td>
        <td>
          <a href="/job-postings/${escapeHtml(app.jobPostingId)}" style="font-weight: 700; color: #111827; text-decoration: none;">
            İlan #${escapeHtml(app.jobPostingId)}
          </a>
          <div style="font-size: 13px; color: #4B5563; margin-top: 2px;">
            ${app.jobTitle ? `${escapeHtml(app.jobTitle)} @ ${escapeHtml(app.company || '')}` : ''}
          </div>
        </td>
        <td>
          <a href="/users/${escapeHtml(app.userId)}" style="font-weight: 600; color: #111827;">
            ${escapeHtml(app.userName || `Mezun #${app.userId}`)}
          </a>
          <div style="font-size: 12px; color: #6B7280;">${escapeHtml(app.userEmail || '')}</div>
        </td>
        <td>${getStatusBadge(app.status)}</td>
        <td style="font-size: 13px; color: #6B7280;">${app.appliedAt ? escapeHtml(app.appliedAt.substring(0, 10)) : '-'}</td>
        <td>
          ${app.resumeUrl ? `<a href="${escapeHtml(app.resumeUrl)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Özgeçmiş ↗</a>` : '<span style="color: #9CA3AF; font-size: 13px;">Yok</span>'}
        </td>
        <td style="white-space: nowrap; text-align: right;">
          <a href="/applications/${escapeHtml(app.id)}" class="btn btn-secondary btn-sm" title="Başvuru Detayı">Görüntüle</a>
          <a href="/applications/${escapeHtml(app.id)}/edit" class="btn btn-outline btn-sm" style="color: #111827; border-color: #D1D5DB; margin-left: 4px;" title="Başvuruyu Düzenle">Düzenle</a>
          <form method="POST" action="/applications/${escapeHtml(app.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('#${escapeHtml(app.id)} numaralı başvuruyu silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;" title="Başvuruyu Sil">Sil</button>
          </form>
        </td>
      </tr>
    `
        )
        .join('');

  const content = `
    ${alertBox}

    <!-- Başvurular Tablosu -->
    <div class="card">
      <div class="card-title">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>📄 Kayıtlı İş ve Staj Başvuruları</span>
          <span class="badge badge-dark">Toplam: ${applications.length}</span>
        </div>
        <a href="#new-application-form" class="btn btn-primary btn-sm">+ Yeni Başvuru Ekle</a>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">ID</th>
              <th>İş / Staj İlanı</th>
              <th>Başvuran Mezun</th>
              <th>Durum</th>
              <th>Başvuru Tarihi</th>
              <th>Özgeçmiş</th>
              <th style="width: 200px; text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${appRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Yeni Başvuru Formu (POST /applications) -->
    <div class="card" id="new-application-form">
      <div class="card-title">
        <span>➕ Yeni İş Başvurusu Kaydet</span>
        <span class="badge badge-warning">Başvuru Formu</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 20px;">
        Mezunlar adına açık ilanlara iş veya staj başvurusu oluşturun ve süreç durumunu başlatın.
      </p>

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
            <label for="status">Başlangıç Durumu</label>
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
            <input type="url" id="resumeUrl" name="resumeUrl" placeholder="Örn: https://linkedin.com/in/... veya https://drive.google.com/...">
          </div>
          <div class="form-group full-width">
            <label for="coverNote">Ön Yazı / Başvuru Notu</label>
            <textarea id="coverNote" name="coverNote" rows="3" placeholder="Pozisyona uygunluk, motivasyon ve adayın ek açıklamaları..."></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">🚀 Başvuruyu Kaydet</button>
            <a href="/applications" class="btn btn-secondary">Temizle</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: 'İş Başvuruları | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'applications',
    pageTitle: '📄 İş ve Staj Başvuruları',
    pageSubtitle: 'Mezunların kariyer fırsatlarına yaptığı başvuruları izleyin ve süreç adımlarını güncelleyin.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Başvurular</span>',
    content,
  });
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

  const content = `
    <div class="card" style="max-width: 860px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; padding-bottom: 20px; border-bottom: 1.5px solid #E5E7EB; margin-bottom: 24px;">
        <div>
          <div style="font-size: 13px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Başvuru #${escapeHtml(app.id)}</div>
          <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 4px 0;">
            ${job ? `${escapeHtml(job.title)} @ ${escapeHtml(job.company)}` : `İlan #${escapeHtml(app.jobPostingId)}`}
          </h1>
          <div style="font-size: 14px; color: #4B5563;">
            Tarih: ${app.appliedAt ? escapeHtml(app.appliedAt.substring(0, 10)) : '-'}
          </div>
        </div>
        <div>
          ${getStatusBadge(app.status)}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Başvurulan İlan</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">
            ${job ? `<a href="/job-postings/${escapeHtml(job.id)}" style="color: #111827; text-decoration: underline;">💼 ${escapeHtml(job.title)} (@${escapeHtml(job.company)})</a>` : `İlan #${escapeHtml(app.jobPostingId)}`}
          </div>
        </div>

        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Başvuran Mezun</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">
            ${user ? `<a href="/users/${escapeHtml(user.id)}" style="color: #111827; text-decoration: underline;">🎓 ${escapeHtml(user.name)} (${escapeHtml(user.email)})</a>` : `Kullanıcı #${escapeHtml(app.userId)}`}
          </div>
        </div>

        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Özgeçmiş / CV</div>
          <div style="font-size: 14px; font-weight: 600; margin-top: 4px;">
            ${app.resumeUrl ? `<a href="${escapeHtml(app.resumeUrl)}" target="_blank" rel="noopener" style="color: #111827; text-decoration: underline;">📄 Özgeçmişi Görüntüle ↗</a>` : 'Özgeçmiş yüklenmemiş'}
          </div>
        </div>

        <div style="background-color: #F9FAFB; padding: 14px 18px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Son Güncelleme</div>
          <div style="font-size: 14px; color: #374151; margin-top: 4px;">
            🕒 ${app.updatedAt ? escapeHtml(app.updatedAt.substring(0, 10)) : 'Güncellenmedi'}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 10px;">📝 Ön Yazı / Motivasyon Notu</h3>
        <div style="background-color: #FAFAFA; padding: 18px; border-radius: 12px; border: 1px solid #E5E7EB; line-height: 1.7; color: #374151; white-space: pre-line;">
${escapeHtml(app.coverNote || 'Ön yazı eklenmemiş.')}
        </div>
      </div>

      <div style="display: flex; gap: 12px; align-items: center; border-top: 1.5px solid #E5E7EB; padding-top: 20px; flex-wrap: wrap;">
        <a href="/applications" class="btn btn-secondary">← Başvurular Listesi</a>
        <a href="/applications/${escapeHtml(app.id)}/edit" class="btn btn-primary">✏️ Durumu Güncelle</a>
        <form method="POST" action="/applications/${escapeHtml(app.id)}/delete" style="display: inline; margin-left: auto;" onsubmit="return confirm('#${escapeHtml(app.id)} numaralı başvuruyu silmek istediğinize emin misiniz?');">
          <button type="submit" class="btn btn-danger">🗑️ Başvuruyu Sil</button>
        </form>
      </div>
    </div>
  `;

  return renderLayout({
    title: `Başvuru #${escapeHtml(app.id)} Detayı | İÜ Mezun`,
    activeNav: 'applications',
    pageTitle: `Başvuru #${escapeHtml(app.id)} Detayı`,
    pageSubtitle: 'İş başvurusu inceleme ve durum değerlendirme kartı.',
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/applications">Başvurular</a> <span class="separator">/</span> <span class="current">#${escapeHtml(app.id)}</span>`,
    content,
  });
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
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const content = `
    ${alertBox}

    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-title">
        <span>✏️ Başvuru Durumunu Güncelle</span>
        <span class="badge badge-warning">Başvuru ID: #${escapeHtml(app.id)}</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 20px;">
        <strong>İlan:</strong> ${job ? `${escapeHtml(job.title)} @ ${escapeHtml(job.company)}` : `İlan #${escapeHtml(app.jobPostingId)}`} &bull; 
        <strong>Aday:</strong> ${user ? `${escapeHtml(user.name)} (${escapeHtml(user.email)})` : `Kullanıcı #${escapeHtml(app.userId)}`}
      </p>

      <form method="POST" action="/applications/${escapeHtml(app.id)}/update">
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
            <input type="url" id="resumeUrl" name="resumeUrl" value="${escapeHtml(app.resumeUrl || '')}">
          </div>
          <div class="form-group full-width">
            <label for="coverNote">Ön Yazı / Başvuru Notu</label>
            <textarea id="coverNote" name="coverNote" rows="4">${escapeHtml(app.coverNote || '')}</textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 Değişiklikleri Kaydet</button>
            <a href="/applications/${escapeHtml(app.id)}" class="btn btn-secondary">İptal</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: `Başvuru #${escapeHtml(app.id)} Düzenle | İÜ Mezun`,
    activeNav: 'applications',
    pageTitle: `✏️ Başvuru Düzenle (#${escapeHtml(app.id)})`,
    pageSubtitle: 'Başvuru değerlendirme aşamasını ve notlarını güncelleyin.',
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/applications">Başvurular</a> <span class="separator">/</span> <span class="current">Düzenle</span>`,
    content,
  });
};

/**
 * 404 Başvuru Bulunamadı Sayfası
 * @param {string|number} id
 * @returns {string} Tam HTML çıktısı
 */
const renderApplicationNotFoundPage = (id) => {
  const content = `
    <div class="card" style="max-width: 680px; margin: 40px auto; text-align: center; padding: 48px 24px;">
      <div style="font-size: 52px; margin-bottom: 12px;">📄 ❌</div>
      <span class="badge badge-danger" style="margin-bottom: 14px;">404 BULUNAMADI</span>
      <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Başvuru Bulunamadı</h2>
      <p style="color: #4B5563; font-size: 15px; margin-bottom: 24px;">
        Aradığınız <strong>#${escapeHtml(id)}</strong> numaralı iş başvurusu sistemde mevcut değil veya silinmiş.
      </p>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <a href="/applications" class="btn btn-primary">← Başvurular Listesine Dön</a>
        <a href="/" class="btn btn-secondary">Ana Sayfa</a>
      </div>
    </div>
  `;

  return renderLayout({
    title: 'Başvuru Bulunamadı (404) | İÜ Mezun',
    activeNav: 'applications',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/applications">Başvurular</a> <span class="separator">/</span> <span class="current">Başvuru Bulunamadı</span>',
    content,
  });
};

module.exports = {
  renderApplicationsPage,
  renderApplicationDetailPage,
  renderEditApplicationPage,
  renderApplicationNotFoundPage,
};
