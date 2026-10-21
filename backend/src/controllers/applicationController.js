const ApplicationModel = require('../models/applicationModel');
const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');
const applicationView = require('../views/applicationView');

/**
 * ApplicationController (Web / MVC Katmanı)
 * 
 * Sorumluluk: /applications altındaki web isteklerini karşılar,
 * PostgreSQL ApplicationModel üzerinden veri operasyonlarını yürütür
 * ve applicationView üzerinden HTML sayfalarını render ederek sunar.
 */

// GET /applications - İş başvuruları listesi ve yeni başvuru formu
const getApplications = async (req, res) => {
  try {
    const rawApplications = await ApplicationModel.findAll();
    let jobPostings = [];
    let users = [];

    try {
      jobPostings = await JobPostingModel.findAll();
      users = await UserModel.findAll();
    } catch (e) {
      jobPostings = [];
      users = [];
    }

    // Tablo görünümünü zenginleştirmek için iş ilanı ve kullanıcı bilgilerini eşleştir
    const jobMap = {};
    jobPostings.forEach((j) => {
      jobMap[j.id] = j;
    });

    const userMap = {};
    users.forEach((u) => {
      userMap[u.id] = u;
    });

    const enrichedApplications = rawApplications.map((app) => {
      const job = jobMap[app.jobPostingId];
      const user = userMap[app.userId];
      return {
        ...app,
        jobTitle: job ? job.title : null,
        company: job ? job.company : null,
        userName: user ? user.name : null,
        userEmail: user ? user.email : null,
      };
    });

    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      let success = null;
      if (req.query && req.query.created) {
        success = 'İş başvurusu başarıyla kaydedildi!';
      } else if (req.query && req.query.updated) {
        success = 'Başvuru bilgileri başarıyla güncellendi!';
      } else if (req.query && req.query.deleted) {
        success = 'Başvuru kaydı başarıyla silindi!';
      }

      const error = req.query && req.query.error ? req.query.error : null;
      const selectedJobId = req.query && req.query.job_id ? req.query.job_id : null;

      return res.status(200).send(
        applicationView.renderApplicationsPage(
          enrichedApplications,
          { success, error, selectedJobId },
          { jobPostings, users }
        )
      );
    }

    return res.status(200).json(enrichedApplications);
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(
        applicationView.renderApplicationsPage(
          [],
          { error: 'Başvurular yüklenirken veritabanı hatası oluştu.' },
          { jobPostings: [], users: [] }
        )
      );
    }
    return res.status(500).json({ error: 'Başvurular alınırken hata oluştu.' });
  }
};

// GET /applications/:id - Başvuru detay sayfası
const getApplicationById = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const app = await ApplicationModel.findById(appId);

    if (!app) {
      if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
        return res.status(404).send(applicationView.renderApplicationNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    let jobPosting = null;
    let user = null;

    try {
      jobPosting = await ApplicationModel.getJobPosting(app.id);
      user = await ApplicationModel.getUser(app.id);
    } catch (e) {
      // İlişki hatası detayı engellemesin
    }

    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(200).send(
        applicationView.renderApplicationDetailPage(app, { jobPosting, user })
      );
    }

    return res.status(200).json({ application: app, jobPosting, user });
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(applicationView.renderApplicationNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'Başvuru detayı alınırken hata oluştu.' });
  }
};

// GET /applications/:id/edit - Başvuru düzenleme formu
const getEditApplicationForm = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const app = await ApplicationModel.findById(appId);

    if (!app) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(applicationView.renderApplicationNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    let jobPosting = null;
    let user = null;
    try {
      jobPosting = await ApplicationModel.getJobPosting(app.id);
      user = await ApplicationModel.getUser(app.id);
    } catch (e) {
      // Dropdown fallback
    }

    const error = req.query && req.query.error ? req.query.error : null;
    return res.status(200).send(
      applicationView.renderEditApplicationPage(app, { error }, { jobPosting, user })
    );
  } catch (err) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(500).send(applicationView.renderApplicationNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'Başvuru düzenleme formu yüklenirken hata oluştu.' });
  }
};

// POST /applications - Yeni iş başvurusu ekler
const createApplication = async (req, res) => {
  const { jobPostingId, userId, resumeUrl, coverNote, status } = req.body || {};

  if (!jobPostingId || !userId) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect(
        '/applications?error=' + encodeURIComponent('İş ilanı ve başvuran mezun seçimi zorunludur.')
      );
    }
    return res.status(400).json({ error: 'jobPostingId ve userId alanları zorunludur.' });
  }

  try {
    const parsedJobId = parseInt(jobPostingId, 10);
    const parsedUserId = parseInt(userId, 10);

    // Mükerrer başvuru kontrolü
    const existing = await ApplicationModel.findByJobAndUser(parsedJobId, parsedUserId);
    if (existing) {
      if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
        return res.redirect(
          '/applications?error=' + encodeURIComponent('Bu kullanıcı seçilen iş ilanına daha önce zaten başvurmuş.')
        );
      }
      return res.status(409).json({ error: 'Bu ilana zaten başvuru yapılmış.' });
    }

    const newApp = await ApplicationModel.create({
      jobPostingId: parsedJobId,
      userId: parsedUserId,
      resumeUrl: resumeUrl ? resumeUrl.trim() : null,
      coverNote: coverNote ? coverNote.trim() : null,
      status: status || 'pending',
    });

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/applications?created=true');
    }

    return res.status(201).json({ message: 'Başvuru kaydedildi', application: newApp });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = err.code === '23505'
      ? 'Bu kullanıcı seçilen iş ilanına zaten başvurmuş.'
      : 'Başvuru kaydedilirken veritabanı hatası oluştu.';

    if (isHtml) {
      return res.redirect('/applications?error=' + encodeURIComponent(errorMsg));
    }
    return res.status(err.code === '23505' ? 409 : 500).json({ error: errorMsg });
  }
};

// POST /applications/:id/update - Başvuru bilgilerini günceller
const updateApplicationForm = async (req, res) => {
  const appId = parseInt(req.params.id, 10);

  try {
    const app = await ApplicationModel.findById(appId);

    if (!app) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(applicationView.renderApplicationNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    const { status, resumeUrl, coverNote } = req.body || {};

    await ApplicationModel.update(appId, {
      status: status || app.status,
      resumeUrl: resumeUrl !== undefined ? resumeUrl.trim() : app.resumeUrl,
      coverNote: coverNote !== undefined ? coverNote.trim() : app.coverNote,
    });

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/applications?updated=true');
    }

    return res.status(200).json({ message: 'Başvuru güncellendi' });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = 'Başvuru güncellenirken hata oluştu.';
    if (isHtml) {
      return res.redirect(`/applications/${appId}/edit?error=` + encodeURIComponent(errorMsg));
    }
    return res.status(500).json({ error: errorMsg });
  }
};

// POST /applications/:id/delete - Başvuru kaydını siler
const deleteApplicationForm = async (req, res) => {
  const appId = parseInt(req.params.id, 10);
  try {
    const deleted = await ApplicationModel.remove(appId);

    if (!deleted) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(applicationView.renderApplicationNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/applications?deleted=true');
    }

    return res.status(200).json({ message: 'Başvuru silindi' });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = 'Başvuru silinirken hata oluştu.';
    if (isHtml) {
      return res.redirect('/applications?error=' + encodeURIComponent(errorMsg));
    }
    return res.status(500).json({ error: errorMsg });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  getEditApplicationForm,
  createApplication,
  updateApplicationForm,
  deleteApplicationForm,
};
