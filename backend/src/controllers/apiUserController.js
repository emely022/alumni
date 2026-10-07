const UserModel = require('../models/userModel');

/**
 * ApiUserController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı
 * Postman, mobil uygulamalar ve frontend SPA istemcileri için
 * saf JSON veri transferi, HTTP durum kodları ve parametre doğrulamalarını yönetir.
 */

// GET /api/users - Tüm kullanıcıları JSON formatında listeler
const getUsers = (req, res) => {
  const users = UserModel.findAll();
  return res.status(200).json(users);
};

// GET /api/users/:id - ID'ye göre tekil kullanıcı detayını JSON formatında döner
const getUserById = (req, res) => {
  const user = UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }
  return res.status(200).json(user);
};

// POST /api/users - Yeni kullanıcı ekler (JSON)
const createUser = (req, res) => {
  const { name, email, department, graduationYear } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      error: 'name ve email alanları zorunludur.',
    });
  }

  const newUser = UserModel.create({
    name,
    email,
    department,
    graduationYear,
  });

  return res.status(201).json({
    message: 'Kullanıcı başarıyla eklendi',
    user: newUser,
  });
};

// PUT /api/users/:id - Kullanıcıyı tamamen değiştirir (Tüm alanlar zorunlu)
const updateUserPut = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = UserModel.findById(userId);

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

  const updatedUser = UserModel.replace(userId, {
    name,
    email,
    department,
    graduationYear,
  });

  return res.status(200).json({
    message: 'Kullanıcı güncellendi',
    user: updatedUser,
  });
};

// PATCH /api/users/:id - Kullanıcıyı kısmi olarak günceller (Sadece gönderilen alanlar değişir)
const updateUserPatch = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const { name, email, department, graduationYear } = req.body || {};

  const updatedUser = UserModel.update(userId, {
    name,
    email,
    department,
    graduationYear,
  });

  return res.status(200).json({
    message: 'Kullanıcı güncellendi',
    user: updatedUser,
  });
};

// DELETE /api/users/:id - Kullanıcıyı siler (JSON)
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const deletedUser = UserModel.remove(userId);

  if (!deletedUser) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  return res.status(200).json({
    message: 'Kullanıcı başarıyla silindi',
    user: deletedUser,
  });
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
