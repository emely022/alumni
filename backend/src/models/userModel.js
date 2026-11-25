const { pool } = require('../config/db');

/**
 * User Model (PostgreSQL)
 * 
 * PostgreSQL veritabanı ile çalışan ve CRUD (Create, Read, Update, Delete)
 * operasyonlarını sağlayan model katmanıdır.
 */

// PostgreSQL satırını API ve View formatına dönüştürücü (password ve password_hash ASLA yer almaz)
const formatUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'alumni',
    isActive: row.is_active !== undefined ? Boolean(row.is_active) : true,
    department: row.department,
    department_id: row.department_id,
    graduationYear: row.graduation_year !== null && row.graduation_year !== undefined
      ? Number(row.graduation_year)
      : null,
    phone: row.phone !== undefined ? row.phone : null,
    linkedinUrl: row.linkedin_url !== undefined ? row.linkedin_url : (row.linkedinUrl || null),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
};

/**
 * Tüm kullanıcıları döner (Read - All)
 * @returns {Promise<Array>} Kullanıcı listesi
 */
const findAll = async () => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, created_at, updated_at FROM users ORDER BY id ASC;'
    );
    return result.rows.map(formatUser);
  } catch (err) {
    if (err.code === '42703') {
      try {
        const resRole = await pool.query(
          'SELECT id, name, email, role, is_active, department, department_id, graduation_year, created_at, updated_at FROM users ORDER BY id ASC;'
        );
        return resRole.rows.map(formatUser);
      } catch (_) {
        const result = await pool.query(
          'SELECT id, name, email, department, department_id, graduation_year, created_at, updated_at FROM users ORDER BY id ASC;'
        );
        return result.rows.map(formatUser);
      }
    }
    throw err;
  }
};

/**
 * ID'ye göre kullanıcı arar (Read - By ID)
 * @param {number|string} id - Kullanıcı ID'si
 * @returns {Promise<Object|null>} Kullanıcı nesnesi veya bulunamazsa null
 */
const findById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, created_at, updated_at FROM users WHERE id = $1;',
      [numericId]
    );
    return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
  } catch (err) {
    if (err.code === '42703') {
      try {
        const resRole = await pool.query(
          'SELECT id, name, email, role, is_active, department, department_id, graduation_year, created_at, updated_at FROM users WHERE id = $1;',
          [numericId]
        );
        return resRole.rows.length > 0 ? formatUser(resRole.rows[0]) : null;
      } catch (_) {
        const result = await pool.query(
          'SELECT id, name, email, department, department_id, graduation_year, created_at, updated_at FROM users WHERE id = $1;',
          [numericId]
        );
        return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
      }
    }
    throw err;
  }
};

/**
 * E-Postaya göre kullanıcı arar (Read - By Email)
 * @param {string} email - Kullanıcı e-postası
 * @returns {Promise<Object|null>} Kullanıcı nesnesi veya null
 */
const findByEmail = async (email) => {
  if (!email) return null;
  const cleanEmail = String(email).trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1);',
      [cleanEmail]
    );
    return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
  } catch (err) {
    if (err.code === '42703') {
      try {
        const resRole = await pool.query(
          'SELECT id, name, email, role, is_active, department, department_id, graduation_year, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1);',
          [cleanEmail]
        );
        return resRole.rows.length > 0 ? formatUser(resRole.rows[0]) : null;
      } catch (_) {
        const result = await pool.query(
          'SELECT id, name, email, department, department_id, graduation_year, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1);',
          [cleanEmail]
        );
        return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
      }
    }
    throw err;
  }
};

/**
 * Yalnızca kimlik doğrulama (login) işlemi için kullanıcıyı ve parola karmasını getirir.
 * DİKKAT: passwordHash alanı yalnızca sunucu içi verifyPassword kontrolü içindir;
 * ASLA istemciye, API yanıtına veya loglara gönderilmez.
 * @param {string} email - Kullanıcı e-postası
 * @returns {Promise<{ user: Object, passwordHash: string|null }|null>}
 */
const findAuthByEmail = async (email) => {
  if (!email) return null;
  const cleanEmail = String(email).trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, password_hash, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1);',
      [cleanEmail]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      user: formatUser(row),
      passwordHash: row.password_hash || null,
    };
  } catch (err) {
    if (err.code === '42703') {
      try {
        const resRole = await pool.query(
          'SELECT id, name, email, role, is_active, department, department_id, graduation_year, password_hash, created_at, updated_at FROM users WHERE LOWER(email) = LOWER($1);',
          [cleanEmail]
        );
        if (resRole.rows.length === 0) return null;
        return {
          user: formatUser(resRole.rows[0]),
          passwordHash: resRole.rows[0].password_hash || null,
        };
      } catch (_) {
        const user = await findByEmail(cleanEmail);
        return user ? { user, passwordHash: null } : null;
      }
    }
    throw err;
  }
};

