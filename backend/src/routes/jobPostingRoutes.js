const express = require('express');
const router = express.Router();
const jobPostingController = require('../controllers/jobPostingController');

/**
 * @swagger
 * /job-postings:
 *   get:
 *     summary: "İş İlanları Listesi Web Sayfası"
 *     description: "Sistemde kayıtlı tüm iş ilanlarını listeleyen ve yeni ilan yayınlama formunu barındıran responsive HTML sayfasını döner (JobPostingController)."
 *     tags:
 *       - Job Postings (Web View)
 *     responses:
 *       200:
 *         description: "Başarılı HTML sayfası"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *   post:
 *     summary: "Yeni İş İlanı Yayınla (Web Form)"
 *     description: "HTML formundan gelen verilerle yeni iş ilanı ekler ve iş ilanları sayfasına yönlendirir (JobPostingController)."
 *     tags:
 *       - Job Postings (Web View)
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Kıdemli Full Stack Geliştirici"
 *               company:
 *                 type: string
 *                 example: "Trendyol Tech"
 *               location:
 *                 type: string
 *                 example: "İstanbul / Hibrit"
 *               employmentType:
 *                 type: string
 *                 example: "full-time"
 *               description:
 *                 type: string
 *                 example: "E-ticaret platformumuz için deneyimli mühendis arıyoruz."
 *               requirements:
 *                 type: string
 *                 example: "Node.js, PostgreSQL ve Docker tecrübesi."
 *               contactEmail:
 *                 type: string
 *                 example: "kariyer@trendyol.com"
 *               applicationUrl:
 *                 type: string
 *                 example: "https://trendyol.com/kariyer"
 *               salaryRange:
 *                 type: string
 *                 example: "90.000 - 130.000 TL"
 *               deadline:
 *                 type: string
 *                 example: "2026-12-31"
 *               postedBy:
 *                 type: integer
 *                 example: 1
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       302:
 *         description: "İş ilanı başarıyla eklendi ve /job-postings sayfasına yönlendirildi"
 *       400:
 *         description: "Zorunlu alanlar eksik"
 */
router.get('/', jobPostingController.getJobPostings);
router.post('/', jobPostingController.createJobPosting);

/**
 * @swagger
 * /job-postings/{id}/edit:
 *   get:
 *     summary: "İş İlanı Düzenleme Formu Web Sayfası"
 *     description: "Belirtilen ID'ye sahip iş ilanının önceden doldurulmuş düzenleme formunu döner (JobPostingController)."
 *     tags:
 *       - Job Postings (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Düzenlenecek ilan ID'si"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Başarılı düzenleme HTML formu"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "İş ilanı bulunamadı"
 */
router.get('/:id/edit', jobPostingController.getEditJobPostingForm);

/**
 * @swagger
 * /job-postings/{id}/update:
 *   post:
 *     summary: "İş İlanını Güncelle (Web Form)"
 *     description: "Düzenleme formundan gelen verileri günceller ve /job-postings sayfasına yönlendirir (JobPostingController)."
 *     tags:
 *       - Job Postings (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Güncellenecek ilan ID'si"
 *         example: 1
 *     responses:
 *       302:
 *         description: "İlan güncellendi ve /job-postings sayfasına yönlendirildi"
 *       404:
 *         description: "İş ilanı bulunamadı"
 */
router.post('/:id/update', jobPostingController.updateJobPostingForm);

/**
 * @swagger
 * /job-postings/{id}/delete:
 *   post:
 *     summary: "İş İlanını Sil (Web Form)"
 *     description: "Belirtilen ID'ye sahip iş ilanını siler ve /job-postings sayfasına yönlendirir (JobPostingController)."
 *     tags:
 *       - Job Postings (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Silinecek ilan ID'si"
 *         example: 1
 *     responses:
 *       302:
 *         description: "İlan silindi ve /job-postings sayfasına yönlendirildi"
 *       404:
 *         description: "İş ilanı bulunamadı"
 */
router.post('/:id/delete', jobPostingController.deleteJobPostingForm);

/**
 * @swagger
 * /job-postings/{id}:
 *   get:
 *     summary: "İş İlanı Detay Web Sayfası"
 *     description: "Belirtilen ID'ye sahip iş ilanının ve ilana yapılan başvuruların detay sayfasını döner (JobPostingController)."
 *     tags:
 *       - Job Postings (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "İlan ID'si"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Başarılı HTML sayfası"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "İş ilanı bulunamadı"
 */
router.get('/:id', jobPostingController.getJobPostingById);

module.exports = router;
