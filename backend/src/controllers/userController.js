const UserModel = require('../models/userModel');
const userView = require('../views/userView');

/**
 * UserController
 * 
 * Sorumluluk: Web / MVC Controller Katmanı
 * İstekleri karşılar, UserModel üzerinden veri operasyonlarını yürütür
 * ve userView (Görünüm katmanı) üzerinden HTML sayfalarını render ederek istemciye sunar.
 */

// GET /users - Mezunlar listesini ve oluşturma formunu içeren HTML sayfası
const getUsers = (req, res) => {
  const users = UserModel.findAll();

  // Tarayıcıdan HTML isteği geldiyse View katmanından HTML render et
  if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
    let success = null;
    if (req.query && req.query.created) {
      success = 'Yeni mezun başarıyla sisteme eklendi!';
    } else if (req.query && req.query.updated) {
      success = 'Mezun bilgileri başarıyla güncellendi!';
    } else if (req.query && req.query.deleted) {
      success = 'Mezun kaydı başarıyla silindi!';
    }

    const error = req.query && req.query.error ? req.query.error : null;
    return res.status(200).send(userView.renderUsersPage(users, { success, error }));
  }

  // API veya JSON fallback
  return res.status(200).json(users);
};

// GET /users/:id - ID'ye göre tekil mezun profil sayfası
const getUserById = (req, res) => {
  const user = UserModel.findById(req.params.id);

  if (!user) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
    return res.status(200).send(userView.renderUserProfilePage(user));
  }

  return res.status(200).json(user);
};

// GET /users/:id/edit - Seçilen mezunun bilgilerini önceden doldurulmuş düzenleme formuyla gösterir
const getEditUserForm = (req, res) => {
  const user = UserModel.findById(req.params.id);

  if (!user) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const error = req.query && req.query.error ? req.query.error : null;
  return res.status(200).send(userView.renderEditUserPage(user, { error }));
};

// POST /users - Yeni mezun oluşturur (HTML form veya API)
const createUser = (req, res) => {
  const { name, email, department, graduationYear } = req.body || {};

  // Zorunlu alan kontrolü
  if (!name || !email) {
    // HTML form isteği ise hata ile tekrar listeye yönlendir
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/users?error=' + encodeURIComponent('İsim ve e-posta alanları zorunludur.'));
    }
    return res.status(400).json({
      error: 'name ve email alanları zorunludur.',
    });
  }

  // Model katmanına yeni kullanıcı ekle
  const newUser = UserModel.create({
    name,
    email,
    department,
    graduationYear,
  });

  // HTML form gönderimi ise başarıyla listeye yönlendir
  if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
    return res.redirect('/users?created=true');
  }

  // JSON isteği ise 201 JSON dön
  return res.status(201).json({
    message: 'Kullanıcı başarıyla eklendi',
    user: newUser,
  });
};

// POST /users/:id/update - Form gönderildiğinde mezun bilgilerini günceller ve /users adresine yönlendirir
const updateUserForm = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = UserModel.findById(userId);

  if (!user) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const { name, email, department, graduationYear } = req.body || {};

  if (!name || !email) {
    return res.redirect(`/users/${userId}/edit?error=` + encodeURIComponent('İsim ve e-posta alanları zorunludur.'));
  }

  UserModel.replace(userId, {
    name,
    email,
    department,
    graduationYear,
  });

  if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
    return res.redirect('/users?updated=true');
  }

  return res.status(200).json({
    message: 'Kullanıcı güncellendi',
    user: UserModel.findById(userId),
  });
};

// POST /users/:id/delete - Mezun kaydını siler ve /users adresine yönlendirir
const deleteUserForm = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const deletedUser = UserModel.remove(userId);

  if (!deletedUser) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
    return res.redirect('/users?deleted=true');
  }

  return res.status(200).json({
    message: 'Kullanıcı başarıyla silindi',
    user: deletedUser,
  });
};

// PUT /users/:id - Kullanıcıyı tamamen günceller (Geriye dönük uyumluluk)
const updateUserPut = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const { name, email, department, graduationYear } = req.body || {};

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

// PATCH /users/:id - Kullanıcıyı kısmi olarak günceller (Geriye dönük uyumluluk)
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

// DELETE /users/:id - Kullanıcıyı siler (Geriye dönük uyumluluk)
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

const UserController = {
  getUsers,
  getUserById,
  getEditUserForm,
  createUser,
  updateUserForm,
  deleteUserForm,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};

module.exports = {
  ...UserController,
  UserController,
};
