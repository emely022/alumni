/**
 * Announcement View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun:
 * - Koyu yeşil zemin: #214539
 * - Header, Menü, Logo, Footer
 * - Beyaz kartlar, sarı butonlar ve Arial tipografi
 */

const { renderLayout, escapeHtml } = require('./layout');

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
    alertBox = `<div class="alert alert-success"><span>✅</span><div>${escapeHtml(options.success)}</div></div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const rows = announcements.length === 0
    ? `<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">📢</div><h3>Henüz yayınlanan duyuru bulunmuyor</h3><p>Aşağıdaki formu kullanarak üniversite ve mezun ağı için ilk duyuruyu yayınlayabilirsiniz.</p></td></tr>`
    : announcements
        .map(
          (a) => `
      <tr>
        <td><strong>#${escapeHtml(a.id)}</strong></td>
        <td>
          <a href="/announcements/${escapeHtml(a.id)}" style="font-weight: 700; color: #111827; text-decoration: none;">
            ${escapeHtml(a.title)}
          </a>
        </td>
        <td><span class="badge badge-warning">${escapeHtml(a.category || 'Genel')}</span></td>
        <td><strong>${escapeHtml(a.date || '-')}</strong></td>
        <td>${escapeHtml(a.author || 'Yönetim')}</td>
        <td style="white-space: nowrap; text-align: right;">
          <a href="/announcements/${escapeHtml(a.id)}" class="btn btn-secondary btn-sm" title="Duyuruyu Görüntüle">Görüntüle</a>
          <a href="/announcements/${escapeHtml(a.id)}/edit" class="btn btn-outline btn-sm" style="color: #111827; border-color: #D1D5DB; margin-left: 4px;" title="Duyuruyu Düzenle">Düzenle</a>
          <form method="POST" action="/announcements/${escapeHtml(a.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${escapeHtml(a.title)} başlıklı duyuruyu silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;" title="Duyuruyu Sil">Sil</button>
          </form>
        </td>
      </tr>
    `
        )
        .join('');

  const content = `
    ${alertBox}

    <!-- Yayınlanan Duyurular Tablosu -->
    <div class="card">
      <div class="card-title">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>📢 Yayınlanan Duyurular</span>
          <span class="badge badge-dark">Toplam: ${announcements.length}</span>
        </div>
        <a href="#new-announcement-form" class="btn btn-primary btn-sm">+ Yeni Duyuru Yayınla</a>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th>Duyuru Başlığı</th>
              <th>Kategori</th>
              <th>Tarih</th>
              <th>Yayınlayan</th>
              <th style="width: 200px; text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Yeni Duyuru Ekleme Formu (POST /announcements) -->
    <div class="card" id="new-announcement-form">
      <div class="card-title">
        <span>➕ Kampüs ve Mezun Duyurusu Yayınla</span>
        <span class="badge badge-warning">Duyuru Paneli</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 20px;">
        İstanbul Üniversitesi mezunlar ağına ve öğrencilere yönelik etkinlik, burs, genel bildirim veya kariyer duyurusu oluşturun.
      </p>

      <form method="POST" action="/announcements">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="title">Duyuru Başlığı *</label>
            <input type="text" id="title" name="title" required placeholder="Örn: 2026 Bahar Mezunlar Buluşması ve Kariyer Zirvesi">
            <span class="form-help">Duyurunun ana manşeti (kısa ve net olmalıdır)</span>
          </div>
          <div class="form-group">
            <label for="category">Kategori</label>
            <input type="text" id="category" name="category" placeholder="Örn: Etkinlik, Kariyer, Burs, Genel" value="Genel">
            <span class="form-help">Duyuru sınıflandırması</span>
          </div>
          <div class="form-group">
            <label for="author">Yayınlayan / Yetkili Birim</label>
            <input type="text" id="author" name="author" placeholder="Örn: Mezunlar Ofisi" value="Rektörlük">
            <span class="form-help">Duyuruyu oluşturan akademik/idari birim</span>
          </div>
          <div class="form-group">
            <label for="date">Etkinlik / Duyuru Tarihi</label>
            <input type="date" id="date" name="date" value="${today}">
          </div>
          <div class="form-group full-width">
            <label for="content">Duyuru İçeriği *</label>
            <textarea id="content" name="content" rows="5" required placeholder="Duyurunun tüm detaylarını, tarih, saat, yer ve katılım koşullarını buraya yazınız..."></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">📢 Duyuruyu Yayınla</button>
            <a href="/announcements" class="btn btn-secondary">Temizle</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: 'Duyurular Paneli | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'announcements',
    pageTitle: '📢 Kampüs ve Mezun Duyuruları',
    pageSubtitle: 'İstanbul Üniversitesi etkinlikleri, kariyer duyuruları ve kurumsal haber bülteni.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Duyurular</span>',
    content,
  });
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
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const content = `
    ${alertBox}

    <div class="card" style="max-width: 860px; margin: 0 auto;">
      <div class="card-title">
        <span>✏️ Duyuru İçeriğini Güncelle</span>
        <span class="badge badge-warning">Duyuru ID: #${escapeHtml(announcement.id)}</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 24px;">
        <strong>${escapeHtml(announcement.title)}</strong> başlıklı duyurunun metnini veya yayın bilgilerini güncelliyorsunuz.
      </p>

      <form method="POST" action="/announcements/${escapeHtml(announcement.id)}/update">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="title">Duyuru Başlığı *</label>
            <input type="text" id="title" name="title" value="${escapeHtml(announcement.title)}" required>
          </div>
          <div class="form-group">
            <label for="category">Kategori</label>
            <input type="text" id="category" name="category" value="${escapeHtml(announcement.category || 'Genel')}">
          </div>
          <div class="form-group">
            <label for="author">Yayınlayan</label>
            <input type="text" id="author" name="author" value="${escapeHtml(announcement.author || 'Yönetim')}">
          </div>
          <div class="form-group">
            <label for="date">Tarih</label>
            <input type="date" id="date" name="date" value="${escapeHtml(announcement.date || '')}">
          </div>
          <div class="form-group full-width">
            <label for="content">Duyuru İçeriği *</label>
            <textarea id="content" name="content" rows="6" required>${escapeHtml(announcement.content || '')}</textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 Değişiklikleri Kaydet</button>
            <a href="/announcements/${escapeHtml(announcement.id)}" class="btn btn-secondary">İptal</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: `${escapeHtml(announcement.title)} - Düzenle | İÜ Mezun`,
    activeNav: 'announcements',
    pageTitle: '✏️ Duyuruyu Düzenle',
    pageSubtitle: `#${escapeHtml(announcement.id)} numaralı duyuru kaydını güncelleyin.`,
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/announcements">Duyurular</a> <span class="separator">/</span> <span class="current">Düzenle</span>`,
    content,
  });
};

