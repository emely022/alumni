const express = require('express');
const router = express.Router();
const apiEventController = require('../controllers/apiEventController');

/**
 * @swagger
 * /api/event-registrations:
 *   get:
 *     summary: Tüm Etkinlik Kayıtlarını Listele
 *     tags:
 *       - Event Registrations (REST API)
 *     responses:
 *       200:
 *         description: Kayıt listesi
 *   post:
 *     summary: Yeni Etkinlik Kaydı Oluştur
 *     tags:
 *       - Event Registrations (REST API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *             properties:
 *               eventId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [registered, attended, cancelled]
 *     responses:
 *       201:
 *         description: Kayıt oluşturuldu
 */
router.get('/', apiEventController.getRegistrations);
router.post('/', apiEventController.createRegistration);

/**
 * @swagger
 * /api/event-registrations/{id}:
 *   get:
 *     summary: ID'ye Göre Kayıt Detayı Getir
 *     tags:
 *       - Event Registrations (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kayıt detayı
 *       404:
 *         description: Kayıt bulunamadı
 *   patch:
 *     summary: Kayıt Durumunu Güncelle (PATCH)
 *     tags:
 *       - Event Registrations (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [registered, attended, cancelled]
 *     responses:
 *       200:
 *         description: Kayıt durumu güncellendi
 *   delete:
 *     summary: Kaydı Sil / İptal Et
 *     tags:
 *       - Event Registrations (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kayıt silindi
 */
router.get('/:id', apiEventController.getRegistrationById);
router.patch('/:id', apiEventController.updateRegistrationStatus);
router.delete('/:id', apiEventController.deleteRegistration);

/**
 * @swagger
 * /api/event-registrations/{id}/event:
 *   get:
 *     summary: Kaydın Bağlı Olduğu Etkinliği Getir (Nested)
 *     tags:
 *       - Event Registrations (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İlişkili etkinlik detayı
 */
router.get('/:id/event', apiEventController.getRegistrationEvent);

/**
 * @swagger
 * /api/event-registrations/{id}/user:
 *   get:
 *     summary: Kaydı Yapan Kullanıcıyı Getir (Nested)
 *     tags:
 *       - Event Registrations (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İlişkili kullanıcı detayı
 */
router.get('/:id/user', apiEventController.getRegistrationUser);

module.exports = router;