/**
 * Yalnızca aktif kullanıcının (/settings) kendi şifresini değiştirmesi sırasında
 * mevcut şifre doğrulaması için ID ile kullanıcıyı ve parola karmasını getirir.
 * @param {number|string} id - Oturumdaki kullanıcı ID'si
 * @returns {Promise<{ user: Object, passwordHash: string|null }|null>}
 */
const findAuthById = async (id) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, password_hash, created_at, updated_at FROM users WHERE id = $1;',
      [numericId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      user: formatUser(row),
      passwordHash: row.password_hash || null,
    };
  } catch (err) {
    if (err.code === '42703') {
      try {
        const resRole = await pool.query(
          'SELECT id, name, email, role, is_active, department, department_id, graduation_year, password_hash, created_at, updated_at FROM users WHERE id = $1;',
          [numericId]
        );
        if (resRole.rows.length === 0) return null;
        return {
          user: formatUser(resRole.rows[0]),
          passwordHash: resRole.rows[0].password_hash || null,
        };
      } catch (_) {
        const user = await findById(numericId);
        return user ? { user, passwordHash: null } : null;
      }
    }
    throw err;
  }
};

/**
 * Yeni bir kullanıcı oluşturur ve veritabanına ekler (Create)
 * @param {Object} userData - Yeni kullanıcı bilgileri
 * @returns {Promise<Object>} Oluşturulan kullanıcı nesnesi
 */
const create = async (userData) => {
  const {
    name,
    email,
    department,
    graduationYear,
    department_id,
    role,
    is_active,
    password_hash,
    phone,
    linkedinUrl,
    linkedin_url,
  } = userData;
  const gradYear = graduationYear ? Number(graduationYear) : new Date().getFullYear();
  const dept = department || 'Belirtilmedi';
  const userRole = role && ['admin', 'alumni', 'student', 'coordinator', 'employer'].includes(role.toLowerCase())
    ? role.toLowerCase()
    : 'alumni';
  const activeStatus = is_active !== undefined ? Boolean(is_active) : true;
  const passwordHash = password_hash || null;
  const userPhone = phone ? String(phone).trim() : null;
  const userLinkedin = (linkedinUrl || linkedin_url) ? String(linkedinUrl || linkedin_url).trim() : null;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, role, is_active, department, department_id, graduation_year, password_hash, phone, linkedin_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, created_at, updated_at;`,
      [name, email, userRole, activeStatus, dept, department_id || null, gradYear, passwordHash, userPhone, userLinkedin]
    );
    return formatUser(result.rows[0]);
  } catch (err) {
    if (err.code === '42703') {
      try {
        const fallbackWithHash = await pool.query(
          `INSERT INTO users (name, email, role, is_active, department, department_id, graduation_year, password_hash)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, name, email, role, is_active, department, department_id, graduation_year, created_at, updated_at;`,
          [name, email, userRole, activeStatus, dept, department_id || null, gradYear, passwordHash]
        );
        const u = formatUser(fallbackWithHash.rows[0]);
        u.phone = userPhone;
        u.linkedinUrl = userLinkedin;
        return u;
      } catch (errHash) {
        if (errHash.code === '42703') {
          const fallbackResult = await pool.query(
            `INSERT INTO users (name, email, department, department_id, graduation_year)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, department, department_id, graduation_year, created_at, updated_at;`,
            [name, email, dept, department_id || null, gradYear]
          );
          const user = formatUser(fallbackResult.rows[0]);
          user.role = userRole;
          user.phone = userPhone;
          user.linkedinUrl = userLinkedin;
          return user;
        }
        throw errHash;
      }
    }
    throw err;
  }
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
 * Kullanıcının sistem rolünü (role) ve aktiflik durumunu (is_active) günceller (Admin işlemi)
 * @param {number|string} id - Kullanıcı ID'si
 * @param {Object} roleData - { role, isActive }
 * @returns {Promise<Object|null>} Güncellenmiş kullanıcı veya null
 */
const updateRoleAndStatus = async (id, roleData = {}) => {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const validRoles = ['admin', 'alumni', 'student', 'coordinator', 'employer'];
  const nextRole =
    roleData.role && validRoles.includes(String(roleData.role).toLowerCase())
      ? String(roleData.role).toLowerCase()
      : current.role || 'alumni';

  let nextActive = current.isActive !== undefined ? Boolean(current.isActive) : true;
  if (roleData.isActive !== undefined) {
    nextActive = roleData.isActive === true || roleData.isActive === 'true' || roleData.isActive === '1';
  } else if (roleData.is_active !== undefined) {
    nextActive = roleData.is_active === true || roleData.is_active === 'true' || roleData.is_active === '1';
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET role = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, email, role, is_active, department, department_id, graduation_year, created_at, updated_at;`,
      [nextRole, nextActive, numericId]
    );
    return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
  } catch (err) {
    if (err.code === '42703') {
      current.role = nextRole;
      current.isActive = nextActive;
      return current;
    }
    throw err;
  }
};