/**
 * Duyuru Detay Sayfası (GET /announcements/:id)
 * @param {Object} announcement - Duyuru nesnesi
 * @returns {string} Tam HTML çıktısı
 */
const renderAnnouncementDetailPage = (announcement) => {
  const content = `
    <div class="card" style="max-width: 880px; margin: 0 auto;">
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">
        <span class="badge badge-dark">Duyuru #${escapeHtml(announcement.id)}</span>
        <span class="badge badge-warning">${escapeHtml(announcement.category || 'Genel')}</span>
      </div>

      <h1 style="font-size: 26px; font-weight: 700; color: #111827; margin: 0 0 16px 0; line-height: 1.3;">
        ${escapeHtml(announcement.title)}
      </h1>

      <div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 13px; color: #6B7280; padding: 12px 0 18px 0; border-bottom: 1.5px solid #E5E7EB; margin-bottom: 24px;">
        <span>📅 <strong>Tarih:</strong> ${escapeHtml(announcement.date || 'Belirtilmedi')}</span>
        <span>✍️ <strong>Yayınlayan:</strong> ${escapeHtml(announcement.author || 'Yönetim')}</span>
        ${announcement.createdAt ? `<span>🕒 <strong>Oluşturulma:</strong> ${escapeHtml(announcement.createdAt)}</span>` : ''}
        ${announcement.updatedAt ? `<span>✏️ <strong>Güncellenme:</strong> ${escapeHtml(announcement.updatedAt)}</span>` : ''}
      </div>

      <div style="font-size: 16px; line-height: 1.8; color: #1F2937; white-space: pre-line; margin-bottom: 32px; background-color: #FAFAFA; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB;">
${escapeHtml(announcement.content)}
      </div>

      <div style="display: flex; gap: 12px; align-items: center; border-top: 1.5px solid #E5E7EB; padding-top: 20px; flex-wrap: wrap;">
        <a href="/announcements" class="btn btn-secondary">← Tüm Duyuruları Listele</a>
        <a href="/announcements/${escapeHtml(announcement.id)}/edit" class="btn btn-primary">✏️ Düzenle</a>
        <a href="/api/announcements/${escapeHtml(announcement.id)}" target="_blank" class="btn btn-outline" style="color: #111827; border-color: #D1D5DB;">JSON API</a>
        <form method="POST" action="/announcements/${escapeHtml(announcement.id)}/delete" style="display: inline; margin-left: auto;" onsubmit="return confirm('${escapeHtml(announcement.title)} başlıklı duyuruyu silmek istediğinize emin misiniz?');">
          <button type="submit" class="btn btn-danger">🗑️ Duyuruyu Sil</button>
        </form>
      </div>
    </div>
  `;

  return renderLayout({
    title: `${escapeHtml(announcement.title)} | İÜ Mezun`,
    activeNav: 'announcements',
    pageTitle: `${escapeHtml(announcement.title)}`,
    pageSubtitle: `${escapeHtml(announcement.category || 'Genel')} Duyuru Detayı`,
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/announcements">Duyurular</a> <span class="separator">/</span> <span class="current">Detay</span>`,
    content,
  });
};

/**
 * 404 Duyuru Bulunamadı Sayfası
 * @param {string|number} id - Aranan ID
 * @returns {string} Tam HTML çıktısı
 */
const renderAnnouncementNotFoundPage = (id) => {
  const content = `
    <div class="card" style="max-width: 680px; margin: 40px auto; text-align: center; padding: 48px 24px;">
      <div style="font-size: 52px; margin-bottom: 12px;">📢 ❌</div>
      <span class="badge badge-danger" style="margin-bottom: 14px;">404 BULUNAMADI</span>
      <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Duyuru Bulunamadı</h2>
      <p style="color: #4B5563; font-size: 15px; margin-bottom: 24px;">
        Aradığınız <strong>#${escapeHtml(id)}</strong> numaralı duyuru sistemde mevcut değil veya yayından kaldırılmış.
      </p>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <a href="/announcements" class="btn btn-primary">← Duyurular Listesine Dön</a>
        <a href="/" class="btn btn-secondary">Ana Sayfa</a>
      </div>
    </div>
  `;

  return renderLayout({
    title: 'Duyuru Bulunamadı (404) | İÜ Mezun',
    activeNav: 'announcements',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/announcements">Duyurular</a> <span class="separator">/</span> <span class="current">Duyuru Bulunamadı</span>',
    content,
  });
};

module.exports = {
  renderAnnouncementsPage,
  renderEditAnnouncementPage,
  renderAnnouncementDetailPage,
  renderAnnouncementNotFoundPage,
};
