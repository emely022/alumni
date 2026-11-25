/**
 * User View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun:
 * - Koyu yeşil zemin: #214539
 * - Header, Menü, Logo, Footer
 * - Beyaz kartlar, sarı butonlar ve Arial tipografi
 */

const { renderLayout, escapeHtml } = require('./layout');

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
    alertBox = `<div class="alert alert-success"><span>✅</span><div>${escapeHtml(options.success)}</div></div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const userRows = users.length === 0
    ? `<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">🎓</div><h3>Henüz kayıtlı mezun bulunmuyor</h3><p>Aşağıdaki formu doldurarak ilk mezun kaydını sisteme ekleyebilirsiniz.</p></td></tr>`
    : users
        .map(
          (u) => `
      <tr>
        <td><strong>#${escapeHtml(u.id)}</strong></td>
        <td>
          <a href="/users/${escapeHtml(u.id)}" style="font-weight: 700; color: #111827; text-decoration: none;">
            ${escapeHtml(u.name)}
          </a>
        </td>
        <td><a href="mailto:${escapeHtml(u.email)}" style="color: #4B5563;">${escapeHtml(u.email)}</a></td>
        <td><span class="badge badge-neutral">${escapeHtml(u.department || 'Belirtilmedi')}</span></td>
        <td><strong>${escapeHtml(u.graduationYear || '-')}</strong></td>
        <td style="white-space: nowrap; text-align: right;">
          <a href="/users/${escapeHtml(u.id)}" class="btn btn-secondary btn-sm" title="Profili Görüntüle">Görüntüle</a>
          <a href="/users/${escapeHtml(u.id)}/edit" class="btn btn-outline btn-sm" style="color: #111827; border-color: #D1D5DB; margin-left: 4px;" title="Mezunu Düzenle">Düzenle</a>
          <form method="POST" action="/users/${escapeHtml(u.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${escapeHtml(u.name)} mezun kaydını silmek istediğinize emin misiniz?');">
            <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;" title="Mezunu Sil">Sil</button>
          </form>
        </td>
      </tr>
    `
        )
        .join('');

  const content = `
    ${alertBox}

    <!-- Kayıtlı Mezunlar Tablosu -->
    <div class="card">
      <div class="card-title">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>📋 Kayıtlı Mezunlar Listesi</span>
          <span class="badge badge-dark">Toplam: ${users.length}</span>
        </div>
        <a href="#new-user-form" class="btn btn-primary btn-sm">+ Yeni Mezun Ekle</a>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th>Ad Soyad</th>
              <th>E-Posta</th>
              <th>Fakülte / Bölüm</th>
              <th>Mezuniyet Yılı</th>
              <th style="width: 200px; text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${userRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Yeni Mezun Ekleme Formu (POST /users) -->
    <div class="card" id="new-user-form">
      <div class="card-title">
        <span>➕ Sisteme Yeni Mezun Kaydı Ekle</span>
        <span class="badge badge-warning">Hızlı Form</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 20px;">
        İstanbul Üniversitesi mezunlar ağına yeni bir mezun kaydetmek için lütfen aşağıdaki zorunlu alanları doldurunuz.
      </p>

      <form method="POST" action="/users">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Ad Soyad *</label>
            <input type="text" id="name" name="name" required placeholder="Örn: Zeynep Kaya">
            <span class="form-help">Mezunun tam adı ve unvanı</span>
          </div>
          <div class="form-group">
            <label for="email">E-Posta Adresi *</label>
            <input type="email" id="email" name="email" required placeholder="Örn: zeynep.kaya@alumni.istanbul.edu.tr">
            <span class="form-help">Sistem ve iletişim e-posta adresi</span>
          </div>
          <div class="form-group">
            <label for="department">Fakülte / Bölüm</label>
            <input type="text" id="department" name="department" placeholder="Örn: Hukuk Fakültesi">
            <span class="form-help">Mezun olunan akademik birim</span>
          </div>
          <div class="form-group">
            <label for="graduationYear">Mezuniyet Yılı</label>
            <input type="number" id="graduationYear" name="graduationYear" value="${currentYear}" min="1950" max="2050">
            <span class="form-help">Diploma / mezuniyet dönemi</span>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 Mezun Kaydını Tamamla</button>
            <a href="/users" class="btn btn-secondary">Temizle</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: 'Mezunlar Dizini | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'users',
    pageTitle: '🎓 Mezunlar Dizini (Alumni Directory)',
    pageSubtitle: 'İstanbul Üniversitesi mezunlarını görüntüleyin, fakültelere göre arayın veya yeni mezun ekleyin.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Mezunlar</span>',
    actionButtonHtml: '<a href="/register" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 6px;"><span>➕</span><span>Yeni Mezun / Üye Kaydı</span></a>',
    content,
  });
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
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const content = `
    ${alertBox}

    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-title">
        <span>✏️ Mezun Bilgilerini Güncelle</span>
        <span class="badge badge-warning">Mezun ID: #${escapeHtml(user.id)}</span>
      </div>
      <p style="color: #4B5563; font-size: 14px; margin-bottom: 24px;">
        <strong>${escapeHtml(user.name)}</strong> adlı mezunun sistemdeki profil ve akademik bilgilerini güncelliyorsunuz.
      </p>

      <form method="POST" action="/users/${escapeHtml(user.id)}/update">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Ad Soyad *</label>
            <input type="text" id="name" name="name" value="${escapeHtml(user.name)}" required>
          </div>
          <div class="form-group">
            <label for="email">E-Posta *</label>
            <input type="email" id="email" name="email" value="${escapeHtml(user.email)}" required>
          </div>
          <div class="form-group">
            <label for="department">Fakülte / Bölüm</label>
            <input type="text" id="department" name="department" value="${escapeHtml(user.department || '')}">
          </div>
          <div class="form-group">
            <label for="graduationYear">Mezuniyet Yılı</label>
            <input type="number" id="graduationYear" name="graduationYear" value="${escapeHtml(user.graduationYear || '')}" min="1950" max="2050">
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 Değişiklikleri Kaydet</button>
            <a href="/users/${escapeHtml(user.id)}" class="btn btn-secondary">İptal</a>
          </div>
        </div>
      </form>
    </div>
  `;

  return renderLayout({
    title: `${escapeHtml(user.name)} - Bilgileri Düzenle | İÜ Mezun`,
    activeNav: 'users',
    pageTitle: '✏️ Mezun Bilgilerini Düzenle',
    pageSubtitle: `#${escapeHtml(user.id)} numaralı mezun kaydını güncelleyin.`,
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/users">Mezunlar</a> <span class="separator">/</span> <span class="current">Düzenle</span>`,
    content,
  });
};

