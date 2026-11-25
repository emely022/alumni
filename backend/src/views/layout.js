/**
 * Layout View (Ortak Şablon Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun olarak oluşturulmuştur:
 * - Koyu yeşil zemin: #214539
 * - Header & Footer: #17342A
 * - Sarı vurgular & butonlar: #F5BA13 (siyah yazılı #111827 pill butonlar)
 * - Beyaz kartlar: #FFFFFF (siyah/koyu gri yazılı, 16px radius, gölgeli)
 * - Tipografi: Arial, "Helvetica Neue", Helvetica, sans-serif (İtalik yok, harici font yok)
 * - Logo: /istanbul-universitesi-logo.png
 */

const { renderHeaderMenu } = require('../components/headerMenu');

/**
 * XSS Koruması için HTML kaçış fonksiyonu
 * @param {unknown} value 
 * @returns {string}
 */
const escapeHtml = (value) => {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Sayfa Çatısı (Layout Wrapper)
 * @param {Object} options
 * @param {string} options.title - Sayfa başlığı (<title>)
 * @param {string} [options.activeNav] - Aktif menü öğesi: 'home' | 'users' | 'announcements' | 'jobs' | 'applications' | 'swagger' | 'login' | 'register'
 * @param {string} options.content - Sayfanın ana gövde HTML içeriği
 * @param {string} [options.pageTitle] - H1 veya ana başlık metni
 * @param {string} [options.pageSubtitle] - Başlık altı açıklama
 * @param {string} [options.actionButtonHtml] - Başlığın sağındaki opsiyonel buton
 * @param {string} [options.breadcrumbsHtml] - Ekmek kırıntısı gezinme
 * @param {Object|null} [options.currentUser] - Oturum açmış kullanıcı bilgisi
 * @returns {string} Tam HTML dokümanı
 */
const renderLayout = ({
  title = 'İstanbul Üniversitesi | Mezun Bilgi Sistemi',
  activeNav = '',
  content = '',
  pageTitle = '',
  pageSubtitle = '',
  actionButtonHtml = '',
  breadcrumbsHtml = '',
  currentUser,
}) => {
  const headerHtml = renderHeaderMenu({ activeNav, currentUser });
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    /* ==========================================================================
       design.md Tasarım Sistemi Değişkenleri
       ========================================================================== */
    :root {
      --color-canvas-green: #214539;
      --color-canvas-dark: #17342A;
      --color-surface-green: #295547;
      
      --color-action-yellow: #F5BA13;
      --color-yellow-hover: #FFCC00;
      --color-yellow-muted: #DF9C0A;

      --color-paper-white: #FFFFFF;
      --color-off-white: #F9FAFB;
      --color-white-muted: rgba(255, 255, 255, 0.88);
      --color-white-subtle: rgba(255, 255, 255, 0.65);

      --color-text-black: #111827;
      --color-text-charcoal: #374151;
      --color-text-slate: #6B7280;

      --color-border-green: rgba(255, 255, 255, 0.15);
      --color-border-white: #E5E7EB;
      --color-border-yellow: #F5BA13;

      --font-family-base: Arial, "Helvetica Neue", Helvetica, sans-serif;

      --radius-full: 100px;
      --radius-card: 16px;
      --radius-large-card: 24px;
      --radius-input: 10px;

      --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.15);
      --shadow-card-hover: 0 12px 24px -4px rgba(10, 26, 20, 0.35);
      --shadow-button: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(245, 186, 19, 0.25);
      --shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(245, 186, 19, 0.4);

      --page-max-width: 1200px;
    }

    /* Sıfırlama ve Temel Kurallar - İtalik Kesinlikle Yoktur */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-style: normal !important;
    }

    body {
      font-family: var(--font-family-base);
      background-color: var(--color-canvas-green);
      color: var(--color-paper-white);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* --------------------------------------------------------------------------
       Top Institutional Bar
       -------------------------------------------------------------------------- */
    .top-bar {
      background-color: var(--color-canvas-dark);
      color: var(--color-white-subtle);
      font-size: 13px;
      padding: 9px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border-green);
    }
    .top-bar-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .top-bar-title strong {
      color: var(--color-action-yellow);
    }
    .top-bar-links {
      display: flex;
      gap: 18px;
    }
    .top-bar-links a {
      color: var(--color-white-muted);
      transition: color 0.2s ease;
    }
    .top-bar-links a:hover {
      color: var(--color-action-yellow);
      text-decoration: underline;
    }

    /* --------------------------------------------------------------------------
       Header & Navigation Menu
       -------------------------------------------------------------------------- */
    .header {
      background-color: rgba(23, 52, 42, 0.96);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 2px solid var(--color-action-yellow);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .header-inner {
      max-width: var(--page-max-width);
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #ffffff;
      padding: 2px;
      box-shadow: 0 0 0 2px var(--color-action-yellow);
      flex-shrink: 0;
    }
    .brand-texts {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.3px;
      color: var(--color-paper-white);
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 11px;
      color: var(--color-action-yellow);
      letter-spacing: 1px;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .nav-item {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-white-muted);
      padding: 8px 14px;
      border-radius: var(--radius-full);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--color-paper-white);
    }
    .nav-item.active {
      background-color: rgba(245, 186, 19, 0.15);
      color: var(--color-action-yellow);
      border: 1px solid rgba(245, 186, 19, 0.3);
    }
    .nav-cta {
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
      padding: 9px 20px;
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 700;
      box-shadow: var(--shadow-button);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .nav-cta:hover {
      background-color: var(--color-yellow-hover);
      box-shadow: var(--shadow-button-hover);
      transform: translateY(-1px);
    }

    /* --------------------------------------------------------------------------
       Main Page Shell & Container
       -------------------------------------------------------------------------- */
    .main-wrapper {
      flex: 1;
      max-width: var(--page-max-width);
      width: 100%;
      margin: 0 auto;
      padding: 32px 24px 60px 24px;
    }

    /* Breadcrumbs */
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--color-white-subtle);
      margin-bottom: 20px;
    }
    .breadcrumbs a {
      color: var(--color-white-muted);
      transition: color 0.2s;
    }
    .breadcrumbs a:hover {
      color: var(--color-action-yellow);
      text-decoration: underline;
    }
    .breadcrumbs span.separator {
      color: rgba(255, 255, 255, 0.3);
    }
    .breadcrumbs span.current {
      color: var(--color-action-yellow);
      font-weight: 600;
    }

    /* Page Header Banner */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--color-border-green);
    }
    .page-title-group h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--color-paper-white);
      line-height: 1.2;
    }
    .page-title-group p {
      font-size: 15px;
      color: var(--color-white-muted);
      margin-top: 6px;
    }

    /* --------------------------------------------------------------------------
       Cards & Panels (design.md White Cards)
       -------------------------------------------------------------------------- */
    .card {
      background-color: var(--color-paper-white);
      color: var(--color-text-black);
      border-radius: var(--radius-card);
      padding: 28px;
      box-shadow: var(--shadow-card);
      margin-bottom: 28px;
      border: 1px solid var(--color-border-white);
    }
    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-text-black);
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-border-white);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    /* --------------------------------------------------------------------------
       Buttons (design.md Yellow Pills & Outlines)
       -------------------------------------------------------------------------- */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 22px;
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
      line-height: 1.2;
    }
    .btn-primary, .btn-submit {
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
      box-shadow: var(--shadow-button);
    }
    .btn-primary:hover, .btn-submit:hover {
      background-color: var(--color-yellow-hover);
      box-shadow: var(--shadow-button-hover);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background-color: #F3F4F6;
      color: var(--color-text-black);
      border: 1px solid #D1D5DB;
    }
    .btn-secondary:hover {
      background-color: #E5E7EB;
      color: #000;
    }
    .btn-outline {
      background-color: transparent;
      color: var(--color-action-yellow);
      border: 1.5px solid var(--color-action-yellow);
    }
    .btn-outline:hover {
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
    }
    .btn-danger, .btn-delete {
      background-color: #EF4444;
      color: #FFFFFF;
    }
    .btn-danger:hover, .btn-delete:hover {
      background-color: #DC2626;
      transform: translateY(-1px);
    }
    .btn-sm {
      padding: 6px 14px;
      font-size: 13px;
    }

    /* --------------------------------------------------------------------------
       Forms & Inputs
       -------------------------------------------------------------------------- */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    .form-group label {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--color-text-black);
    }
    .form-group input, 
    .form-group select, 
    .form-group textarea {
      padding: 12px 16px;
      border: 1.5px solid #D1D5DB;
      border-radius: var(--radius-input);
      font-size: 14px;
      font-family: inherit;
      color: var(--color-text-black);
      background-color: #FAFAFA;
      transition: all 0.2s ease;
      outline: none;
    }
    .form-group input:focus, 
    .form-group select:focus, 
    .form-group textarea:focus {
      border-color: var(--color-action-yellow);
      background-color: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(245, 186, 19, 0.25);
    }
    .form-help {
      font-size: 12px;
      color: var(--color-text-slate);
      margin-top: 6px;
    }
    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 12px;
      margin-top: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border-white);
    }

    /* --------------------------------------------------------------------------
       Tables
       -------------------------------------------------------------------------- */
    .table-responsive {
      overflow-x: auto;
      border-radius: var(--radius-card);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .data-table th {
      background-color: #F9FAFB;
      color: var(--color-text-black);
      font-weight: 700;
      padding: 14px 18px;
      border-bottom: 2px solid var(--color-border-white);
      white-space: nowrap;
    }
    .data-table td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--color-border-white);
      color: var(--color-text-charcoal);
      vertical-align: middle;
    }
    .data-table tbody tr:hover {
      background-color: #F8FAF9;
    }
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* --------------------------------------------------------------------------
       Badges & Tags
       -------------------------------------------------------------------------- */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
    .badge-success { background-color: #DCFCE7; color: #166534; }
    .badge-warning { background-color: #FEF3C7; color: #92400E; }
    .badge-info    { background-color: #E0F2FE; color: #075985; }
    .badge-danger  { background-color: #FEE2E2; color: #991B1B; }
    .badge-neutral { background-color: #F3F4F6; color: #374151; }
    .badge-dark    { background-color: #17342A; color: var(--color-action-yellow); }

    /* --------------------------------------------------------------------------
       Alerts
       -------------------------------------------------------------------------- */
    .alert {
      padding: 14px 20px;
      border-radius: var(--radius-card);
      margin-bottom: 24px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .alert-success {
      background-color: #DCFCE7;
      color: #14532D;
      border: 1px solid #86EFAC;
    }
    .alert-error {
      background-color: #FEE2E2;
      color: #7F1D1D;
      border: 1px solid #FCA5A5;
    }

    /* --------------------------------------------------------------------------
       Empty State
       -------------------------------------------------------------------------- */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--color-text-slate);
    }
    .empty-state-icon {
      font-size: 44px;
      margin-bottom: 12px;
    }
    .empty-state h3 {
      font-size: 18px;
      color: var(--color-text-black);
      margin-bottom: 6px;
    }

    /* --------------------------------------------------------------------------
       Footer
       -------------------------------------------------------------------------- */
    .footer {
      background-color: var(--color-canvas-dark);
      border-top: 1px solid var(--color-border-green);
      padding: 48px 24px 28px 24px;
      margin-top: auto;
    }
    .footer-inner {
      max-width: var(--page-max-width);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 36px;
    }
    .footer-brand h4 {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-paper-white);
      margin-bottom: 8px;
    }
    .footer-brand p {
      font-size: 13px;
      color: var(--color-white-subtle);
      line-height: 1.6;
    }
    .footer-col h5 {
      font-size: 14px;
      font-weight: 700;
      color: var(--color-action-yellow);
      margin-bottom: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col li {
      margin-bottom: 8px;
    }
    .footer-col a {
      font-size: 13px;
      color: var(--color-white-muted);
      transition: color 0.2s;
    }
    .footer-col a:hover {
      color: var(--color-action-yellow);
      text-decoration: underline;
    }
    .footer-bottom {
      max-width: var(--page-max-width);
      margin: 0 auto;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--color-white-subtle);
      flex-wrap: wrap;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .top-bar { display: none; }
      .header-inner { flex-direction: column; align-items: flex-start; }
      .nav-menu { width: 100%; overflow-x: auto; padding-bottom: 8px; }
      .form-grid { grid-template-columns: 1fr; }
      .footer-inner { grid-template-columns: 1fr; gap: 24px; }
      .page-header { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
${headerHtml}

  <!-- 3. Main Page Shell -->
  <main class="main-wrapper">
    ${breadcrumbsHtml ? `<nav class="breadcrumbs">${breadcrumbsHtml}</nav>` : ''}
    
    ${pageTitle ? `
    <div class="page-header">
      <div class="page-title-group">
        <h1>${pageTitle}</h1>
        ${pageSubtitle ? `<p>${pageSubtitle}</p>` : ''}
      </div>
      ${actionButtonHtml ? `<div>${actionButtonHtml}</div>` : ''}
    </div>
    ` : ''}

    ${content}
  </main>

  <!-- 4. Institutional Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <img src="/istanbul-universitesi-logo.png" alt="İÜ Logo" style="width: 36px; height: 36px; border-radius: 50%; background: #fff; padding: 1px;">
          <h4 style="margin: 0;">İSTANBUL ÜNİVERSİTESİ</h4>
        </div>
        <p>1453'ten bugüne uzanan köklü bilim mirası ile mezunlarımızı, akademisyenlerimizi ve öğrencilerimizi ortak bir dijital ağda buluşturuyoruz.</p>
        <p style="margin-top: 10px; font-size: 12px;">📍 Beyazıt Yerleşkesi, 34452 Fatih / İstanbul</p>
      </div>

      <div class="footer-col">
        <h5>Mezun Ağı</h5>
        <ul>
          <li><a href="/users">Mezun Dizini</a></li>
          <li><a href="/register">Mezun Kaydı Yap</a></li>
          <li><a href="/#alumni-profiles">Öne Çıkan Mezunlar</a></li>
          <li><a href="/#product-page">Mezun Hizmetleri</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Kariyer & Kampüs</h5>
        <ul>
          <li><a href="/job-postings">İş ve Staj İlanları</a></li>
          <li><a href="/job-postings/new">İlan Yayınla</a></li>
          <li><a href="/applications">Başvuru Takibi</a></li>
          <li><a href="/announcements">Duyurular & Etkinlikler</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Geliştirici & Sistem</h5>
        <ul>
          <li><a href="/api/swagger" target="_blank">Swagger UI Dokümanı</a></li>
          <li><a href="/api/health" target="_blank">Sistem Sağlık Durumu</a></li>
          <li><a href="/about">Proje & Ekip</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; 2026 T.C. İstanbul Üniversitesi &bull; Mezun Bilgi Sistemi. Tüm hakları saklıdır.</span>
      <span>Tasarım: Letters Esintili İÜ Kurumsal Kimliği (#214539 &bull; #F5BA13)</span>
    </div>
  </footer>

</body>
</html>`;
};

module.exports = {
  renderLayout,
  escapeHtml,
};
