const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const apiUserRoutes = require('./apiUserRoutes');
const userRoutes = require('./userRoutes');
const apiAnnouncementRoutes = require('./apiAnnouncementRoutes');
const announcementRoutes = require('./announcementRoutes');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Ana Karşılama Sayfası
 *     description: Alumni Tracking System HTML ana sayfasını döner.
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

// Sub-routers: Modüler route tanımları
router.use('/api/users', apiUserRoutes);
router.use('/users', userRoutes);
router.use('/api/announcements', apiAnnouncementRoutes);
router.use('/announcements', announcementRoutes);

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

module.exports = router;
