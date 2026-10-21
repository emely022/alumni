const { pool } = require('../config/db');

/**
 * EventRegistration Model (PostgreSQL)
 * 
 * PostgreSQL event_registrations ara tablosu (junction table) için CRUD
 * ve ilişkisel (relationship) operasyonları sağlar.
 */

// PostgreSQL satırını API ve nesne formatına dönüştürücü
const formatEventRegistration = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    status: row.status,
    registrationDate: row.registration_date ? new Date(row.registration_date).toISOString() : null,
  };
};

/**
 * Tüm etkinlik kayıtlarını listeler (Read - All)
 * @returns {Promise<Array>} Kayıt listesi
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, event_id, user_id, registration_date, status FROM event_registrations ORDER BY id ASC;'
  );
  return result.rows.map(formatEventRegistration);
};

/**
 * ID'ye göre etkinlik kaydı arar (Read - By ID)
 * @param {number|string} id - Kayıt ID'si
 * @returns {Promise<Object|null>} Kayıt nesnesi veya null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    'SELECT id, event_id, user_id, registration_date, status FROM event_registrations WHERE id = $1;',
    [numericId]
  );
  return result.rows.length > 0 ? formatEventRegistration(result.rows[0]) : null;
};

/**
 * Etkinlik ve kullanıcı ikilisine göre kayıt arar (Mükerrerlik / sorgulama için)
 * @param {number|string} eventId
 * @param {number|string} userId
 * @returns {Promise<Object|null>} Kayıt nesnesi veya null
 */
const findByEventAndUser = async (eventId, userId) => {
  const evId = parseInt(eventId, 10);
  const uId = parseInt(userId, 10);
  if (isNaN(evId) || isNaN(uId)) return null;

  const result = await pool.query(
    'SELECT id, event_id, user_id, registration_date, status FROM event_registrations WHERE event_id = $1 AND user_id = $2;',
    [evId, uId]
  );
  return result.rows.length > 0 ? formatEventRegistration(result.rows[0]) : null;
};

/**
 * Yeni etkinlik kaydı oluşturur (Create)
 * @param {Object} data - { eventId, userId, status }
 * @returns {Promise<Object>} Oluşturulan kayıt
 */
const create = async (data) => {
  const { eventId, userId, status } = data;
  const regStatus = status || 'registered';

  const result = await pool.query(
    `INSERT INTO event_registrations (event_id, user_id, status)
     VALUES ($1, $2, $3)
     RETURNING id, event_id, user_id, registration_date, status;`,
    [eventId, userId, regStatus]
  );

  return formatEventRegistration(result.rows[0]);
};

/**
 * Kayıt durumunu günceller (Update Status: registered, attended, cancelled)
 * @param {number|string} id - Kayıt ID'si
 * @param {string} status - Yeni durum
 * @returns {Promise<Object|null>} Güncellenmiş kayıt veya null
 */
const updateStatus = async (id, status) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `UPDATE event_registrations
     SET status = $1
     WHERE id = $2
     RETURNING id, event_id, user_id, registration_date, status;`,
    [status, numericId]
  );

  return result.rows.length > 0 ? formatEventRegistration(result.rows[0]) : null;
};

/**
 * Etkinlik kaydını siler / iptal eder (Delete)
 * @param {number|string} id - Silinecek kayıt ID'si
 * @returns {Promise<Object|null>} Silinen kayıt veya null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM event_registrations
     WHERE id = $1
     RETURNING id, event_id, user_id, registration_date, status;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatEventRegistration(result.rows[0]) : null;
};

// =========================================================================
// İLİŞKİLER (RELATIONSHIPS)
// =========================================================================

/**
 * N:1 İlişki: event_registrations -> events
 * Bu kaydın ait olduğu etkinliği döner.
 * @param {number|string} registrationId
 * @returns {Promise<Object|null>} Etkinlik nesnesi
 */
const getEvent = async (registrationId) => {
  const numericId = parseInt(registrationId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT e.id, e.title, e.description, e.location, e.event_date, e.capacity, e.organizer_id, e.created_at, e.updated_at
     FROM event_registrations er
     JOIN events e ON er.event_id = e.id
     WHERE er.id = $1;`,
    [numericId]
  );

  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.event_date ? new Date(row.event_date).toISOString() : null,
    capacity: row.capacity !== null && row.capacity !== undefined ? Number(row.capacity) : null,
    organizerId: row.organizer_id,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

/**
 * N:1 İlişki: event_registrations -> users
 * Bu kaydı yapan mezun/kullanıcıyı döner.
 * @param {number|string} registrationId
 * @returns {Promise<Object|null>} Kullanıcı nesnesi
 */
const getUser = async (registrationId) => {
  const numericId = parseInt(registrationId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, u.department_id, u.graduation_year, u.created_at, u.updated_at
     FROM event_registrations er
     JOIN users u ON er.user_id = u.id
     WHERE er.id = $1;`,
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

const EventRegistrationModel = {
  findAll,
  findById,
  findByEventAndUser,
  create,
  updateStatus,
  remove,
  delete: remove,
  // İlişkisel fonksiyonlar
  getEvent,
  getUser,
  relationships: {
    event: { type: 'belongsTo', target: 'events', foreignKey: 'event_id' },
    user: { type: 'belongsTo', target: 'users', foreignKey: 'user_id' },
  },
};

module.exports = EventRegistrationModel;
