const AnnouncementModel = require('../models/announcementModel');

/**
 * ApiAnnouncementController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı
 * Postman, mobil uygulamalar ve frontend SPA istemcileri için
 * saf JSON duyuru veri transferi, HTTP durum kodları ve parametre doğrulamalarını yönetir.
 */

// GET /api/announcements - Tüm duyuruları JSON formatında listeler
const getAnnouncements = (req, res) => {
  const announcements = AnnouncementModel.findAll();
  return res.status(200).json(announcements);
};

// GET /api/announcements/:id - ID'ye göre tekil duyuru detayını JSON formatında döner
const getAnnouncementById = (req, res) => {
  const announcement = AnnouncementModel.findById(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }
  return res.status(200).json(announcement);
};

// POST /api/announcements - Yeni duyuru ekler (JSON)
const createAnnouncement = (req, res) => {
  const { title, content, category, author, date } = req.body || {};

  if (!title || !content) {
    return res.status(400).json({
      error: 'title ve content alanları zorunludur.',
    });
  }

  const newAnnouncement = AnnouncementModel.create({
    title,
    content,
    category,
    author,
    date,
  });

  return res.status(201).json({
    message: 'Duyuru başarıyla eklendi',
    announcement: newAnnouncement,
  });
};

// PUT /api/announcements/:id - Duyuruyu tamamen değiştirir (PUT)
const updateAnnouncementPut = (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  const announcement = AnnouncementModel.findById(announcementId);

  if (!announcement) {
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  const { title, content, category, author, date } = req.body || {};

  if (!title || !content) {
    return res.status(400).json({
      error: 'PUT isteğinde title ve content alanları zorunludur.',
    });
  }

  const updatedAnnouncement = AnnouncementModel.replace(announcementId, {
    title,
    content,
    category,
    author,
    date,
  });

  return res.status(200).json({
    message: 'Duyuru güncellendi',
    announcement: updatedAnnouncement,
  });
};

// PATCH /api/announcements/:id - Duyuruyu kısmi olarak günceller (PATCH)
const updateAnnouncementPatch = (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  const announcement = AnnouncementModel.findById(announcementId);

  if (!announcement) {
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  const { title, content, category, author, date } = req.body || {};

  const updatedAnnouncement = AnnouncementModel.update(announcementId, {
    title,
    content,
    category,
    author,
    date,
  });

  return res.status(200).json({
    message: 'Duyuru güncellendi',
    announcement: updatedAnnouncement,
  });
};

// DELETE /api/announcements/:id - Duyuruyu siler (JSON)
const deleteAnnouncement = (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  const deletedAnnouncement = AnnouncementModel.remove(announcementId);

  if (!deletedAnnouncement) {
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  return res.status(200).json({
    message: 'Duyuru başarıyla silindi',
    announcement: deletedAnnouncement,
  });
};

const ApiAnnouncementController = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncementPut,
  updateAnnouncementPatch,
  deleteAnnouncement,
};

module.exports = {
  ...ApiAnnouncementController,
  ApiAnnouncementController,
};
