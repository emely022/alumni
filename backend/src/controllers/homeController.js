const { pool } = require('../config/db');
const UserModel = require('../models/userModel');
const { homeView, notFoundView, layout } = require('../views');

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

  const sessionUser = req && req.session && req.session.user ? req.session.user : null;
  if (sessionUser) {
    let myAppliedJobs = [];
    let myJobPostings = [];
    let myAnnouncements = [];
    let freshUser = null;

    try {
      [freshUser, myAppliedJobs, myJobPostings, myAnnouncements] = await Promise.all([
        UserModel.findById(sessionUser.id).catch(() => null),
        UserModel.getAppliedJobs(sessionUser.id).catch(() => []),
        UserModel.getJobPostings(sessionUser.id).catch(() => []),
        UserModel.getAnnouncements(sessionUser.id).catch(() => []),
      ]);
    } catch (_) {}

    const activeUser = freshUser
      ? { ...sessionUser, ...freshUser }
      : sessionUser;

    stats.currentUser = activeUser;
    stats.userDashboard = {
      user: activeUser,
      myAppliedJobs,
      myJobPostings,
      myAnnouncements,
    };
  }

  const html = homeView.renderHomePage(stats);
  return res.status(200).send(html);
};

const getAbout = (req, res) => {
  const html = layout.renderLayout({
    title: 'Proje Hakkında | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'about',
    pageTitle: '🏛️ İstanbul Üniversitesi Mezun Bilgi Sistemi Hakkında',
    pageSubtitle: '1453\'ten bugüne uzanan bilim mirasını mezunlarımız, öğrencilerimiz ve akademisyenlerimiz için tek bir dijital ağda buluşturuyoruz.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Hakkında</span>',
    content: `
      <div class="card" style="padding: 36px 32px;">
        <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 14px;">About Alumni Tracking System</h2>
        <p style="color: #374151; font-size: 15px; margin-bottom: 20px;">
          Alumni Tracking System, mezunların üniversiteleri ile olan bağlarını sürdürmelerini sağlamak için tasarlanmış rol tabanlı (RBAC) bir dijital platformdur. Mezunlar topluluğunun bir arada kalmasına, kariyer fırsatlarının paylaşılmasına ve kampüs etkinliklerinden haberdar olunmasına olanak tanır.
        </p>

        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 20px 0 12px 0;">Öne Çıkan Özellikler</h3>
        <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; display: flex; flex-direction: column; gap: 10px; color: #374151;">
          <li>✅ <strong>Mezun Profilleri & Dizini:</strong> Kişisel mezun profilleri oluşturma, düzenleme ve arama.</li>
          <li>✅ <strong>Rol Tabanlı Dinamik Navigasyon (RBAC):</strong> Admin, Mezun, Öğrenci, Koordinatör ve İşveren rollerine özel dinamik menü ve yetkilendirme.</li>
          <li>✅ <strong>Kariyer & İş İlanları:</strong> İş ve staj ilanları yayınlama, aday başvurusu yapma ve başvuru durumu takip etme.</li>
          <li>✅ <strong>Yönetim Paneli (/admin):</strong> Tüm sistem verilerini ve kullanıcı rollerini tek merkezden yönetme.</li>
        </ul>

        <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin: 20px 0 12px 0;">Teknoloji Yığını</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
          <span class="badge badge-dark">Node.js</span>
          <span class="badge badge-dark">Express.js</span>
          <span class="badge badge-dark">PostgreSQL 16</span>
          <span class="badge badge-warning">express-session &amp; crypto.scrypt</span>
          <span class="badge badge-neutral">Docker &amp; Compose</span>
        </div>

        <a href="/" class="btn btn-primary">← Ana Sayfaya Dön</a>
      </div>
    `,
  });

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


