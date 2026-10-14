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
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.findAll();

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
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(announcementView.renderAnnouncementsPage([], { error: 'Duyurular listesi alınırken veritabanı hatası oluştu.' }));
    }
    return res.status(500).json({ error: 'Duyurular alınırken hata oluştu.' });
  }
};

// GET /announcements/:id - ID'ye göre tekil duyuru detay sayfası
const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);

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
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'Duyuru detayı alınırken hata oluştu.' });
  }
};

// GET /announcements/:id/edit - Seçilen duyurunun önceden doldurulmuş düzenleme formu
const getEditAnnouncementForm = async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);

    if (!announcement) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Duyuru bulunamadı' });
    }

    const error = req.query && req.query.error ? req.query.error : null;
    return res.status(200).send(announcementView.renderEditAnnouncementPage(announcement, { error }));
  } catch (err) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(500).send(announcementView.renderAnnouncementNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'Duyuru düzenleme formu yüklenirken hata oluştu.' });
  }
};

// POST /announcements - Yeni duyuru oluşturur (HTML form veya API)
const createAnnouncement = async (req, res) => {
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

  try {
    const newAnnouncement = await AnnouncementModel.create({
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
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/announcements?error=' + encodeURIComponent('Duyuru eklenirken hata oluştu.'));
    }
    return res.status(500).json({ error: 'Duyuru eklenirken hata oluştu.' });
  }
};

// POST /announcements/:id/update - Form gönderildiğinde duyuruyu günceller ve /announcements adresine yönlendirir
const updateAnnouncementForm = async (req, res) => {
  const announcementId = parseInt(req.params.id, 10);

  try {
    const announcement = await AnnouncementModel.findById(announcementId);

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

    const updatedAnnouncement = await AnnouncementModel.replace(announcementId, {
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
      announcement: updatedAnnouncement,
    });
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect(`/announcements/${announcementId}/edit?error=` + encodeURIComponent('Duyuru güncellenirken hata oluştu.'));
    }
    return res.status(500).json({ error: 'Duyuru güncellenirken hata oluştu.' });
  }
};

// POST /announcements/:id/delete - Duyuru kaydını siler ve /announcements adresine yönlendirir
const deleteAnnouncementForm = async (req, res) => {
  const announcementId = parseInt(req.params.id, 10);

  try {
    const deletedAnnouncement = await AnnouncementModel.remove(announcementId);

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
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/announcements?error=' + encodeURIComponent('Duyuru silinirken hata oluştu.'));
    }
    return res.status(500).json({ error: 'Duyuru silinirken hata oluştu.' });
  }
};

// PUT /announcements/:id - Duyuruyu tamamen günceller
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

// PATCH /announcements/:id - Duyuruyu kısmi olarak günceller
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

// DELETE /announcements/:id - Duyuruyu siler
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
