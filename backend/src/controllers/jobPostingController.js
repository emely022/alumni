const JobPostingModel = require('../models/jobPostingModel');
const UserModel = require('../models/userModel');
const DepartmentModel = require('../models/departmentModel');
const jobPostingView = require('../views/jobPostingView');

/**
 * JobPostingController (Web / MVC Katmanı)
 * 
 * Sorumluluk: /job-postings altındaki web isteklerini karşılar,
 * PostgreSQL JobPostingModel üzerinden veri operasyonlarını yürütür
 * ve jobPostingView üzerinden HTML sayfalarını render ederek sunar.
 */

// GET /job-postings - İş ilanları listesi ve yeni ilan ekleme formu
const getJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPostingModel.findAll();
    let users = [];
    let departments = [];

    try {
      users = await UserModel.findAll();
      departments = await DepartmentModel.findAll();
    } catch (e) {
      // Dropdown verileri alınamazsa akışı bozma
      users = [];
      departments = [];
    }

    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      let success = null;
      if (req.query && req.query.created) {
        success = 'Yeni iş ilanı başarıyla yayınlandı!';
      } else if (req.query && req.query.updated) {
        success = 'İş ilanı bilgileri başarıyla güncellendi!';
      } else if (req.query && req.query.deleted) {
        success = 'İş ilanı başarıyla silindi!';
      }

      const error = req.query && req.query.error ? req.query.error : null;
      return res.status(200).send(
        jobPostingView.renderJobPostingsPage(
          jobPostings,
          { success, error },
          { users, departments }
        )
      );
    }

    return res.status(200).json(jobPostings);
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(
        jobPostingView.renderJobPostingsPage(
          [],
          { error: 'İş ilanları yüklenirken veritabanı hatası oluştu.' },
          { users: [], departments: [] }
        )
      );
    }
    return res.status(500).json({ error: 'İş ilanları alınırken hata oluştu.' });
  }
};

// GET /job-postings/:id - Tekil iş ilanı detay sayfası
const getJobPostingById = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
        return res.status(404).send(jobPostingView.renderJobPostingNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    // İlişkisel verileri getir
    let poster = null;
    let department = null;
    let applications = [];

    try {
      if (job.postedBy) {
        poster = await JobPostingModel.getPoster(job.id);
      }
      if (job.departmentId) {
        department = await JobPostingModel.getDepartment(job.id);
      }
      applications = await JobPostingModel.getApplications(job.id);
    } catch (e) {
      // İlişki hatası detayı engellemesin
    }

    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(200).send(
        jobPostingView.renderJobPostingDetailPage(job, { poster, department, applications })
      );
    }

    return res.status(200).json({ job, poster, department, applications });
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(jobPostingView.renderJobPostingNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'İş ilanı detayı alınırken hata oluştu.' });
  }
};

// GET /job-postings/:id/edit - İlan düzenleme formu
const getEditJobPostingForm = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(jobPostingView.renderJobPostingNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    let users = [];
    let departments = [];
    try {
      users = await UserModel.findAll();
      departments = await DepartmentModel.findAll();
    } catch (e) {
      users = [];
      departments = [];
    }

    const error = req.query && req.query.error ? req.query.error : null;
    return res.status(200).send(
      jobPostingView.renderEditJobPostingPage(job, { error }, { users, departments })
    );
  } catch (err) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(500).send(jobPostingView.renderJobPostingNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'İlan düzenleme formu yüklenirken hata oluştu.' });
  }
};

