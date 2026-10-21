const ApplicationModel = require('../models/applicationModel');

/**
 * ApiApplicationController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı - İş Başvuruları (Applications)
 * Direkt CRUD ve ilişkisel (nested) endpoint'leri yönetir.
 */

// GET /api/applications - Tüm başvuruları listeler (Filtre: ?jobPostingId=...&userId=...&status=...)
const getApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.jobPostingId !== undefined) {
      const jId = parseInt(req.query.jobPostingId, 10);
      if (!isNaN(jId)) filter.jobPostingId = jId;
    }
    if (req.query.userId !== undefined) {
      const uId = parseInt(req.query.userId, 10);
      if (!isNaN(uId)) filter.userId = uId;
    }
    if (req.query.status !== undefined) {
      filter.status = req.query.status;
    }

    const applications = await ApplicationModel.findAll(filter);
    return res.status(200).json(applications);
  } catch (err) {
    return res.status(500).json({ error: 'Başvurular listelenirken hata oluştu.' });
  }
};

// GET /api/applications/:id - Tekil başvuru detayı
const getApplicationById = async (req, res) => {
  try {
    const application = await ApplicationModel.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }
    return res.status(200).json(application);
  } catch (err) {
    return res.status(500).json({ error: 'Başvuru detayı alınırken hata oluştu.' });
  }
};

// POST /api/applications - Yeni başvuru oluşturur
const createApplication = async (req, res) => {
  try {
    const { jobPostingId, userId, resumeUrl, coverNote, status } = req.body || {};

    if (!jobPostingId || !userId) {
      return res.status(400).json({
        error: 'jobPostingId ve userId alanları zorunludur.',
      });
    }

    // Mükerrer kontrolü
    const existing = await ApplicationModel.findByJobAndUser(jobPostingId, userId);
    if (existing) {
      return res.status(400).json({ error: 'Bu ilana zaten başvuru yaptınız.' });
    }

    const newApplication = await ApplicationModel.create({
      jobPostingId,
      userId,
      resumeUrl,
      coverNote,
      status: status || 'pending',
    });

    return res.status(201).json({
      message: 'Başvuru başarıyla oluşturuldu',
      application: newApplication,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu ilana zaten başvuru yaptınız.' });
    }
    return res.status(500).json({ error: 'Başvuru oluşturulurken hata oluştu.' });
  }
};

// PUT /api/applications/:id - Başvuruyu tamamen günceller (PUT)
const updateApplicationPut = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const application = await ApplicationModel.findById(appId);

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    const { resumeUrl, coverNote, status } = req.body || {};

    const updated = await ApplicationModel.replace(appId, {
      resumeUrl,
      coverNote,
      status: status || application.status,
    });

    return res.status(200).json({
      message: 'Başvuru güncellendi',
      application: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Başvuru güncellenirken hata oluştu.' });
  }
};

// PATCH /api/applications/:id - Başvuruyu kısmi günceller (PATCH - durum, CV, not)
const updateApplicationPatch = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const application = await ApplicationModel.findById(appId);

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    const { status, resumeUrl, coverNote } = req.body || {};

    if (status !== undefined) {
      const validStatuses = ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Geçersiz durum. İzin verilenler: ${validStatuses.join(', ')}`,
        });
      }
    }

    const updated = await ApplicationModel.update(appId, { status, resumeUrl, coverNote });

    return res.status(200).json({
      message: 'Başvuru güncellendi',
      application: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Başvuru güncellenirken hata oluştu.' });
  }
};

// DELETE /api/applications/:id - Başvuruyu siler / geri çeker
const deleteApplication = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const deleted = await ApplicationModel.remove(appId);

    if (!deleted) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    return res.status(200).json({
      message: 'Başvuru başarıyla silindi',
      application: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Başvuru silinirken hata oluştu.' });
  }
};

// =========================================================================
// İÇ İÇE (NESTED) İLİŞKİ ENDPOINT'LERİ
// =========================================================================

// GET /api/applications/:id/job-posting - Başvurunun ait olduğu iş ilanını döner (N:1)
const getApplicationJobPosting = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const application = await ApplicationModel.findById(appId);

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    const jobPosting = await ApplicationModel.getJobPosting(appId);
    if (!jobPosting) {
      return res.status(404).json({ error: 'İlişkili iş ilanı bulunamadı' });
    }

    return res.status(200).json(jobPosting);
  } catch (err) {
    return res.status(500).json({ error: 'İlişkili iş ilanı alınırken hata oluştu.' });
  }
};

// GET /api/applications/:id/user - Başvuruyu yapan mezun bilgisini döner (N:1)
const getApplicationUser = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const application = await ApplicationModel.findById(appId);

    if (!application) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    const user = await ApplicationModel.getUser(appId);
    if (!user) {
      return res.status(404).json({ error: 'İlişkili kullanıcı bulunamadı' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'İlişkili kullanıcı alınırken hata oluştu.' });
  }
};

const ApiApplicationController = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationPut,
  updateApplicationPatch,
  deleteApplication,
  // Nested
  getApplicationJobPosting,
  getApplicationUser,
};

module.exports = ApiApplicationController;
