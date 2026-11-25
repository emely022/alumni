/**
 * Shared Dynamic Header Navigation Component (backend/src/components/headerMenu.js)
 *
 * Tüm sayfalarda (Ana Sayfa, Mezunlar, Duyurular, İş İlanları, Başvurular,
 * Giriş, Kayıt, Hakkında, 404 ve Admin Panel) kullanılan tekil (single-source)
 * dinamik navigasyon ve header bileşenidir.
 *
 * design.md kurallarına (%100) uyumlu:
 * - Header Zemini: #17342A (rgba(23, 52, 42, 0.96)), alt sınır: 2px solid #F5BA13
 * - Birincil Aksiyon (CTA / Çıkış / Kayıt): #F5BA13 sarı hap (pill, 100px radius) buton, #111827 koyu metin
 * - Menü Öğeleri: Beyaz/krem metin, aktif öğede sarı vurgu (#F5BA13)
 * - Tipografi: Arial, "Helvetica Neue", Helvetica, sans-serif (İtalik kesinlikle kullanılmaz)
 */

const { getCurrentUser } = require('../utils/sessionContext');

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
 * Rollere Özel Ek Menü Öğeleri Matrisi (RBAC Extra Navigation Items)
 *
 * Ortak öğeler (Giriş yapmış her rol için):
 *   - Ana Sayfa (/)
 *   - Mezunlar (/users)
 *   - Duyurular (/announcements)
 *   - İş İlanları (/job-postings)
 *   - Çıkış (POST /logout)
 *
 * Rollere göre eklenen özel menü öğeleri:
 *   - admin:       Başvurular (/applications), Admin Panel (/admin)
 *   - alumni:      Başvurularım (/applications), İlan Paylaş (/job-postings#new-job-form)
 *   - student:     Staj & Başvurularım (/applications)
 *   - coordinator: Duyuru Yayınla (/announcements#new-announcement-form)
 *   - employer:    İlan Yayınla (/job-postings#new-job-form), Aday Başvuruları (/applications)
 */
const ROLE_EXTRA_MENU_ITEMS = {
  admin: [
    { key: 'applications', label: 'Başvurular', href: '/applications' },
    { key: 'admin', label: '🛡️ Admin Panel', href: '/admin' },
  ],
  alumni: [
    { key: 'applications', label: 'Başvurularım', href: '/applications' },
    { key: 'share-job', label: '➕ İlan Paylaş', href: '/job-postings#new-job-form' },
  ],
  student: [
    { key: 'applications', label: 'Staj ve Başvurularım', href: '/applications' },
  ],
  coordinator: [
    { key: 'publish-announcement', label: '📢 Duyuru Yayınla', href: '/announcements#new-announcement-form' },
  ],
  employer: [
    { key: 'publish-job', label: '➕ İlan Yayınla', href: '/job-postings#new-job-form' },
    { key: 'applications', label: 'Aday Başvuruları', href: '/applications' },
  ],
};

const ROLE_BADGE_LABELS = {
  admin: 'Admin',
  alumni: 'Mezun',
  student: 'Öğrenci',
  coordinator: 'Koordinatör',
  employer: 'İşveren',
};

/**
 * Giriş durumuna ve kullanıcı rolüne göre menü modelini üretir.
 * @param {Object|null} user - Oturumdaki kullanıcı ({ id, name, email, role }) veya null
 * @returns {{ isAuthenticated: boolean, role: string|null, navItems: Array, authActions: Array, user: Object|null }}
 */
const buildMenuModel = (user = null) => {
  const isAuthenticated = Boolean(user && (user.id || user.email || user.name));

  // 1. Giriş yapmamış (Misafir) kullanıcı: Yalnızca Ana Sayfa, Giriş ve Kayıt
  if (!isAuthenticated) {
    return {
      isAuthenticated: false,
      role: null,
      user: null,
      navItems: [
        { key: 'home', label: 'Ana Sayfa', href: '/' },
      ],
      authActions: [
        { key: 'login', label: 'Giriş', href: '/login', variant: 'link' },
        { key: 'register', label: 'Kayıt', href: '/register', variant: 'cta' },
      ],
    };
  }

  // 2. Giriş yapmış her rol için ortak menü öğeleri
  const normalizedRole = String(user.role || 'alumni').toLowerCase();
  const baseNavItems = [
    { key: 'home', label: 'Ana Sayfa', href: '/' },
    { key: 'users', label: 'Mezunlar', href: '/users' },
    { key: 'announcements', label: 'Duyurular', href: '/announcements' },
    { key: 'jobs', label: 'İş İlanları', href: '/job-postings' },
  ];

  // 3. Role özel ek menü öğeleri
  const extraItems = ROLE_EXTRA_MENU_ITEMS[normalizedRole] || ROLE_EXTRA_MENU_ITEMS.alumni;

  // 4. Giriş yapmış her rol için kişisel Profil ve Ayarlar bağlantıları
  const accountNavItems = [
    { key: 'profile', label: 'Profil', href: '/profile' },
    { key: 'settings', label: 'Ayarlar', href: '/settings' },
  ];

  return {
    isAuthenticated: true,
    role: normalizedRole,
    user,
    navItems: [...baseNavItems, ...extraItems, ...accountNavItems],
    authActions: [
      { key: 'logout', label: 'Çıkış', action: '/logout', method: 'POST', variant: 'logout' },
    ],
  };
};

/**
 * Kurumsal Üst Bar + Dinamik Header Menüsünü HTML olarak üretir.
 * @param {Object} [options]
 * @param {string} [options.activeNav] - Aktif sayfa anahtarı ('home' | 'users' | 'announcements' | 'jobs' | 'applications' | 'admin' | 'login' | 'register')
 * @param {Object|null} [options.currentUser] - Oturumdaki kullanıcı (verilmezse AsyncLocalStorage üzerinden otomatik okunur)
 * @param {boolean} [options.includeTopBar=true] - Üst kurumsal bilgi bandını dahil et
 * @returns {string} Header HTML çıktısı
 */
const renderHeaderMenu = ({
  activeNav = '',
  currentUser,
  includeTopBar = true,
} = {}) => {
  const activeUser = currentUser !== undefined ? currentUser : getCurrentUser();
  const menuModel = buildMenuModel(activeUser);

  const navItemsHtml = menuModel.navItems
    .map((item) => {
      const isActive = activeNav === item.key ? 'active' : '';
      return `<a href="${escapeHtml(item.href)}" class="nav-item ${isActive}">${escapeHtml(item.label)}</a>`;
    })
    .join('\n        ');

  let authSectionHtml = '';
  if (!menuModel.isAuthenticated) {
    authSectionHtml = `
      <div class="header-auth" style="display: flex; align-items: center; gap: 10px;">
        <a href="/login" class="nav-item ${activeNav === 'login' ? 'active' : ''}" style="border: 1px solid rgba(255, 255, 255, 0.35);">
          Giriş
        </a>
        <a href="/register" class="nav-cta ${activeNav === 'register' ? 'active' : ''}">
          <span>+</span>
          <span>Kayıt</span>
        </a>
      </div>
    `;
  } else {
    const roleLabel = ROLE_BADGE_LABELS[menuModel.role] || menuModel.role;
    authSectionHtml = `
      <div class="header-auth" style="display: flex; align-items: center; gap: 10px;">
        <span class="header-user-name" style="font-size: 13px; font-weight: 700; color: #FFFFFF; background: rgba(255, 255, 255, 0.12); padding: 7px 14px; border-radius: 100px; border: 1px solid rgba(245, 186, 19, 0.45); display: inline-flex; align-items: center; gap: 6px;">
          <span>👤 ${escapeHtml(activeUser.name)}</span>
          <span style="background: #F5BA13; color: #111827; font-size: 11px; padding: 2px 8px; border-radius: 100px; font-weight: 700;">${escapeHtml(roleLabel)}</span>
        </span>
        <form method="POST" action="/logout" style="display: inline; margin: 0;">
          <button type="submit" class="nav-cta" style="border: none; cursor: pointer; font-family: inherit;">
            <span>Çıkış</span>
          </button>
        </form>
      </div>
    `;
  }

  const topBarHtml = includeTopBar
    ? `
  <!-- 1. Institutional Top Bar -->
  <div class="top-bar">
    <div class="top-bar-title">
      <span>🏛️</span>
      <span>T.C. İSTANBUL ÜNİVERSİTESİ &bull; <strong>1453'TEN GELECEĞE BİLİM KÖPRÜSÜ</strong></span>
    </div>
    <div class="top-bar-links">
      <a href="/api/swagger" target="_blank">Swagger API</a>
      <a href="https://www.istanbul.edu.tr" target="_blank" rel="noopener">istanbul.edu.tr</a>
      <a href="/about">Hakkında</a>
    </div>
  </div>`
    : '';

  return `${topBarHtml}

  <!-- 2. Sticky Header & Dynamic Role-Based Navigation Menu -->
  <header class="header">
    <div class="header-inner">
      <a href="/" class="brand-link">
        <img src="/istanbul-universitesi-logo.png" alt="İstanbul Üniversitesi Logosu" class="brand-logo-img" onerror="this.style.display='none'">
        <div class="brand-texts">
          <span class="brand-name">İSTANBUL ÜNİVERSİTESİ</span>
          <span class="brand-sub">Mezun Bilgi Sistemi</span>
        </div>
      </a>

      <nav class="nav-menu" aria-label="Ana Navigasyon">
        ${navItemsHtml}
      </nav>

      ${authSectionHtml}
    </div>
  </header>`;
};

module.exports = {
  ROLE_EXTRA_MENU_ITEMS,
  ROLE_BADGE_LABELS,
  buildMenuModel,
  renderHeaderMenu,
};
