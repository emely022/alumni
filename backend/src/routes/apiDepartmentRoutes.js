const express = require('express');
const router = express.Router();
const apiDepartmentController = require('../controllers/apiDepartmentController');

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Tüm Bölümleri Listele
 *     description: Sistemdeki tüm akademik bölümleri JSON formatında listeler.
 *     tags:
 *       - Departments (REST API)
 *     responses:
 *       200:
 *         description: Bölüm listesi
 *   post:
 *     summary: Yeni Bölüm Ekle
 *     description: Sisteme yeni bir akademik bölüm ekler.
 *     tags:
 *       - Departments (REST API)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - faculty
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bilgisayar Mühendisliği
 *               code:
 *                 type: string
 *                 example: CENG
 *               faculty:
 *                 type: string
 *                 example: Mühendislik Fakültesi
 *     responses:
 *       201:
 *         description: Bölüm başarıyla oluşturuldu
 *       400:
 *         description: Eksik alanlar veya mükerrer kayıt
 */
router.get('/', apiDepartmentController.getDepartments);
router.post('/', apiDepartmentController.createDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: ID'ye Göre Bölüm Getir
 *     tags:
 *       - Departments (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bölüm detayı
 *       404:
 *         description: Bölüm bulunamadı
 *   put:
 *     summary: Bölümü Tamamen Güncelle (PUT)
 *     tags:
 *       - Departments (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bölüm güncellendi
 *       404:
 *         description: Bölüm bulunamadı
 *   patch:
 *     summary: Bölümü Kısmi Güncelle (PATCH)
 *     tags:
 *       - Departments (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bölüm güncellendi
 *       404:
 *         description: Bölüm bulunamadı
 *   delete:
 *     summary: Bölümü Sil
 *     tags:
 *       - Departments (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bölüm silindi
 *       404:
 *         description: Bölüm bulunamadı
 */
router.get('/:id', apiDepartmentController.getDepartmentById);
router.put('/:id', apiDepartmentController.updateDepartmentPut);
router.patch('/:id', apiDepartmentController.updateDepartmentPatch);
router.delete('/:id', apiDepartmentController.deleteDepartment);

/**
 * @swagger
 * /api/departments/{id}/users:
 *   get:
 *     summary: Bölümün Mezunlarını Listele (Nested)
 *     description: Belirtilen bölüme kayıtlı mezunları listeler (1:N ilişki).
 *     tags:
 *       - Departments (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bölüme ait mezunlar
 *       404:
 *         description: Bölüm bulunamadı
 */
router.get('/:id/users', apiDepartmentController.getDepartmentUsers);

/**
 * @swagger
 * /api/departments/{id}/job-postings:
 *   get:
 *     summary: Bölüm İçin Hedeflenmiş İş İlanlarını Listele (Nested)
 *     description: Belirtilen bölüm mezunlarına yönelik iş ilanlarını listeler (1:N ilişki).
 *     tags:
 *       - Departments (REST API)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bölüme ait iş ilanları
 *       404:
 *         description: Bölüm bulunamadı
 */
router.get('/:id/job-postings', apiDepartmentController.getDepartmentJobPostings);

module.exports = router;
