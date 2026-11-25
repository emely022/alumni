/**
 * Login View (HTML Şablon Katmanı)
 * 
 * İstanbul Üniversitesi Mezun Bilgi Sistemi - Kullanıcı Giriş Sayfası (/login)
 * design.md kurallarına (%100) uyumlu:
 * - Zemin: #214539 (Koyu Orman Yeşili)
 * - Kart Yüzeyi: #FFFFFF (Beyaz)
 * - Birincil Aksiyon: #F5BA13 (Sarı Hap Buton, #0B1914 koyu metin)
 * - Font: Arial, sans-serif (İtalik stil kullanılmaz)
 */

const { renderLayout, escapeHtml } = require('./layout');

/**
 * Kullanıcı Giriş Sayfasını Render Eder (GET /login)
 * @param {Object} options
 * @param {string} [options.success] - Başarı mesajı
 * @param {string} [options.error] - Genel hata mesajı
 * @param {Object} [options.formData] - Önceki form verisi (yalnızca e-posta, şifre asla tutulmaz)
 * @param {Object|null} [options.currentUser] - Oturumdaki kullanıcı
 * @returns {string} Tam HTML sayfası
 */
const renderLoginPage = (options = {}) => {
  const formData = options.formData || {};

  let alertBox = '';
  if (options.success) {
    alertBox = `
      <div class="alert alert-success">
        <span>✅</span>
        <div>
          <strong>Bilgilendirme:</strong> ${escapeHtml(options.success)}
        </div>
      </div>
    `;
  } else if (options.error) {
    alertBox = `
      <div class="alert alert-error">
        <span>❌</span>
        <div>
          <strong>Giriş Başarısız:</strong> ${escapeHtml(options.error)}
        </div>
      </div>
    `;
  }

  const content = `
    ${alertBox}

    <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; align-items: start;">
      
      <!-- Sol / Ana Bölüm: Giriş Formu Kartı -->
      <div class="card" style="padding: 36px 32px; border: 1.5px solid rgba(245, 186, 19, 0.35);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="badge badge-dark" style="font-size: 12px; padding: 5px 14px; letter-spacing: 0.5px;">
            🏛️ T.C. İSTANBUL ÜNİVERSİTESİ
          </span>
          <span class="badge badge-warning" style="font-size: 12px; padding: 5px 14px;">
            Üye & Mezun Girişi
          </span>
        </div>

        <h2 style="font-size: 26px; font-weight: 700; color: #111827; margin: 6px 0 10px 0; line-height: 1.3;">
          Hesabınıza Giriş Yapın
        </h2>
        <p style="color: #4B5563; font-size: 15px; margin-bottom: 28px; line-height: 1.6;">
          İstanbul Üniversitesi Mezun Bilgi Sistemi'ne kayıtlı e-posta adresiniz ve şifreniz ile oturum açabilirsiniz.
        </p>

        <form method="POST" action="/login" id="login-form">
          <div class="form-grid">
            
            <!-- 1. E-Posta Adresi -->
            <div class="form-group full-width">
              <label for="email">✉️ E-Posta Adresi *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                maxlength="255" 
                placeholder="Örn: zeynep.kaya@alumni.istanbul.edu.tr" 
                autocomplete="email"
                value="${escapeHtml(formData.email || '')}"
              >
              <span class="form-help">Kayıt sırasında kullandığınız e-posta adresinizi giriniz.</span>
            </div>

            <!-- 2. Şifre -->
            <div class="form-group full-width">
              <label for="password">🔒 Şifre *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                placeholder="Şifrenizi giriniz" 
                autocomplete="current-password"
              >
              <span class="form-help">Hesap şifrenizi giriniz.</span>
            </div>

            <!-- Aksiyon Butonları -->
            <div class="form-actions" style="margin-top: 12px;">
              <button type="submit" class="btn btn-primary" style="font-size: 16px; padding: 13px 32px;">
                🔑 Giriş Yap
              </button>
              <a href="/register" class="btn btn-secondary">
                Hesabınız Yok mu? Kayıt Olun
              </a>
              <a href="/" class="btn btn-outline" style="border-color: #D1D5DB; color: #111827;">
                Ana Sayfa
              </a>
            </div>

          </div>
        </form>
      </div>

      <!-- Sağ Bölüm: Güvenlik ve Bilgilendirme Kartı -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <span>🔐</span>
            <span>Güvenli Oturum Yönetimi</span>
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #374151; display: flex; flex-direction: column; gap: 14px;">
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">🛡️</span>
              <div>
                <strong>Kriptografik Doğrulama:</strong> Şifreniz Node.js <code>crypto.scrypt</code> algoritması ile doğrulanır ve asla düz metin olarak işlenmez.
              </div>
            </li>
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">🍪</span>
              <div>
                <strong>HttpOnly Oturum Çerezi:</strong> Oturumunuz güvenli sunucu tabanlı çerez (cookie session) ile korunur.
              </div>
            </li>
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">🎓</span>
              <div>
                <strong>Yeni Mezun musunuz?</strong> Henüz kaydınız yoksa <a href="/register" style="color: #111827; font-weight: 700; text-decoration: underline;">Kayıt Sayfası</a> üzerinden hemen hesabınızı oluşturabilirsiniz.
              </div>
            </li>
          </ul>
        </div>

        <div class="card" style="padding: 24px; border: 1.5px solid #F5BA13; background: #FFFDF5;">
          <h4 style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span>
            <span>Yönetim Paneli (Admin Panel) Erişimi</span>
          </h4>
          <p style="font-size: 13px; color: #374151; line-height: 1.6; margin-bottom: 10px;">
            Yönetici hesabıyla (<code>admin@istanbul.edu.tr</code>) veya kendi hesabınızla giriş yaptıktan sonra üst menüdeki <strong>🛡️ Admin Panel</strong> (<code>/admin</code>) bağlantısından tüm verileri yönetebilirsiniz.
          </p>
        </div>
      </div>

    </div>
  `;

  return renderLayout({
    title: 'Giriş Yap | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'login',
    pageTitle: '🔑 Üye & Mezun Girişi',
    pageSubtitle: 'İstanbul Üniversitesi Mezun Bilgi Sistemi hesabınıza güvenli giriş yapın.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Giriş Yap</span>',
    currentUser: options.currentUser,
    content,
  });
};

module.exports = {
  renderLoginPage,
};
