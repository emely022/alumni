const { pool } = require('../config/db');

/**
 * Department Model (PostgreSQL)
 * 
 * PostgreSQL departments tablosu için CRUD ve ilişkisel (relationship) operasyonları sağlar.
 */

// PostgreSQL satırını API ve nesne formatına dönüştürücü
const formatDepartment = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    faculty: row.faculty,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
};

/**
 * Tüm bölümleri listeler (Read - All)
 * @returns {Promise<Array>} Bölüm listesi
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, name, code, faculty, created_at FROM departments ORDER BY id ASC;'
  );
  return result.rows.map(formatDepartment);
};

/**
 * ID'ye göre bölüm arar (Read - By ID)
 * @param {number|string} id - Bölüm ID'si
 * @returns {Promise<Object|null>} Bölüm nesnesi veya null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    'SELECT id, name, code, faculty, created_at FROM departments WHERE id = $1;',
    [numericId]
  );
  return result.rows.length > 0 ? formatDepartment(result.rows[0]) : null;
};

/**
 * Koduna göre bölüm arar (Read - By Code, Örn: "CENG")
 * @param {string} code - Bölüm kodu
 * @returns {Promise<Object|null>} Bölüm nesnesi veya null
 */
const findByCode = async (code) => {
  if (!code) return null;

  const result = await pool.query(
    'SELECT id, name, code, faculty, created_at FROM departments WHERE LOWER(code) = LOWER($1);',
    [code.trim()]
  );
  return result.rows.length > 0 ? formatDepartment(result.rows[0]) : null;
};

/**
 * Yeni bir bölüm oluşturur (Create)
 * @param {Object} data - { name, code, faculty }
 * @returns {Promise<Object>} Oluşturulan bölüm nesnesi
 */
const create = async (data) => {
  const { name, code, faculty } = data;

  const result = await pool.query(
    `INSERT INTO departments (name, code, faculty)
     VALUES ($1, $2, $3)
     RETURNING id, name, code, faculty, created_at;`,
    [name, code, faculty]
  );

  return formatDepartment(result.rows[0]);
};

/**
 * Bölümü tamamen günceller (Update - PUT)
 * @param {number|string} id - Güncellenecek bölüm ID'si
 * @param {Object} data - { name, code, faculty }
 * @returns {Promise<Object|null>} Güncellenmiş bölüm veya null
 */
const replace = async (id, data) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const { name, code, faculty } = data;

  const result = await pool.query(
    `UPDATE departments
     SET name = $1, code = $2, faculty = $3
     WHERE id = $4
     RETURNING id, name, code, faculty, created_at;`,
    [name, code, faculty, numericId]
  );

  return result.rows.length > 0 ? formatDepartment(result.rows[0]) : null;
};

/**
 * Bölümü kısmi günceller (Update - PATCH)
 * @param {number|string} id - Güncellenecek bölüm ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Promise<Object|null>} Güncellenmiş bölüm veya null
 */
const update = async (id, partialData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const name = partialData.name !== undefined ? partialData.name : current.name;
  const code = partialData.code !== undefined ? partialData.code : current.code;
  const faculty = partialData.faculty !== undefined ? partialData.faculty : current.faculty;

  const result = await pool.query(
    `UPDATE departments
     SET name = $1, code = $2, faculty = $3
     WHERE id = $4
     RETURNING id, name, code, faculty, created_at;`,
    [name, code, faculty, numericId]
  );

  return result.rows.length > 0 ? formatDepartment(result.rows[0]) : null;
};

/**
 * Bölümü siler (Delete)
 * @param {number|string} id - Silinecek bölüm ID'si
 * @returns {Promise<Object|null>} Silinen bölüm veya null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM departments
     WHERE id = $1
     RETURNING id, name, code, faculty, created_at;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatDepartment(result.rows[0]) : null;
};

// =========================================================================
// İLİŞKİLER (RELATIONSHIPS)
// =========================================================================

/**
 * 1:N İlişki: departments -> users
 * Bu bölüme kayıtlı mezunları/kullanıcıları döner.
 * @param {number|string} departmentId
 * @returns {Promise<Array>} Mezun listesi
 */
const getUsers = async (departmentId) => {
  const numericId = parseInt(departmentId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, name, email, department, department_id, graduation_year, created_at, updated_at
     FROM users
     WHERE department_id = $1
     ORDER BY graduation_year DESC, name ASC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    departmentId: row.department_id,
    graduationYear: row.graduation_year !== null ? Number(row.graduation_year) : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }));
};

/**
 * 1:N İlişki: departments -> job_postings
 * Bu bölüm için hedeflenmiş iş ilanlarını döner.
 * @param {number|string} departmentId
 * @returns {Promise<Array>} İlan listesi
 */
const getJobPostings = async (departmentId) => {
  const numericId = parseInt(departmentId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, title, company, location, employment_type, description, requirements,
            contact_email, application_url, salary_range, deadline, is_active,
            posted_by, department_id, created_at, updated_at
     FROM job_postings
     WHERE department_id = $1
     ORDER BY created_at DESC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
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
    deadline: row.deadline ? (row.deadline instanceof Date ? row.deadline.toISOString().split('T')[0] : row.deadline) : null,
    isActive: row.is_active,
    postedBy: row.posted_by,
    departmentId: row.department_id,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }));
};

const DepartmentModel = {
  findAll,
  findById,
  findByCode,
  create,
  replace,
  update,
  remove,
  delete: remove,
  // İlişkisel fonksiyonlar
  getUsers,
  getJobPostings,
  relationships: {
    users: { type: 'hasMany', target: 'users', foreignKey: 'department_id' },
    jobPostings: { type: 'hasMany', target: 'job_postings', foreignKey: 'department_id' },
  },
};

module.exports = DepartmentModel;