// POST /job-postings - Yeni iş ilanı oluşturur
const createJobPosting = async (req, res) => {
  const {
    title,
    company,
    location,
    employmentType,
    description,
    requirements,
    contactEmail,
    applicationUrl,
    salaryRange,
    deadline,
    postedBy,
    departmentId,
  } = req.body || {};

  if (!title || !company || !description) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect(
        '/job-postings?error=' + encodeURIComponent('Başlık, şirket adı ve iş tanımı alanları zorunludur.')
      );
    }
    return res.status(400).json({ error: 'title, company ve description alanları zorunludur.' });
  }

  try {
    const parsedPostedBy = postedBy ? parseInt(postedBy, 10) : null;
    const parsedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;

    const newJob = await JobPostingModel.create({
      title: title.trim(),
      company: company.trim(),
      location: location ? location.trim() : null,
      employmentType: employmentType || 'full-time',
      description: description.trim(),
      requirements: requirements ? requirements.trim() : null,
      contactEmail: contactEmail ? contactEmail.trim() : null,
      applicationUrl: applicationUrl ? applicationUrl.trim() : null,
      salaryRange: salaryRange ? salaryRange.trim() : null,
      deadline: deadline ? deadline : null,
      postedBy: isNaN(parsedPostedBy) ? null : parsedPostedBy,
      departmentId: isNaN(parsedDepartmentId) ? null : parsedDepartmentId,
      isActive: true,
    });

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/job-postings?created=true');
    }

    return res.status(201).json({ message: 'İş ilanı oluşturuldu', job: newJob });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = 'İş ilanı oluşturulurken veritabanı hatası oluştu.';
    if (isHtml) {
      return res.redirect('/job-postings?error=' + encodeURIComponent(errorMsg));
    }
    return res.status(500).json({ error: errorMsg });
  }
};

// POST /job-postings/:id/update - Formdan gelen verilerle iş ilanını günceller
const updateJobPostingForm = async (req, res) => {
  const jobId = parseInt(req.params.id, 10);

  try {
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(jobPostingView.renderJobPostingNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const {
      title,
      company,
      location,
      employmentType,
      description,
      requirements,
      contactEmail,
      applicationUrl,
      salaryRange,
      deadline,
      isActive,
      postedBy,
      departmentId,
    } = req.body || {};

    if (!title || !company || !description) {
      return res.redirect(
        `/job-postings/${jobId}/edit?error=` +
          encodeURIComponent('Başlık, şirket adı ve iş tanımı alanları zorunludur.')
      );
    }

    const parsedPostedBy = postedBy ? parseInt(postedBy, 10) : null;
    const parsedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;
    const active = isActive === 'true' || isActive === true;

    await JobPostingModel.replace(jobId, {
      title: title.trim(),
      company: company.trim(),
      location: location ? location.trim() : null,
      employmentType: employmentType || 'full-time',
      description: description.trim(),
      requirements: requirements ? requirements.trim() : null,
      contactEmail: contactEmail ? contactEmail.trim() : null,
      applicationUrl: applicationUrl ? applicationUrl.trim() : null,
      salaryRange: salaryRange ? salaryRange.trim() : null,
      deadline: deadline ? deadline : null,
      isActive: active,
      postedBy: isNaN(parsedPostedBy) ? null : parsedPostedBy,
      departmentId: isNaN(parsedDepartmentId) ? null : parsedDepartmentId,
    });

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/job-postings?updated=true');
    }

    return res.status(200).json({ message: 'İş ilanı güncellendi' });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = 'İş ilanı güncellenirken hata oluştu.';
    if (isHtml) {
      return res.redirect(`/job-postings/${jobId}/edit?error=` + encodeURIComponent(errorMsg));
    }
    return res.status(500).json({ error: errorMsg });
  }
};

// POST /job-postings/:id/delete - İş ilanını siler
const deleteJobPostingForm = async (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  try {
    const deleted = await JobPostingModel.remove(jobId);

    if (!deleted) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(jobPostingView.renderJobPostingNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/job-postings?deleted=true');
    }

    return res.status(200).json({ message: 'İş ilanı silindi' });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = 'İş ilanı silinirken hata oluştu.';
    if (isHtml) {
      return res.redirect('/job-postings?error=' + encodeURIComponent(errorMsg));
    }
    return res.status(500).json({ error: errorMsg });
  }
};

module.exports = {
  getJobPostings,
  getJobPostingById,
  getEditJobPostingForm,
  createJobPosting,
  updateJobPostingForm,
  deleteJobPostingForm,
};
