/**
 * Profile & Settings View (Kullanıcıya Özel Profil ve Ayarlar HTML Şablon Katmanı)
 *
 * İstanbul Üniversitesi Mezun Bilgi Sistemi
 * - /profile: Oturum açmış kullanıcının kendi profil bilgilerini (ad, e-posta, rol, bölüm, mezuniyet yılı, telefon, LinkedIn) sunar.
 * - /settings: Oturum açmış kullanıcının kendi bilgilerini güncellemesini (rol değiştirilemez) ve şifresini değiştirmesini (mevcut şifre + en az 8 karakter yeni şifre) sağlar.
 *
 * design.md kurallarına (%100) uyumlu:
 * - Zemin: #214539 (Koyu Orman Yeşili)
 * - Kart Yüzeyi: #FFFFFF (Beyaz)
 * - Birincil Aksiyon: #F5BA13 (Sarı Hap Buton, #111827 koyu metin)
 * - Font: Arial, sans-serif (İtalik stil kullanılmaz)
 */

const { renderLayout, escapeHtml } = require('./layout');

const ROLE_DISPLAY = {
  admin: { label: 'Sistem Yöneticisi (Admin)', badge: 'badge-dark', icon: '🛡️' },
  alumni: { label: 'Mezun (Alumni)', badge: 'badge-success', icon: '🎓' },
  student: { label: 'Öğrenci (Student)', badge: 'badge-info', icon: '📚' },
  coordinator: { label: 'Bölüm Koordinatörü (Coordinator)', badge: 'badge-warning', icon: '🏛️' },
  employer: { label: 'İşveren / İK Temsilcisi (Employer)', badge: 'badge-neutral', icon: '🏢' },
};

/**
 * 1. Kullanıcıya Özel Profil Sayfası (GET /profile)
 * @param {Object} user - Oturumdaki kullanıcının güncel profil nesnesi
 * @param {Object} [options] - { success, error, summary }
 * @returns {string} Tam HTML sayfası
 */
