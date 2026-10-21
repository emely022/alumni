const express = require('express');
const router = express.Router();
const apiEventController = require('../controllers/apiEventController');

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Tüm Etkinlikleri Listele
 *     description: Sistemdeki tüm etkinlikleri JSON formatında listeler.
 *     tags:
 *       - Events (REST API)
 *     responses:
 *       200:
 *         description: Etkinlik listesi
 *   post:
 *     summary: Yeni Etkinlik Oluştur
 *     tags:
 *       - Events (REST API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - eventDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               capacity:
 *                 type: integer
 *               organizerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Etkinlik başarıyla oluşturuldu
 */
router.get('/', apiEventController.getEvents);
router.post('/', apiEventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: ID'ye Göre Etkinlik Getir
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etkinlik bulundu
 *       404:
 *         description: Etkinlik bulunamadı
 *   put:
 *     summary: Etkinliği Tamamen Güncelle (PUT)
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etkinlik güncellendi
 *   patch:
 *     summary: Etkinliği Kısmi Güncelle (PATCH)
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etkinlik güncellendi
 *   delete:
 *     summary: Etkinliği Sil
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etkinlik silindi
 */
router.get('/:id', apiEventController.getEventById);
router.put('/:id', apiEventController.updateEventPut);
router.patch('/:id', apiEventController.updateEventPatch);
router.delete('/:id', apiEventController.deleteEvent);

/**
 * @swagger
 * /api/events/{id}/organizer:
 *   get:
 *     summary: Etkinliğin Organizatörünü Getir (Nested)
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Organizatör kullanıcı bilgisi
 *       404:
 *         description: Organizatör veya etkinlik bulunamadı
 */
router.get('/:id/organizer', apiEventController.getEventOrganizer);

/**
 * @swagger
 * /api/events/{id}/registrations:
 *   get:
 *     summary: Etkinliğin Kayıtlarını Listele (Nested)
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etkinlik kayıt listesi
 *   post:
 *     summary: Etkinliğe Kayıt Ol / Mezun Ekle (Nested)
 *     tags:
 *       - Events (REST API)
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [registered, attended, cancelled]
 *     responses:
 *       201:
 *         description: Kayıt oluşturuldu
 */
router.get('/:id/registrations', apiEventController.getEventRegistrations);
router.post('/:id/registrations', apiEventController.registerToEvent);

/**
 * @swagger
 * /api/events/{id}/participants:
 *   get:
 *     summary: Etkinliğe Katılan Mezunları Listele (Nested - N:N)
 *     tags:
 *       - Events (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Katılımcı mezun listesi
 */
router.get('/:id/participants', apiEventController.getEventParticipants);

module.exports = router;
