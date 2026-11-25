const path = require('path');
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const apiUserRoutes = require('./apiUserRoutes');
const userRoutes = require('./userRoutes');
const apiAnnouncementRoutes = require('./apiAnnouncementRoutes');
const announcementRoutes = require('./announcementRoutes');
const apiDepartmentRoutes = require('./apiDepartmentRoutes');
const apiEventRoutes = require('./apiEventRoutes');
const apiEventRegistrationRoutes = require('./apiEventRegistrationRoutes');
const apiJobPostingRoutes = require('./apiJobPostingRoutes');
const apiApplicationRoutes = require('./apiApplicationRoutes');
const jobPostingRoutes = require('./jobPostingRoutes');
const applicationRoutes = require('./applicationRoutes');
const adminRoutes = require('./adminRoutes');

// Kurumsal logo uç noktası
router.get('/istanbul-universitesi-logo.png', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/istanbul-universitesi-logo.png'));
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: "İstanbul Üniversitesi Mezun Bilgi Sistemi Ana Sayfası"
 *     description: "İstanbul Üniversitesi ve design.md tasarım sistemine uygun olarak hazırlanan; header, footer, menü, logo, ürünler, mezunlar listesi ve mezun profillerini içeren HTML ana sayfası."
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: "Başarılı HTML ana sayfası"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', homeController.getHome);

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Hakkında Sayfası
 *     description: Projenin amacını, özelliklerini ve teknoloji yığınını anlatan HTML sayfası döner.
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Başarılı HTML sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/about', homeController.getAbout);

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Mezun ve Üye Kayıt Sayfası
 *     description: İstanbul Üniversitesi Mezun Bilgi Sistemi için kullanıcı rolü, bölümü, mezuniyet yılı ve iletişim bilgilerini içeren kayıt formunu sunar.
 *     tags:
 *       - Registration
 *     responses:
 *       200:
 *         description: Başarılı HTML kayıt sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *   post:
 *     summary: Yeni Üye & Mezun Kaydı Oluştur
 *     description: Kayıt formundan gelen verileri doğrular, e-posta tekilliğini kontrol eder ve kullanıcıyı kaydeder.
 *     tags:
 *       - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - password
 *               - passwordConfirm
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: "En az 8 karakter uzunluğunda hesap parolası"
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: "Parola doğrulaması için parola tekrarı"
 *               role:
 *                 type: string
 *                 enum: [alumni, student, coordinator, employer]
 *               department_id:
 *                 type: integer
 *               graduationYear:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Başarılı kayıt sonrası yönlendirme
 *       400:
 *         description: Doğrulama hatası
 *       409:
 *         description: E-posta adresi zaten kullanımda
 */
router.get('/register', userController.getRegisterPage);
router.post('/register', userController.handleRegister);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Kullanıcı Giriş Sayfası
 *     description: E-posta ve şifre ile oturum açma HTML formunu sunar.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Başarılı HTML giriş sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *   post:
 *     summary: Kullanıcı Girişi (Oturum Başlatma)
 *     description: E-posta ve şifreyi crypto.scrypt ile doğrular, express-session ile cookie oturumu başlatır. Hatalı girişte genel mesaj döner.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       302:
 *         description: Başarılı giriş veya hata yönlendirmesi
 *       401:
 *         description: E-posta adresi veya şifre hatalı
 */
router.get('/login', userController.getLoginPage);
router.post('/login', userController.handleLogin);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Kullanıcı Çıkışı (Oturum Sonlandırma)
 *     description: Aktif kullanıcı oturumunu sonlandırır ve oturum çerezini temizler.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Çıkış sonrası yönlendirme
 *       200:
 *         description: Başarılı JSON çıkış yanıtı
 */
router.post('/logout', userController.handleLogout);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Giriş Yapmış Kullanıcının Kişisel Profil Sayfası
 *     description: Oturumdaki kullanıcının kendi bilgilerini (ad, e-posta, rol, bölüm, mezuniyet yılı, telefon, LinkedIn) sunar.
 *     tags:
 *       - Profile & Settings
 *     responses:
 *       200:
 *         description: Başarılı HTML profil sayfası
 *       302:
 *         description: Giriş yapılmamışsa /login yönlendirmesi
 */
router.get('/profile', authMiddleware, userController.getProfilePage);

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Giriş Yapmış Kullanıcının Kişisel Ayarlar ve Şifre Değiştirme Sayfası
 *     description: Oturumdaki kullanıcının kendi profil bilgilerini ve şifresini değiştirebildiği sayfa.
 *     tags:
 *       - Profile & Settings
 *     responses:
 *       200:
 *         description: Başarılı HTML ayarlar sayfası
 *   post:
 *     summary: Oturumdaki Kullanıcının Kendi Bilgilerini Güncelle
 *     description: Yalnızca oturumdaki kullanıcının kendi bilgilerini günceller; rol değiştirmeye izin vermez.
 *     tags:
 *       - Profile & Settings
 *     responses:
 *       302:
 *         description: Güncelleme sonrası /settings yönlendirmesi
 */
router.get('/settings', authMiddleware, userController.getSettingsPage);
router.post('/settings', authMiddleware, userController.handleUpdateSettings);
router.post('/settings/profile', authMiddleware, userController.handleUpdateSettings);
router.post('/settings/password', authMiddleware, userController.handleChangePassword);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Sistem Sağlık Durumu
 *     description: Uygulama durumu, zaman damgası, uptime ve veritabanı bağlantı durumunu JSON olarak döner.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Sistem sağlık bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   example: 2026-09-30T06:27:24.937Z
 *                 uptime:
 *                   type: string
 *                   example: 12.34s
 *                 database:
 *                   type: string
 *                   example: connected
 */
router.get('/api/health', homeController.getHealth);

// Sub-routers: Modüler route tanımları (authMiddleware ile korunan web ve API rotaları)
router.use('/admin', adminRoutes);
router.use('/api/users', authMiddleware, apiUserRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/api/announcements', authMiddleware, apiAnnouncementRoutes);
router.use('/announcements', authMiddleware, announcementRoutes);
router.use('/api/departments', authMiddleware, apiDepartmentRoutes);
router.use('/api/events', authMiddleware, apiEventRoutes);
router.use('/api/event-registrations', authMiddleware, apiEventRegistrationRoutes);
router.use('/api/job-postings', authMiddleware, apiJobPostingRoutes);
router.use('/job-postings', authMiddleware, jobPostingRoutes);
router.use('/api/applications', authMiddleware, apiApplicationRoutes);
router.use('/applications', authMiddleware, applicationRoutes);

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Hello World Mesajı
 *     description: Düz metin olarak "Hello World!" mesajı döner.
 *     tags:
 *       - Greetings
 *     responses:
 *       200:
 *         description: Başarılı selamlama mesajı
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
router.get('/hello', homeController.getHello);

/**
 * @swagger
 * /hello/{name}:
 *   get:
 *     summary: İsme Özel Karşılama Mesajı
 *     description: URL'deki parametreyi alıp "Hello, {name}!" formatında döner.
 *     tags:
 *       - Greetings
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Karşılanacak isim
 *         example: Emel
 *     responses:
 *       200:
 *         description: Kişiselleştirilmiş selamlama mesajı
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Hello, Emel!
 */
router.get('/hello/:name', homeController.getHelloWithName);

/**
 * @swagger
 * /sum/{number1}/{number2}:
 *   get:
 *     summary: İki Sayıyı Topla
 *     description: URL'deki iki sayıyı alıp toplar ve "Toplam = {number1} + {number2} = {sonuç}" formatında döner.
 *     tags:
 *       - Math
 *     parameters:
 *       - in: path
 *         name: number1
 *         required: true
 *         schema:
 *           type: number
 *         description: Birinci sayı
 *         example: 5
 *       - in: path
 *         name: number2
 *         required: true
 *         schema:
 *           type: number
 *         description: İkinci sayı
 *         example: 3
 *     responses:
 *       200:
 *         description: Başarılı toplam sonucu
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Toplam = 5 + 3 = 8
 *       400:
 *         description: Geçersiz sayı parametresi
 */
router.get('/sum/:number1/:number2', homeController.getSum);

/**
 * @swagger
 * /404:
 *   get:
 *     summary: "Genel 404 sayfası"
 *     description: "Tanımlı olmayan route'lardan yönlendirilen istekler için generic 404 HTML sayfasını döndürür."
 *     tags: [Genel]
 *     parameters:
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: "Bulunamayan istek yolu"
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: "İstek HTTP metodu"
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *         description: "404 nedeni"
 *     responses:
 *       404:
 *         description: "Generic 404 hata sayfası HTML yanıtı"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/404', homeController.getNotFoundPage);

module.exports = router;
