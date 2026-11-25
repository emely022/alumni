/**
 * Home View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 * 
 * design.md tasarım sistemine uygun olarak oluşturulmuştur:
 * - Arka plan rengi: #214539 (Koyu Orman Yeşili)
 * - Vurgu renkleri: Sarı (#F5BA13 / #FFCC00) ve Beyaz (#FFFFFF)
 * - Yazılar: Sarı butonlar ve beyaz kartlar içinde yüksek kontrastlı siyah (#111827 / #374151)
 * - Tipografi: Arial, "Helvetica Neue", Helvetica, sans-serif (İtalik yok, harici font yok)
 * - Butonlar: 100px border-radius tam yuvarlak sarı hap butonlar
 * - Kartlar: 18px ve 32px border-radius beyaz ve koyu yeşil yüzeyler
 * - İstenen Bölümler: Header, Footer, Menu, Logo (/istanbul-universitesi-logo.png),
 *   Product Page (Ürünler & Mezun Hizmetleri), Alumni List (Mezunlar Listesi & Arama),
 *   Alumni Profile (Öne Çıkan Mezun Profilleri).
 */

const { renderHeaderMenu } = require('../components/headerMenu');
const { getCurrentUser } = require('../utils/sessionContext');
const { escapeHtml } = require('./layout');

const ROLE_SHORTCUTS = {
  admin: {
    label: 'Sistem Yöneticisi (Admin)',
    shortcuts: [
      { icon: '🛡️', title: 'Admin Panel', href: '/admin', primary: true },
      { icon: '📝', title: 'Tüm Başvurular', href: '/applications' },
      { icon: '👥', title: 'Kullanıcı & Rol Yönetimi', href: '/admin#admin-users' },
      { icon: '📢', title: 'Duyuru Yayınla', href: '/admin#admin-announcements' },
      { icon: '👤', title: 'Profilim', href: '/profile' },
      { icon: '⚙️', title: 'Ayarlar & Şifre', href: '/settings' },
    ],
  },
  alumni: {
    label: 'Mezun (Alumni)',
    shortcuts: [
      { icon: '📝', title: 'Başvurularım', href: '/applications', primary: true },
      { icon: '➕', title: 'İş / Staj İlanı Paylaş', href: '/job-postings#new-job-form' },
      { icon: '💼', title: 'Kariyer İlanları', href: '/job-postings' },
      { icon: '🎓', title: 'Mezunlar Dizini', href: '/users' },
      { icon: '👤', title: 'Profilim', href: '/profile' },
      { icon: '⚙️', title: 'Ayarlar & Şifre', href: '/settings' },
    ],
  },
  student: {
    label: 'Öğrenci (Student)',
    shortcuts: [
      { icon: '📝', title: 'Staj ve Başvurularım', href: '/applications', primary: true },
      { icon: '💼', title: 'Açık İş & Staj İlanları', href: '/job-postings' },
      { icon: '🎓', title: 'Mezun Mentörler', href: '/users' },
      { icon: '📢', title: 'Kampüs Duyuruları', href: '/announcements' },
      { icon: '👤', title: 'Profilim', href: '/profile' },
      { icon: '⚙️', title: 'Ayarlar & Şifre', href: '/settings' },
    ],
  },
  coordinator: {
    label: 'Bölüm Koordinatörü',
    shortcuts: [
      { icon: '📢', title: 'Yeni Duyuru Yayınla', href: '/announcements#new-announcement-form', primary: true },
      { icon: '🎓', title: 'Bölüm Mezunları', href: '/users' },
      { icon: '📰', title: 'Tüm Duyurular', href: '/announcements' },
      { icon: '💼', title: 'Kariyer İlanları', href: '/job-postings' },
      { icon: '👤', title: 'Profilim', href: '/profile' },
      { icon: '⚙️', title: 'Ayarlar & Şifre', href: '/settings' },
    ],
  },
  employer: {
    label: 'İşveren / İK Temsilcisi',
    shortcuts: [
      { icon: '➕', title: 'Yeni İlan Yayınla', href: '/job-postings#new-job-form', primary: true },
      { icon: '📝', title: 'Gelen Aday Başvuruları', href: '/applications' },
      { icon: '💼', title: 'İlanlarım & Kariyer', href: '/job-postings' },
      { icon: '🎓', title: 'Mezun Aday Havuzu', href: '/users' },
      { icon: '👤', title: 'Profilim', href: '/profile' },
      { icon: '⚙️', title: 'Ayarlar & Şifre', href: '/settings' },
    ],
  },
};

