const fs = require('fs');
const path = require('path');

/**
 * Shared Error Logger Helper
 *
 * 404 Guardian ve 5xx Guardian middleware'lerinin ürettiği hataları
 * standart bir formatta hem terminale (console.error) hem de
 * backend/logs/error.logs dosyasına yazar.
 */

const LOG_DIR = path.resolve(__dirname, '../../logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'error.logs');

const padTwo = (value) => String(value).padStart(2, '0');

const formatDateTime = (date = new Date()) => {
  const year = date.getFullYear();
  const month = padTwo(date.getMonth() + 1);
  const day = padTwo(date.getDate());
  const hours = padTwo(date.getHours());
  const minutes = padTwo(date.getMinutes());
  const seconds = padTwo(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatErrorEntry = ({ errorType, method, route, statusCode, reason, stack }) => {
  const timestamp = formatDateTime(new Date());
  const header = `[${timestamp}] [${errorType}] ${method} ${route} | Status: ${statusCode} | Reason: ${reason}`;

  if (errorType === '5xx' && stack) {
    return `${header}\nStack Trace:\n${stack}\n`;
  }

  return header;
};

const logMiddlewareError = ({
  errorType,
  method,
  route,
  statusCode,
  reason,
  stack = null,
}) => {
  const entry = formatErrorEntry({ errorType, method, route, statusCode, reason, stack });

  // Terminale hata logunu yaz
  console.error(entry);

  // logs/ klasörü yoksa otomatik oluştur ve logs/error.logs dosyasına ekle
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    fs.appendFileSync(ERROR_LOG_FILE, `${entry}\n`, 'utf8');
  } catch (fsErr) {
    console.error(`[ErrorLogger] Hata dosyasına yazılamadı (${ERROR_LOG_FILE}): ${fsErr.message}`);
  }
};

module.exports = {
  LOG_DIR,
  ERROR_LOG_FILE,
  logMiddlewareError,
};
