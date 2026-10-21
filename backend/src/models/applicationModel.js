const { pool } = require('../config/db');

/**
 * Application Model (PostgreSQL)
 * 
 * PostgreSQL applications tablosu için CRUD ve ilişkisel (relationship) operasyonları sağlar.
 */

// PostgreSQL satırını API ve nesne formatına dönüştürücü
const formatApplication = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    jobPostingId: row.job_posting_id,
    userId: row.user_id,
    resumeUrl: row.resume_url,
    coverNote: row.cover_note,
    status: row.status,
    appliedAt: row.applied_at ? new Date(row.applied_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

/**
 * Tüm iş başvurularını listeler (Read - All, filtreleme destekli)
 * @param {Object} [filter] - { jobPostingId, userId, status }
 * @returns {Promise<Array>} Başvuru listesi
 */
const findAll = async (filter = {}) => {
  const conditions = [];
  const params = [];

  if (filter.jobPostingId !== undefined) {
    params.push(filter.jobPostingId);
    conditions.push(`job_posting_id = $${params.length}`);
  }

  if (filter.userId !== undefined) {
    params.push(filter.userId);
    conditions.push(`user_id = $${params.length}`);
  }

  if (filter.status !== undefined) {
    params.push(filter.status);
    conditions.push(`status = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at
     FROM applications
     ${whereClause}
     ORDER BY applied_at DESC, id DESC;`,
    params
  );

  return result.rows.map(formatApplication);
};

/**
 * ID'ye göre başvuru arar (Read - By ID)
 * @param {number|string} id - Başvuru ID'si
 * @returns {Promise<Object|null>} Başvuru nesnesi veya null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at
     FROM applications
     WHERE id = $1;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatApplication(result.rows[0]) : null;
};

/**
 * İlan ve kullanıcı ikilisine göre başvuru arar (Mükerrerlik / kontrol için)
 * @param {number|string} jobPostingId
 * @param {number|string} userId
 * @returns {Promise<Object|null>} Başvuru nesnesi veya null
 */
const findByJobAndUser = async (jobPostingId, userId) => {
  const jobId = parseInt(jobPostingId, 10);
  const uId = parseInt(userId, 10);
  if (isNaN(jobId) || isNaN(uId)) return null;

  const result = await pool.query(
    `SELECT id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at
     FROM applications
     WHERE job_posting_id = $1 AND user_id = $2;`,
    [jobId, uId]
  );

  return result.rows.length > 0 ? formatApplication(result.rows[0]) : null;
};

/**
 * Yeni başvuru oluşturur (Create)
 * @param {Object} data - { jobPostingId, userId, resumeUrl, coverNote, status }
 * @returns {Promise<Object>} Oluşturulan başvuru nesnesi
 */
const create = async (data) => {
  const { jobPostingId, userId, resumeUrl, coverNote, status } = data;
  const appStatus = status || 'pending';

  const result = await pool.query(
    `INSERT INTO applications (job_posting_id, user_id, resume_url, cover_note, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at;`,
    [jobPostingId, userId, resumeUrl || null, coverNote || null, appStatus]
  );

  return formatApplication(result.rows[0]);
};

/**
 * Başvuruyu tamamen günceller (Update - PUT)
 * @param {number|string} id - Başvuru ID'si
 * @param {Object} data - Güncel veriler
 * @returns {Promise<Object|null>} Güncellenmiş başvuru veya null
 */
const replace = async (id, data) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const { resumeUrl, coverNote, status } = data;
  const appStatus = status || 'pending';

  const result = await pool.query(
    `UPDATE applications
     SET resume_url = $1, cover_note = $2, status = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at;`,
    [resumeUrl || null, coverNote || null, appStatus, numericId]
  );

  return result.rows.length > 0 ? formatApplication(result.rows[0]) : null;
};

/**
 * Başvuru durumunu günceller (pending, reviewed, interview, accepted, rejected)
 * @param {number|string} id - Başvuru ID'si
 * @param {string} status - Yeni durum
 * @returns {Promise<Object|null>} Güncellenmiş başvuru veya null
 */
const updateStatus = async (id, status) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `UPDATE applications
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at;`,
    [status, numericId]
  );

  return result.rows.length > 0 ? formatApplication(result.rows[0]) : null;
};