const renderProfilePage = (user = {}, options = {}) => {
  const roleKey = String(user.role || 'alumni').toLowerCase();
  const roleMeta = ROLE_DISPLAY[roleKey] || ROLE_DISPLAY.alumni;
  const summary = options.summary || {};

  let alertBox = '';
  if (options.success) {
    alertBox = `<div class="alert alert-success"><span>✅</span><div>${escapeHtml(options.success)}</div></div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error"><span>❌</span><div>${escapeHtml(options.error)}</div></div>`;
  }

  const phoneHtml = user.phone
    ? `<span style="font-weight: 700; color: #111827;">${escapeHtml(user.phone)}</span>`
    : `<span style="color: #6B7280;">Belirtilmedi (<a href="/settings" style="color: #111827; text-decoration: underline; font-weight: 600;">Ayarlardan Ekle</a>)</span>`;

  const linkedinHtml = user.linkedinUrl
    ? `<a href="${escapeHtml(user.linkedinUrl)}" target="_blank" rel="noopener" style="font-weight: 700; color: #111827; text-decoration: underline;">${escapeHtml(user.linkedinUrl)} ↗</a>`
    : `<span style="color: #6B7280;">Belirtilmedi (<a href="/settings" style="color: #111827; text-decoration: underline; font-weight: 600;">Ayarlardan Ekle</a>)</span>`;

  const content = `
    ${alertBox}

    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; align-items: start;">
      
      <!-- Sol Ana Kart: Kişisel ve Akademik Profil Bilgileri -->
      <div class="card" style="padding: 36px 32px; border: 2px solid #F5BA13;">
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB; flex-wrap: wrap;">
          <div style="width: 76px; height: 76px; border-radius: 50%; background: #214539; color: #F5BA13; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; border: 3px solid #F5BA13; flex-shrink: 0;">
            ${escapeHtml((user.name || 'İÜ').charAt(0).toUpperCase())}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px;">
              <span class="badge ${roleMeta.badge}">${roleMeta.icon} ${escapeHtml(roleMeta.label)}</span>
              <span class="badge badge-success">🟢 Aktif Hesap</span>
            </div>
            <h2 style="font-size: 26px; font-weight: 700; color: #111827; margin: 0;">
              ${escapeHtml(user.name || 'İsimsiz Kullanıcı')}
            </h2>
            <div style="font-size: 14px; color: #4B5563; margin-top: 2px;">
              ${escapeHtml(user.email || '')}
            </div>
          </div>
          <div>
            <a href="/settings" class="btn btn-primary">⚙️ Bilgilerimi &amp; Şifremi Düzenle</a>
          </div>
        </div>

        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px;">
          📋 Kişisel, Akademik ve İletişim Bilgilerim
        </h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          
          <!-- 1. Ad Soyad -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">👤 Ad Soyad</div>
            <div style="font-size: 16px; font-weight: 700; color: #111827;">${escapeHtml(user.name || '-')}</div>
          </div>

          <!-- 2. E-Posta -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">✉️ E-Posta Adresi</div>
            <div style="font-size: 16px; font-weight: 700; color: #111827;">${escapeHtml(user.email || '-')}</div>
          </div>

          <!-- 3. Sistem Rolü -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">🏷️ Sistem Rolü (RBAC)</div>
            <div style="font-size: 15px; font-weight: 700; color: #111827;">${roleMeta.icon} ${escapeHtml(roleMeta.label)} (<code>${escapeHtml(roleKey)}</code>)</div>
          </div>

          <!-- 4. Fakülte / Bölüm -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">🏛️ Fakülte / Akademik Bölüm</div>
            <div style="font-size: 16px; font-weight: 700; color: #111827;">${escapeHtml(user.department || 'Belirtilmedi')}</div>
          </div>

          <!-- 5. Mezuniyet Yılı -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">📅 Mezuniyet Yılı</div>
            <div style="font-size: 16px; font-weight: 700; color: #111827;">${escapeHtml(user.graduationYear || '-')}</div>
          </div>

          <!-- 6. Telefon -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">📱 Telefon Numarası</div>
            <div style="font-size: 15px;">${phoneHtml}</div>
          </div>

          <!-- 7. LinkedIn -->
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; grid-column: 1 / -1;">
            <div style="font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">🔗 LinkedIn Profil Bağlantısı</div>
            <div style="font-size: 15px; word-break: break-all;">${linkedinHtml}</div>
          </div>

        </div>
      </div>

      <!-- Sağ Sütun: Hesap Özeti ve Hızlı Bağlantılar -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 14px;">
            📊 Hesap Aktivite Özetim
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E5E7EB;">
              <span style="font-size: 14px; color: #374151; font-weight: 600;">📝 Başvurularım</span>
              <span class="badge badge-dark">${escapeHtml(summary.applicationsCount ?? 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E5E7EB;">
              <span style="font-size: 14px; color: #374151; font-weight: 600;">💼 Paylaştığım İlanlar</span>
              <span class="badge badge-warning">${escapeHtml(summary.jobPostingsCount ?? 0)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E5E7EB;">
              <span style="font-size: 14px; color: #374151; font-weight: 600;">📢 Yayınladığım Duyurular</span>
              <span class="badge badge-neutral">${escapeHtml(summary.announcementsCount ?? 0)}</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
            <a href="/settings" class="btn btn-primary" style="width: 100%;">⚙️ Hesap Ayarları &amp; Şifre Değiştir</a>
            <a href="/" class="btn btn-secondary" style="width: 100%;">🏠 Kişisel Ana Sayfama Git</a>
          </div>
        </div>
      </div>

    </div>
  `;

  return renderLayout({
    title: 'Profilim | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'profile',
    pageTitle: '👤 Profilim (Kişisel Hesap Bilgilerim)',
    pageSubtitle: 'Oturum açmış hesabınıza ait kişisel, akademik, rol ve iletişim bilgilerinizi görüntülüyorsunuz.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Profilim</span>',
    currentUser: user,
    content,
  });
};

