const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: "İş Başvuruları Listesi Web Sayfası"
 *     description: "Sistemde kayıtlı tüm iş başvurularını listeleyen ve yeni başvuru formunu barındıran responsive HTML sayfasını döner (ApplicationController)."
 *     tags:
 *       - Applications (Web View)
 *     responses:
 *       200:
 *         description: "Başarılı HTML sayfası"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *   post:
 *     summary: "Yeni Başvuru Yap (Web Form)"
 *     description: "HTML formundan gelen verilerle yeni iş başvurusu ekler ve /applications sayfasına yönlendirir (ApplicationController)."
 *     tags:
 *       - Applications (Web View)
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - jobPostingId
 *               - userId
 *             properties:
 *               jobPostingId:
 *                 type: integer
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 example: 1
 *               resumeUrl:
 *                 type: string
 *                 example: "https://drive.google.com/cv.pdf"
 *               coverNote:
 *                 type: string
 *                 example: "Bu pozisyon için motiveyim."
 *               status:
 *                 type: string
 *                 example: "pending"
 *     responses:
 *       302:
 *         description: "Başvuru başarıyla eklendi ve /applications sayfasına yönlendirildi"
 *       400:
 *         description: "Zorunlu alanlar eksik"
 *       409:
 *         description: "Aynı ilana daha önce başvuru yapılmış"
 */
router.get('/', applicationController.getApplications);
router.post('/', applicationController.createApplication);

/**
 * @swagger
 * /applications/{id}/edit:
 *   get:
 *     summary: "Başvuru Düzenleme Formu Web Sayfası"
 *     description: "Belirtilen ID'ye sahip iş başvurusunun durum ve içerik düzenleme formunu döner (ApplicationController)."
 *     tags:
 *       - Applications (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Düzenlenecek başvuru ID'si"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Başarılı düzenleme HTML formu"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Başvuru bulunamadı"
 */
router.get('/:id/edit', applicationController.getEditApplicationForm);

/**
 * @swagger
 * /applications/{id}/update:
 *   post:
 *     summary: "Başvuru Bilgilerini Güncelle (Web Form)"
 *     description: "Düzenleme formundan gelen verileri günceller ve /applications sayfasına yönlendirir (ApplicationController)."
 *     tags:
 *       - Applications (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Güncellenecek başvuru ID'si"
 *         example: 1
 *     responses:
 *       302:
 *         description: "Başvuru güncellendi ve /applications sayfasına yönlendirildi"
 *       404:
 *         description: "Başvuru bulunamadı"
 */
router.post('/:id/update', applicationController.updateApplicationForm);

/**
 * @swagger
 * /applications/{id}/delete:
 *   post:
 *     summary: "Başvuru Kaydını Sil (Web Form)"
 *     description: "Belirtilen ID'ye sahip başvuruyu siler ve /applications sayfasına yönlendirir (ApplicationController)."
 *     tags:
 *       - Applications (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Silinecek başvuru ID'si"
 *         example: 1
 *     responses:
 *       302:
 *         description: "Başvuru silindi ve /applications sayfasına yönlendirildi"
 *       404:
 *         description: "Başvuru bulunamadı"
 */
router.post('/:id/delete', applicationController.deleteApplicationForm);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: "Başvuru Detay Web Sayfası"
 *     description: "Belirtilen ID'ye sahip başvurunun aday, ilan ve durum detaylarını gösteren HTML sayfasını döner (ApplicationController)."
 *     tags:
 *       - Applications (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Başvuru ID'si"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Başarılı HTML sayfası"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Başvuru bulunamadı"
 */
router.get('/:id', applicationController.getApplicationById);

module.exports = router;
