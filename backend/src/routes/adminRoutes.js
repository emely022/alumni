const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /admin/assign-self:
 *   post:
 *     summary: Aktif Kullanıcıya Yönetici (Admin) Rolü Ata
 *     description: Oturum açmış kullanıcının kendi hesabına 'admin' rolü atamasını ve yönetim paneline erişmesini sağlar.
 *     tags:
 *       - Admin Panel
 *     responses:
 *       302:
 *         description: Admin rolü atandı ve /admin paneline yönlendirildi
 *       200:
 *         description: Başarılı JSON yanıtı
 */
router.post('/assign-self', authMiddleware, adminController.assignAdminToSelf);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Merkezi Sistem Yönetim Paneli (Admin Dashboard)
 *     description: Yalnızca 'admin' rolüne sahip kullanıcıların erişebildiği; kullanıcılar, roller, bölümler, duyurular, iş ilanları ve başvurular üzerinde tam veri manipülasyonu sağlayan yönetim paneli.
 *     tags:
 *       - Admin Panel
 *     responses:
 *       200:
 *         description: Başarılı HTML yönetim paneli
 *       401:
 *         description: Giriş yapılmamış (/login yönlendirmesi)
 *       403:
 *         description: Yönetici (admin) yetkisi yok
 */
router.get('/', requireAdmin, adminController.getAdminDashboard);

// Kullanıcı ve Rol (RBAC) Manipülasyonu
router.post('/users/create', requireAdmin, adminController.createUserAsAdmin);
router.post('/users/:id/role', requireAdmin, adminController.updateUserRoleAndStatus);
router.post('/users/:id/delete', requireAdmin, adminController.deleteUserAsAdmin);

// Akademik Bölümler (Departments) Manipülasyonu
router.post('/departments/create', requireAdmin, adminController.createDepartmentAsAdmin);
router.post('/departments/:id/update', requireAdmin, adminController.updateDepartmentAsAdmin);
router.post('/departments/:id/delete', requireAdmin, adminController.deleteDepartmentAsAdmin);

// Kurumsal Duyurular (Announcements) Manipülasyonu
router.post('/announcements/create', requireAdmin, adminController.createAnnouncementAsAdmin);
router.post('/announcements/:id/delete', requireAdmin, adminController.deleteAnnouncementAsAdmin);

// İş İlanları (Job Postings) Manipülasyonu
router.post('/job-postings/:id/toggle', requireAdmin, adminController.toggleJobPostingAsAdmin);
router.post('/job-postings/:id/delete', requireAdmin, adminController.deleteJobPostingAsAdmin);

// İş Başvuruları (Applications) Manipülasyonu
router.post('/applications/:id/status', requireAdmin, adminController.updateApplicationStatusAsAdmin);
router.post('/applications/:id/delete', requireAdmin, adminController.deleteApplicationAsAdmin);

module.exports = router;
