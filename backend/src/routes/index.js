const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm Kullanıcıları Listele
 *     description: Bellekte (in-memory) tutulan tüm kullanıcıları JSON listesi olarak döner.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Ahmet Yılmaz
 *                   email:
 *                     type: string
 *                     example: ahmet@alumni.edu
 *                   department:
 *                     type: string
 *                     example: Bilgisayar Mühendisliği
 *                   graduationYear:
 *                     type: integer
 *                     example: 2022
 *   post:
 *     summary: Yeni Kullanıcı Ekle
 *     description: Belleğe (in-memory) yeni bir kullanıcı ekler.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mehmet Demir
 *               email:
 *                 type: string
 *                 example: mehmet@alumni.edu
 *               department:
 *                 type: string
 *                 example: Yazılım Mühendisliği
 *               graduationYear:
 *                 type: integer
 *                 example: 2024
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz parametreler (name veya email eksik)
 */
router.get('/api/users', userController.getUsers);
router.post('/api/users', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ID'ye Göre Kullanıcı Getir
 *     description: Belirtilen ID'ye sahip kullanıcı detaylarını döner.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kullanıcı ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Kullanıcı bulundu
 *       404:
 *         description: Kullanıcı bulunamadı
 *   put:
 *     summary: Kullanıcıyı Tamamen Güncelle (PUT)
 *     description: Kullanıcının tüm bilgilerini tamamen değiştirir (Tüm alanlar zorunludur).
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcı ID'si
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - department
 *               - graduationYear
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmet Güncel
 *               email:
 *                 type: string
 *                 example: ahmet_guncel@alumni.edu
 *               department:
 *                 type: string
 *                 example: Yapay Zeka Mühendisliği
 *               graduationYear:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Kullanıcı tamamen güncellendi
 *       400:
 *         description: Eksik alan gönderildi (tüm alanlar zorunlu)
 *       404:
 *         description: Kullanıcı bulunamadı
 *   patch:
 *     summary: Kullanıcıyı Kısmi Güncelle (PATCH)
 *     description: Kullanıcının sadece gönderilen alanlarını günceller, diğerlerini korur.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcı ID'si
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmet Yeni
 *               email:
 *                 type: string
 *                 example: yeni@alumni.edu
 *               department:
 *                 type: string
 *                 example: Siber Güvenlik
 *               graduationYear:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Kullanıcı kısmi olarak güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *   delete:
 *     summary: Kullanıcıyı Sil
 *     description: Belirtilen ID'ye sahip kullanıcıyı listeden siler.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek kullanıcı ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/api/users/:id', userController.getUserById);
router.put('/api/users/:id', userController.updateUserPut);
router.patch('/api/users/:id', userController.updateUserPatch);
router.delete('/api/users/:id', userController.deleteUser);

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
