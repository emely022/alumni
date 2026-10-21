const AnnouncementModel = require('../models/announcementModel');

/**
 * ApiAnnouncementController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı
 * Postman, mobil uygulamalar ve frontend SPA istemcileri için
 * saf JSON duyuru veri transferi, HTTP durum kodları ve parametre doğrulamalarını yönetir.
 */

// GET /api/announcements - Tüm duyuruları JSON formatında listeler
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.findAll();
    return res.status(200).json(announcements);
  } catch (err) {
    return res.status(500).json({ error: 'Duyurular alınırken hata oluştu.' });
  }
};

// GET /api/announcements/:id - ID'ye göre tekil duyuru detayını JSON formatında döner
const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }
    return res.status(200).json(announcement);
  } catch (err) {
    return res.status(500).json({ error: 'Duyuru detayı alınırken hata oluştu.' });
  }
};

// POST /api/announcements - Yeni duyuru ekler (JSON)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, author, date } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({
        error: 'title ve content alanları zorunludur.',
      });
    }

    const newAnnouncement = await AnnouncementModel.create({
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
  } catch (err) {
    return res.status(500).json({ error: 'Duyuru eklenirken hata oluştu.' });
  }
};

// PUT /api/announcements/:id - Duyuruyu tamamen değiştirir (PUT)
const updateAnnouncementPut = async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id, 10);
    const announcement = await AnnouncementModel.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    const { title, content, category, author, date } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({
        error: 'PUT isteğinde title ve content alanları zorunludur.',
      });
    }

    const updatedAnnouncement = await AnnouncementModel.replace(announcementId, {
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
  } catch (err) {
    return res.status(500).json({ error: 'Duyuru güncellenirken hata oluştu.' });
  }
};

// PATCH /api/announcements/:id - Duyuruyu kısmi olarak günceller (PATCH)
const updateAnnouncementPatch = async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id, 10);
    const announcement = await AnnouncementModel.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    const { title, content, category, author, date } = req.body || {};

    const updatedAnnouncement = await AnnouncementModel.update(announcementId, {
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
  } catch (err) {
    return res.status(500).json({ error: 'Duyuru güncellenirken hata oluştu.' });
  }
};

// DELETE /api/announcements/:id - Duyuruyu siler (JSON)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id, 10);
    const deletedAnnouncement = await AnnouncementModel.remove(announcementId);

    if (!deletedAnnouncement) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    return res.status(200).json({
      message: 'Duyuru başarıyla silindi',
      announcement: deletedAnnouncement,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Duyuru silinirken hata oluştu.' });
  }
};

// =========================================================================
// İÇ İÇE (NESTED) İLİŞKİ ENDPOINT'LERİ
// =========================================================================

// GET /api/announcements/:id/author - Duyuruyu yayınlayan mezun/yetkili bilgisini döner (N:1)
const getAnnouncementAuthor = async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id, 10);
    const announcement = await AnnouncementModel.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    const author = await AnnouncementModel.getAuthor(announcementId);
    if (!author) {
      return res.status(404).json({ error: 'Bu duyuru için sistemde kayıtlı bir yazar kullanıcısı bulunamadı' });
    }

    return res.status(200).json(author);
  } catch (err) {
    return res.status(500).json({ error: 'Duyuru yazarı alınırken hata oluştu.' });
  }
};

const ApiAnnouncementController = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncementPut,
  updateAnnouncementPatch,
  deleteAnnouncement,
  // Nested
  getAnnouncementAuthor,
};

module.exports = {
  ...ApiAnnouncementController,
  ApiAnnouncementController,
};
