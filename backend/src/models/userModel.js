const { pool } = require('../config/db');

/**
 * User Model (PostgreSQL)
 * 
 * PostgreSQL veritabanı ile çalışan ve CRUD (Create, Read, Update, Delete)
 * operasyonlarını sağlayan model katmanıdır.
 */

// PostgreSQL satırını API ve View formatına dönüştürücü
const formatUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    department_id: row.department_id,
    graduationYear: row.graduation_year !== null && row.graduation_year !== undefined
      ? Number(row.graduation_year)
      : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

/**
 * Tüm kullanıcıları döner (Read - All)
 * @returns {Promise<Array>} Kullanıcı listesi
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, name, email, department, department_id, graduation_year, created_at, updated_at FROM users ORDER BY id ASC;'
  );
  return result.rows.map(formatUser);
};

/**
 * ID'ye göre kullanıcı arar (Read - By ID)
 * @param {number|string} id - Kullanıcı ID'si
 * @returns {Promise<Object|null>} Kullanıcı nesnesi veya bulunamazsa null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    'SELECT id, name, email, department, department_id, graduation_year, created_at, updated_at FROM users WHERE id = $1;',
    [numericId]
  );
  return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
};

/**
 * Yeni bir kullanıcı oluşturur ve veritabanına ekler (Create)
 * @param {Object} userData - Yeni kullanıcı bilgileri
 * @returns {Promise<Object>} Oluşturulan kullanıcı nesnesi
 */
const create = async (userData) => {
  const { name, email, department, graduationYear, department_id } = userData;
  const gradYear = graduationYear ? Number(graduationYear) : new Date().getFullYear();
  const dept = department || 'Belirtilmedi';

  const result = await pool.query(
    `INSERT INTO users (name, email, department, department_id, graduation_year)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, department, department_id, graduation_year, created_at, updated_at;`,
    [name, email, dept, department_id || null, gradYear]
  );

  return formatUser(result.rows[0]);
};

/**
 * Kullanıcıyı tamamen günceller / üzerine yazar (Update - PUT)
 * @param {number|string} id - Güncellenecek kullanıcı ID'si
 * @param {Object} userData - Güncel kullanıcı bilgileri
 * @returns {Promise<Object|null>} Güncellenmiş kullanıcı veya bulunamazsa null
 */
const replace = async (id, userData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const { name, email, department, graduationYear, department_id } = userData;
  const gradYear = Number(graduationYear);

  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2, department = $3, department_id = $4, graduation_year = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, name, email, department, department_id, graduation_year, created_at, updated_at;`,
    [name, email, department, department_id || null, gradYear, numericId]
  );

  return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
};

/**
 * Kullanıcıyı kısmi olarak günceller (Update - PATCH)
 * @param {number|string} id - Güncellenecek kullanıcı ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Promise<Object|null>} Güncellenmiş kullanıcı veya bulunamazsa null
 */
const update = async (id, partialData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const name = partialData.name !== undefined ? partialData.name : current.name;
  const email = partialData.email !== undefined ? partialData.email : current.email;
  const department = partialData.department !== undefined ? partialData.department : current.department;
  const graduationYear = partialData.graduationYear !== undefined
    ? Number(partialData.graduationYear)
    : current.graduationYear;
  const department_id = partialData.department_id !== undefined
    ? partialData.department_id
    : current.department_id;

  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2, department = $3, department_id = $4, graduation_year = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, name, email, department, department_id, graduation_year, created_at, updated_at;`,
    [name, email, department, department_id || null, graduationYear, numericId]
  );

  return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
};

/**
 * Kullanıcıyı ID'ye göre veritabanından siler (Delete)
 * @param {number|string} id - Silinecek kullanıcı ID'si
 * @returns {Promise<Object|null>} Silinen kullanıcı veya bulunamazsa null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id, name, email, department, department_id, graduation_year, created_at, updated_at;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
};

const UserModel = {
  findAll,
  findById,
  create,
  replace,
  update,
  remove,
  delete: remove,
};

module.exports = UserModel;
