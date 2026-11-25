/**
 * Register View (Kayıt Görünümü Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun:
 * - Koyu yeşil zemin: #214539
 * - Header, Menü, Logo, Footer
 * - Beyaz kartlar, sarı aksiyon butonları ve Arial tipografi
 */

const { renderLayout, escapeHtml } = require('./layout');

/**
 * Üyelik & Mezun Kayıt Sayfası HTML şablonu (GET /register)
 * 
 * @param {Object} options
 * @param {Array} [options.departments=[]] - Sistemdeki akademik bölümler listesi
 * @param {string} [options.success=null] - Başarı bildirim mesajı
 * @param {string} [options.error=null] - Hata bildirim mesajı
 * @param {Object} [options.formData={}] - Hata durumunda formu tekrar dolduracak veriler
 * @returns {string} Tam HTML çıktısı
 */
const renderRegisterPage = ({ departments = [], success = null, error = null, formData = {} } = {}) => {
  const currentYear = new Date().getFullYear();

  let alertBox = '';
  if (success) {
    alertBox = `
      <div class="alert alert-success" style="margin-bottom: 24px;">
        <span style="font-size: 20px;">🎉</span>
        <div>
          <strong>Kayıt Başarılı!</strong> ${escapeHtml(success)}
          <div style="margin-top: 6px;">
            <a href="/users" style="color: #14532D; font-weight: 700; text-decoration: underline;">
              Mezunlar Dizinine Git →
            </a>
          </div>
        </div>
      </div>
    `;
  } else if (error) {
    alertBox = `
      <div class="alert alert-error" style="margin-bottom: 24px;">
        <span style="font-size: 20px;">⚠️</span>
        <div>
          <strong>Kayıt Oluşturulamadı:</strong> ${escapeHtml(error)}
        </div>
      </div>
    `;
  }

  // Bölüm seçenekleri
  const selectedDeptId = formData.department_id ? String(formData.department_id) : '';
  const deptOptions = departments
    .map(
      (d) =>
        `<option value="${escapeHtml(d.id)}" ${selectedDeptId === String(d.id) ? 'selected' : ''}>
          ${escapeHtml(d.name)} (${escapeHtml(d.code)}) - ${escapeHtml(d.faculty || 'Fakülte')}
        </option>`
    )
    .join('');

  // Rol seçeneği
  const selectedRole = formData.role || 'alumni';

  const content = `
    ${alertBox}

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start;">
      
      <!-- Sol / Ana Bölüm: Kayıt Formu Kartı -->
      <div class="card" style="padding: 36px 32px; border: 1.5px solid rgba(245, 186, 19, 0.35);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="badge badge-dark" style="font-size: 12px; padding: 5px 14px; letter-spacing: 0.5px;">
            🏛️ T.C. İSTANBUL ÜNİVERSİTESİ
          </span>
          <span class="badge badge-warning" style="font-size: 12px; padding: 5px 14px;">
            Üyelik & Mezun Kaydı
          </span>
        </div>

        <h2 style="font-size: 26px; font-weight: 700; color: #111827; margin: 6px 0 10px 0; line-height: 1.3;">
          Mezunlar Ağına Katılın
        </h2>
        <p style="color: #4B5563; font-size: 15px; margin-bottom: 28px; line-height: 1.6;">
          1453'ten geleceğe uzanan akademik ve profesyonel köprümüzün bir parçası olun. Bilgilerinizi eksiksiz doldurarak topluluğumuzla hemen bağlantı kurun.
        </p>

        <form method="POST" action="/register" id="register-form">
          <div class="form-grid">
            
            <!-- 1. Ad Soyad -->
            <div class="form-group full-width">
              <label for="name">👤 Ad Soyad *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                minlength="2" 
                maxlength="100" 
                placeholder="Örn: Zeynep Kaya" 
                value="${escapeHtml(formData.name || '')}"
              >
              <span class="form-help">Diplomanızda veya resmî kimliğinizde kayıtlı adınız ve soyadınız.</span>
            </div>

            <!-- 2. E-Posta Adresi -->
            <div class="form-group">
              <label for="email">✉️ E-Posta Adresi *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                maxlength="255" 
                placeholder="Örn: zeynep.kaya@alumni.istanbul.edu.tr" 
                value="${escapeHtml(formData.email || '')}"
              >
              <span class="form-help">Sistem bildirimleri ve iletişim için kullanılacaktır.</span>
            </div>

            <!-- 3. Sistem Rolü (RBAC) -->
            <div class="form-group">
              <label for="role">🏷️ Üyelik Rolü (Statü) *</label>
              <select id="role" name="role" required>
                <option value="alumni" ${selectedRole === 'alumni' ? 'selected' : ''}>🎓 Mezun (İÜ Mezunu)</option>
                <option value="student" ${selectedRole === 'student' ? 'selected' : ''}>📚 Aktif Öğrenci (Öğrenimi Devam Eden)</option>
                <option value="coordinator" ${selectedRole === 'coordinator' ? 'selected' : ''}>🏛️ Bölüm Koordinatörü / Akademisyen</option>
                <option value="employer" ${selectedRole === 'employer' ? 'selected' : ''}>🏢 İşveren / Kurum Temsilcisi</option>
                <option value="admin" ${selectedRole === 'admin' ? 'selected' : ''}>🛡️ Sistem Yöneticisi (Admin)</option>
              </select>
              <span class="form-help">Sistem içindeki yetki ve kullanım profilinizi belirler.</span>
            </div>

            <!-- 4. Bölüm / Fakülte Seçimi -->
            <div class="form-group">
              <label for="department_id">🏛️ Fakülte / Akademik Bölüm</label>
              <select id="department_id" name="department_id">
                <option value="">-- Bölümünüzü Listeden Seçiniz --</option>
                ${deptOptions}
              </select>
              <span class="form-help">Mezun olduğunuz veya eğitim aldığınız birim.</span>
            </div>

            <!-- 5. Mezuniyet Yılı -->
            <div class="form-group">
              <label for="graduationYear">📅 Mezuniyet Yılı *</label>
              <input 
                type="number" 
                id="graduationYear" 
                name="graduationYear" 
                required 
                min="1950" 
                max="2100" 
                value="${escapeHtml(formData.graduationYear || currentYear)}"
              >
              <span class="form-help">Mezunlar için diploma yılı; öğrenciler için beklenen yıl.</span>
            </div>

            <!-- 6. Serbest Bölüm Adı (Opsiyonel / Tamamlayıcı) -->
            <div class="form-group full-width">
              <label for="department">📝 Bölüm Adı (Listede Bulunmuyorsa / Açıklama)</label>
              <input 
                type="text" 
                id="department" 
                name="department" 
                placeholder="Örn: Hukuk Fakültesi veya İktisat / Uluslararası İlişkiler" 
                value="${escapeHtml(formData.department || '')}"
              >
              <span class="form-help">Bölümünüz yukarıdaki listede yer almıyorsa buraya serbest metin olarak yazabilirsiniz.</span>
            </div>

            <!-- 7. Telefon (Opsiyonel) -->
            <div class="form-group">
              <label for="phone">📱 Telefon Numarası (Opsiyonel)</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="Örn: 0555 123 45 67" 
                value="${escapeHtml(formData.phone || '')}"
              >
            </div>

            <!-- 8. LinkedIn / Web Bağlantısı (Opsiyonel) -->
            <div class="form-group">
              <label for="linkedinUrl">🔗 LinkedIn / Profil Bağlantısı (Opsiyonel)</label>
              <input 
                type="url" 
                id="linkedinUrl" 
                name="linkedinUrl" 
                placeholder="Örn: https://linkedin.com/in/profil" 
                value="${escapeHtml(formData.linkedinUrl || '')}"
              >
            </div>

            <!-- 9. Hesap Güvenliği: Şifre ve Şifre Tekrarı -->
            <div class="form-group">
              <label for="password">🔒 Şifre *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                minlength="8" 
                placeholder="En az 8 karakter" 
                autocomplete="new-password"
              >
              <span class="form-help">Hesap güvenliğiniz için en az 8 karakter olmalıdır.</span>
            </div>

            <div class="form-group">
              <label for="passwordConfirm">🔒 Şifre Tekrarı *</label>
              <input 
                type="password" 
                id="passwordConfirm" 
                name="passwordConfirm" 
                required 
                minlength="8" 
                placeholder="Şifrenizi tekrar giriniz" 
                autocomplete="new-password"
              >
              <span class="form-help">Yukarıda belirlediğiniz şifre ile birebir eşleşmelidir.</span>
            </div>

            <!-- 10. KVKK ve Açık Rıza Onayı -->
            <div class="form-group full-width" style="margin-top: 8px;">
              <label style="display: flex; align-items: flex-start; gap: 10px; font-weight: 500; font-size: 13px; color: #374151; cursor: pointer;">
                <input type="checkbox" id="termsAgreement" name="termsAgreement" required checked style="width: 18px; height: 18px; margin-top: 2px;">
                <span>
                  <strong>KVKK ve Açık Rıza Metni:</strong> İstanbul Üniversitesi Mezun Bilgi Sistemi Aydınlatma Metni kapsamında kişisel verilerimin mezun dizini, kariyer bilgilendirmeleri ve üniversite etkinlikleri amacıyla işlenmesini kabul ediyorum.
                </span>
              </label>
            </div>

            <!-- Aksiyon Butonları -->
            <div class="form-actions" style="margin-top: 16px;">
              <button type="submit" class="btn btn-primary" style="font-size: 16px; padding: 13px 32px;">
                🚀 Kaydı Tamamla ve Katıl
              </button>
              <a href="/users" class="btn btn-secondary">
                Mevcut Mezunlar Dizini
              </a>
              <a href="/" class="btn btn-outline" style="border-color: #D1D5DB; color: #111827;">
                Ana Sayfa
              </a>
            </div>

          </div>
        </form>

        <script>
          (function() {
            var form = document.getElementById('register-form');
            var pwd = document.getElementById('password');
            var pwdConfirm = document.getElementById('passwordConfirm');

            function checkMatch() {
              if (!pwd || !pwdConfirm) return true;
              if (pwd.value && pwd.value.length < 8) {
                pwd.setCustomValidity('Şifre en az 8 karakter uzunluğunda olmalıdır.');
                return false;
              } else {
                pwd.setCustomValidity('');
              }

              if (pwdConfirm.value && pwd.value !== pwdConfirm.value) {
                pwdConfirm.setCustomValidity('Şifreler eşleşmiyor. Lütfen iki alana da aynı şifreyi yazınız.');
                return false;
              } else {
                pwdConfirm.setCustomValidity('');
                return true;
              }
            }

            if (pwd && pwdConfirm) {
              pwd.addEventListener('input', checkMatch);
              pwdConfirm.addEventListener('input', checkMatch);
              if (form) {
                form.addEventListener('submit', function(e) {
                  if (!checkMatch()) {
                    e.preventDefault();
                  }
                });
              }
            }
          })();
        </script>
      </div>

      <!-- Sağ Bölüm: Bilgilendirme ve Ayrıcalık Kartları -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Kart 1: Mezunlar Ağı Avantajları -->
        <div class="card" style="padding: 24px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <span>🌟</span>
            <span>Neden Katılmalısınız?</span>
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #374151; display: flex; flex-direction: column; gap: 14px;">
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">🤝</span>
              <div>
                <strong>Geniş Mezun İletişim Ağı:</strong> Farklı dönem ve fakültelerden binlerce mezunla iletişim kurun.
              </div>
            </li>
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">💼</span>
              <div>
                <strong>Öncelikli Kariyer Fırsatları:</strong> Mezunlara ve öğrencilere özel staj ve iş ilanlarına hemen başvurun.
              </div>
            </li>
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">🎟️</span>
              <div>
                <strong>Etkinlik & Buluşmalar:</strong> Geleneksel mezunlar günü, paneller ve akademik konferanslara katılın.
              </div>
            </li>
            <li style="display: flex; gap: 10px;">
              <span style="font-size: 18px; flex-shrink: 0;">📚</span>
              <div>
                <strong>Kütüphane & Veritabanları:</strong> İstanbul Üniversitesi akademik kaynaklarından faydalanın.
              </div>
            </li>
          </ul>
        </div>

        <!-- Kart 2: İletişim & Yardım -->
        <div class="card" style="padding: 24px; background-color: #F8FAF9; border: 1px solid #E5E7EB;">
          <h4 style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span>🏛️</span>
            <span>Mezunlar Koordinatörlüğü</span>
          </h4>
          <p style="font-size: 13px; color: #4B5563; line-height: 1.6; margin-bottom: 12px;">
            Kayıt esnasında veya diploma teyidinde bir sorun yaşarsanız rektörlük mezun masası ile iletişime geçebilirsiniz.
          </p>
          <div style="font-size: 13px; color: #1F2937; display: flex; flex-direction: column; gap: 4px;">
            <span>📍 Beyazıt Yerleşkesi, Fatih / İstanbul</span>
            <span>✉️ <a href="mailto:mezun@istanbul.edu.tr" style="color: #111827; text-decoration: underline;">mezun@istanbul.edu.tr</a></span>
          </div>
        </div>

      </div>

    </div>
  `;

  return renderLayout({
    title: 'Mezun & Üye Kaydı | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'users',
    pageTitle: '🎓 İstanbul Üniversitesi Mezun & Üye Kaydı',
    pageSubtitle: 'İstanbul Üniversitesi mezunlar ağına, kariyer portalına ve kampüs etkinliklerine katılmak için kaydınızı oluşturun.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <a href="/users">Mezunlar</a> <span class="separator">/</span> <span class="current">Kayıt Ol</span>',
    content,
  });
};

module.exports = {
  renderRegisterPage,
};
