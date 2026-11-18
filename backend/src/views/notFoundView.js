/**
 * NotFound View (Görünüm Katmanı) - İstanbul Üniversitesi Mezun Bilgi Sistemi
 *
 * design.md tasarım sistemine uygun generic 404 HTML hata sayfası.
 */

const { renderLayout, escapeHtml } = require('./layout');

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

  const content = `
    <div class="card" style="max-width: 760px; margin: 30px auto; padding: 40px; text-align: center;">
      <div style="font-size: 56px; margin-bottom: 12px;">🏛️ 404</div>
      <span class="badge badge-danger" style="font-size: 14px; padding: 6px 16px; margin-bottom: 16px;">SAYFA BULUNAMADI</span>
      <h2 style="font-size: 26px; font-weight: 700; color: #111827; margin: 12px 0;">İstediğiniz Sayfa Sistemde Mevcut Değil</h2>
      <p style="color: #4B5563; font-size: 15px; max-width: 580px; margin: 0 auto 24px auto;">
        Ulaşmaya çalıştığınız sayfa veya API endpoint'i yayından kaldırılmış, taşınmış ya da bağlantı adresi hatalı girilmiş olabilir.
      </p>

      <div style="background-color: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 14px 18px; text-align: left; margin-bottom: 20px;">
        <div style="font-size: 13px; color: #6B7280; margin-bottom: 4px;">İstenen Rota & Metod:</div>
        <code style="font-size: 14px; font-weight: 700; color: #111827; font-family: monospace;">${safeMethod} ${safePath}</code>
      </div>

      <div class="alert alert-error" style="text-align: left; margin-bottom: 28px;">
        <span>⚠️</span>
        <div><strong>Hata Nedeni:</strong> ${safeReason}</div>
      </div>

      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <a class="btn btn-primary" href="/">← Ana Sayfaya Dön</a>
        <a class="btn btn-secondary" href="/users">Mezunlar Dizini</a>
        <a class="btn btn-secondary" href="/job-postings">Kariyer İlanları</a>
        <a class="btn btn-secondary" href="/api/swagger" target="_blank">Swagger API</a>
      </div>
    </div>
  `;

  return renderLayout({
    title: '404 - Sayfa Bulunamadı | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: '',
    content,
    pageTitle: '',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">404 Hatası</span>',
  });
};

module.exports = {
  escapeHtml,
  renderNotFoundPage,
};
