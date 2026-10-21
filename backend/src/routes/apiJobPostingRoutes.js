const express = require('express');
const router = express.Router();
const apiJobPostingController = require('../controllers/apiJobPostingController');

/**
 * @swagger
 * /api/job-postings:
 *   get:
 *     summary: Tüm İş İlanlarını Listele
 *     description: "Sistemdeki iş ilanlarını listeler (Filtreler: ?isActive=true&departmentId=1)."
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Sadece aktif ilanları filtrele
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         description: Bölüme göre filtrele
 *     responses:
 *       200:
 *         description: İş ilanları listesi
 *   post:
 *     summary: Yeni İş İlanı Ekle
 *     tags:
 *       - Job Postings (REST API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *                 enum: [full-time, part-time, internship, contract, remote]
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               applicationUrl:
 *                 type: string
 *               salaryRange:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               postedBy:
 *                 type: integer
 *               departmentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: İş ilanı başarıyla oluşturuldu
 */
router.get('/', apiJobPostingController.getJobPostings);
router.post('/', apiJobPostingController.createJobPosting);

/**
 * @swagger
 * /api/job-postings/{id}:
 *   get:
 *     summary: ID'ye Göre İş İlanı Getir
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İş ilanı detayı
 *       404:
 *         description: İş ilanı bulunamadı
 *   put:
 *     summary: İş İlanını Tamamen Güncelle (PUT)
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İş ilanı güncellendi
 *   patch:
 *     summary: İş İlanını Kısmi Güncelle (PATCH)
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İş ilanı güncellendi
 *   delete:
 *     summary: İş İlanını Sil
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İş ilanı silindi
 */
router.get('/:id', apiJobPostingController.getJobPostingById);
router.put('/:id', apiJobPostingController.updateJobPostingPut);
router.patch('/:id', apiJobPostingController.updateJobPostingPatch);
router.delete('/:id', apiJobPostingController.deleteJobPosting);

/**
 * @swagger
 * /api/job-postings/{id}/poster:
 *   get:
 *     summary: İlanı Yayınlayan Mezun/Yetkiliyi Getir (Nested)
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İlanı oluşturan kullanıcı bilgisi
 */
router.get('/:id/poster', apiJobPostingController.getJobPostingPoster);

/**
 * @swagger
 * /api/job-postings/{id}/department:
 *   get:
 *     summary: İlanın Hedeflendiği Bölümü Getir (Nested)
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İlanın hedef bölümü
 */
router.get('/:id/department', apiJobPostingController.getJobPostingDepartment);

/**
 * @swagger
 * /api/job-postings/{id}/applications:
 *   get:
 *     summary: İlana Yapılan Başvuruları Listele (Nested - 1:N)
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: İlana ait başvurular
 *       404:
 *         description: İlan bulunamadı
 *   post:
 *     summary: İlana Başvuru Yap (Nested Create)
 *     tags:
 *       - Job Postings (REST API)
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
 *               resumeUrl:
 *                 type: string
 *               coverNote:
 *                 type: string
 *     responses:
 *       201:
 *         description: Başvuru oluşturuldu
 *       400:
 *         description: Mükerrer veya geçersiz başvuru
 */
router.get('/:id/applications', apiJobPostingController.getJobPostingApplications);
router.post('/:id/applications', apiJobPostingController.applyToJobPosting);

/**
 * @swagger
 * /api/job-postings/{id}/applicants:
 *   get:
 *     summary: İlana Başvuran Mezunları Listele (Nested - N:N)
 *     tags:
 *       - Job Postings (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başvuran aday mezunlar listesi
 *       404:
 *         description: İlan bulunamadı
 */
router.get('/:id/applicants', apiJobPostingController.getJobPostingApplicants);

module.exports = router;
