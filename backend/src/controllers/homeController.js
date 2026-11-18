const { pool } = require('../config/db');
const { homeView, notFoundView } = require('../views');

const getHome = async (req, res) => {
  let stats = {
    usersCount: 450000,
    jobPostingsCount: 120,
    announcementsCount: 48,
    departmentsCount: 17,
    dbConnected: false,
  };

  try {
    const client = await pool.connect();
    try {
      const [uRes, jRes, aRes, dRes] = await Promise.all([
        client.query('SELECT COUNT(*) FROM users;'),
        client.query('SELECT COUNT(*) FROM job_postings WHERE is_active = TRUE;'),
        client.query('SELECT COUNT(*) FROM announcements;'),
        client.query('SELECT COUNT(*) FROM departments;'),
      ]);
      stats = {
        usersCount: parseInt(uRes.rows[0].count, 10),
        jobPostingsCount: parseInt(jRes.rows[0].count, 10),
        announcementsCount: parseInt(aRes.rows[0].count, 10),
        departmentsCount: parseInt(dRes.rows[0].count, 10),
        dbConnected: true,
      };
    } finally {
      client.release();
    }
  } catch (_) {
    // Veritabanı kapalıysa kurumsal varsayılanlar kullanılır
  }

  const html = homeView.renderHomePage(stats);
  return res.status(200).send(html);
};

const getAbout = (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Alumni</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
      padding: 40px 20px;
    }
    .container {
      max-width: 760px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px 32px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    h1 {
      font-size: 2rem;
      color: #0f172a;
      margin-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
    }
    h2 {
      font-size: 1.25rem;
      color: #334155;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p {
      color: #475569;
      margin-bottom: 16px;
      font-size: 1.05rem;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 24px;
    }
    li {
      position: relative;
      padding-left: 28px;
      margin-bottom: 12px;
      color: #334155;
    }
    li::before {
      content: "✓";
      position: absolute;
      left: 6px;
      color: #2563eb;
      font-weight: bold;
    }
    .badge-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      margin-bottom: 24px;
    }
    .badge {
      background-color: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .nav-link {
      display: inline-block;
      margin-top: 12px;
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }
    .nav-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>About Alumni</h1>
    <p>
      Alumni Tracking System, mezunların okulları veya üniversiteleri ile olan bağlarını sürdürmelerini sağlamak için tasarlanmış bir platformdur. Mezunlar topluluğunun bir arada kalmasına, karşılıklı iletişimin devam etmesine ve gelecekteki etkinliklerden haberdar olunmasına olanak tanır.
    </p>

    <h2>Öne Çıkan Özellikler</h2>
    <ul>
      <li><strong>Mezun Profilleri:</strong> Kişisel mezun profilleri oluşturma ve görüntüleme.</li>
      <li><strong>İletişim Rehberi:</strong> Diğer mezunların iletişim bilgilerine güvenle erişim ve arama.</li>
      <li><strong>Etkinlik Duyuruları:</strong> Yaklaşan mezun buluşmaları, seminerler ve duyuruları takip etme.</li>
    </ul>

    <h2>Teknoloji Yığını</h2>
    <div class="badge-group">
      <span class="badge">Node.js</span>
      <span class="badge">Express</span>
      <span class="badge">PostgreSQL</span>
      <span class="badge">Docker &amp; Compose</span>
    </div>

    <a href="/" class="nav-link">← Ana Sayfaya Dön</a>
  </div>
</body>
</html>`;

  res.status(200).send(html);
};

const getHello = (req, res) => {
  res.status(200).send('Hello World!');
};

const getHelloWithName = (req, res) => {
  const { name } = req.params;
  res.status(200).send(`Hello, ${name}!`);
};

const getSum = (req, res) => {
  const { number1, number2 } = req.params;
  const num1 = Number(number1);
  const num2 = Number(number2);

  if (isNaN(num1) || isNaN(num2) || number1.trim() === '' || number2.trim() === '') {
    return res.status(400).send('Geçersiz sayı parametresi');
  }

  const result = num1 + num2;
  return res.status(200).send(`Toplam = ${number1} + ${number2} = ${result}`);
};

const getHealth = async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const client = await pool.connect();
    client.release();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    database: dbStatus,
  });
};

/**
 * Generic 404 hata sayfasını render eder.
 * Geçersiz route'lardan redirect edilen istekleri HTTP 404 durum kodu ile karşılar.
 */
const getNotFoundPage = (req, res) => {
  const path = typeof req.query.path === 'string' ? req.query.path : '/404';
  const method = typeof req.query.method === 'string' ? req.query.method : req.method;
  const reason =
    typeof req.query.reason === 'string' ? req.query.reason : undefined;

  const html = notFoundView.renderNotFoundPage({ path, method, reason });
  return res.status(404).send(html);
};

module.exports = {
  getHome,
  getAbout,
  getHello,
  getHelloWithName,
  getSum,
  getHealth,
  getNotFoundPage,
};


