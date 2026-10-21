const express = require('express');
const router = express.Router();
const apiApplicationController = require('../controllers/apiApplicationController');

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Tüm İş Başvurularını Listele
 *     description: "Sistemdeki iş başvurularını listeler (Filtreler: ?jobPostingId=...&userId=...&status=...)."
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: query
 *         name: jobPostingId
 *         schema:
 *           type: integer
 *         description: İlana göre filtrele
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Başvuran kullanıcıya göre filtrele
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewed, interview, accepted, rejected]
 *         description: Başvuru durumuna göre filtrele
 *     responses:
 *       200:
 *         description: Başvuru listesi
 *   post:
 *     summary: Yeni İş Başvurusu Gönder
 *     tags:
 *       - Applications (REST API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobPostingId
 *               - userId
 *             properties:
 *               jobPostingId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               resumeUrl:
 *                 type: string
 *               coverNote:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, interview, accepted, rejected]
 *     responses:
 *       201:
 *         description: Başvuru başarıyla oluşturuldu
 *       400:
 *         description: Eksik alanlar veya mükerrer başvuru
 */
router.get('/', apiApplicationController.getApplications);
router.post('/', apiApplicationController.createApplication);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: ID'ye Göre Başvuru Getir
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başvuru detayı
 *       404:
 *         description: Başvuru bulunamadı
 *   put:
 *     summary: Başvuruyu Tamamen Güncelle (PUT)
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başvuru güncellendi
 *       404:
 *         description: Başvuru bulunamadı
 *   patch:
 *     summary: Başvuruyu Kısmi Güncelle (PATCH)
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başvuru güncellendi
 *       404:
 *         description: Başvuru bulunamadı
 *   delete:
 *     summary: Başvuruyu Sil / Geri Çek
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başvuru silindi
 *       404:
 *         description: Başvuru bulunamadı
 */
router.get('/:id', apiApplicationController.getApplicationById);
router.put('/:id', apiApplicationController.updateApplicationPut);
router.patch('/:id', apiApplicationController.updateApplicationPatch);
router.delete('/:id', apiApplicationController.deleteApplication);

/**
 * @swagger
 * /api/applications/{id}/job-posting:
 *   get:
 *     summary: Başvurunun Bağlı Olduğu İş İlanını Getir (Nested - N:1)
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İlgili iş ilanı bilgisi
 *       404:
 *         description: İlan veya başvuru bulunamadı
 */
router.get('/:id/job-posting', apiApplicationController.getApplicationJobPosting);

/**
 * @swagger
 * /api/applications/{id}/user:
 *   get:
 *     summary: Başvuruyu Yapan Mezunu Getir (Nested - N:1)
 *     tags:
 *       - Applications (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başvuruyu yapan mezun bilgisi
 *       404:
 *         description: Kullanıcı veya başvuru bulunamadı
 */
router.get('/:id/user', apiApplicationController.getApplicationUser);

module.exports = router;
