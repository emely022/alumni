/**
 * Auth Guardian Middleware
 *
 * Oturum açmamış (req.session.user bulunmayan) kullanıcıların korunan
 * web sayfalarına ve REST API uç noktalarına erişimini engeller.
 * - Tüm yetkisiz erişim denemelerini terminale ve backend/logs/error.logs dosyasına yazar.
 * - API isteklerinde (/api/* veya JSON bekleyen isteklerde) 401 Unauthorized JSON yanıtı döner.
 * - Web / tarayıcı isteklerinde kullanıcıyı /login sayfasına yönlendirir.
 */

const { logMiddlewareError } = require('../utils/errorLogger');

const isApiOrJsonRequest = (req, routePath) => {
  if (routePath.startsWith('/api/') || routePath === '/api') {
    return true;
  }
  if (req.baseUrl && (req.baseUrl.startsWith('/api/') || req.baseUrl === '/api')) {
    return true;
  }
  if (req.path && (req.path.startsWith('/api/') || req.path === '/api')) {
    return true;
  }
  if (req.is && req.is('json')) {
    return true;
  }
  const acceptHeader = (req.headers && req.headers.accept) || '';
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    return true;
  }
  return false;
};

const authMiddleware = (req, res, next) => {
  if (req && req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  const routePath = (req && (req.originalUrl || req.url || req.path)) || '/';
  const method = (req && req.method) || 'GET';
  const isApi = isApiOrJsonRequest(req || {}, routePath);
  const reason = `Yetkisiz erişim denemesi: '${method} ${routePath}' kaynağına oturum açmadan erişilmeye çalışıldı.`;

  logMiddlewareError({
    errorType: '401',
    method,
    route: routePath,
    statusCode: 401,
    reason,
  });

  if (isApi) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Bu kaynağa erişmek için giriş yapmalısınız.',
      statusCode: 401,
      reason,
      method,
      path: routePath,
      timestamp: new Date().toISOString(),
    });
  }

  return res.redirect('/login');
};

/**
 * Admin Role Guardian Middleware
 *
 * Yalnızca oturum açmış ve rolü 'admin' olan kullanıcıların
 * yönetici paneli (/admin) ve yönetici işlemlerine erişmesine izin verir.
 * Yetkisiz (401 veya 403) tüm denemeleri logs/error.logs dosyasına yazar.
 */
const requireAdmin = (req, res, next) => {
  if (!req || !req.session || !req.session.user) {
    return authMiddleware(req, res, next);
  }

  req.user = req.session.user;

  if (req.user.role === 'admin') {
    return next();
  }

  const routePath = (req && (req.originalUrl || req.url || req.path)) || '/admin';
  const method = (req && req.method) || 'GET';
  const isApi = isApiOrJsonRequest(req || {}, routePath);
  const userEmail = req.user.email || 'bilinmeyen';
  const userRole = req.user.role || 'alumni';
  const reason = `Yetkisiz yönetici (admin) erişim denemesi: '${userEmail}' (rol: '${userRole}') kullanıcısı '${method} ${routePath}' yönetici kaynağına erişmeye çalıştı.`;

  logMiddlewareError({
    errorType: '403',
    method,
    route: routePath,
    statusCode: 403,
    reason,
  });

  if (isApi) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Bu kaynağa erişmek için yönetici (admin) yetkisine sahip olmalısınız.',
      statusCode: 403,
      reason,
      method,
      path: routePath,
      timestamp: new Date().toISOString(),
    });
  }

  const { renderLayout, escapeHtml } = require('../views/layout');
  const forbiddenHtml = renderLayout({
    title: '403 Yetkisiz Erişim | Yönetim Paneli',
    activeNav: 'admin',
    pageTitle: '🛡️ Yönetici (Admin) Yetkisi Gerekli',
    pageSubtitle: 'Bu sayfaya erişebilmek ve sistem verilerini yönetebilmek için hesabınızın "admin" rolüne sahip olması gerekmektedir.',
    currentUser: req.user,
    content: `
      <div class="card" style="padding: 36px 32px; max-width: 720px; margin: 0 auto; border: 2px solid #F5BA13;">
        <div class="alert alert-error" style="margin-bottom: 20px;">
          <span>🚫</span>
          <div>
            <strong>Erişim Engellendi (403 Forbidden):</strong> Aktif oturumunuz (<strong>${escapeHtml(req.user.name)}</strong> - <code>${escapeHtml(userEmail)}</code>) şu anda <strong>${escapeHtml(userRole)}</strong> rolündedir.
          </div>
        </div>
        <h3 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 10px;">
          Hesabınıza Yönetici (Admin) Rolü Atayın
        </h3>
        <p style="font-size: 15px; color: #4B5563; margin-bottom: 24px; line-height: 1.6;">
          Yönetim paneline erişmek ve tüm sistem verilerini (kullanıcılar, roller, bölümler, duyurular, iş ilanları ve başvurular) yönetmek için aşağıdaki butonla aktif hesabınıza <strong>admin</strong> rolü atayabilirsiniz.
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <form method="POST" action="/admin/assign-self" style="display: inline; margin: 0;">
            <button type="submit" class="btn btn-primary" style="font-size: 15px; padding: 12px 28px;">
              🛡️ Hesabıma Admin Rolü Ata ve Panele Gir
            </button>
          </form>
          <a href="/" class="btn btn-secondary">Ana Sayfaya Dön</a>
        </div>
      </div>
    `,
  });

  return res.status(403).send(forbiddenHtml);
};

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.requireAuth = authMiddleware;
module.exports.requireAdmin = requireAdmin;
module.exports.adminMiddleware = requireAdmin;
