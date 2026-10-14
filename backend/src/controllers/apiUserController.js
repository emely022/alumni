const UserModel = require('../models/userModel');

/**
 * ApiUserController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı
 * Postman, mobil uygulamalar ve frontend SPA istemcileri için
 * saf JSON veri transferi, HTTP durum kodları ve parametre doğrulamalarını yönetir.
 * Veritabanı (PostgreSQL) işlemlerini UserModel üzerinden asenkron yürütür.
 */

// GET /api/users - Tüm kullanıcıları JSON formatında listeler
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcılar alınırken hata oluştu.' });
  }
};

// GET /api/users/:id - ID'ye göre tekil kullanıcı detayını JSON formatında döner
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı detayı alınırken hata oluştu.' });
  }
};

// POST /api/users - Yeni kullanıcı ekler (JSON)
const createUser = async (req, res) => {
  try {
    const { name, email, department, graduationYear } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        error: 'name ve email alanları zorunludur.',
      });
    }

    const newUser = await UserModel.create({
      name,
      email,
      department,
      graduationYear,
    });

    return res.status(201).json({
      message: 'Kullanıcı başarıyla eklendi',
      user: newUser,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kayıtlı.' });
    }
    return res.status(500).json({ error: 'Kullanıcı eklenirken sunucu hatası oluştu.' });
  }
};

// PUT /api/users/:id - Kullanıcıyı tamamen değiştirir (Tüm alanlar zorunlu)
const updateUserPut = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const { name, email, department, graduationYear } = req.body || {};

    // PUT: Tüm alanlar zorunludur
    if (!name || !email || !department || graduationYear === undefined || graduationYear === null || graduationYear === '') {
      return res.status(400).json({
        error: 'PUT isteğinde tüm alanlar (name, email, department, graduationYear) zorunludur.',
      });
    }

    const updatedUser = await UserModel.replace(userId, {
      name,
      email,
      department,
      graduationYear,
    });

    return res.status(200).json({
      message: 'Kullanıcı güncellendi',
      user: updatedUser,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.' });
    }
    return res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu.' });
  }
};

// PATCH /api/users/:id - Kullanıcıyı kısmi olarak günceller (Sadece gönderilen alanlar değişir)
const updateUserPatch = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const { name, email, department, graduationYear } = req.body || {};

    const updatedUser = await UserModel.update(userId, {
      name,
      email,
      department,
      graduationYear,
    });

    return res.status(200).json({
      message: 'Kullanıcı güncellendi',
      user: updatedUser,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.' });
    }
    return res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu.' });
  }
};

// DELETE /api/users/:id - Kullanıcıyı siler (JSON)
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = await UserModel.remove(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    return res.status(200).json({
      message: 'Kullanıcı başarıyla silindi',
      user: deletedUser,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu.' });
  }
};

const ApiUserController = {
  getUsers,
  getUserById,
  createUser,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};

module.exports = {
  ...ApiUserController,
  ApiUserController,
};
