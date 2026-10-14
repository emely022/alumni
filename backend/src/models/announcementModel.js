const { pool } = require('../config/db');

/**
 * Announcement Model (PostgreSQL)
 * 
 * PostgreSQL veritabanı ile çalışan ve CRUD (Create, Read, Update, Delete)
 * operasyonlarını sağlayan duyuru modelidir.
 */

// PostgreSQL satırını API ve View formatına dönüştürücü
const formatAnnouncement = (row) => {
  if (!row) return null;

  let formattedDate = row.date;
  if (row.date instanceof Date) {
    formattedDate = row.date.toISOString().split('T')[0];
  } else if (typeof row.date === 'string' && row.date.includes('T')) {
    formattedDate = row.date.split('T')[0];
  }

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category || 'Genel',
    author: row.author || 'Yönetim',
    author_id: row.author_id,
    date: formattedDate || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

/**
 * Tüm duyuruları döner (Read - All)
 * @returns {Promise<Array>} Duyurular listesi
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, title, content, category, author, author_id, date, created_at, updated_at FROM announcements ORDER BY id ASC;'
  );
  return result.rows.map(formatAnnouncement);
};

/**
 * ID'ye göre duyuru arar (Read - By ID)
 * @param {number|string} id - Duyuru ID'si
 * @returns {Promise<Object|null>} Duyuru nesnesi veya bulunamazsa null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    'SELECT id, title, content, category, author, author_id, date, created_at, updated_at FROM announcements WHERE id = $1;',
    [numericId]
  );
  return result.rows.length > 0 ? formatAnnouncement(result.rows[0]) : null;
};

/**
 * Yeni bir duyuru oluşturur ve veritabanına ekler (Create)
 * @param {Object} data - Duyuru bilgileri
 * @returns {Promise<Object>} Oluşturulan duyuru nesnesi
 */
const create = async (data) => {
  const { title, content, category, author, author_id, date } = data;
  const annCategory = category || 'Genel';
  const annAuthor = author || 'Yönetim';
  const annDate = date || new Date().toISOString().split('T')[0];

  const result = await pool.query(
    `INSERT INTO announcements (title, content, category, author, author_id, date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, content, category, author, author_id, date, created_at, updated_at;`,
    [title, content, annCategory, annAuthor, author_id || null, annDate]
  );

  return formatAnnouncement(result.rows[0]);
};

/**
 * Duyuruyu tamamen günceller / üzerine yazar (Update - PUT)
 * @param {number|string} id - Güncellenecek duyuru ID'si
 * @param {Object} data - Yeni duyuru bilgileri
 * @returns {Promise<Object|null>} Güncellenmiş duyuru veya bulunamazsa null
 */
const replace = async (id, data) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const { title, content, category, author, author_id, date } = data;
  const annCategory = category || 'Genel';
  const annAuthor = author || 'Yönetim';

  const result = await pool.query(
    `UPDATE announcements
     SET title = $1, content = $2, category = $3, author = $4, author_id = $5,
         date = COALESCE($6, date), updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, title, content, category, author, author_id, date, created_at, updated_at;`,
    [title, content, annCategory, annAuthor, author_id || null, date || null, numericId]
  );

  return result.rows.length > 0 ? formatAnnouncement(result.rows[0]) : null;
};

/**
 * Duyuruyu kısmi olarak günceller (Update - PATCH)
 * @param {number|string} id - Güncellenecek duyuru ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Promise<Object|null>} Güncellenmiş duyuru veya bulunamazsa null
 */
const update = async (id, partialData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const title = partialData.title !== undefined ? partialData.title : current.title;
  const content = partialData.content !== undefined ? partialData.content : current.content;
  const category = partialData.category !== undefined ? partialData.category : current.category;
  const author = partialData.author !== undefined ? partialData.author : current.author;
  const author_id = partialData.author_id !== undefined ? partialData.author_id : current.author_id;
  const date = partialData.date !== undefined ? partialData.date : current.date;

  const result = await pool.query(
    `UPDATE announcements
     SET title = $1, content = $2, category = $3, author = $4, author_id = $5,
         date = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, title, content, category, author, author_id, date, created_at, updated_at;`,
    [title, content, category, author, author_id || null, date, numericId]
  );

  return result.rows.length > 0 ? formatAnnouncement(result.rows[0]) : null;
};

/**
 * Duyuruyu ID'ye göre siler (Delete)
 * @param {number|string} id - Silinecek duyuru ID'si
 * @returns {Promise<Object|null>} Silinen duyuru veya bulunamazsa null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM announcements
     WHERE id = $1
     RETURNING id, title, content, category, author, author_id, date, created_at, updated_at;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatAnnouncement(result.rows[0]) : null;
};

const AnnouncementModel = {
  findAll,
  findById,
  create,
  replace,
  update,
  remove,
  delete: remove,
};

module.exports = AnnouncementModel;
