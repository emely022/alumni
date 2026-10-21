const express = require('express');
const router = express.Router();
const apiAnnouncementController = require('../controllers/apiAnnouncementController');

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Tüm Duyuruları Listele
 *     description: Bellekte (in-memory) tutulan tüm duyuruları JSON listesi olarak döner (ApiAnnouncementController).
 *     tags:
 *       - Announcements (REST API)
 *     responses:
 *       200:
 *         description: Duyurular listesi
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
 *                   title:
 *                     type: string
 *                     example: 2026 Yıllık Mezunlar Buluşması
 *                   content:
 *                     type: string
 *                     example: Tüm mezunlarımızı ana kampüsümüzde düzenlenecek buluşmaya davet ediyoruz.
 *                   category:
 *                     type: string
 *                     example: Etkinlik
 *                   author:
 *                     type: string
 *                     example: Mezunlar Ofisi
 *                   date:
 *                     type: string
 *                     example: 2026-05-15
 *                   createdAt:
 *                     type: string
 *                     example: 2026-10-01T09:00:00.000Z
 *   post:
 *     summary: Yeni Duyuru Ekle
 *     description: Belleğe (in-memory) yeni bir duyuru ekler (ApiAnnouncementController).
 *     tags:
 *       - Announcements (REST API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bahar Kariyer Zirvesi
 *               content:
 *                 type: string
 *                 example: Mezunlarımız ve öğrencilerimiz için networking oturumları düzenlenecektir.
 *               category:
 *                 type: string
 *                 example: Kariyer
 *               author:
 *                 type: string
 *                 example: Kariyer Merkezi
 *               date:
 *                 type: string
 *                 example: 2026-04-20
 *     responses:
 *       201:
 *         description: Duyuru başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz parametreler (title veya content eksik)
 */
router.get('/', apiAnnouncementController.getAnnouncements);
router.post('/', apiAnnouncementController.createAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   get:
 *     summary: ID'ye Göre Duyuru Getir
 *     description: Belirtilen ID'ye sahip duyuru detaylarını JSON formatında döner (ApiAnnouncementController).
 *     tags:
 *       - Announcements (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Duyuru ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Duyuru bulundu
 *       404:
 *         description: Duyuru bulunamadı
 *   put:
 *     summary: Duyuruyu Tamamen Güncelle (PUT)
 *     description: Duyurunun tüm bilgilerini tamamen değiştirir (title ve content zorunludur - ApiAnnouncementController).
 *     tags:
 *       - Announcements (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek duyuru ID'si
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Güncellenmiş Mezunlar Buluşması
 *               content:
 *                 type: string
 *                 example: Buluşma saati 14:00 olarak güncellenmiştir.
 *               category:
 *                 type: string
 *                 example: Etkinlik
 *               author:
 *                 type: string
 *                 example: Mezunlar Ofisi
 *               date:
 *                 type: string
 *                 example: 2026-05-15
 *     responses:
 *       200:
 *         description: Duyuru tamamen güncellendi
 *       400:
 *         description: Eksik alan gönderildi (title ve content zorunlu)
 *       404:
 *         description: Duyuru bulunamadı
 *   patch:
 *     summary: Duyuruyu Kısmi Güncelle (PATCH)
 *     description: Duyurunun sadece gönderilen alanlarını günceller, diğerlerini korur (ApiAnnouncementController).
 *     tags:
 *       - Announcements (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek duyuru ID'si
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Kısmi Güncellenmiş Başlık
 *               content:
 *                 type: string
 *                 example: Kısmi güncellenmiş içerik
 *               category:
 *                 type: string
 *                 example: Genel
 *               author:
 *                 type: string
 *                 example: Rektörlük
 *               date:
 *                 type: string
 *                 example: 2026-06-01
 *     responses:
 *       200:
 *         description: Duyuru kısmi olarak güncellendi
 *       404:
 *         description: Duyuru bulunamadı
 *   delete:
 *     summary: Duyuruyu Sil
 *     description: Belirtilen ID'ye sahip duyuruyu bellekten siler (ApiAnnouncementController).
 *     tags:
 *       - Announcements (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek duyuru ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Duyuru başarıyla silindi
 *       404:
 *         description: Duyuru bulunamadı
 */
router.get('/:id', apiAnnouncementController.getAnnouncementById);
router.put('/:id', apiAnnouncementController.updateAnnouncementPut);
router.patch('/:id', apiAnnouncementController.updateAnnouncementPatch);
router.delete('/:id', apiAnnouncementController.deleteAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}/author:
 *   get:
 *     summary: Duyurunun Yazarını Getir (Nested - N:1)
 *     tags:
 *       - Announcements (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Duyuru yazarı kullanıcı bilgisi
 *       404:
 *         description: Duyuru veya yazar bulunamadı
 */
router.get('/:id/author', apiAnnouncementController.getAnnouncementAuthor);

module.exports = router;
