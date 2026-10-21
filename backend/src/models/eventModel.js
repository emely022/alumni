const { pool } = require('../config/db');

/**
 * Event Model (PostgreSQL)
 * 
 * PostgreSQL events tablosu için CRUD ve ilişkisel (relationship) operasyonları sağlar.
 */

// PostgreSQL satırını API ve nesne formatına dönüştürücü
const formatEvent = (row) => {
  if (!row) return null;
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
 * Tüm etkinlikleri listeler (Read - All)
 * @returns {Promise<Array>} Etkinlik listesi
 */
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at FROM events ORDER BY event_date ASC, id ASC;'
  );
  return result.rows.map(formatEvent);
};

/**
 * ID'ye göre etkinlik arar (Read - By ID)
 * @param {number|string} id - Etkinlik ID'si
 * @returns {Promise<Object|null>} Etkinlik nesnesi veya null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    'SELECT id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at FROM events WHERE id = $1;',
    [numericId]
  );
  return result.rows.length > 0 ? formatEvent(result.rows[0]) : null;
};

/**
 * Yeni bir etkinlik oluşturur (Create)
 * @param {Object} data - Etkinlik bilgileri
 * @returns {Promise<Object>} Oluşturulan etkinlik
 */
const create = async (data) => {
  const { title, description, location, eventDate, capacity, organizerId } = data;

  const result = await pool.query(
    `INSERT INTO events (title, description, location, event_date, capacity, organizer_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at;`,
    [title, description, location, eventDate, capacity || null, organizerId || null]
  );

  return formatEvent(result.rows[0]);
};

/**
 * Etkinliği tamamen günceller (Update - PUT)
 * @param {number|string} id - Güncellenecek etkinlik ID'si
 * @param {Object} data - Güncel etkinlik verileri
 * @returns {Promise<Object|null>} Güncellenmiş etkinlik veya null
 */
const replace = async (id, data) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const { title, description, location, eventDate, capacity, organizerId } = data;

  const result = await pool.query(
    `UPDATE events
     SET title = $1, description = $2, location = $3, event_date = $4,
         capacity = $5, organizer_id = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at;`,
    [title, description, location, eventDate, capacity || null, organizerId || null, numericId]
  );

  return result.rows.length > 0 ? formatEvent(result.rows[0]) : null;
};

/**
 * Etkinliği kısmi günceller (Update - PATCH)
 * @param {number|string} id - Güncellenecek etkinlik ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Promise<Object|null>} Güncellenmiş etkinlik veya null
 */
const update = async (id, partialData) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const title = partialData.title !== undefined ? partialData.title : current.title;
  const description = partialData.description !== undefined ? partialData.description : current.description;
  const location = partialData.location !== undefined ? partialData.location : current.location;
  const eventDate = partialData.eventDate !== undefined ? partialData.eventDate : current.eventDate;
  const capacity = partialData.capacity !== undefined ? partialData.capacity : current.capacity;
  const organizerId = partialData.organizerId !== undefined ? partialData.organizerId : current.organizerId;

  const result = await pool.query(
    `UPDATE events
     SET title = $1, description = $2, location = $3, event_date = $4,
         capacity = $5, organizer_id = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at;`,
    [title, description, location, eventDate, capacity || null, organizerId || null, numericId]
  );

  return result.rows.length > 0 ? formatEvent(result.rows[0]) : null;
};

/**
 * Etkinliği siler (Delete)
 * @param {number|string} id - Silinecek etkinlik ID'si
 * @returns {Promise<Object|null>} Silinen etkinlik veya null
 */
const remove = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `DELETE FROM events
     WHERE id = $1
     RETURNING id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at;`,
    [numericId]
  );

  return result.rows.length > 0 ? formatEvent(result.rows[0]) : null;
};

// =========================================================================
// İLİŞKİLER (RELATIONSHIPS)
// =========================================================================

/**
 * N:1 İlişki: events -> users (Organizatör)
 * Bu etkinliğin organizatör kullanıcısını döner.
 * @param {number|string} eventId
 * @returns {Promise<Object|null>} Kullanıcı nesnesi
 */
const getOrganizer = async (eventId) => {
  const numericId = parseInt(eventId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, u.department_id, u.graduation_year, u.created_at, u.updated_at
     FROM events e
     JOIN users u ON e.organizer_id = u.id
     WHERE e.id = $1;`,
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
 * 1:N İlişki: events -> event_registrations
 * Bu etkinliğe yapılan kayıtları döner.
 * @param {number|string} eventId
 * @returns {Promise<Array>} Kayıt listesi
 */
const getRegistrations = async (eventId) => {
  const numericId = parseInt(eventId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, event_id, user_id, registration_date, status
     FROM event_registrations
     WHERE event_id = $1
     ORDER BY registration_date ASC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    registrationDate: row.registration_date ? new Date(row.registration_date).toISOString() : null,
    status: row.status,
  }));
};

/**
 * N:N İlişki: events <-> users (Etkinlik Katılımcıları)
 * Bu etkinliğe kayıt olmuş mezun/kullanıcı listesini döner.
 * @param {number|string} eventId
 * @returns {Promise<Array>} Katılımcı mezunlar listesi
 */
const getParticipants = async (eventId) => {
  const numericId = parseInt(eventId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.department, u.department_id, u.graduation_year,
            er.registration_date, er.status as registration_status
     FROM event_registrations er
     JOIN users u ON er.user_id = u.id
     WHERE er.event_id = $1
     ORDER BY er.registration_date ASC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    departmentId: row.department_id,
    graduationYear: row.graduation_year !== null ? Number(row.graduation_year) : null,
    registrationDate: row.registration_date ? new Date(row.registration_date).toISOString() : null,
    registrationStatus: row.registration_status,
  }));
};

const EventModel = {
  findAll,
  findById,
  create,
  replace,
  update,
  remove,
  delete: remove,
  // İlişkisel fonksiyonlar
  getOrganizer,
  getRegistrations,
  getParticipants,
  relationships: {
    organizer: { type: 'belongsTo', target: 'users', foreignKey: 'organizer_id' },
    registrations: { type: 'hasMany', target: 'event_registrations', foreignKey: 'event_id' },
    participants: { type: 'belongsToMany', target: 'users', through: 'event_registrations', foreignKey: 'event_id', otherKey: 'user_id' },
  },
};

module.exports = EventModel;
