const express = require('express');
const router = express.Router();
const apiUserController = require('../controllers/apiUserController');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm Kullanıcıları Listele
 *     description: Bellekte (in-memory) tutulan tüm kullanıcıları JSON listesi olarak döner (ApiUserController).
 *     tags:
 *       - Users (REST API)
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
 *     description: Belleğe (in-memory) yeni bir kullanıcı ekler (ApiUserController).
 *     tags:
 *       - Users (REST API)
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
router.get('/', apiUserController.getUsers);
router.post('/', apiUserController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ID'ye Göre Kullanıcı Getir
 *     description: Belirtilen ID'ye sahip kullanıcı detaylarını döner (ApiUserController).
 *     tags:
 *       - Users (REST API)
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
 *     description: Kullanıcının tüm bilgilerini tamamen değiştirir (Tüm alanlar zorunludur - ApiUserController).
 *     tags:
 *       - Users (REST API)
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
 *     description: Kullanıcının sadece gönderilen alanlarını günceller, diğerlerini korur (ApiUserController).
 *     tags:
 *       - Users (REST API)
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
 *     description: Belirtilen ID'ye sahip kullanıcıyı listeden siler (ApiUserController).
 *     tags:
 *       - Users (REST API)
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
router.get('/:id', apiUserController.getUserById);
router.put('/:id', apiUserController.updateUserPut);
router.patch('/:id', apiUserController.updateUserPatch);
router.delete('/:id', apiUserController.deleteUser);

/**
 * @swagger
 * /api/users/{id}/department:
 *   get:
 *     summary: Kullanıcının Bölümünü Getir (Nested - N:1)
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcının akademik bölümü
 *       404:
 *         description: Kullanıcı veya bölüm bulunamadı
 */
router.get('/:id/department', apiUserController.getUserDepartment);

/**
 * @swagger
 * /api/users/{id}/announcements:
 *   get:
 *     summary: Kullanıcının Yayınladığı Duyuruları Getir (Nested - 1:N)
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcının duyuruları
 */
router.get('/:id/announcements', apiUserController.getUserAnnouncements);

/**
 * @swagger
 * /api/users/{id}/events:
 *   get:
 *     summary: Kullanıcının Organize Ettiği Etkinlikleri Getir (Nested - 1:N)
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcının organize ettiği etkinlikler
 */
router.get('/:id/events', apiUserController.getUserOrganizedEvents);

/**
 * @swagger
 * /api/users/{id}/registered-events:
 *   get:
 *     summary: Kullanıcının Kayıt Olduğu Etkinlikleri Getir (Nested - N:N)
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcının kayıt olduğu etkinlikler
 */
router.get('/:id/registered-events', apiUserController.getUserRegisteredEvents);

/**
 * @swagger
 * /api/users/{id}/job-postings:
 *   get:
 *     summary: Kullanıcının Yayınladığı İş İlanlarını Getir (Nested - 1:N)
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcının iş ilanları
 */
router.get('/:id/job-postings', apiUserController.getUserJobPostings);

/**
 * @swagger
 * /api/users/{id}/applications:
 *   get:
 *     summary: "Kullanıcının İş Başvurularını Getir (Nested - 1:N)"
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Kullanıcının iş başvuruları listesi"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 */
router.get('/:id/applications', apiUserController.getUserApplications);

/**
 * @swagger
 * /api/users/{id}/applied-jobs:
 *   get:
 *     summary: "Kullanıcının Başvurduğu İş İlanlarını Getir (Nested - N:N)"
 *     tags:
 *       - Users (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Kullanıcının başvurduğu iş ilanları listesi"
 *       404:
 *         description: "Kullanıcı bulunamadı"
 */
router.get('/:id/applied-jobs', apiUserController.getUserAppliedJobs);

module.exports = router;
