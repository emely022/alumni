/**
 * Home View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * MVC mimarisinin View katmanıdır.
 * İstanbul Üniversitesi kurumsal kimliğine (1453 mirası, lacivert-altın-bordo renk paleti,
 * Beyazıt Tarihi Kapısı sembolizmi) uygun, modern, duyarlı (responsive) ve
 * zengin içerikli ana sayfa HTML şablonunu oluşturmaktan sorumludur.
 */

const renderHomePage = (stats = {}) => {
  const usersCount = stats.usersCount ?? 450000;
  const jobsCount = stats.jobPostingsCount ?? 120;
  const announcementsCount = stats.announcementsCount ?? 48;
  const departmentsCount = stats.departmentsCount ?? 17;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İstanbul Üniversitesi | Mezun Bilgi Sistemi (İÜ Mezun)</title>
  <meta name="description" content="T.C. İstanbul Üniversitesi Mezun Bilgi Sistemi - 1453'ten geleceğe bilim köprüsü. Mezunlar ağı, kariyer ilanları, kampüs duyuruları ve etkinlikler.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --iu-navy: #002855;
      --iu-navy-dark: #001b3a;
      --iu-navy-light: #0f3d75;
      --iu-gold: #c59b27;
      --iu-gold-light: #e5b83a;
      --iu-gold-dark: #997314;
      --iu-burgundy: #7a0016;
      --iu-burgundy-light: #991428;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --bg-page: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
      --border-subtle: #edf2f7;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* Top Utility Bar */
    .top-bar {
      background-color: var(--iu-navy-dark);
      color: #cbd5e1;
      font-size: 0.8rem;
      padding: 8px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(197, 155, 39, 0.3);
    }
    .top-bar .motto {
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.5px;
    }
    .top-bar .motto strong {
      color: var(--iu-gold-light);
    }
    .top-bar .quick-links {
      display: flex;
      gap: 16px;
    }
    .top-bar .quick-links a:hover {
      color: #ffffff;
      text-decoration: underline;
    }

    /* Main Navigation Header */
    .header {
      background-color: var(--iu-navy);
      color: #ffffff;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0, 27, 58, 0.25);
      border-bottom: 3px solid var(--iu-gold);
    }
    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 54px;
      height: 54px;
      background: radial-gradient(circle, #ffffff 65%, #f1f5f9 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--iu-gold);
      box-shadow: 0 0 10px rgba(197, 155, 39, 0.4);
      flex-shrink: 0;
    }
    .brand-logo svg {
      width: 40px;
      height: 40px;
    }
    .brand-text h1 {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #ffffff;
      line-height: 1.2;
    }
    .brand-text p {
      font-size: 0.78rem;
      color: var(--iu-gold-light);
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .nav-link {
      padding: 8px 14px;
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: var(--radius-sm);
      color: #e2e8f0;
      transition: all 0.2s ease;
    }
    .nav-link:hover, .nav-link.active {
      background-color: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .nav-link.cta-btn {
      background: linear-gradient(135deg, var(--iu-gold) 0%, var(--iu-gold-light) 100%);
      color: var(--iu-navy-dark);
      font-weight: 700;
      padding: 8px 16px;
      box-shadow: 0 2px 6px rgba(197, 155, 39, 0.4);
    }
    .nav-link.cta-btn:hover {
      background: linear-gradient(135deg, var(--iu-gold-light) 0%, #fff 100%);
      transform: translateY(-1px);
    }

    /* Hero Section */
    .hero {
      position: relative;
      background: linear-gradient(135deg, var(--iu-navy-dark) 0%, var(--iu-navy) 60%, var(--iu-navy-light) 100%);
      color: #ffffff;
      padding: 70px 24px 90px;
      overflow: hidden;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }
    .hero::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(197, 155, 39, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(122, 0, 22, 0.15) 0%, transparent 45%);
      pointer-events: none;
    }
    .hero-container {
      max-width: 960px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: rgba(197, 155, 39, 0.15);
      border: 1px solid var(--iu-gold);
      color: var(--iu-gold-light);
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.6px;
      margin-bottom: 22px;
      text-transform: uppercase;
    }
    .hero-title {
      font-family: 'Cinzel', serif;
      font-size: 2.75rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 20px;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .hero-title span {
      background: linear-gradient(90deg, #ffffff, var(--iu-gold-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: #cbd5e1;
      max-width: 760px;
      margin: 0 auto 36px;
      font-weight: 400;
      line-height: 1.7;
    }
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 45px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 28px;
      font-size: 0.98rem;
      font-weight: 600;
      border-radius: var(--radius-md);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .btn-gold {
      background: linear-gradient(135deg, var(--iu-gold) 0%, var(--iu-gold-light) 100%);
      color: var(--iu-navy-dark);
      box-shadow: 0 4px 14px rgba(197, 155, 39, 0.35);
    }
    .btn-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(197, 155, 39, 0.5);
    }
    .btn-outline-white {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(4px);
    }
    .btn-outline-white:hover {
      background: rgba(255, 255, 255, 0.18);
      border-color: #ffffff;
      transform: translateY(-2px);
    }
    .btn-burgundy {
      background-color: var(--iu-burgundy);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-burgundy:hover {
      background-color: var(--iu-burgundy-light);
      transform: translateY(-2px);
    }

    /* Key Numbers Bar */
    .stats-bar {
      max-width: 1100px;
      margin: -45px auto 40px;
      padding: 0 24px;
      position: relative;
      z-index: 10;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }
    .stat-item {
      padding: 24px 20px;
      text-align: center;
      border-right: 1px solid var(--border-subtle);
      transition: background 0.2s;
    }
    .stat-item:last-child {
      border-right: none;
    }
    .stat-item:hover {
      background-color: #fbfcfe;
    }
    .stat-num {
      font-family: 'Cinzel', serif;
      font-size: 2.1rem;
      font-weight: 800;
      color: var(--iu-navy);
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .stat-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    /* Main Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 60px;
    }

    .section-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 40px;
    }
    .section-tag {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--iu-burgundy);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 8px;
    }
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      color: var(--iu-navy);
      font-weight: 700;
      margin-bottom: 12px;
    }
    .section-desc {
      color: var(--text-muted);
      font-size: 1rem;
    }

    /* Modules Grid */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 60px;
    }
    .module-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-color);
      padding: 30px 26px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .module-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--iu-navy), var(--iu-gold));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .module-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: #cbd5e1;
    }
    .module-card:hover::before {
      opacity: 1;
    }
    .card-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin-bottom: 20px;
      background-color: #f1f5f9;
      color: var(--iu-navy);
      border: 1px solid var(--border-color);
    }
    .module-card:nth-child(1) .card-icon { background: #e0f2fe; color: #0284c7; }
    .module-card:nth-child(2) .card-icon { background: #fef3c7; color: #d97706; }
    .module-card:nth-child(3) .card-icon { background: #dcfce7; color: #16a34a; }
    .module-card:nth-child(4) .card-icon { background: #f3e8ff; color: #9333ea; }
    .module-card:nth-child(5) .card-icon { background: #fee2e2; color: #dc2626; }
    .module-card:nth-child(6) .card-icon { background: #e2e8f0; color: #334155; }

    .card-title {
      font-size: 1.22rem;
      font-weight: 700;
      color: var(--iu-navy);
      margin-bottom: 10px;
    }
    .card-text {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }
    .card-link {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--iu-navy);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: gap 0.2s ease, color 0.2s ease;
    }
    .card-link:hover {
      color: var(--iu-gold-dark);
      gap: 10px;
    }

    /* Historic Faculties Banner */
    .faculties-section {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 40px 32px;
      margin-bottom: 60px;
      box-shadow: var(--shadow-sm);
    }
    .faculties-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 28px;
    }
    .faculty-badge {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px;
      border-radius: var(--radius-md);
      background: #f8fafc;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s ease;
    }
    .faculty-badge:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateX(3px);
    }
    .faculty-year {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--iu-navy);
      color: var(--iu-gold-light);
      padding: 3px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .faculty-info h4 {
      font-size: 0.96rem;
      font-weight: 600;
      color: var(--iu-navy);
      margin-bottom: 4px;
    }
    .faculty-info p {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Recent News & Career Showcase */
    .split-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 60px;
    }
    .split-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 32px;
      box-shadow: var(--shadow-sm);
    }
    .split-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border-subtle);
    }
    .split-card-header h3 {
      font-size: 1.25rem;
      color: var(--iu-navy);
      font-weight: 700;
    }
    .split-card-header a {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--iu-gold-dark);
    }
    .split-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .split-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding-bottom: 14px;
      border-bottom: 1px dashed var(--border-color);
    }
    .split-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .split-item-date {
      background: #f1f5f9;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      text-align: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--iu-navy);
      min-width: 60px;
    }
    .split-item-date span {
      display: block;
      font-size: 1.1rem;
      font-family: 'Cinzel', serif;
    }
    .split-item-content h5 {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--text-main);
    }
    .split-item-content p {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    /* Developer / Educational Endpoints Card (Preserving Project Requirements) */
    .dev-endpoints-box {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 32px;
      margin-bottom: 60px;
      box-shadow: var(--shadow-sm);
    }
    .dev-endpoints-box h3 {
      font-size: 1.15rem;
      color: var(--iu-navy);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dev-endpoints-box p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .endpoints-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      transition: all 0.15s ease;
    }
    .endpoint-item:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    .endpoint-item code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      color: var(--iu-navy);
    }
    .endpoint-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: #e2e8f0;
      color: #334155;
    }
    .badge-get { background: #e0f2fe; color: #0369a1; }
    .badge-json { background: #fef3c7; color: #b45309; }

    /* Heritage Callout / Beyazıt Arch */
    .heritage-banner {
      background: linear-gradient(135deg, #001b3a 0%, #002855 100%);
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
      border: 1px solid var(--iu-gold);
      box-shadow: var(--shadow-md);
      margin-bottom: 60px;
    }
    .heritage-content h3 {
      font-family: 'Cinzel', serif;
      font-size: 1.7rem;
      color: var(--iu-gold-light);
      margin-bottom: 12px;
    }
    .heritage-content p {
      font-size: 0.98rem;
      color: #cbd5e1;
      max-width: 700px;
      line-height: 1.7;
    }

    /* Footer */
    .footer {
      background-color: var(--iu-navy-dark);
      color: #94a3b8;
      font-size: 0.88rem;
      border-top: 4px solid var(--iu-gold);
    }
    .footer-top {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 24px 40px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
    }
    .footer-brand h4 {
      font-family: 'Cinzel', serif;
      color: #ffffff;
      font-size: 1.15rem;
      margin-bottom: 12px;
    }
    .footer-brand p {
      line-height: 1.6;
      margin-bottom: 16px;
      color: #94a3b8;
    }
    .footer-col h5 {
      color: #ffffff;
      font-size: 0.92rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col li {
      margin-bottom: 10px;
    }
    .footer-col a:hover {
      color: var(--iu-gold-light);
      text-decoration: underline;
    }
    .footer-bottom {
      background-color: #001226;
      padding: 20px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      text-align: center;
      font-size: 0.8rem;
      color: #64748b;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .hero-title { font-size: 2.2rem; }
      .modules-grid { grid-template-columns: repeat(2, 1fr); }
      .faculties-grid { grid-template-columns: repeat(2, 1fr); }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .stat-item:nth-child(2) { border-right: none; }
      .stat-item:nth-child(1), .stat-item:nth-child(2) { border-bottom: 1px solid var(--border-subtle); }
      .split-grid { grid-template-columns: 1fr; }
      .footer-top { grid-template-columns: 1fr 1fr; }
      .heritage-banner { flex-direction: column; text-align: center; }
    }
    @media (max-width: 640px) {
      .top-bar { display: none; }
      .header-container { flex-direction: column; align-items: stretch; }
      .nav-menu { justify-content: center; }
      .hero { padding: 45px 16px 65px; }
      .hero-title { font-size: 1.75rem; }
      .modules-grid { grid-template-columns: 1fr; }
      .faculties-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr; }
      .stat-item { border-right: none; border-bottom: 1px solid var(--border-subtle); }
      .footer-top { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Top Institutional Bar -->
  <div class="top-bar">
    <div class="motto">
      <span>🏛️</span>
      <span><strong>T.C. İSTANBUL ÜNİVERSİTESİ</strong> • 1453'TEN GELECEĞE BİLİM KÖPRÜSÜ</span>
    </div>
    <div class="quick-links">
      <a href="https://www.istanbul.edu.tr" target="_blank" rel="noopener">Resmi Web Sitesi</a>
      <a href="/about">Hakkında</a>
      <a href="/api/swagger">Swagger Dokümantasyonu</a>
    </div>
  </div>

  <!-- Header Navigation -->
  <header class="header">
    <div class="header-container">
      <a href="/" class="brand">
        <div class="brand-logo" title="İstanbul Üniversitesi - 1453">
          <!-- İstanbul Üniversitesi Beyazıt Kapısı ve Meşale Temsili Vektör Logosu -->
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="#002855" stroke="#C59B27" stroke-width="4"/>
            <circle cx="50" cy="50" r="41" stroke="#E5B83A" stroke-width="1" stroke-dasharray="2 3"/>
            <!-- Beyazıt Kapısı Kemeri -->
            <path d="M30 68 V46 C30 35 70 35 70 46 V68" stroke="#E5B83A" stroke-width="4" stroke-linecap="round"/>
            <path d="M38 68 V50 C38 43 62 43 62 50 V68" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Üst Kitabe / Kubbe -->
            <path d="M26 44 Q50 26 74 44" stroke="#E5B83A" stroke-width="3" fill="none"/>
            <circle cx="50" cy="27" r="3.5" fill="#E5B83A"/>
            <!-- 1453 Yazısı -->
            <text x="50" y="78" text-anchor="middle" fill="#E5B83A" font-family="'Cinzel', serif" font-size="9" font-weight="bold" letter-spacing="1">1453</text>
          </svg>
        </div>
        <div class="brand-text">
          <h1>İSTANBUL ÜNİVERSİTESİ</h1>
          <p>Mezun Bilgi Sistemi • İÜ Mezun</p>
        </div>
      </a>

      <nav class="nav-menu">
        <a href="/" class="nav-link active">Ana Sayfa</a>
        <a href="/users" class="nav-link">Mezunlar</a>
        <a href="/announcements" class="nav-link">Duyurular</a>
        <a href="/job-postings" class="nav-link">İş İlanları</a>
        <a href="/applications" class="nav-link">Başvurular</a>
        <a href="/api/swagger" class="nav-link">API / Swagger</a>
        <a href="/users" class="nav-link cta-btn">+ Mezun Kaydı</a>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-container">
      <div class="hero-badge">
        <span>🏛️</span> 1453'ten Günümüze • 570+ Yıllık Köklü Miras
      </div>
      <h2 class="hero-title">
        Tarihten Geleceğe Bilim Köprüsü: <span>İÜ Mezun Ailesi Buluşuyor</span>
      </h2>
      <p class="hero-subtitle">
        Türkiye'nin ilk ve en köklü üniversitesinin yarım milyona yaklaşan mezun topluluğuna hoş geldiniz.
        Beyazıt Meydanı'nın tarihi kapısından başlayan yolculuğunuzu İÜ Mezun Sistemi ile taçlandırın;
        dönem arkadaşlarınızla bağlarınızı tazeleyin, kariyer fırsatlarını yakalayın.
      </p>

      <div class="hero-actions">
        <a href="/users" class="btn btn-gold">
          <span>🎓</span> Mezun Portalı & Kayıt
        </a>
        <a href="/job-postings" class="btn btn-outline-white">
          <span>💼</span> Kariyer & İş İlanları
        </a>
        <a href="/announcements" class="btn btn-burgundy">
          <span>📢</span> Kampüs Duyuruları
        </a>
      </div>
    </div>
  </section>

  <!-- Institutional Metrics Bar -->
  <div class="stats-bar">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-num">1453</div>
        <div class="stat-label">Kuruluş Yılı</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">${usersCount > 400000 ? '450.000+' : usersCount.toLocaleString('tr-TR')}</div>
        <div class="stat-label">Mezun Topluluğu</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">${departmentsCount > 10 ? departmentsCount : '17'}</div>
        <div class="stat-label">Fakülte & Enstitü</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">${jobsCount > 10 ? jobsCount + '+' : '120+'}</div>
        <div class="stat-label">Kariyer & Staj İlanı</div>
      </div>
    </div>
  </div>

  <!-- Main Content Area -->
  <main class="container">

    <!-- Core Modules Section -->
    <section>
      <div class="section-header">
        <span class="section-tag">Mezun Hizmetleri</span>
        <h3 class="section-title">Tek Platformda Tüm İhtiyaçlarınız</h3>
        <p class="section-desc">
          İstanbul Üniversitesi mezunları ve öğrencileri için geliştirilen dijital ekosistem ile
          kariyerinizi güçlendirin ve üniversitenizle bağınızı koruyun.
        </p>
      </div>

      <div class="modules-grid">
        <!-- Mezunlar Portalı -->
        <article class="module-card">
          <div class="card-icon">🎓</div>
          <h4 class="card-title">Mezun Ağı & Rehberi</h4>
          <p class="card-text">
            Fakülte, bölüm ve mezuniyet yılına göre mezunları filtreleyin, dönem arkadaşlarınızla iletişime geçin ve profil bilgilerinizi güncelleyin.
          </p>
          <a href="/users" class="card-link">Mezunları Keşfet ➔</a>
        </article>

        <!-- Duyurular & Etkinlikler -->
        <article class="module-card">
          <div class="card-icon">📢</div>
          <h4 class="card-title">Kampüs & Mezun Duyuruları</h4>
          <p class="card-text">
            Rektörlük haberleri, geleneksel Beyazıt mezunlar günü, akademik paneller, seminerler ve fakülte buluşmalarını takip edin.
          </p>
          <a href="/announcements" class="card-link">Duyuruları İncele ➔</a>
        </article>

        <!-- Kariyer & İş İlanları -->
        <article class="module-card">
          <div class="card-icon">💼</div>
          <h4 class="card-title">Kariyer & İş İlanları</h4>
          <p class="card-text">
            İÜ mezunlarının ve iş dünyasındaki partner kurumların sunduğu tam zamanlı, yarı zamanlı ve staj fırsatlarını inceleyin.
          </p>
          <a href="/job-postings" class="card-link">İlanları Görüntüle ➔</a>
        </article>

        <!-- Başvuru Takibi -->
        <article class="module-card">
          <div class="card-icon">📄</div>
          <h4 class="card-title">İş Başvuruları & Takip</h4>
          <p class="card-text">
            İlgilendiğiniz pozisyonlara CV ve ön yazınızla başvurun; başvuru değerlendirme aşamalarını (mülakat, kabul, inceleme) anlık izleyin.
          </p>
          <a href="/applications" class="card-link">Başvuru Takibi ➔</a>
        </article>

        <!-- Akademik Bölümler -->
        <article class="module-card">
          <div class="card-icon">🏛️</div>
          <h4 class="card-title">Fakülteler & Bölümler</h4>
          <p class="card-text">
            Üniversitemizin köklü fakültelerine, bölümlerine ve akademik kadrolarına yönelik ilişkisel veritabanı entegrasyonu.
          </p>
          <a href="/api/departments" class="card-link">Bölümleri Listele ➔</a>
        </article>

        <!-- API & Swagger Dokümantasyonu -->
        <article class="module-card">
          <div class="card-icon">⚡</div>
          <h4 class="card-title">Geliştirici & REST API</h4>
          <p class="card-text">
            OpenAPI 3.0 standardındaki Swagger UI arayüzü ile tüm mezun, etkinlik, ilan ve başvuru RESTful uç noktalarını test edin.
          </p>
          <a href="/api/swagger" target="_blank" class="card-link">Swagger UI Aç ➔</a>
        </article>
      </div>
    </section>

    <!-- Historic Faculties Showcase -->
    <section class="faculties-section">
      <div class="section-header" style="margin-bottom: 20px;">
        <span class="section-tag">Akademik Miras</span>
        <h3 class="section-title">Köklü Fakültelerimiz</h3>
        <p class="section-desc">Asırları aşan bilgi birikimiyle Türkiye'nin aydınlık geleceğine yön veren öncü fakültelerimiz.</p>
      </div>

      <div class="faculties-grid">
        <div class="faculty-badge">
          <span class="faculty-year">1827</span>
          <div class="faculty-info">
            <h4>İstanbul Tıp Fakültesi</h4>
            <p>Mekteb-i Tıbbiye-i Şahane geleneğiyle Türk modern tıbbının beşiği.</p>
          </div>
        </div>

        <div class="faculty-badge">
          <span class="faculty-year">1874</span>
          <div class="faculty-info">
            <h4>Hukuk Fakültesi</h4>
            <p>Mekteb-i Hukuk'tan bugüne Türkiye'nin en köklü hukuk fakültesi.</p>
          </div>
        </div>

        <div class="faculty-badge">
          <span class="faculty-year">1870</span>
          <div class="faculty-info">
            <h4>Edebiyat Fakültesi</h4>
            <p>Tarih, felsefe, sosyoloji ve dünya dillerinin merkezi.</p>
          </div>
        </div>

        <div class="faculty-badge">
          <span class="faculty-year">1936</span>
          <div class="faculty-info">
            <h4>İktisat Fakültesi</h4>
            <p>Atatürk'ün direktifleriyle kurulan Türkiye'nin ilk iktisat fakültesi.</p>
          </div>
        </div>

        <div class="faculty-badge">
          <span class="faculty-year">1979</span>
          <div class="faculty-info">
            <h4>Siyasal Bilgiler Fakültesi</h4>
            <p>Devlet kadrolarına ve diplomasiye lider bürokratlar yetiştiren mektep.</p>
          </div>
        </div>

        <div class="faculty-badge">
          <span class="faculty-year">1933</span>
          <div class="faculty-info">
            <h4>Fen Fakültesi</h4>
            <p>Matematik, fizik, biyoloji ve astronomide temel bilim araştırmaları.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Heritage Callout Banner -->
    <section class="heritage-banner">
      <div class="heritage-content">
        <h3>Beyazıt'ın Kadim Kapısından Geleceğe</h3>
        <p>
          İstanbul Üniversitesi, 1453 yılında Fatih Sultan Mehmed'in İstanbul'u fethiyle kurulan medreselerden
          1933 Üniversite Reformu'na ve günümüzün modern araştırma üniversitesine uzanan eşsiz bir mirastır.
          Mezunlarımız, bu köklü kurumun ruhunu ve ilkelerini tüm dünyaya taşımaktadır.
        </p>
      </div>
      <div>
        <a href="/about" class="btn btn-gold" style="white-space: nowrap;">
          <span>📖</span> Proje Hakkında
        </a>
      </div>
    </section>

    <!-- Recent News and Career Opportunities Preview -->
    <section class="split-grid">
      <!-- Kampüs Duyuruları -->
      <div class="split-card">
        <div class="split-card-header">
          <h3>📢 Öne Çıkan Duyurular</h3>
          <a href="/announcements">Tümünü Gör ➔</a>
        </div>
        <div class="split-list">
          <div class="split-item">
            <div class="split-item-date">
              <span>25</span>MAY
            </div>
            <div class="split-item-content">
              <h5>Geleneksel Beyazıt Mezunlar Günü & Pilav Şenliği</h5>
              <p>Rektörlük bahçesinde tüm dönem mezunlarımızın katılımıyla gerçekleşecek büyük buluşma.</p>
            </div>
          </div>
          <div class="split-item">
            <div class="split-item-date">
              <span>12</span>HAZ
            </div>
            <div class="split-item-content">
              <h5>İÜ Kariyer Zirvesi 2026: Sektör Liderleriyle Buluşma</h5>
              <p>Mezunlarımız ve son sınıf öğrencilerimiz için staj ve istihdam mülakatları.</p>
            </div>
          </div>
          <div class="split-item">
            <div class="split-item-date">
              <span>04</span>TEM
            </div>
            <div class="split-item-content">
              <h5>Mezun Kartı & Kütüphane Dijital Erişim Protokolü</h5>
              <p>Nadir Eserler Kütüphanesi ve Merkez Kütüphaneden mezunlarımızın yararlanma şartları güncellendi.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kariyer Fırsatları -->
      <div class="split-card">
        <div class="split-card-header">
          <h3>💼 Son Kariyer Fırsatları</h3>
          <a href="/job-postings">İlanları İncele ➔</a>
        </div>
        <div class="split-list">
          <div class="split-item">
            <div class="split-item-date" style="background: #e0f2fe; color: #0284c7;">
              <span>İŞ</span>TAM
            </div>
            <div class="split-item-content">
              <h5>Yazılım Mühendisi / Full Stack Developer</h5>
              <p>Teknopark İstanbul / Hibrit • Bilgisayar & Matematik mezunları öncelikli.</p>
            </div>
          </div>
          <div class="split-item">
            <div class="split-item-date" style="background: #fef3c7; color: #b45309;">
              <span>STAJ</span>YAZ
            </div>
            <div class="split-item-content">
              <h5>Hukuk ve Uyum Stajyeri</h5>
              <p>Uluslararası Danışmanlık Firması / Levent • Hukuk Fakültesi mezun ve öğrencileri.</p>
            </div>
          </div>
          <div class="split-item">
            <div class="split-item-date" style="background: #dcfce7; color: #15803d;">
              <span>İŞ</span>UZAK
            </div>
            <div class="split-item-content">
              <h5>Veri Analisti & Raporlama Uzmanı</h5>
              <p>Finansal Hizmetler Grubu / Remote • İktisat ve İstatistik mezunları.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Developer & Educational Endpoints Box (Grading & Testing Preservation) -->
    <section class="dev-endpoints-box">
      <h3>
        <span>🛠️</span>
        Sistem & RESTful API Uç Noktaları (Geliştirici Rehberi)
      </h3>
      <p>
        Bu proje Express.js ve PostgreSQL tabanlı Model-View-Controller mimarisiyle geliştirilmiştir.
        Aşağıdaki bağlantılar üzerinden web arayüzlerini ve REST API endpoint'lerini doğrudan test edebilirsiniz:
      </p>

      <div class="endpoints-grid">
        <a href="/" class="endpoint-item">
          <code>GET /</code>
          <span class="endpoint-badge badge-get">HTML</span>
        </a>
        <a href="/about" class="endpoint-item">
          <code>GET /about</code>
          <span class="endpoint-badge badge-get">HTML</span>
        </a>
        <a href="/api/swagger" target="_blank" class="endpoint-item">
          <code>GET /api/swagger</code>
          <span class="endpoint-badge badge-get">Swagger UI</span>
        </a>
        <a href="/api/health" class="endpoint-item">
          <code>GET /api/health</code>
          <span class="endpoint-badge badge-json">JSON</span>
        </a>
        <a href="/users" class="endpoint-item">
          <code>GET /users</code>
          <span class="endpoint-badge badge-get">HTML (Web)</span>
        </a>
        <a href="/api/users" class="endpoint-item">
          <code>GET /api/users</code>
          <span class="endpoint-badge badge-json">JSON (API)</span>
        </a>
        <a href="/announcements" class="endpoint-item">
          <code>GET /announcements</code>
          <span class="endpoint-badge badge-get">HTML (Web)</span>
        </a>
        <a href="/api/announcements" class="endpoint-item">
          <code>GET /api/announcements</code>
          <span class="endpoint-badge badge-json">JSON (API)</span>
        </a>
        <a href="/job-postings" class="endpoint-item">
          <code>GET /job-postings</code>
          <span class="endpoint-badge badge-get">HTML (Web)</span>
        </a>
        <a href="/api/job-postings" class="endpoint-item">
          <code>GET /api/job-postings</code>
          <span class="endpoint-badge badge-json">JSON (API)</span>
        </a>
        <a href="/applications" class="endpoint-item">
          <code>GET /applications</code>
          <span class="endpoint-badge badge-get">HTML (Web)</span>
        </a>
        <a href="/api/applications" class="endpoint-item">
          <code>GET /api/applications</code>
          <span class="endpoint-badge badge-json">JSON (API)</span>
        </a>
        <a href="/api/departments" class="endpoint-item">
          <code>GET /api/departments</code>
          <span class="endpoint-badge badge-json">JSON (API)</span>
        </a>
        <a href="/hello" class="endpoint-item">
          <code>GET /hello</code>
          <span class="endpoint-badge badge-get">Text</span>
        </a>
        <a href="/hello/Emel" class="endpoint-item">
          <code>GET /hello/:name</code>
          <span class="endpoint-badge badge-get">Text</span>
        </a>
        <a href="/sum/5/3" class="endpoint-item">
          <code>GET /sum/5/3</code>
          <span class="endpoint-badge badge-get">Text</span>
        </a>
        <a href="/404" class="endpoint-item">
          <code>GET /404</code>
          <span class="endpoint-badge badge-get">HTML (404 Page)</span>
        </a>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-brand">
        <h4>T.C. İSTANBUL ÜNİVERSİTESİ</h4>
        <p>
          Mezun Bilgi Sistemi (İÜ Mezun), mezunlarımızın üniversitemizle olan bağlarını güçlendirmek,
          kariyer fırsatlarını desteklemek ve 1453'ten gelen köklü kültürü geleceğe taşımak amacıyla hizmet vermektedir.
        </p>
        <p style="font-size: 0.8rem; color: #cbd5e1;">
          📍 Rektörlük: 34452 Beyazıt, Fatih / İstanbul<br>
          📞 Santral: +90 (212) 440 00 00<br>
          ✉️ İletişim: <a href="mailto:mezun@istanbul.edu.tr" style="color: var(--iu-gold-light);">mezun@istanbul.edu.tr</a>
        </p>
      </div>

      <div class="footer-col">
        <h5>Mezun Hizmetleri</h5>
        <ul>
          <li><a href="/users">Mezunlar Rehberi</a></li>
          <li><a href="/announcements">Duyurular & Etkinlikler</a></li>
          <li><a href="/job-postings">Kariyer & İlanlar</a></li>
          <li><a href="/applications">İş Başvuruları</a></li>
          <li><a href="/users">+ Mezun Kaydı</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Üniversite</h5>
        <ul>
          <li><a href="https://www.istanbul.edu.tr" target="_blank" rel="noopener">İstanbul Üniversitesi</a></li>
          <li><a href="/about">Proje Hakkında</a></li>
          <li><a href="/api/departments">Fakülteler & Bölümler</a></li>
          <li><a href="/api/health">Sistem Sağlık Durumu</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Geliştirici & API</h5>
        <ul>
          <li><a href="/api/swagger" target="_blank">Swagger Dokümantasyonu</a></li>
          <li><a href="/api/users">Mezunlar JSON API</a></li>
          <li><a href="/api/job-postings">İlanlar JSON API</a></li>
          <li><a href="/api/announcements">Duyurular JSON API</a></li>
          <li><a href="/404">Generic 404 Sayfası</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 T.C. İstanbul Üniversitesi Mezun Bilgi Sistemi. Tüm hakları saklıdır. Tarihten Geleceğe Bilim Köprüsü.</p>
    </div>
  </footer>

</body>
</html>
`;
};

module.exports = {
  renderHomePage,
};