/**
 * Kullanıcının yalnızca kendi profil bilgilerini günceller (/settings).
 * GÜVENLİK KURALI: Kullanıcının kendi rolünü (role) veya aktifliğini (is_active)
 * değiştirmesine KESİNLİKLE izin vermez; role alanı sorguda güncellenmez.
 * @param {number|string} userId - Oturumdaki kullanıcının ID'si (req.session.user.id)
 * @param {Object} profileData - { name, email, department, department_id, graduationYear, phone, linkedinUrl }
 * @returns {Promise<Object|null>} Güncellenmiş kullanıcı veya null
 */
const updateOwnProfile = async (userId, profileData = {}) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return null;

  const current = await findById(numericId);
  if (!current) return null;

  const name = profileData.name !== undefined ? String(profileData.name).trim() : current.name;
  const email = profileData.email !== undefined ? String(profileData.email).trim().toLowerCase() : current.email;
  const department = profileData.department !== undefined ? String(profileData.department).trim() : current.department;
  const department_id = profileData.department_id !== undefined ? profileData.department_id : current.department_id;
  const graduationYear =
    profileData.graduationYear !== undefined && profileData.graduationYear !== ''
      ? Number(profileData.graduationYear)
      : current.graduationYear;
  const phone =
    profileData.phone !== undefined
      ? (profileData.phone ? String(profileData.phone).trim() : null)
      : (current.phone || null);
  const linkedinUrl =
    profileData.linkedinUrl !== undefined
      ? (profileData.linkedinUrl ? String(profileData.linkedinUrl).trim() : null)
      : (current.linkedinUrl || null);

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, department = $3, department_id = $4,
           graduation_year = $5, phone = $6, linkedin_url = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, name, email, role, is_active, department, department_id, graduation_year, phone, linkedin_url, created_at, updated_at;`,
      [name, email, department, department_id || null, graduationYear, phone, linkedinUrl, numericId]
    );
    return result.rows.length > 0 ? formatUser(result.rows[0]) : null;
  } catch (err) {
    if (err.code === '42703') {
      const fallback = await pool.query(
        `UPDATE users
         SET name = $1, email = $2, department = $3, department_id = $4,
             graduation_year = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING id, name, email, department, department_id, graduation_year, created_at, updated_at;`,
        [name, email, department, department_id || null, graduationYear, numericId]
      );
      if (fallback.rows.length === 0) return null;
      const formatted = formatUser(fallback.rows[0]);
      formatted.role = current.role || 'alumni';
      formatted.phone = phone;
      formatted.linkedinUrl = linkedinUrl;
      return formatted;
    }
    throw err;
  }
};

/**
 * Kullanıcının parola karmasını (password_hash) günceller (/settings).
 * @param {number|string} userId - Oturumdaki kullanıcının ID'si
 * @param {string} newPasswordHash - crypto.scrypt ile üretilmiş yeni parola karması
 * @returns {Promise<boolean>} Başarılıysa true
 */
const updatePasswordHash = async (userId, newPasswordHash) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId) || !newPasswordHash) return false;

  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id;`,
    [newPasswordHash, numericId]
  );

  return result.rows.length > 0;
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

// =========================================================================
// İLİŞKİLER (RELATIONSHIPS)
// =========================================================================

/**
 * N:1 İlişki: users -> departments
 * Kullanıcının bağlı olduğu akademik bölümü döner.
 * @param {number|string} userId
 * @returns {Promise<Object|null>} Bölüm nesnesi veya null
 */
const getDepartment = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return null;

  const result = await pool.query(
    `SELECT d.id, d.name, d.code, d.faculty, d.created_at
     FROM users u
     JOIN departments d ON u.department_id = d.id
     WHERE u.id = $1;`,
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
 * 1:N İlişki: users -> announcements
 * Kullanıcının yazar olduğu duyuruları döner.
 * @param {number|string} userId
 * @returns {Promise<Array>} Duyurular listesi
 */
const getAnnouncements = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, title, content, category, author, author_id, date, created_at, updated_at
     FROM announcements
     WHERE author_id = $1
     ORDER BY date DESC, id DESC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    author: row.author,
    authorId: row.author_id,
    date: row.date ? (row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date) : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }));
};

