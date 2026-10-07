const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mezunlar Listesi Web Sayfası
 *     description: Sistemde kayıtlı tüm mezunları listeleyen ve yeni mezun ekleme formunu barındıran responsive HTML sayfasını döner (UserController).
 *     tags:
 *       - Users (Web View)
 *     responses:
 *       200:
 *         description: Başarılı HTML sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *   post:
 *     summary: Yeni Mezun Oluştur (Web Form)
 *     description: HTML formundan gelen verilerle yeni mezun ekler ve mezunlar listesine yönlendirir (UserController).
 *     tags:
 *       - Users (Web View)
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Zeynep Çelik
 *               email:
 *                 type: string
 *                 example: zeynep@alumni.edu
 *               department:
 *                 type: string
 *                 example: Bilgisayar Mühendisliği
 *               graduationYear:
 *                 type: integer
 *                 example: 2024
 *     responses:
 *       302:
 *         description: Kullanıcı başarıyla eklendi ve /users sayfasına yönlendirildi
 *       400:
 *         description: İsim veya e-posta eksik
 */
router.get('/', userController.getUsers);
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/{id}/edit:
 *   get:
 *     summary: Mezun Düzenleme Formu Web Sayfası
 *     description: Belirtilen ID'ye sahip mezunun bilgilerini önceden doldurulmuş düzenleme formuyla döner (UserController).
 *     tags:
 *       - Users (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Düzenlenecek mezunun ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Başarılı düzenleme HTML formu
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Mezun bulunamadı
 */
router.get('/:id/edit', userController.getEditUserForm);

/**
 * @swagger
 * /users/{id}/update:
 *   post:
 *     summary: Mezun Bilgilerini Güncelle (Web Form)
 *     description: Düzenleme formundan gelen verileri günceller ve /users sayfasına yönlendirir (UserController).
 *     tags:
 *       - Users (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek mezunun ID'si
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmet Yılmaz Güncel
 *               email:
 *                 type: string
 *                 example: ahmet.guncel@alumni.edu
 *               department:
 *                 type: string
 *                 example: Bilgisayar Mühendisliği
 *               graduationYear:
 *                 type: integer
 *                 example: 2023
 *     responses:
 *       302:
 *         description: Kullanıcı güncellendi ve /users sayfasına yönlendirildi
 *       404:
 *         description: Mezun bulunamadı
 */
router.post('/:id/update', userController.updateUserForm);

/**
 * @swagger
 * /users/{id}/delete:
 *   post:
 *     summary: Mezun Kaydını Sil (Web Form)
 *     description: Belirtilen ID'ye sahip mezun kaydını siler ve /users sayfasına yönlendirir (UserController).
 *     tags:
 *       - Users (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek mezunun ID'si
 *         example: 1
 *     responses:
 *       302:
 *         description: Kullanıcı silindi ve /users sayfasına yönlendirildi
 *       404:
 *         description: Mezun bulunamadı
 */
router.post('/:id/delete', userController.deleteUserForm);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Mezun Profili Web Sayfası
 *     description: Belirtilen ID'ye sahip mezunun detaylı profil HTML sayfasını döner (UserController).
 *     tags:
 *       - Users (Web View)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kullanıcı ID'si
 *         example: 1
 *     responses:
 *       200:
 *         description: Başarılı HTML sayfası
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/:id', userController.getUserById);

module.exports = router;
