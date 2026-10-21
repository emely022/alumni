const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');

/**
 * ApiJobPostingController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı - İş İlanları (Job Postings)
 * Direkt CRUD ve ilişkisel (nested) endpoint'leri yönetir.
 */

// GET /api/job-postings - Tüm iş ilanlarını listeler (Filtreleme: ?isActive=true&departmentId=1)
const getJobPostings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.departmentId !== undefined) {
      const deptId = parseInt(req.query.departmentId, 10);
      if (!isNaN(deptId)) {
        filter.departmentId = deptId;
      }
    }

    const jobPostings = await JobPostingModel.findAll(filter);
    return res.status(200).json(jobPostings);
  } catch (err) {
    return res.status(500).json({ error: 'İş ilanları listelenirken hata oluştu.' });
  }
};

// GET /api/job-postings/:id - Tekil iş ilanı detayı
const getJobPostingById = async (req, res) => {
  try {
    const job = await JobPostingModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }
    return res.status(200).json(job);
  } catch (err) {
    return res.status(500).json({ error: 'İş ilanı detayı alınırken hata oluştu.' });
  }
};

// POST /api/job-postings - Yeni iş ilanı ekler
const createJobPosting = async (req, res) => {
  try {
    const { title, company, description } = req.body || {};

    if (!title || !company || !description) {
      return res.status(400).json({
        error: 'title, company ve description alanları zorunludur.',
      });
    }

    const newJob = await JobPostingModel.create(req.body);
    return res.status(201).json({
      message: 'İş ilanı başarıyla oluşturuldu',
      jobPosting: newJob,
    });
  } catch (err) {
    return res.status(500).json({ error: 'İş ilanı oluşturulurken hata oluştu.' });
  }
};

// PUT /api/job-postings/:id - İş ilanını tamamen günceller (PUT)
const updateJobPostingPut = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const { title, company, description } = req.body || {};

    if (!title || !company || !description) {
      return res.status(400).json({
        error: 'PUT isteğinde title, company ve description alanları zorunludur.',
      });
    }

    const updated = await JobPostingModel.replace(jobId, req.body);
    return res.status(200).json({
      message: 'İş ilanı güncellendi',
      jobPosting: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'İş ilanı güncellenirken hata oluştu.' });
  }
};

// PATCH /api/job-postings/:id - İş ilanını kısmi günceller (PATCH)
const updateJobPostingPatch = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const updated = await JobPostingModel.update(jobId, req.body || {});
    return res.status(200).json({
      message: 'İş ilanı güncellendi',
      jobPosting: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'İş ilanı güncellenirken hata oluştu.' });
  }
};

// DELETE /api/job-postings/:id - İş ilanını siler
const deleteJobPosting = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const deleted = await JobPostingModel.remove(jobId);

    if (!deleted) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    return res.status(200).json({
      message: 'İş ilanı başarıyla silindi',
      jobPosting: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'İş ilanı silinirken hata oluştu.' });
  }
};

// =========================================================================
// İÇ İÇE (NESTED) ENDPOINT'LER
// =========================================================================

// GET /api/job-postings/:id/poster - İlanı yayınlayan mezun/yetkili bilgisini döner (N:1)
const getJobPostingPoster = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const poster = await JobPostingModel.getPoster(jobId);
    if (!poster) {
      return res.status(404).json({ error: 'İlanı veren kullanıcı bilgisi bulunamadı' });
    }

    return res.status(200).json(poster);
  } catch (err) {
    return res.status(500).json({ error: 'İlan veren bilgisi alınırken hata oluştu.' });
  }
};

// GET /api/job-postings/:id/department - İlanın hedeflendiği akademik bölümü döner (N:1)
const getJobPostingDepartment = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const department = await JobPostingModel.getDepartment(jobId);
    if (!department) {
      return res.status(404).json({ error: 'Bu ilan için tanımlı bir bölüm bulunamadı' });
    }

    return res.status(200).json(department);
  } catch (err) {
    return res.status(500).json({ error: 'Bölüm bilgisi alınırken hata oluştu.' });
  }
};

// GET /api/job-postings/:id/applications - İlana yapılan başvuruları listeler (1:N)
const getJobPostingApplications = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const applications = await JobPostingModel.getApplications(jobId);
    return res.status(200).json({
      jobPostingId: jobId,
      title: job.title,
      totalApplications: applications.length,
      applications,
    });
  } catch (err) {
    return res.status(500).json({ error: 'İlan başvuruları alınırken hata oluştu.' });
  }
};

// GET /api/job-postings/:id/applicants - İlana başvuran mezunları listeler (N:N)
const getJobPostingApplicants = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const applicants = await JobPostingModel.getApplicants(jobId);
    return res.status(200).json({
      jobPostingId: jobId,
      title: job.title,
      totalApplicants: applicants.length,
      applicants,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Başvuran adaylar listelenirken hata oluştu.' });
  }
};

// POST /api/job-postings/:id/applications - İlana yeni başvuru yapar (Nested Apply)
const applyToJobPosting = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    const job = await JobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    }

    const { userId, resumeUrl, coverNote } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: 'userId alanı zorunludur.' });
    }

    const existing = await ApplicationModel.findByJobAndUser(jobId, userId);
    if (existing) {
      return res.status(400).json({ error: 'Bu ilana zaten başvuru yaptınız.' });
    }

    const application = await ApplicationModel.create({
      jobPostingId: jobId,
      userId,
      resumeUrl,
      coverNote,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'İş başvurusu başarıyla iletildi',
      application,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu ilana zaten başvuru yaptınız.' });
    }
    return res.status(500).json({ error: 'Başvuru yapılırken hata oluştu.' });
  }
};

const ApiJobPostingController = {
  getJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPostingPut,
  updateJobPostingPatch,
  deleteJobPosting,
  // Nested
  getJobPostingPoster,
  getJobPostingDepartment,
  getJobPostingApplications,
  getJobPostingApplicants,
  applyToJobPosting,
};

module.exports = ApiJobPostingController;
