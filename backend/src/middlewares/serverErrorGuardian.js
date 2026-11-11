/**
 * 5xx Guardian Middleware
 *
 * Uygulama katmanında veya middleware zincirinde oluşan sunucu taraflı hataları (5xx)
 * yakalar, hatayı terminale ve logs/error.logs dosyasına (stack trace ile) kaydeder ve
 * istemciye 500 durum koduyla birlikte nedenini (reason) içeren bir JSON hata cevabı döner.
 */

const http = require('http');
const { logMiddlewareError } = require('../utils/errorLogger');

const resolveStatusCode = (err) => {
  if (!err || typeof err !== 'object') return 500;
  const rawStatus = Number(err.statusCode ?? err.status);
  if (Number.isInteger(rawStatus) && rawStatus >= 400 && rawStatus < 500) {
    return rawStatus;
  }
  return 500;
};

const extractErrorReason = (err, statusCode) => {
  if (typeof err === 'string' && err.trim()) {
    return err.trim();
  }

  if (err && typeof err === 'object') {
    if (typeof err.reason === 'string' && err.reason.trim()) {
      return err.reason.trim();
    }

    if (typeof err.message === 'string' && err.message.trim()) {
      const codePrefix = err.code ? `[${err.code}] ` : '';
      return `${codePrefix}${err.message.trim()}`;
    }

    // Node.js AggregateError (örn. pg bağlantı hatası) durumlarında iç hatayı oku
    if (Array.isArray(err.errors) && err.errors.length > 0 && err.errors[0]?.message) {
      const codePrefix = err.code ? `[${err.code}] ` : '';
      return `${codePrefix}${err.errors[0].message.trim()}`;
    }

    if (err.code) {
      return `Sunucu hatası (Kod: ${err.code}).`;
    }
  }

  return statusCode >= 500
    ? 'Beklenmeyen bir sunucu hatası oluştu.'
    : 'İstek işlenirken istemci kaynaklı bir hata oluştu.';
};

// Express hata yakalama middleware'i 4 parametre (err, req, res, next) gerektirir
const serverErrorGuardian = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = resolveStatusCode(err);
  const routePath = req.originalUrl || req.url || '/';
  const reason = extractErrorReason(err, statusCode);
  const isServerError = statusCode >= 500;
  const stackTrace = isServerError
    ? (err && err.stack ? err.stack : new Error(reason).stack)
    : null;

  logMiddlewareError({
    errorType: isServerError ? '5xx' : '4xx',
    method: req.method,
    route: routePath,
    statusCode,
    reason,
    stack: stackTrace,
  });

  return res.status(statusCode).json({
    error: http.STATUS_CODES[statusCode] || 'Internal Server Error',
    statusCode,
    reason,
    method: req.method,
    path: routePath,
    timestamp: new Date().toISOString(),
  });
};

module.exports = serverErrorGuardian;
