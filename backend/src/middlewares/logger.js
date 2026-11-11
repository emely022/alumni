/**
 * Request Logger Middleware
 *
 * Her HTTP isteğinde terminale tek satırlık özet log basar.
 * Format: HH:MM:SS METOD ROUTE DURUM_KODU SÜRE
 * Örnek:  10:20:30 POST /api/users 201 18ms
 */

const padTwo = (value) => String(value).padStart(2, '0');

const formatTimestamp = (date) => {
  return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;
};

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  let logged = false;

  const writeLog = () => {
    if (logged) return;
    logged = true;

    const elapsedMs = Math.round(Number(process.hrtime.bigint() - startTime) / 1e6);
    const timestamp = formatTimestamp(new Date());
    const method = req.method;
    const route = req.originalUrl || req.url;
    const statusCode = res.statusCode;

    console.log(`${timestamp} ${method} ${route} ${statusCode} ${elapsedMs}ms`);
  };

  res.on('finish', writeLog);
  res.on('close', writeLog);

  next();
};

module.exports = requestLogger;