/**
 * Başvuruyu kısmi günceller (Update - PATCH)
 * @param {number|string} id - Başvuru ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Promise<Object|null>} Güncellenmiş başvuru veya null
 */
const update = async (id, partialData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const resumeUrl = partialData.resumeUrl !== undefined ? partialData.resumeUrl : current.resumeUrl;
  const coverNote = partialData.coverNote !== undefined ? partialData.coverNote : current.coverNote;
  const status = partialData.status !== undefined ? partialData.status : current.status;

  const result = await pool.query(
    `UPDATE applications
     SET resume_url = $1, cover_note = $2, status = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at;`,
    [resumeUrl, coverNote, status, numericId]
  );

  return result.rows.length > 0 ? formatApplication(result.rows[0]) : null;
};

/**
 * Başvuruyu siler (Delete)
 * @param {number|string} id - Silinecek başvuru ID'si
 * @returns {Promise<Object|null>} Silinen başvuru veya null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM applications
     WHERE id = $1
     RETURNING id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatApplication(result.rows[0]) : null;
};

// =========================================================================
// İLİŞKİLER (RELATIONSHIPS)
// =========================================================================

/**
 * N:1 İlişki: applications -> job_postings
 * Başvurunun ait olduğu iş ilanını döner.
 * @param {number|string} applicationId
 * @returns {Promise<Object|null>} İş ilanı nesnesi
 */
const getJobPosting = async (applicationId) => {
  const numericId = parseInt(applicationId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT jp.id, jp.title, jp.company, jp.location, jp.employment_type, jp.description,
            jp.requirements, jp.contact_email, jp.application_url, jp.salary_range,
            jp.deadline, jp.is_active, jp.posted_by, jp.department_id, jp.created_at, jp.updated_at
     FROM applications a
     JOIN job_postings jp ON a.job_posting_id = jp.id
     WHERE a.id = $1;`,
    [numericId]
  );

  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  let formattedDeadline = row.deadline;
  if (row.deadline instanceof Date) {
    formattedDeadline = row.deadline.toISOString().split('T')[0];
  } else if (typeof row.deadline === 'string' && row.deadline.includes('T')) {
    formattedDeadline = row.deadline.split('T')[0];
  }

  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    employmentType: row.employment_type,
    description: row.description,
    requirements: row.requirements,
    contactEmail: row.contact_email,
    applicationUrl: row.application_url,
    salaryRange: row.salary_range,
    deadline: formattedDeadline || null,
    isActive: row.is_active,
    postedBy: row.posted_by,
    departmentId: row.department_id,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

/**
 * N:1 İlişki: applications -> users
 * Başvuruyu yapan mezun/kullanıcı bilgisini döner.
 * @param {number|string} applicationId
 * @returns {Promise<Object|null>} Kullanıcı nesnesi
 */
const getUser = async (applicationId) => {
  const numericId = parseInt(applicationId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, u.department_id, u.graduation_year, u.created_at, u.updated_at
     FROM applications a
     JOIN users u ON a.user_id = u.id
     WHERE a.id = $1;`,
    [numericId]
  );

  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    departmentId: row.department_id,
    graduationYear: row.graduation_year !== null ? Number(row.graduation_year) : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

const ApplicationModel = {
  findAll,
  findById,
  findByJobAndUser,
  create,
  replace,
  updateStatus,
  update,
  remove,
  delete: remove,
  // İlişkisel fonksiyonlar
  getJobPosting,
  getUser,
  relationships: {
    jobPosting: { type: 'belongsTo', target: 'job_postings', foreignKey: 'job_posting_id' },
    user: { type: 'belongsTo', target: 'users', foreignKey: 'user_id' },
  },
};

module.exports = ApplicationModel;