/**
 * Mezun Profil Detay Sayfası (GET /users/:id)
 * @param {Object} user - Mezun nesnesi
 * @returns {string} Tam HTML çıktısı
 */
const renderUserProfilePage = (user) => {
  const content = `
    <div class="card" style="max-width: 860px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1.5px solid #E5E7EB;">
        <div style="display: flex; align-items: center; gap: 18px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background-color: #214539; color: #F5BA13; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            ${escapeHtml((user.name || 'M').charAt(0).toUpperCase())}
          </div>
          <div>
            <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0;">${escapeHtml(user.name)}</h2>
            <p style="color: #4B5563; font-size: 15px; margin-top: 4px;">${escapeHtml(user.department || 'Bölüm belirtilmedi')}</p>
          </div>
        </div>
        <span class="badge badge-dark" style="font-size: 13px; padding: 6px 14px;">Mezun #${escapeHtml(user.id)}</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
        <div style="background-color: #F9FAFB; padding: 16px 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">E-Posta</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">
            <a href="mailto:${escapeHtml(user.email)}" style="color: #111827; text-decoration: underline;">${escapeHtml(user.email)}</a>
          </div>
        </div>

        <div style="background-color: #F9FAFB; padding: 16px 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Mezuniyet Yılı</div>
          <div style="font-size: 15px; font-weight: 600; color: #111827; margin-top: 4px;">
            ${escapeHtml(user.graduationYear || 'Belirtilmedi')}
          </div>
        </div>

        ${user.createdAt ? `
        <div style="background-color: #F9FAFB; padding: 16px 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Kayıt Tarihi</div>
          <div style="font-size: 14px; color: #374151; margin-top: 4px;">${escapeHtml(user.createdAt)}</div>
        </div>
        ` : ''}

        ${user.updatedAt ? `
        <div style="background-color: #F9FAFB; padding: 16px 20px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase;">Son Güncelleme</div>
          <div style="font-size: 14px; color: #374151; margin-top: 4px;">${escapeHtml(user.updatedAt)}</div>
        </div>
        ` : ''}
      </div>

      <div style="display: flex; gap: 12px; align-items: center; border-top: 1.5px solid #E5E7EB; padding-top: 20px; flex-wrap: wrap;">
        <a href="/users" class="btn btn-secondary">← Tüm Mezunlar Listesi</a>
        <a href="/users/${escapeHtml(user.id)}/edit" class="btn btn-primary">✏️ Bilgileri Düzenle</a>
        <a href="/api/users/${escapeHtml(user.id)}" target="_blank" class="btn btn-outline" style="color: #111827; border-color: #D1D5DB;">JSON API</a>
        <form method="POST" action="/users/${escapeHtml(user.id)}/delete" style="display: inline; margin-left: auto;" onsubmit="return confirm('${escapeHtml(user.name)} mezun kaydını silmek istediğinize emin misiniz?');">
          <button type="submit" class="btn btn-danger">🗑️ Mezun Kaydını Sil</button>
        </form>
      </div>
    </div>
  `;

  return renderLayout({
    title: `${escapeHtml(user.name)} - Mezun Profili | İÜ Mezun`,
    activeNav: 'users',
    pageTitle: `${escapeHtml(user.name)}`,
    pageSubtitle: 'İstanbul Üniversitesi Mezun Profil Kartı',
    breadcrumbsHtml: `<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/users">Mezunlar</a> <span class="separator">/</span> <span class="current">${escapeHtml(user.name)}</span>`,
    content,
  });
};