/**
 * 2. Kullanıcıya Özel Ayarlar ve Şifre Değiştirme Sayfası (GET /settings)
 * @param {Object} user - Oturumdaki kullanıcının güncel profil nesnesi
 * @param {Object} [options] - { departments, success, error }
 * @returns {string} Tam HTML sayfası
 */
const renderSettingsPage = (user = {}, options = {}) => {
  const departments = Array.isArray(options.departments) ? options.departments : [];
  const roleKey = String(user.role || 'alumni').toLowerCase();
  const roleMeta = ROLE_DISPLAY[roleKey] || ROLE_DISPLAY.alumni;

  let alertBox = '';
  if (options.success) {
    alertBox = `<div class="alert alert-success"><span>✅</span><div><strong>Güncellendi:</strong> ${escapeHtml(options.success)}</div></div>`;
  } else if (options.error) {
    alertBox = `<div class="alert alert-error"><span>❌</span><div><strong>Hata:</strong> ${escapeHtml(options.error)}</div></div>`;
  }

  const deptOptions = departments
    .map((d) => {
      const isSelected =
        String(user.department_id || '') === String(d.id) ||
        String(user.department || '') === String(d.name);
      return `<option value="${escapeHtml(d.id)}" ${isSelected ? 'selected' : ''}>${escapeHtml(d.name)} (${escapeHtml(d.code)}) - ${escapeHtml(d.faculty)}</option>`;
    })
    .join('');

  const content = `
    ${alertBox}

    <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 28px; align-items: start;">
      
      <!-- Sol Kart: Profil Bilgilerini Güncelleme Formu -->
      <div class="card" style="padding: 32px; border: 1.5px solid rgba(245, 186, 19, 0.4);">
        <div class="card-title">
          <span>📝 1. Kişisel ve Akademik Bilgilerimi Güncelle</span>
          <span class="badge badge-warning">Kendi Hesabınız</span>
        </div>
        <p style="font-size: 14px; color: #4B5563; margin-bottom: 22px;">
          Aşağıdaki form yalnızca aktif oturumdaki hesabınızı günceller. Güncelleme sonrasında üst menüdeki (Header) adınız da anında değişir.
        </p>

        <form method="POST" action="/settings">
          <input type="hidden" name="formType" value="profile">
          <div class="form-grid">
            
            <!-- Ad Soyad -->
            <div class="form-group full-width">
              <label for="name">👤 Ad Soyad *</label>
              <input type="text" id="name" name="name" required minlength="2" maxlength="100" value="${escapeHtml(user.name || '')}">
              <span class="form-help">Kaydettiğinizde Header menüsündeki görünen adınız da güncellenir.</span>
            </div>

            <!-- E-Posta -->
            <div class="form-group">
              <label for="email">✉️ E-Posta Adresi *</label>
              <input type="email" id="email" name="email" required maxlength="255" value="${escapeHtml(user.email || '')}">
            </div>

            <!-- Sistem Rolü (Salt Okunur - Kullanıcı Kendi Rolünü Değiştiremez) -->
            <div class="form-group">
              <label for="role_readonly">🏷️ Sistem Rolü (Değiştirilemez)</label>
              <input type="text" id="role_readonly" value="${escapeHtml(roleMeta.label)}" disabled style="background-color: #F3F4F6; color: #6B7280; cursor: not-allowed;">
              <span class="form-help">Güvenlik gereği kullanıcı kendi rolünü değiştiremez.</span>
            </div>

            <!-- Fakülte / Bölüm Seçimi -->
            <div class="form-group">
              <label for="department_id">🏛️ Fakülte / Bölüm Seçimi</label>
              <select id="department_id" name="department_id">
                <option value="">-- Listeden Seçiniz --</option>
                ${deptOptions}
              </select>
            </div>

            <!-- Serbest Bölüm Adı -->
            <div class="form-group">
              <label for="department">📝 Bölüm Adı</label>
              <input type="text" id="department" name="department" value="${escapeHtml(user.department || '')}" placeholder="Örn: Bilgisayar Mühendisliği">
            </div>

            <!-- Mezuniyet Yılı -->
            <div class="form-group">
              <label for="graduationYear">📅 Mezuniyet Yılı *</label>
              <input type="number" id="graduationYear" name="graduationYear" required min="1950" max="2100" value="${escapeHtml(user.graduationYear || new Date().getFullYear())}">
            </div>

            <!-- Telefon Numarası -->
            <div class="form-group">
              <label for="phone">📱 Telefon Numarası</label>
              <input type="tel" id="phone" name="phone" value="${escapeHtml(user.phone || '')}" placeholder="Örn: 0555 123 45 67">
            </div>

            <!-- LinkedIn Bağlantısı -->
            <div class="form-group full-width">
              <label for="linkedinUrl">🔗 LinkedIn Profil Bağlantısı</label>
              <input type="url" id="linkedinUrl" name="linkedinUrl" value="${escapeHtml(user.linkedinUrl || '')}" placeholder="Örn: https://linkedin.com/in/kullanici">
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">💾 Bilgilerimi Güncelle</button>
              <a href="/profile" class="btn btn-secondary">Profilime Dön</a>
            </div>
          </div>
        </form>
      </div>

      <!-- Sağ Kart: Şifre Değiştirme Formu -->
      <div class="card" style="padding: 32px; border: 1.5px solid rgba(245, 186, 19, 0.4);">
        <div class="card-title">
          <span>🔒 2. Şifremi Değiştir</span>
          <span class="badge badge-dark">crypto.scrypt</span>
        </div>
        <p style="font-size: 14px; color: #4B5563; margin-bottom: 22px;">
          Şifrenizi değiştirmek için mevcut şifrenizi doğrulamalı ve en az 8 karakter uzunluğunda yeni bir şifre belirlemelisiniz.
        </p>

        <form method="POST" action="/settings/password">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <div class="form-group">
              <label for="currentPassword">🔑 Mevcut Şifre *</label>
              <input type="password" id="currentPassword" name="currentPassword" required placeholder="Mevcut şifrenizi giriniz" autocomplete="current-password">
              <span class="form-help">Hesap güvenliğiniz için mevcut şifreniz doğrulanır.</span>
            </div>

            <div class="form-group">
              <label for="newPassword">🔒 Yeni Şifre (En az 8 karakter) *</label>
              <input type="password" id="newPassword" name="newPassword" required minlength="8" placeholder="En az 8 karakter" autocomplete="new-password">
              <span class="form-help">Yeni şifreniz en az 8 karakter olmalıdır.</span>
            </div>

            <div class="form-group">
              <label for="newPasswordConfirm">🔒 Yeni Şifre Tekrarı *</label>
              <input type="password" id="newPasswordConfirm" name="newPasswordConfirm" required minlength="8" placeholder="Yeni şifrenizi tekrar giriniz" autocomplete="new-password">
              <span class="form-help">Yeni şifreniz ile birebir eşleşmelidir.</span>
            </div>

            <div style="margin-top: 8px;">
              <button type="submit" class="btn btn-primary" style="width: 100%;">🔐 Şifremi Güvenle Güncelle</button>
            </div>
          </div>
        </form>
      </div>

    </div>
  `;

  return renderLayout({
    title: 'Hesap Ayarları | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'settings',
    pageTitle: '⚙️ Hesap Ayarlarım & Şifre Değiştirme',
    pageSubtitle: 'Kişisel bilgilerinizi, iletişim tercihlerinizi ve hesap şifrenizi güvenle güncelleyin.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/profile">Profilim</a> <span class="separator">/</span> <span class="current">Ayarlar</span>',
    currentUser: user,
    content,
  });
};

module.exports = {
  ROLE_DISPLAY,
  renderProfilePage,
  renderSettingsPage,
};
