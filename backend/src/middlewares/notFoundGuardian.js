/**
 * 404 Guardian Middleware
 *
 * Tanımlı olmayan bir route veya eşleşmeyen (route + HTTP metodu) isteği geldiğinde
 * 404 durum koduyla birlikte nedenini (reason) içeren standart bir hata cevabı döner
 * ve hatayı terminale + logs/error.logs dosyasına kaydeder.
 */

const { logMiddlewareError } = require('../utils/errorLogger');

const collectSupportedMethods = (stack, path, methods = new Set()) => {
  if (!Array.isArray(stack)) return methods;

  for (const layer of stack) {
    if (layer.route && layer.regexp && layer.regexp.test(path)) {
      Object.keys(layer.route.methods || {}).forEach((method) => {
        if (method !== '_all' && layer.route.methods[method]) {
          methods.add(method.toUpperCase());
        }
      });
    } else if (
      layer.name === 'router' &&
      layer.handle &&
      Array.isArray(layer.handle.stack) &&
      layer.regexp
    ) {
      const match = layer.regexp.exec(path);
      if (match) {
        let subPath = path.slice(match[0].length) || '/';
        if (!subPath.startsWith('/')) subPath = `/${subPath}`;
        collectSupportedMethods(layer.handle.stack, subPath, methods);
      }
    }
  }

  return methods;
};

const buildNotFoundReason = (req, routePath) => {
  let supportedMethods = [];
  const cleanPath = req.path || routePath.split('?')[0] || '/';

  try {
    const stack = req.app && req.app._router && req.app._router.stack;
    if (stack) {
      supportedMethods = [...collectSupportedMethods(stack, cleanPath)];
    }
  } catch (_) {
    supportedMethods = [];
  }

  if (supportedMethods.length > 0) {
    return `'${cleanPath}' yolu için '${req.method}' metodu tanımlı değil. Desteklenen HTTP metodları: ${supportedMethods.join(', ')}.`;
  }

  return `Tanımlı olmayan route: '${req.method} ${routePath}' ile eşleşen bir endpoint sistemde bulunamadı.`;
};

const { notFoundView } = require('../views');

const notFoundGuardian = (req, res) => {
  const routePath = req.originalUrl || req.url || '/';
  const cleanPath = routePath.split('?')[0].replace(/\/+$/, '') || '/';
  const reason = buildNotFoundReason(req, routePath);

  logMiddlewareError({
    errorType: '404',
    method: req.method,
    route: routePath,
    statusCode: 404,
    reason,
  });

  // /404 route'unun desteklenmeyen bir HTTP metoduyla çağrılması halinde sonsuz yönlendirmeyi önle
  if (cleanPath === '/404') {
    const html = notFoundView.renderNotFoundPage({
      path: routePath,
      method: req.method,
      reason,
    });
    return res.status(404).send(html);
  }

  const params = new URLSearchParams({
    path: routePath,
    method: req.method,
    reason,
  });

  return res.redirect(302, `/404?${params.toString()}`);
};

module.exports = notFoundGuardian;