/**
 * 1:N İlişki: users -> events (Organizatör)
 * Kullanıcının organize ettiği etkinlikleri döner.
 * @param {number|string} userId
 * @returns {Promise<Array>} Etkinlik listesi
 */
const getOrganizedEvents = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, title, description, location, event_date, capacity, organizer_id, created_at, updated_at
     FROM events
     WHERE organizer_id = $1
     ORDER BY event_date ASC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.event_date ? new Date(row.event_date).toISOString() : null,
    capacity: row.capacity !== null ? Number(row.capacity) : null,
    organizerId: row.organizer_id,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }));
};

/**
 * N:N İlişki: users <-> events (Kayıt Olunan Etkinlikler)
 * Kullanıcının kayıt olduğu etkinlikleri döner.
 * @param {number|string} userId
 * @returns {Promise<Array>} Kayıt olunan etkinlik listesi
 */
const getRegisteredEvents = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT e.id, e.title, e.description, e.location, e.event_date, e.capacity, e.organizer_id,
            er.registration_date, er.status as registration_status
     FROM event_registrations er
     JOIN events e ON er.event_id = e.id
     WHERE er.user_id = $1
     ORDER BY e.event_date ASC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.event_date ? new Date(row.event_date).toISOString() : null,
    capacity: row.capacity !== null ? Number(row.capacity) : null,
    organizerId: row.organizer_id,
    registrationDate: row.registration_date ? new Date(row.registration_date).toISOString() : null,
    registrationStatus: row.registration_status,
  }));
};

/**
 * 1:N İlişki: users -> job_postings
 * Kullanıcının yayınladığı iş ilanlarını döner.
 * @param {number|string} userId
 * @returns {Promise<Array>} İş ilanları listesi
 */
const getJobPostings = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, title, company, location, employment_type, description, requirements,
            contact_email, application_url, salary_range, deadline, is_active,
            posted_by, department_id, created_at, updated_at
     FROM job_postings
     WHERE posted_by = $1
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

/**
 * 1:N İlişki: users -> applications
 * Kullanıcının yaptığı tüm iş başvurularını döner.
 * @param {number|string} userId
 * @returns {Promise<Array>} Başvuru listesi
 */
const getApplications = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT id, job_posting_id, user_id, resume_url, cover_note, status, applied_at, updated_at
     FROM applications
     WHERE user_id = $1
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
 * N:N İlişki: users <-> job_postings (Başvurulan İlanlar)
 * Kullanıcının başvurduğu iş ilanlarını ve başvuru detaylarını döner.
 * @param {number|string} userId
 * @returns {Promise<Array>} Başvurulan ilanlar listesi
 */
const getAppliedJobs = async (userId) => {
  const numericId = parseInt(userId, 10);
  if (isNaN(numericId)) return [];

  const result = await pool.query(
    `SELECT jp.id, jp.title, jp.company, jp.location, jp.employment_type,
            a.id as application_id, a.status as application_status, a.applied_at
     FROM applications a
     JOIN job_postings jp ON a.job_posting_id = jp.id
     WHERE a.user_id = $1
     ORDER BY a.applied_at DESC;`,
    [numericId]
  );

  return result.rows.map((row) => ({
    jobId: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    employmentType: row.employment_type,
    applicationId: row.application_id,
    applicationStatus: row.application_status,
    appliedAt: row.applied_at ? new Date(row.applied_at).toISOString() : null,
  }));
};

const UserModel = {
  findAll,
  findById,
  findByEmail,
  findAuthByEmail,
  findAuthById,
  create,
  replace,
  update,
  updateRoleAndStatus,
  updateOwnProfile,
  updatePasswordHash,
  remove,
  delete: remove,
  // İlişkisel fonksiyonlar
  getDepartment,
  getAnnouncements,
  getOrganizedEvents,
  getRegisteredEvents,
  getJobPostings,
  getApplications,
  getAppliedJobs,
  relationships: {
    department: { type: 'belongsTo', target: 'departments', foreignKey: 'department_id' },
    announcements: { type: 'hasMany', target: 'announcements', foreignKey: 'author_id' },
    organizedEvents: { type: 'hasMany', target: 'events', foreignKey: 'organizer_id' },
    eventRegistrations: { type: 'hasMany', target: 'event_registrations', foreignKey: 'user_id' },
    registeredEvents: { type: 'belongsToMany', target: 'events', through: 'event_registrations', foreignKey: 'user_id', otherKey: 'event_id' },
    jobPostings: { type: 'hasMany', target: 'job_postings', foreignKey: 'posted_by' },
    applications: { type: 'hasMany', target: 'applications', foreignKey: 'user_id' },
    appliedJobs: { type: 'belongsToMany', target: 'job_postings', through: 'applications', foreignKey: 'user_id', otherKey: 'job_posting_id' },
  },
};

module.exports = UserModel;
