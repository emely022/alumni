const { pool } = require('../config/db');

/**
 * JobPosting Model (PostgreSQL)
 * 
 * PostgreSQL job_postings tablosu için CRUD ve ilişkisel (relationship) operasyonları sağlar.
 */

// PostgreSQL satırını API ve nesne formatına dönüştürücü
const formatJobPosting = (row) => {
  if (!row) return null;

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
 * Tüm iş ilanlarını listeler (Read - All, opsiyonel filtreleme ile)
 * @param {Object} [filter] - { isActive, departmentId }
 * @returns {Promise<Array>} İlan listesi
 */
const findAll = async (filter = {}) => {
  const conditions = [];
  const params = [];

  if (filter.isActive !== undefined) {
    params.push(filter.isActive);
    conditions.push(`is_active = $${params.length}`);
  }

  if (filter.departmentId !== undefined) {
    params.push(filter.departmentId);
    conditions.push(`department_id = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `SELECT id, title, company, location, employment_type, description, requirements,
            contact_email, application_url, salary_range, deadline, is_active,
            posted_by, department_id, created_at, updated_at
     FROM job_postings
     ${whereClause}
     ORDER BY created_at DESC, id DESC;`,
    params
  );

  return result.rows.map(formatJobPosting);
};

/**
 * ID'ye göre iş ilanı arar (Read - By ID)
 * @param {number|string} id - İlan ID'si
 * @returns {Promise<Object|null>} İlan nesnesi veya null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT id, title, company, location, employment_type, description, requirements,
            contact_email, application_url, salary_range, deadline, is_active,
            posted_by, department_id, created_at, updated_at
     FROM job_postings
     WHERE id = $1;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatJobPosting(result.rows[0]) : null;
};

/**
 * Yeni bir iş ilanı oluşturur (Create)
 * @param {Object} data - İlan bilgileri
 * @returns {Promise<Object>} Oluşturulan iş ilanı
 */
const create = async (data) => {
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
  } = data;

  const empType = employmentType || 'full-time';
  const active = isActive !== undefined ? isActive : true;

  const result = await pool.query(
    `INSERT INTO job_postings (
      title, company, location, employment_type, description, requirements,
      contact_email, application_url, salary_range, deadline, is_active,
      posted_by, department_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id, title, company, location, employment_type, description, requirements,
               contact_email, application_url, salary_range, deadline, is_active,
               posted_by, department_id, created_at, updated_at;`,
    [
      title,
      company,
      location || null,
      empType,
      description,
      requirements || null,
      contactEmail || null,
      applicationUrl || null,
      salaryRange || null,
      deadline || null,
      active,
      postedBy || null,
      departmentId || null,
    ]
  );

  return formatJobPosting(result.rows[0]);
};

/**
 * İş ilanını tamamen günceller (Update - PUT)
 * @param {number|string} id - İlan ID'si
 * @param {Object} data - Güncel ilan verileri
 * @returns {Promise<Object|null>} Güncellenmiş ilan veya null
 */
const replace = async (id, data) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

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
  } = data;

  const active = isActive !== undefined ? isActive : true;
  const empType = employmentType || 'full-time';

  const result = await pool.query(
    `UPDATE job_postings
     SET title = $1, company = $2, location = $3, employment_type = $4,
         description = $5, requirements = $6, contact_email = $7,
         application_url = $8, salary_range = $9, deadline = $10,
         is_active = $11, posted_by = $12, department_id = $13,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $14
     RETURNING id, title, company, location, employment_type, description, requirements,
               contact_email, application_url, salary_range, deadline, is_active,
               posted_by, department_id, created_at, updated_at;`,
    [
      title,
      company,
      location || null,
      empType,
      description,
      requirements || null,
      contactEmail || null,
      applicationUrl || null,
      salaryRange || null,
      deadline || null,
      active,
      postedBy || null,
      departmentId || null,
      numericId,
    ]
  );

  return result.rows.length > 0 ? formatJobPosting(result.rows[0]) : null;
};

/**
 * İş ilanını kısmi günceller (Update - PATCH)
 * @param {number|string} id - İlan ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Promise<Object|null>} Güncellenmiş ilan veya null
 */
const update = async (id, partialData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const title = partialData.title !== undefined ? partialData.title : current.title;
  const company = partialData.company !== undefined ? partialData.company : current.company;
  const location = partialData.location !== undefined ? partialData.location : current.location;
  const employmentType = partialData.employmentType !== undefined ? partialData.employmentType : current.employmentType;
  const description = partialData.description !== undefined ? partialData.description : current.description;
  const requirements = partialData.requirements !== undefined ? partialData.requirements : current.requirements;
  const contactEmail = partialData.contactEmail !== undefined ? partialData.contactEmail : current.contactEmail;
  const applicationUrl = partialData.applicationUrl !== undefined ? partialData.applicationUrl : current.applicationUrl;
  const salaryRange = partialData.salaryRange !== undefined ? partialData.salaryRange : current.salaryRange;
  const deadline = partialData.deadline !== undefined ? partialData.deadline : current.deadline;
  const isActive = partialData.isActive !== undefined ? partialData.isActive : current.isActive;
  const postedBy = partialData.postedBy !== undefined ? partialData.postedBy : current.postedBy;
  const departmentId = partialData.departmentId !== undefined ? partialData.departmentId : current.departmentId;

  const result = await pool.query(
    `UPDATE job_postings
     SET title = $1, company = $2, location = $3, employment_type = $4,
         description = $5, requirements = $6, contact_email = $7,
         application_url = $8, salary_range = $9, deadline = $10,
         is_active = $11, posted_by = $12, department_id = $13,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $14
     RETURNING id, title, company, location, employment_type, description, requirements,
               contact_email, application_url, salary_range, deadline, is_active,
               posted_by, department_id, created_at, updated_at;`,
    [
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
      numericId,
    ]
  );

  return result.rows.length > 0 ? formatJobPosting(result.rows[0]) : null;
};

/**
 * İş ilanını siler (Delete)
 * @param {number|string} id - İlan ID'si
 * @returns {Promise<Object|null>} Silinen ilan veya null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM job_postings
     WHERE id = $1
     RETURNING id, title, company, location, employment_type, description, requirements,
               contact_email, application_url, salary_range, deadline, is_active,
               posted_by, department_id, created_at, updated_at;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatJobPosting(result.rows[0]) : null;
};

// =========================================================================
// İLİŞKİLER (RELATIONSHIPS)
// =========================================================================

/**
 * N:1 İlişki: job_postings -> users (İlanı Yayınlayan Mezun/Yetkili)
 * @param {number|string} jobId
 * @returns {Promise<Object|null>} Kullanıcı nesnesi veya null
 */
const getPoster = async (jobId) => {
  const numericId = parseInt(jobId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, u.department_id, u.graduation_year, u.created_at, u.updated_at
     FROM job_postings jp
     JOIN users u ON jp.posted_by = u.id
     WHERE jp.id = $1;`,
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

/**
 * N:1 İlişki: job_postings -> departments (Hedeflenen Bölüm)
 * @param {number|string} jobId
 * @returns {Promise<Object|null>} Bölüm nesnesi veya null
 */
const getDepartment = async (jobId) => {
  const numericId = parseInt(jobId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT d.id, d.name, d.code, d.faculty, d.created_at
     FROM job_postings jp
     JOIN departments d ON jp.department_id = d.id
     WHERE jp.id = $1;`,
    [numericId]
  );

  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    faculty: row.faculty,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
};

/**
 * 1:N İlişki: job_postings -> applications
 * Bu iş ilanına yapılan tüm başvuruları döner.
 * @param {number|string} jobId
 * @returns {Promise<Array>} Başvuru listesi
 */
const getApplications = async (jobId) => {
  const numericId = parseInt(jobId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at
     FROM applications
     WHERE job_posting_id = $1
     ORDER BY applied_at DESC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    jobPostingId: row.job_posting_id,
    userId: row.user_id,
    resumeUrl: row.resume_url,
    coverNote: row.cover_note,
    status: row.status,
    appliedAt: row.applied_at ? new Date(row.applied_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }));
};

/**
 * N:N İlişki: job_postings <-> users (Başvuran Adaylar)
 * Bu iş ilanına başvuru yapmış olan mezunları döner.
 * @param {number|string} jobId
 * @returns {Promise<Array>} Başvuran mezunlar listesi
 */
const getApplicants = async (jobId) => {
  const numericId = parseInt(jobId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, u.department_id, u.graduation_year,
            a.id as application_id, a.status as application_status, a.applied_at,
            a.resume_url, a.cover_note
     FROM applications a
     JOIN users u ON a.user_id = u.id
     WHERE a.job_posting_id = $1
     ORDER BY a.applied_at DESC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    departmentId: row.department_id,
    graduationYear: row.graduation_year !== null ? Number(row.graduation_year) : null,
    applicationId: row.application_id,
    applicationStatus: row.application_status,
    appliedAt: row.applied_at ? new Date(row.applied_at).toISOString() : null,
    resumeUrl: row.resume_url,
    coverNote: row.cover_note,
  }));
};

const JobPostingModel = {
  findAll,
  findById,
  create,
  replace,
  update,
  remove,
  delete: remove,
  // İlişkisel fonksiyonlar
  getPoster,
  getDepartment,
  getApplications,
  getApplicants,
  relationships: {
    poster: { type: 'belongsTo', target: 'users', foreignKey: 'posted_by' },
    department: { type: 'belongsTo', target: 'departments', foreignKey: 'department_id' },
    applications: { type: 'hasMany', target: 'applications', foreignKey: 'job_posting_id' },
    applicants: { type: 'belongsToMany', target: 'users', through: 'applications', foreignKey: 'job_posting_id', otherKey: 'user_id' },
  },
};

module.exports = JobPostingModel;