const buildPersonalizedHeroAndSummary = (activeUser, dashboard = {}) => {
  const roleKey = String(activeUser.role || 'alumni').toLowerCase();
  const roleConfig = ROLE_SHORTCUTS[roleKey] || ROLE_SHORTCUTS.alumni;
  const myAppliedJobs = Array.isArray(dashboard.myAppliedJobs) ? dashboard.myAppliedJobs : [];
  const myJobPostings = Array.isArray(dashboard.myJobPostings) ? dashboard.myJobPostings : [];
  const myAnnouncements = Array.isArray(dashboard.myAnnouncements) ? dashboard.myAnnouncements : [];

  const shortcutsHtml = roleConfig.shortcuts
    .map(
      (sc) => `
        <a href="${escapeHtml(sc.href)}" class="${sc.primary ? 'btn-primary' : 'btn-ghost-white'}" style="padding: 11px 22px; font-size: 14px;">
          <span>${sc.icon}</span>
          <span>${escapeHtml(sc.title)}</span>
        </a>
      `
    )
    .join('');

  const appliedListHtml =
    myAppliedJobs.length === 0
      ? `<p style="color: #6B7280; font-size: 14px; margin-bottom: 14px;">Henüz bir iş veya staj ilanına başvurunuz bulunmuyor.</p>`
      : `<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
          ${myAppliedJobs
            .slice(0, 4)
            .map(
              (item) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E5E7EB; gap: 8px;">
                  <div>
                    <div style="font-weight: 700; color: #111827; font-size: 14px;">${escapeHtml(item.title || 'İş İlanı')}</div>
                    <div style="font-size: 12px; color: #6B7280;">${escapeHtml(item.company || '')}</div>
                  </div>
                  <span style="font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px; background: #FEF3C7; color: #92400E;">
                    ${escapeHtml(item.applicationStatus || item.status || 'pending')}
                  </span>
                </div>
              `
            )
            .join('')}
        </div>`;

  const postedJobsHtml =
    myJobPostings.length === 0
      ? `<p style="color: #6B7280; font-size: 14px; margin-bottom: 14px;">Henüz paylaştığınız bir iş veya staj ilanı bulunmuyor.</p>`
      : `<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px;">
          ${myJobPostings
            .slice(0, 4)
            .map(
              (job) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #F9FAFB; border-radius: 10px; border: 1px solid #E5E7EB; gap: 8px;">
                  <div>
                    <div style="font-weight: 700; color: #111827; font-size: 14px;">${escapeHtml(job.title)}</div>
                    <div style="font-size: 12px; color: #6B7280;">${escapeHtml(job.company || '')} &bull; ${escapeHtml(job.location || '')}</div>
                  </div>
                  <span style="font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 100px; background: ${job.isActive !== false ? '#D1FAE5' : '#FEE2E2'}; color: ${job.isActive !== false ? '#065F46' : '#991B1B'};">
                    ${job.isActive !== false ? 'Yayında' : 'Kapalı'}
                  </span>
                </div>
              `
            )
            .join('')}
        </div>`;

  return `
  <!-- 3. KULLANICIYA ÖZEL KARŞILAMA VE HIZLI KISAYOLLAR (GİRİŞ YAPMIŞ KULLANICI) -->
  <section class="hero" style="padding: 48px 24px 36px;">
    <div class="hero-container">
      <div class="hero-pill-badge">
        <span>👋</span> Kişisel Mezun &amp; Kariyer Portalınız • Rol: ${escapeHtml(roleConfig.label)}
      </div>
      <h2 class="hero-title" style="font-size: 40px; margin-bottom: 14px;">
        Hoş Geldiniz, <span>${escapeHtml(activeUser.name)}</span>!
      </h2>
      <p class="hero-subtext" style="margin-bottom: 24px;">
        İstanbul Üniversitesi <strong>${escapeHtml(activeUser.department || 'Mezunlar Ağı')}</strong> (${escapeHtml(activeUser.graduationYear || 'İÜ')}) hesabınızla oturum açtınız. Rolünüze özel hızlı kısayollar ve kişisel veri özetiniz aşağıda yer almaktadır.
      </p>

      <!-- Rolüne Uygun Kısayollar -->
      <div class="hero-ctas" style="gap: 10px;">
        ${shortcutsHtml}
      </div>
    </div>
  </section>

  <!-- KULLANICININ KENDİ VERİLERİNDEN ÖZET PANELİ (BAŞVURULARIM, PAYLAŞTIĞIM İLANLAR, PROFİLİM) -->
  <section style="max-width: 1240px; margin: 0 auto 36px; padding: 0 24px;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 22px;">
      
      <!-- Kart 1: Başvurularım Özeti -->
      <div style="background: #FFFFFF; color: #111827; border-radius: 18px; padding: 26px; box-shadow: 0 10px 28px rgba(10, 26, 20, 0.28); border: 2px solid #F5BA13;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827;">📝 Başvurularım Özeti</h3>
          <span style="background: #214539; color: #F5BA13; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px;">
            Toplam: ${myAppliedJobs.length}
          </span>
        </div>
        ${appliedListHtml}
        <a href="/applications" class="btn-primary" style="padding: 9px 20px; font-size: 13px; width: 100%;">
          Tüm Başvurularımı Görüntüle →
        </a>
      </div>

      <!-- Kart 2: Paylaştığım İlanlar Özeti -->
      <div style="background: #FFFFFF; color: #111827; border-radius: 18px; padding: 26px; box-shadow: 0 10px 28px rgba(10, 26, 20, 0.28);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827;">💼 Paylaştığım İlanlar</h3>
          <span style="background: #FEF3C7; color: #92400E; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px;">
            Toplam: ${myJobPostings.length}
          </span>
        </div>
        ${postedJobsHtml}
        <a href="/job-postings#new-job-form" class="btn-primary" style="padding: 9px 20px; font-size: 13px; width: 100%;">
          + Yeni İş / Staj İlanı Paylaş
        </a>
      </div>

      <!-- Kart 3: Kişisel Profil & Hesap Özetim -->
      <div style="background: #FFFFFF; color: #111827; border-radius: 18px; padding: 26px; box-shadow: 0 10px 28px rgba(10, 26, 20, 0.28);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #111827;">👤 Hesap &amp; Profil Özetim</h3>
          <span style="background: #ECFDF5; color: #065F46; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 100px;">
            ${escapeHtml(roleKey.toUpperCase())}
          </span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #374151; margin-bottom: 16px;">
          <div><strong>Ad Soyad:</strong> ${escapeHtml(activeUser.name)}</div>
          <div><strong>E-Posta:</strong> ${escapeHtml(activeUser.email)}</div>
          <div><strong>Bölüm:</strong> ${escapeHtml(activeUser.department || 'Belirtilmedi')} (${escapeHtml(activeUser.graduationYear || '-')})</div>
          <div><strong>Telefon:</strong> ${escapeHtml(activeUser.phone || 'Belirtilmedi')}</div>
          <div><strong>Duyurularım:</strong> ${myAnnouncements.length} adet</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="/profile" class="btn-primary" style="padding: 9px 16px; font-size: 13px; flex: 1;">👤 Profilim</a>
          <a href="/settings" class="btn-primary" style="padding: 9px 16px; font-size: 13px; flex: 1; background: #E5E7EB; color: #111827; box-shadow: none;">⚙️ Ayarlar</a>
        </div>
      </div>

    </div>
  </section>
  `;
};

const renderHomePage = (stats = {}) => {
  const usersCount = stats.usersCount ?? 450000;
  const jobsCount = stats.jobPostingsCount ?? 120;
  const announcementsCount = stats.announcementsCount ?? 48;
  const departmentsCount = stats.departmentsCount ?? 17;
  const activeUser = stats.currentUser !== undefined ? stats.currentUser : getCurrentUser();
  const headerHtml = renderHeaderMenu({
    activeNav: 'home',
    currentUser: activeUser,
  });

  const guestHeroHtml = `
  <!-- 3. HERO SECTION -->
  <section class="hero">
    <div class="hero-container">
      <div class="hero-pill-badge">
        <span>🏛️</span> 1453'ten Günümüze • 570+ Yıllık Köklü Miras
      </div>
      <h2 class="hero-title">
        Tarihten Geleceğe Bilim Köprüsü: <span>İÜ Mezun Ailesi</span>
      </h2>
      <p class="hero-subtext">
        Türkiye'nin en köklü üniversitesinin yarım milyona yaklaşan mezun ailesi tek dijital çatı altında buluşuyor.
        Dönem arkadaşlarınızla iletişime geçin, kariyer fırsatlarını yakalayın ve İÜ dayanışmasını geleceğe taşıyın.
      </p>

      <div class="hero-ctas">
        <a href="#alumni-list" class="btn-primary">
          <span>🎓</span> Mezunları Keşfet
        </a>
        <a href="#product-page" class="btn-ghost-white">
          <span>📦</span> Ürün & Hizmetler
        </a>
        <a href="/job-postings" class="btn-ghost-white">
          <span>💼</span> Kariyer İlanları
        </a>
      </div>
    </div>
  </section>`;

  const heroSectionHtml =
    activeUser && activeUser.name
      ? buildPersonalizedHeroAndSummary(activeUser, stats.userDashboard || {})
      : guestHeroHtml;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İstanbul Üniversitesi | Mezun Bilgi Sistemi (İÜ Mezun)</title>
  <meta name="description" content="T.C. İstanbul Üniversitesi Mezun Bilgi Sistemi - 1453'ten geleceğe bilim köprüsü. Mezun ağı, kariyer ilanları, mezun profilleri ve kurumsal ürünler.">
  <style>
    /* ==========================================================================
       CSS Custom Properties (design.md Tasarım Sistemi)
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
      --radius-card: 18px;
      --radius-large-card: 32px;
      --radius-input: 12px;
      --radius-icon: 8px;

      --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.15);
      --shadow-card-hover: 0 16px 32px -4px rgba(10, 26, 20, 0.35), 0 6px 12px -2px rgba(0, 0, 0, 0.2);
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
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background-color: #ffffff;
      padding: 2px;
      border: 2px solid var(--color-action-yellow);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      object-fit: contain;
      flex-shrink: 0;
    }
    .brand-meta h1, .brand-name {
      font-size: 17px;
      font-weight: 700;
      color: var(--color-paper-white);
      letter-spacing: 0.3px;
      line-height: 1.2;
    }
    .brand-texts {
      display: flex;
      flex-direction: column;
    }
    .brand-meta p, .brand-sub {
      font-size: 11px;
      color: var(--color-action-yellow);
      font-weight: 700;
      letter-spacing: 1px;
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
      padding: 8px 14px;
      font-size: 14px;
      font-weight: 600;
      border-radius: var(--radius-full);
      color: var(--color-white-muted);
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
    .btn-header-cta, .nav-cta {
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
      font-size: 14px;
      font-weight: 700;
      padding: 9px 20px;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-button);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-header-cta:hover, .nav-cta:hover {
      background-color: var(--color-yellow-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-button-hover);
    }

    /* --------------------------------------------------------------------------
       Buton Stilleri (Pill Buttons)
       -------------------------------------------------------------------------- */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
      font-size: 15px;
      font-weight: 700;
      padding: 13px 30px;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-button);
      transition: all 0.25s ease;
      cursor: pointer;
      border: none;
      text-decoration: none;
    }
    .btn-primary:hover {
      background-color: var(--color-yellow-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-button-hover);
    }

    .btn-ghost-white {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: rgba(255, 255, 255, 0.08);
      color: var(--color-paper-white);
      font-size: 15px;
      font-weight: 600;
      padding: 13px 28px;
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.4);
      transition: all 0.25s ease;
      text-decoration: none;
    }
    .btn-ghost-white:hover {
      background-color: rgba(255, 255, 255, 0.18);
      border-color: var(--color-paper-white);
      transform: translateY(-2px);
    }

    .btn-card-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
      font-size: 13px;
      font-weight: 700;
      padding: 9px 20px;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-button);
      transition: all 0.2s ease;
    }
    .btn-card-action:hover {
      background-color: var(--color-yellow-hover);
      transform: translateY(-1px);
    }

    /* --------------------------------------------------------------------------
       Hero Section
       -------------------------------------------------------------------------- */
    .hero {
      padding: 70px 24px 85px;
      text-align: center;
      background-color: var(--color-canvas-green);
      position: relative;
      border-bottom: 1px solid var(--color-border-green);
    }
    .hero-container {
      max-width: 920px;
      margin: 0 auto;
    }
    .hero-pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: rgba(245, 186, 19, 0.15);
      border: 1px solid var(--color-action-yellow);
      color: var(--color-action-yellow);
      padding: 7px 18px;
      border-radius: var(--radius-full);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: 48px;
      font-weight: 700;
      line-height: 1.15;
      color: var(--color-paper-white);
      letter-spacing: -0.02em;
      margin-bottom: 22px;
    }
    .hero-title span {
      color: var(--color-action-yellow);
    }
    .hero-subtext {
      font-size: 18px;
      color: var(--color-white-muted);
      line-height: 1.6;
      max-width: 740px;
      margin: 0 auto 36px;
      font-weight: 400;
    }
    .hero-ctas {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    /* --------------------------------------------------------------------------
       Stats Bar
       -------------------------------------------------------------------------- */
    .stats-wrap {
      max-width: var(--page-max-width);
      margin: -40px auto 60px;
      padding: 0 24px;
      position: relative;
      z-index: 10;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background-color: var(--color-canvas-dark);
      border: 1px solid var(--color-border-green);
      border-radius: var(--radius-large-card);
      box-shadow: var(--shadow-card-hover);
      overflow: hidden;
    }
    .stat-box {
      padding: 26px 20px;
      text-align: center;
      border-right: 1px solid var(--color-border-green);
      transition: background-color 0.2s;
    }
    .stat-box:last-child {
      border-right: none;
    }
    .stat-box:hover {
      background-color: var(--color-surface-green);
    }
    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-action-yellow);
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .stat-caption {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-white-muted);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    /* --------------------------------------------------------------------------
       Genel Sayfa Düzeni (Layout)
       -------------------------------------------------------------------------- */
    .main-wrap {
      max-width: var(--page-max-width);
      margin: 0 auto;
      padding: 0 24px 80px;
    }

    .section-title-wrap {
      text-align: center;
      max-width: 760px;
      margin: 0 auto 45px;
    }
    .section-badge-tag {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      color: var(--color-action-yellow);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 10px;
    }
    .section-heading {
      font-size: 32px;
      font-weight: 700;
      color: var(--color-paper-white);
      margin-bottom: 12px;
      letter-spacing: -0.015em;
    }
    .section-desc {
      font-size: 16px;
      color: var(--color-white-muted);
      line-height: 1.5;
    }

    /* --------------------------------------------------------------------------
       Product Page Section (#product-page - Beyaz ve Yeşil Kartlar)
       -------------------------------------------------------------------------- */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 90px;
    }
    .product-card {
      background-color: var(--color-paper-white);
      border: 1px solid var(--color-border-white);
      border-radius: var(--radius-card);
      padding: 34px 28px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;
      color: var(--color-text-black);
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-card-hover);
      border-color: var(--color-action-yellow);
    }
    .product-icon-wrap {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background-color: #FEF3C7;
      margin-bottom: 20px;
      color: #92400E;
    }
    .product-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-text-black);
      margin-bottom: 10px;
    }
    .product-text {
      font-size: 14.5px;
      color: var(--color-text-charcoal);
      line-height: 1.55;
      margin-bottom: 22px;
      flex-grow: 1;
    }
    .product-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--color-border-white);
    }
    .pill-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 700;
      background-color: #F3F4F6;
      color: #1F2937;
    }
    .pill-chip-yellow {
      background-color: var(--color-action-yellow);
      color: var(--color-text-black);
    }

    /* --------------------------------------------------------------------------
       Alumni List Section (#alumni-list)
       -------------------------------------------------------------------------- */
    .alumni-list-section {
      background-color: var(--color-canvas-dark);
      border: 1px solid var(--color-border-green);
      border-radius: var(--radius-large-card);
      padding: 45px 36px;
      margin-bottom: 90px;
      box-shadow: var(--shadow-card);
    }
    .search-filter-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 12px;
      margin-bottom: 30px;
      background-color: rgba(255, 255, 255, 0.06);
      padding: 16px;
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border-green);
    }
    .filter-input, .filter-select {
      background-color: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--radius-input);
      color: var(--color-paper-white);
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      font-family: var(--font-family-base);
    }
    .filter-input::placeholder {
      color: var(--color-white-subtle);
    }
    .filter-input:focus, .filter-select:focus {
      border-color: var(--color-action-yellow);
      box-shadow: 0 0 0 3px rgba(245, 186, 19, 0.3);
    }
    .filter-select option {
      background-color: var(--color-canvas-dark);
      color: #ffffff;
    }

    .alumni-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background-color: var(--color-paper-white);
      border-radius: var(--radius-card);
      overflow: hidden;
      color: var(--color-text-black);
      box-shadow: var(--shadow-card);
    }
    .alumni-table th {
      background-color: #F3F4F6;
      color: var(--color-text-black);
      text-align: left;
      padding: 14px 18px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid var(--color-border-white);
    }
    .alumni-table td {
      padding: 15px 18px;
      font-size: 14.5px;
      border-bottom: 1px solid var(--color-border-white);
      color: var(--color-text-charcoal);
      vertical-align: middle;
    }
    .alumni-table tr:last-child td {
      border-bottom: none;
    }
    .alumni-table tr:hover td {
      background-color: #F9FAFB;
    }
    .alumni-name-cell {
      font-weight: 700;
      color: var(--color-text-black);
    }
    .alumni-name-cell span {
      display: block;
      font-size: 12px;
      color: var(--color-text-slate);
      font-weight: 400;
    }

    /* --------------------------------------------------------------------------
       Alumni Profiles Section (#alumni-profiles)
       -------------------------------------------------------------------------- */
    .profiles-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
      margin-bottom: 90px;
    }
    .profile-card {
      background-color: var(--color-paper-white);
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border-white);
      padding: 28px 22px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: var(--color-text-black);
      transition: all 0.25s ease;
    }
    .profile-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-card-hover);
      border-color: var(--color-action-yellow);
    }
    .profile-avatar-box {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-canvas-green) 0%, var(--color-surface-green) 100%);
      border: 3px solid var(--color-action-yellow);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .profile-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-text-black);
      margin-bottom: 4px;
    }
    .profile-title {
      font-size: 13px;
      font-weight: 600;
      color: #047857;
      margin-bottom: 8px;
    }
    .profile-dept {
      font-size: 12px;
      color: var(--color-text-slate);
      margin-bottom: 16px;
      line-height: 1.4;
    }
    .profile-bio {
      font-size: 13.5px;
      color: var(--color-text-charcoal);
      line-height: 1.5;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    /* --------------------------------------------------------------------------
       Developer & System Endpoints Bar
       -------------------------------------------------------------------------- */
    .dev-box {
      background-color: var(--color-surface-green);
      border: 1px solid var(--color-border-green);
      border-radius: var(--radius-large-card);
      padding: 34px 30px;
      margin-bottom: 80px;
      box-shadow: var(--shadow-card);
    }
    .dev-box h3 {
      font-size: 19px;
      color: var(--color-action-yellow);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dev-box p {
      font-size: 14.5px;
      color: var(--color-white-muted);
      margin-bottom: 22px;
    }
    .dev-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 12px;
    }
    .dev-link-card {
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--color-border-green);
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.15s ease;
    }
    .dev-link-card:hover {
      background-color: rgba(245, 186, 19, 0.15);
      border-color: var(--color-action-yellow);
    }
    .dev-link-card code {
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--color-action-yellow);
    }
    .dev-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    /* --------------------------------------------------------------------------
       Footer
       -------------------------------------------------------------------------- */
    .footer {
      background-color: var(--color-canvas-dark);
      border-top: 3px solid var(--color-action-yellow);
      color: var(--color-white-muted);
      font-size: 14px;
    }
    .footer-content {
      max-width: var(--page-max-width);
      margin: 0 auto;
      padding: 60px 24px 36px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.2fr;
      gap: 40px;
    }
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .footer-brand-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .footer-logo-img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #ffffff;
      padding: 2px;
      border: 1px solid var(--color-action-yellow);
    }
    .footer-brand h4 {
      font-size: 17px;
      color: var(--color-paper-white);
      font-weight: 700;
    }
    .footer-brand p {
      line-height: 1.6;
      font-size: 13.5px;
      color: var(--color-white-subtle);
    }
    .footer-col h5 {
      color: var(--color-action-yellow);
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 16px;
    }
    .footer-col ul {
      list-style: none;
    }
    .footer-col li {
      margin-bottom: 10px;
    }
    .footer-col a {
      color: var(--color-white-muted);
      transition: color 0.2s;
    }
    .footer-col a:hover {
      color: var(--color-action-yellow);
      text-decoration: underline;
    }
    .footer-bottom {
      border-top: 1px solid var(--color-border-green);
      padding: 20px 24px;
      text-align: center;
      font-size: 13px;
      color: var(--color-white-subtle);
      background-color: #0e241c;
    }

    /* --------------------------------------------------------------------------
       Duyarlılık (Responsive Media Queries)
       -------------------------------------------------------------------------- */
    @media (max-width: 1024px) {
      .products-grid { grid-template-columns: repeat(2, 1fr); }
      .profiles-grid { grid-template-columns: repeat(2, 1fr); }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .stat-box:nth-child(2) { border-right: none; }
      .stat-box:nth-child(1), .stat-box:nth-child(2) { border-bottom: 1px solid var(--color-border-green); }
      .footer-content { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .top-bar { display: none; }
      .hero-title { font-size: 34px; }
      .products-grid { grid-template-columns: 1fr; }
      .profiles-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr; }
      .stat-box { border-right: none; border-bottom: 1px solid var(--color-border-green); }
      .search-filter-bar { grid-template-columns: 1fr; }
      .footer-content { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
${headerHtml}
${heroSectionHtml}

  <!-- 4. KEY METRICS BAR -->
  <div class="stats-wrap">
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-value">1453</div>
        <div class="stat-caption">Kuruluş Yılı</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${usersCount > 400000 ? '450.000+' : usersCount.toLocaleString('tr-TR')}</div>
        <div class="stat-caption">Kayıtlı Mezun</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${departmentsCount > 10 ? departmentsCount : '17'}</div>
        <div class="stat-caption">Fakülte & Enstitü</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${jobsCount > 10 ? jobsCount + '+' : '120+'}</div>
        <div class="stat-caption">Kariyer & Staj İlanı</div>
      </div>
    </div>
  </div>

  <div class="main-wrap">

    <!-- 5. PRODUCT PAGE SECTION (ÜRÜNLER & HİZMETLER) -->
    <section id="product-page">
      <div class="section-title-wrap">
        <span class="section-badge-tag">Dijital Çözümler & Ekosistem</span>
        <h3 class="section-heading">Mezun Ürün ve Hizmetleri</h3>
        <p class="section-desc">
          İstanbul Üniversitesi mezunları, akademisyenleri ve öğrencileri için özel olarak tasarlanan
          kurumsal dijital ürünlerimizle kariyerinizi ve akademik bağlarınızı güçlendirin.
        </p>
      </div>

      <div class="products-grid">
        <!-- Ürün 1: Kariyer & İstihdam -->
        <article class="product-card">
          <div class="product-icon-wrap">💼</div>
          <h4 class="product-title">Kariyer & İstihdam Portalı</h4>
          <p class="product-text">
            Sektör öncüsü şirketler ve İÜ mezunu işverenler tarafından açılan tam zamanlı, yarı zamanlı ve staj fırsatlarına doğrudan başvuru imkanı.
          </p>
          <div class="product-meta-row">
            <span class="pill-chip pill-chip-yellow">Kariyer</span>
            <a href="/job-postings" class="btn-card-action">İlanları Gör ➔</a>
          </div>
        </article>

        <!-- Ürün 2: Dijital Mezun Kimlik Kartı -->
        <article class="product-card">
          <div class="product-icon-wrap">🪪</div>
          <h4 class="product-title">Dijital Mezun Kimlik Kartı</h4>
          <p class="product-text">
            Beyazıt Merkez Kütüphanesi, Nadir Eserler Kütüphanesi, spor tesisleri ve sosyal tesislere QR tabanlı tek tıkla dijital erişim kartı.
          </p>
          <div class="product-meta-row">
            <span class="pill-chip">Kampüs Kart</span>
            <a href="/about" class="btn-card-action">Kart Başvurusu ➔</a>
          </div>
        </article>

        <!-- Ürün 3: Mentörlük & Danışmanlık -->
        <article class="product-card">
          <div class="product-icon-wrap">🤝</div>
          <h4 class="product-title">İÜ Mentörlük Köprüsü</h4>
          <p class="product-text">
            Kıdemli mezunlar ile yeni mezunlar ve son sınıf öğrencilerini 1-e-1 kariyer mentörlüğü programında eşleştiren rehberlik ekosistemi.
          </p>
          <div class="product-meta-row">
            <span class="pill-chip pill-chip-yellow">Mentörlük</span>
            <a href="/users" class="btn-card-action">Mentör Bul ➔</a>
          </div>
        </article>

        <!-- Ürün 4: Teknokent & Girişimcilik -->
        <article class="product-card">
          <div class="product-icon-wrap">🚀</div>
          <h4 class="product-title">Girişim & Teknokent Ağı</h4>
          <p class="product-text">
            Teknopark İstanbul ve İÜ Girişimcilik Merkezi projelerine mezun melek yatırımcı, teknik ortak ve stratejik danışman desteği.
          </p>
          <div class="product-meta-row">
            <span class="pill-chip">Girişimcilik</span>
            <a href="/job-postings" class="btn-card-action">Projeleri Gör ➔</a>
          </div>
        </article>

        <!-- Ürün 5: Sürekli Eğitim & Akademi -->
        <article class="product-card">
          <div class="product-icon-wrap">📚</div>
          <h4 class="product-title">Sürekli Eğitim & Lisansüstü</h4>
          <p class="product-text">
            İÜ SEM ve Enstitüler tarafından açılan sertifika, yabancı dil ve tezsiz yüksek lisans programlarında mezunlarımıza özel indirimler.
          </p>
          <div class="product-meta-row">
            <span class="pill-chip">Eğitim</span>
            <a href="/announcements" class="btn-card-action">Programlar ➔</a>
          </div>
        </article>

        <!-- Ürün 6: Mezunlar Buluşması & Hub -->
        <article class="product-card">
          <div class="product-icon-wrap">🎉</div>
          <h4 class="product-title">Etkinlik & Buluşma Hub'ı</h4>
          <p class="product-text">
            Geleneksel Beyazıt Mezunlar Buluşması, Pilav Günü, fakülte panelleri ve bölgesel mezunlar lokali organizasyon takvimi.
          </p>
          <div class="product-meta-row">
            <span class="pill-chip pill-chip-yellow">Etkinlik</span>
            <a href="/announcements" class="btn-card-action">Takvimi İncele ➔</a>
          </div>
        </article>
      </div>
    </section>

    <!-- 6. ALUMNI LIST SECTION (MEZUNLAR LİSTESİ & ARAMA VİTRİNİ) -->
    <section id="alumni-list" class="alumni-list-section">
      <div class="section-title-wrap">
        <span class="section-badge-tag">Mezun Rehberi</span>
        <h3 class="section-heading">Mezunlar Listesi ve Arama</h3>
        <p class="section-desc">
          İstanbul Üniversitesi'nden mezun olan dönem arkadaşlarınızı fakülte, bölüm ve mezuniyet yılına göre bulun.
        </p>
      </div>

      <!-- Filtreleme & Arama Çubuğu Mockup -->
      <div class="search-filter-bar">
        <input type="text" class="filter-input" placeholder="İsim, unvan veya şirket ile ara (Örn: Zeynep, Mühendis)...">
        <select class="filter-select">
          <option value="">Tüm Fakülteler</option>
          <option value="ceng">Mühendislik Fakültesi</option>
          <option value="law">Hukuk Fakültesi</option>
          <option value="med">İstanbul Tıp Fakültesi</option>
          <option value="econ">İktisat Fakültesi</option>
          <option value="let">Edebiyat Fakültesi</option>
        </select>
        <select class="filter-select">
          <option value="">Tüm Yıllar</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2020">2020</option>
          <option value="2015">2015</option>
          <option value="2010">2010</option>
        </select>
        <a href="/users" class="btn-primary" style="padding: 10px 22px; font-size: 13.5px;">
          Filtrele 🔍
        </a>
      </div>

      <!-- Mezunlar Tablosu -->
      <table class="alumni-table">
        <thead>
          <tr>
            <th>Mezun Adı & Soyadı</th>
            <th>Fakülte & Bölüm</th>
            <th>Mezuniyet Yılı</th>
            <th>Mevcut Pozisyon / Şirket</th>
            <th>Şehir</th>
            <th style="text-align: right;">Profil</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="alumni-name-cell">
              Prof. Dr. Aziz Sancar
              <span>Nobel Kimya Ödülü Sahibi</span>
            </td>
            <td>İstanbul Tıp Fakültesi</td>
            <td><span class="pill-chip">1969</span></td>
            <td>Kıdemli Araştırmacı • UNC Chapel Hill</td>
            <td>Kuzey Karolina / ABD</td>
            <td style="text-align: right;">
              <a href="#alumni-profiles" class="btn-card-action">İncele</a>
            </td>
          </tr>
          <tr>
            <td class="alumni-name-cell">
              Zeynep Kaya
              <span>Bulut Mimarisi Lideri</span>
            </td>
            <td>Bilgisayar Mühendisliği</td>
            <td><span class="pill-chip">2018</span></td>
            <td>Lead Cloud Architect • Global Tech</td>
            <td>İstanbul / Hibrit</td>
            <td style="text-align: right;">
              <a href="#alumni-profiles" class="btn-card-action">İncele</a>
            </td>
          </tr>
          <tr>
            <td class="alumni-name-cell">
              Av. Burak Yılmaz
              <span>Uluslararası Tahkim Avukatı</span>
            </td>
            <td>Hukuk Fakültesi</td>
            <td><span class="pill-chip">2012</span></td>
            <td>Yönetici Ortak • Yılmaz Hukuk Bürosu</td>
            <td>İstanbul</td>
            <td style="text-align: right;">
              <a href="#alumni-profiles" class="btn-card-action">İncele</a>
            </td>
          </tr>
          <tr>
            <td class="alumni-name-cell">
              Dr. Mehmet Özkan
              <span>Finansal Teknolojiler Danışmanı</span>
            </td>
            <td>İktisat Fakültesi</td>
            <td><span class="pill-chip">2015</span></td>
            <td>FinTech Co-Founder • PayPulse</td>
            <td>Londra / İngiltere</td>
            <td style="text-align: right;">
              <a href="#alumni-profiles" class="btn-card-action">İncele</a>
            </td>
          </tr>
          <tr>
            <td class="alumni-name-cell">
              Selin Demir
              <span>Kıdemli Yapay Zeka Mühendisi</span>
            </td>
            <td>Bilgisayar Mühendisliği</td>
            <td><span class="pill-chip">2021</span></td>
            <td>AI Research Engineer • DeepMind Partner</td>
            <td>İstanbul / Remote</td>
            <td style="text-align: right;">
              <a href="/users" class="btn-card-action">İncele</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; margin-top: 26px;">
        <a href="/users" class="btn-ghost-white">
          <span>📋</span> Veritabanındaki Tüm Mezunları Listele (/users) ➔
        </a>
      </div>
    </section>

    <!-- 7. ALUMNI PROFILES SECTION (ÖNE ÇIKAN MEZUN PROFİLLERİ) -->
    <section id="alumni-profiles">
      <div class="section-title-wrap">
        <span class="section-badge-tag">Başarı Hikayeleri</span>
        <h3 class="section-heading">Öne Çıkan Mezun Profilleri</h3>
        <p class="section-desc">
          İstanbul Üniversitesi mezunları; bilimden sanata, hukuktan teknolojiye küresel ölçekte değer üretmeye devam ediyor.
        </p>
      </div>

      <div class="profiles-grid">
        <!-- Profil 1 -->
        <article class="profile-card">
          <div class="profile-avatar-box">AS</div>
          <h4 class="profile-name">Prof. Dr. Aziz Sancar</h4>
          <p class="profile-title">Nobel Kimya Ödülü Sahibi</p>
          <p class="profile-dept">İstanbul Tıp Fakültesi • 1969</p>
          <p class="profile-bio">
            DNA onarımı ve biyolojik saat alanındaki çığır açan çalışmalarıyla 2015 Nobel Kimya Ödülü'nü kazanan tıp mezunumuz.
          </p>
          <a href="/users" class="btn-card-action">Profili Görüntüle ➔</a>
        </article>

        <!-- Profil 2 -->
        <article class="profile-card">
          <div class="profile-avatar-box">ZK</div>
          <h4 class="profile-name">Zeynep Kaya</h4>
          <p class="profile-title">Kıdemli Bulut Mimarı</p>
          <p class="profile-dept">Bilgisayar Mühendisliği • 2018</p>
          <p class="profile-bio">
            Büyük veri ve dağıtık sistemler altyapılarında küresel şirketlerde sistem tasarımı ve DevOps mimarisi yönetmektedir.
          </p>
          <a href="/users" class="btn-card-action">Profili Görüntüle ➔</a>
        </article>

        <!-- Profil 3 -->
        <article class="profile-card">
          <div class="profile-avatar-box">BY</div>
          <h4 class="profile-name">Av. Burak Yılmaz</h4>
          <p class="profile-title">Uluslararası Tahkim Avukatı</p>
          <p class="profile-dept">Hukuk Fakültesi • 2012</p>
          <p class="profile-bio">
            Uluslararası ticaret hukuku, sınır ötesi birleşme ve devralmalar ile tahkim kurullarında mezunlarımızı temsil etmektedir.
          </p>
          <a href="/users" class="btn-card-action">Profili Görüntüle ➔</a>
        </article>

        <!-- Profil 4 -->
        <article class="profile-card">
          <div class="profile-avatar-box">MÖ</div>
          <h4 class="profile-name">Dr. Mehmet Özkan</h4>
          <p class="profile-title">FinTech Kurucu Ortak</p>
          <p class="profile-dept">İktisat Fakültesi • 2015</p>
          <p class="profile-bio">
            Açık bankacılık ve mikro-ödeme teknolojileri üzerine kurduğu girişimle Avrupa ve Ortadoğu pazarında inovasyona liderlik etmektedir.
          </p>
          <a href="/users" class="btn-card-action">Profili Görüntüle ➔</a>
        </article>
      </div>
    </section>

    <!-- 8. DEVELOPER & SYSTEM API ENDPOINTS BAR -->
    <section class="dev-box">
      <h3>
        <span>🛠️</span>
        Sistem & RESTful API Uç Noktaları (Geliştirici Rehberi)
      </h3>
      <p>
        Bu proje Express.js ve PostgreSQL tabanlı Model-View-Controller mimarisiyle geliştirilmiştir.
        Aşağıdaki bağlantılar üzerinden web arayüzlerini ve REST API endpoint'lerini doğrudan test edebilirsiniz:
      </p>

      <div class="dev-grid">
        <a href="/" class="dev-link-card">
          <code>GET /</code>
          <span class="dev-badge">Ana Sayfa</span>
        </a>
        <a href="/about" class="dev-link-card">
          <code>GET /about</code>
          <span class="dev-badge">Hakkında</span>
        </a>
        <a href="/api/swagger" target="_blank" class="dev-link-card">
          <code>GET /api/swagger</code>
          <span class="dev-badge" style="background-color: var(--color-action-yellow); color: #000;">Swagger UI</span>
        </a>
        <a href="/api/health" class="dev-link-card">
          <code>GET /api/health</code>
          <span class="dev-badge">Sağlık (JSON)</span>
        </a>
        <a href="/users" class="dev-link-card">
          <code>GET /users</code>
          <span class="dev-badge">Mezunlar (Web)</span>
        </a>
        <a href="/api/users" class="dev-link-card">
          <code>GET /api/users</code>
          <span class="dev-badge">Mezunlar (API)</span>
        </a>
        <a href="/announcements" class="dev-link-card">
          <code>GET /announcements</code>
          <span class="dev-badge">Duyurular (Web)</span>
        </a>
        <a href="/api/announcements" class="dev-link-card">
          <code>GET /api/announcements</code>
          <span class="dev-badge">Duyurular (API)</span>
        </a>
        <a href="/job-postings" class="dev-link-card">
          <code>GET /job-postings</code>
          <span class="dev-badge">İlanlar (Web)</span>
        </a>
        <a href="/api/job-postings" class="dev-link-card">
          <code>GET /api/job-postings</code>
          <span class="dev-badge">İlanlar (API)</span>
        </a>
        <a href="/applications" class="dev-link-card">
          <code>GET /applications</code>
          <span class="dev-badge">Başvurular (Web)</span>
        </a>
        <a href="/api/applications" class="dev-link-card">
          <code>GET /api/applications</code>
          <span class="dev-badge">Başvurular (API)</span>
        </a>
        <a href="/api/departments" class="dev-link-card">
          <code>GET /api/departments</code>
          <span class="dev-badge">Bölümler (API)</span>
        </a>
        <a href="/404" class="dev-link-card">
          <code>GET /404</code>
          <span class="dev-badge">Generic 404</span>
        </a>
      </div>
    </section>

  </div>

  <!-- 9. FOOTER -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="footer-brand-header">
          <img src="/istanbul-universitesi-logo.png" alt="İstanbul Üniversitesi Logo" class="footer-logo-img" onerror="this.style.display='none'">
          <h4>T.C. İSTANBUL ÜNİVERSİTESİ</h4>
        </div>
        <p>
          Mezun Bilgi Sistemi (İÜ Mezun), 1453'ten bugüne uzanan akademik birikimi ve köklü mezun ağını
          modern dijital çağın imkanlarıyla geleceğe taşımak amacıyla geliştirilmiştir.
        </p>
        <p style="font-size: 13px; color: var(--color-white-muted);">
          📍 <strong>Rektörlük:</strong> 34452 Beyazıt, Fatih / İstanbul<br>
          📞 <strong>Santral:</strong> +90 (212) 440 00 00<br>
          ✉️ <strong>E-Posta:</strong> <a href="mailto:mezun@istanbul.edu.tr" style="color: var(--color-action-yellow);">mezun@istanbul.edu.tr</a>
        </p>
      </div>

      <div class="footer-col">
        <h5>Menü & Navigasyon</h5>
        <ul>
          <li><a href="/">Ana Sayfa</a></li>
          <li><a href="#alumni-list">Mezunlar Listesi</a></li>
          <li><a href="#alumni-profiles">Mezun Profilleri</a></li>
          <li><a href="#product-page">Ürünler & Hizmetler</a></li>
          <li><a href="/register">+ Mezun Kaydı</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Kariyer & Kampüs</h5>
        <ul>
          <li><a href="/job-postings">İş ve Staj İlanları</a></li>
          <li><a href="/applications">İş Başvuru Takibi</a></li>
          <li><a href="/announcements">Duyurular & Etkinlikler</a></li>
          <li><a href="/about">Proje Hakkında</a></li>
          <li><a href="/api/health">Sistem Sağlık Durumu</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h5>Geliştirici & Dokümantasyon</h5>
        <ul>
          <li><a href="/api/swagger" target="_blank">Swagger OpenAPI UI</a></li>
          <li><a href="/api/users">Mezunlar JSON API</a></li>
          <li><a href="/api/job-postings">İş İlanları JSON API</a></li>
          <li><a href="/api/announcements">Duyurular JSON API</a></li>
          <li><a href="/404">Generic 404 Sayfası</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 T.C. İstanbul Üniversitesi Mezun Bilgi Sistemi. Tüm hakları saklıdır. Tarihten Geleceğe Bilim Köprüsü • 1453</p>
    </div>
  </footer>

</body>
</html>
`;
};

module.exports = {
  renderHomePage,
};
