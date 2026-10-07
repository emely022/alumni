const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Duyurular Listesi Web Sayfası
 *     description: Sistemde kayıtlı tüm duyuruları listeleyen ve yeni duyuru yayınlama formunu barındıran responsive HTML sayfasını döner (AnnouncementController).
 *     tags:
 *       - Announcements (Web View)
 *     responses:
 *       200:
 *         description: Başarılı HTML sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *   post:
 *     summary: Yeni Duyuru Yayınla (Web Form)
 *     description: HTML formundan gelen verilerle yeni duyuru ekler ve duyurular listesine yönlendirir (AnnouncementController).
 *     tags:
 *       - Announcements (Web View)
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mezunlar Buluşması 2026
 *               content:
 *                 type: string
 *                 example: Tüm mezunlarımız etkinliğe davetlidir.
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
 *       302:
 *         description: Duyuru başarıyla eklendi ve /announcements sayfasına yönlendirildi
 *       400:
 *         description: Başlık veya içerik eksik
 */
router.get('/', announcementController.getAnnouncements);
router.post('/', announcementController.createAnnouncement);

/**
 * @swagger
 * /announcements/{id}/edit:
 *   get:
 *     summary: Duyuru Düzenleme Formu Web Sayfası
 *     description: Belirtilen ID'ye sahip duyurunun bilgilerini önceden doldurulmuş düzenleme formuyla döner (AnnouncementController).
 *     tags:
 *       - Announcements (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Düzenlenecek duyurunun ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Başarılı düzenleme HTML formu
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Duyuru bulunamadı
 */
router.get('/:id/edit', announcementController.getEditAnnouncementForm);

/**
 * @swagger
 * /announcements/{id}/update:
 *   post:
 *     summary: Duyuru Bilgilerini Güncelle (Web Form)
 *     description: Düzenleme formundan gelen verileri günceller ve /announcements sayfasına yönlendirir (AnnouncementController).
 *     tags:
 *       - Announcements (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek duyurunun ID'si
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Güncel Duyuru Başlığı
 *               content:
 *                 type: string
 *                 example: Güncellenmiş duyuru içeriği.
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
 *       302:
 *         description: Duyuru güncellendi ve /announcements sayfasına yönlendirildi
 *       404:
 *         description: Duyuru bulunamadı
 */
router.post('/:id/update', announcementController.updateAnnouncementForm);

/**
 * @swagger
 * /announcements/{id}/delete:
 *   post:
 *     summary: Duyuru Kaydını Sil (Web Form)
 *     description: Belirtilen ID'ye sahip duyuru kaydını siler ve /announcements sayfasına yönlendirir (AnnouncementController).
 *     tags:
 *       - Announcements (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek duyurunun ID'si
 *         example: 1
 *     responses:
 *       302:
 *         description: Duyuru silindi ve /announcements sayfasına yönlendirildi
 *       404:
 *         description: Duyuru bulunamadı
 */
router.post('/:id/delete', announcementController.deleteAnnouncementForm);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Duyuru Detayı Web Sayfası
 *     description: Belirtilen ID'ye sahip duyurunun detaylı görünüm HTML sayfasını döner (AnnouncementController).
 *     tags:
 *       - Announcements (Web View)
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
 *         description: Başarılı HTML sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Duyuru bulunamadı
 */
router.get('/:id', announcementController.getAnnouncementById);

module.exports = router;
