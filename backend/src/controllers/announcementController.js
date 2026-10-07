const AnnouncementModel = require('../models/announcementModel');
const announcementView = require('../views/announcementView');

/**
 * AnnouncementController
 * 
 * Sorumluluk: Web / MVC Controller Katmanı
 * İstekleri karşılar, AnnouncementModel üzerinden veri operasyonlarını yürütür
 * ve announcementView (Görünüm katmanı) üzerinden HTML sayfalarını render ederek istemciye sunar.
 */

// GET /announcements - Duyurular listesini ve oluşturma formunu içeren HTML sayfası
const getAnnouncements = (req, res) => {
  const announcements = AnnouncementModel.findAll();

  // Tarayıcıdan HTML isteği geldiyse View katmanından HTML render et
  if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
    let success = null;
    if (req.query && req.query.created) {
      success = 'Yeni duyuru başarıyla yayınlandı!';
    } else if (req.query && req.query.updated) {
      success = 'Duyuru başarıyla güncellendi!';
    } else if (req.query && req.query.deleted) {
      success = 'Duyuru başarıyla silindi!';
    }

    const error = req.query && req.query.error ? req.query.error : null;
    return res.status(200).send(announcementView.renderAnnouncementsPage(announcements, { success, error }));
  }

  // API veya JSON fallback
  return res.status(200).json(announcements);
};

// GET /announcements/:id - ID'ye göre tekil duyuru detay sayfası
const getAnnouncementById = (req, res) => {
  const announcement = AnnouncementModel.findById(req.params.id);

  if (!announcement) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(404).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
    return res.status(200).send(announcementView.renderAnnouncementDetailPage(announcement));
  }

  return res.status(200).json(announcement);
};

// GET /announcements/:id/edit - Seçilen duyurunun önceden doldurulmuş düzenleme formu
const getEditAnnouncementForm = (req, res) => {
  const announcement = AnnouncementModel.findById(req.params.id);

  if (!announcement) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(404).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  const error = req.query && req.query.error ? req.query.error : null;
  return res.status(200).send(announcementView.renderEditAnnouncementPage(announcement, { error }));
};

// POST /announcements - Yeni duyuru oluşturur (HTML form veya API)
const createAnnouncement = (req, res) => {
  const { title, content, category, author, date } = req.body || {};

  // Zorunlu alan kontrolü
  if (!title || !content) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/announcements?error=' + encodeURIComponent('Başlık ve içerik alanları zorunludur.'));
    }
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

  if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
    return res.redirect('/announcements?created=true');
  }

  return res.status(201).json({
    message: 'Duyuru başarıyla eklendi',
    announcement: newAnnouncement,
  });
};

// POST /announcements/:id/update - Form gönderildiğinde duyuruyu günceller ve /announcements adresine yönlendirir
const updateAnnouncementForm = (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  const announcement = AnnouncementModel.findById(announcementId);

  if (!announcement) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(404).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  const { title, content, category, author, date } = req.body || {};

  if (!title || !content) {
    return res.redirect(`/announcements/${announcementId}/edit?error=` + encodeURIComponent('Başlık ve içerik alanları zorunludur.'));
  }

  AnnouncementModel.replace(announcementId, {
    title,
    content,
    category,
    author,
    date,
  });

  if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
    return res.redirect('/announcements?updated=true');
  }

  return res.status(200).json({
    message: 'Duyuru güncellendi',
    announcement: AnnouncementModel.findById(announcementId),
  });
};

// POST /announcements/:id/delete - Duyuru kaydını siler ve /announcements adresine yönlendirir
const deleteAnnouncementForm = (req, res) => {
  const announcementId = parseInt(req.params.id, 10);
  const deletedAnnouncement = AnnouncementModel.remove(announcementId);

  if (!deletedAnnouncement) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(404).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
    }
    return res.status(404).json({ error: 'Duyuru bulunamadı' });
  }

  if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
    return res.redirect('/announcements?deleted=true');
  }

  return res.status(200).json({
    message: 'Duyuru başarıyla silindi',
    announcement: deletedAnnouncement,
  });
};

// PUT /announcements/:id - Duyuruyu tamamen günceller
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

// PATCH /announcements/:id - Duyuruyu kısmi olarak günceller
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

// DELETE /announcements/:id - Duyuruyu siler
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

const AnnouncementController = {
  getAnnouncements,
  getAnnouncementById,
  getEditAnnouncementForm,
  createAnnouncement,
  updateAnnouncementForm,
  deleteAnnouncementForm,
  updateAnnouncementPut,
  updateAnnouncementPatch,
  deleteAnnouncement,
};

module.exports = {
  ...AnnouncementController,
  AnnouncementController,
};
