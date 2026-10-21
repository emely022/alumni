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

// =========================================================================
// İÇ İÇE (NESTED) İLİŞKİ ENDPOINT'LERİ
// =========================================================================

// GET /api/users/:id/department - Kullanıcının bağlı olduğu akademik bölümü döner (N:1)
const getUserDepartment = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const department = await UserModel.getDepartment(userId);
    if (!department) {
      return res.status(404).json({ error: 'Bu kullanıcı için tanımlı bir akademik bölüm bulunamadı' });
    }

    return res.status(200).json(department);
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı bölüm bilgisi alınırken hata oluştu.' });
  }
};

// GET /api/users/:id/announcements - Kullanıcının yayınladığı duyuruları döner (1:N)
const getUserAnnouncements = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const announcements = await UserModel.getAnnouncements(userId);
    return res.status(200).json({
      userId,
      userName: user.name,
      totalAnnouncements: announcements.length,
      announcements,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı duyuruları alınırken hata oluştu.' });
  }
};

// GET /api/users/:id/events - Kullanıcının organize ettiği etkinlikleri döner (1:N)
const getUserOrganizedEvents = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const events = await UserModel.getOrganizedEvents(userId);
    return res.status(200).json({
      userId,
      userName: user.name,
      totalOrganizedEvents: events.length,
      events,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Organize edilen etkinlikler alınırken hata oluştu.' });
  }
};

// GET /api/users/:id/registered-events - Kullanıcının kayıt olduğu etkinlikleri döner (N:N)
const getUserRegisteredEvents = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const events = await UserModel.getRegisteredEvents(userId);
    return res.status(200).json({
      userId,
      userName: user.name,
      totalRegisteredEvents: events.length,
      events,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kayıt olunan etkinlikler alınırken hata oluştu.' });
  }
};

// GET /api/users/:id/job-postings - Kullanıcının yayınladığı iş ilanlarını döner (1:N)
const getUserJobPostings = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const jobPostings = await UserModel.getJobPostings(userId);
    return res.status(200).json({
      userId,
      userName: user.name,
      totalJobPostings: jobPostings.length,
      jobPostings,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı iş ilanları alınırken hata oluştu.' });
  }
};

// GET /api/users/:id/applications - Kullanıcının yaptığı iş başvurularını döner (1:N)
const getUserApplications = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const applications = await UserModel.getApplications(userId);
    return res.status(200).json({
      userId,
      userName: user.name,
      totalApplications: applications.length,
      applications,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı başvuruları alınırken hata oluştu.' });
  }
};

// GET /api/users/:id/applied-jobs - Kullanıcının başvurduğu iş ilanlarını döner (N:N)
const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const appliedJobs = await UserModel.getAppliedJobs(userId);
    return res.status(200).json({
      userId,
      userName: user.name,
      totalAppliedJobs: appliedJobs.length,
      appliedJobs,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Başvurulan iş ilanları alınırken hata oluştu.' });
  }
};

const ApiUserController = {
  getUsers,
  getUserById,
  createUser,
  updateUserPut,
  updateUserPatch,
  deleteUser,
  // Nested
  getUserDepartment,
  getUserAnnouncements,
  getUserOrganizedEvents,
  getUserRegisteredEvents,
  getUserJobPostings,
  getUserApplications,
  getUserAppliedJobs,
};

module.exports = {
  ...ApiUserController,
  ApiUserController,
};
