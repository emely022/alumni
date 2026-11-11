/**
 * NotFound View (Görünüm Katmanı)
 *
 * MVC mimarisinin View katmanıdır.
 * Geçersiz veya bulunamayan route'lara yönlendirilen kullanıcılar için
 * generic 404 HTML hata sayfasını oluşturmaktan sorumludur.
 */

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
    line-height: 1.6;
    color: #333;
    background-color: #fcfcfc;
  }
  h1, h2 {
    color: #2c3e50;
  }
  h1 {
    border-bottom: 2px solid #eaecef;
    padding-bottom: 10px;
    margin-top: 10px;
  }
  .nav {
    margin-bottom: 25px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eaecef;
  }
  .nav a {
    color: #0366d6;
    text-decoration: none;
    margin-right: 18px;
    font-weight: 500;
  }
  .nav a:hover {
    text-decoration: underline;
  }
  .card {
    background: white;
    padding: 28px;
    border-radius: 8px;
    border: 1px solid #e1e4e8;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.85em;
    font-weight: 700;
    background-color: #ffeef0;
    color: #86181d;
    border: 1px solid #fdaeb7;
    margin-bottom: 10px;
  }
  .alert-error {
    background-color: #ffeef0;
    border: 1px solid #fdaeb7;
    color: #86181d;
    padding: 14px 18px;
    border-radius: 6px;
    margin: 18px 0;
    font-size: 0.95em;
  }
  .meta {
    background-color: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 16px 0;
    font-size: 0.92em;
    color: #24292e;
    word-break: break-word;
  }
  .meta code {
    background-color: #eaecef;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.92em;
  }
  .actions {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .btn {
    display: inline-block;
    padding: 10px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95em;
  }
  .btn-primary {
    background-color: #0366d6;
    color: #ffffff;
  }
  .btn-primary:hover {
    background-color: #0256b9;
  }
  .btn-secondary {
    background-color: #f6f8fa;
    color: #24292e;
    border: 1px solid #d1d5da;
  }
  .btn-secondary:hover {
    background-color: #eaecef;
  }
`;

/**
 * Kullanıcıdan veya URL query parametrelerinden gelen metni HTML için güvenli hale getirir.
 *
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
 * Generic 404 hata sayfası HTML şablonunu üretir.
 *
 * @param {Object} [options]
 * @param {string} [options.path] - Eşleşmeyen route yolu
 * @param {string} [options.method] - HTTP metodu
 * @param {string} [options.reason] - 404 nedeni
 * @returns {string} HTML dokümanı
 */
const renderNotFoundPage = ({ path, method, reason } = {}) => {
  const normalizedMethod = method ? String(method).toUpperCase() : 'GET';
  const normalizedPath = path ? String(path) : '/404';
  const normalizedReason =
    reason || 'Aradığınız sayfa veya endpoint sistemde bulunamadı.';

  const safeMethod = escapeHtml(normalizedMethod);
  const safePath = escapeHtml(normalizedPath);
  const safeReason = escapeHtml(normalizedReason);

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 - Sayfa Bulunamadı | Mezun Bilgi Sistemi</title>
  <style>${baseStyles}</style>
</head>
<body>
  <nav class="nav">
    <a href="/">Ana Sayfa</a>
    <a href="/users">Mezunlar</a>
    <a href="/announcements">Duyurular</a>
    <a href="/job-postings">İş İlanları</a>
    <a href="/applications">Başvurular</a>
  </nav>

  <div class="card">
    <span class="status-badge">404 Not Found</span>
    <h1>Sayfa Bulunamadı</h1>
    <p>Ulaşmaya çalıştığınız sayfa veya API endpoint'i mevcut değil ya da taşınmış olabilir.</p>

    <div class="meta">
      <strong>İstenen Adres:</strong> <code>${safeMethod} ${safePath}</code>
    </div>

    <div class="alert-error">
      <strong>Neden:</strong> ${safeReason}
    </div>

    <div class="actions">
      <a class="btn btn-primary" href="/">Ana Sayfaya Dön</a>
      <a class="btn btn-secondary" href="/job-postings">İş İlanlarını Görüntüle</a>
      <a class="btn btn-secondary" href="/api/swagger">API Dokümantasyonu</a>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  escapeHtml,
  renderNotFoundPage,
};