/**
 * 404 Kullanıcı Bulunamadı Sayfası
 * @param {string|number} id - Aranan ID
 * @returns {string} Tam HTML çıktısı
 */
const renderUserNotFoundPage = (id) => {
  const content = `
    <div class="card" style="max-width: 680px; margin: 40px auto; text-align: center; padding: 48px 24px;">
      <div style="font-size: 52px; margin-bottom: 12px;">🎓 ❌</div>
      <span class="badge badge-danger" style="margin-bottom: 14px;">404 BULUNAMADI</span>
      <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Mezun Kaydı Bulunamadı</h2>
      <p style="color: #4B5563; font-size: 15px; margin-bottom: 24px;">
        Aradığınız <strong>#${escapeHtml(id)}</strong> numaralı mezun profili sistemde mevcut değil veya kaldırılmış.
      </p>
      <div style="display: flex; justify-content: center; gap: 12px;">
        <a href="/users" class="btn btn-primary">← Mezunlar Listesine Dön</a>
        <a href="/" class="btn btn-secondary">Ana Sayfa</a>
      </div>
    </div>
  `;

  return renderLayout({
    title: 'Mezun Bulunamadı (404) | İÜ Mezun',
    activeNav: 'users',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/users">Mezunlar</a> <span class="separator">/</span> <span class="current">Kayıt Bulunamadı</span>',
    content,
  });
};

module.exports = {
  renderUsersPage,
  renderEditUserPage,
  renderUserProfilePage,
  renderUserNotFoundPage,
};
