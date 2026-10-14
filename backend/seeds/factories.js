/**
 * Entity Factories for Alumni Tracking System
 * 
 * ddd.md veri tasarım dokümanı ile birebir uyumlu test ve seed veri üreticileri (factories).
 * İhtiyaca göre varsayılan alan değerleri üretir veya verilen override değerleri ile birleştirir.
 */

let userCounter = 1;
let deptCounter = 1;

/**
 * Department Factory
 * @param {Object} overrides 
 * @returns {Object}
 */
const departmentFactory = (overrides = {}) => {
  const index = deptCounter++;
  return {
    name: overrides.name || `Bölüm ${index}`,
    code: overrides.code || `DEPT${index}`,
    faculty: overrides.faculty || 'Mühendislik Fakültesi',
    ...overrides,
  };
};

/**
 * User Factory
 * @param {Object} overrides 
 * @returns {Object}
 */
const userFactory = (overrides = {}) => {
  const index = userCounter++;
  return {
    name: overrides.name || `Mezun Kullanıcı ${index}`,
    email: overrides.email || `mezun${index}@alumni.edu`,
    department_id: overrides.department_id !== undefined ? overrides.department_id : null,
    department: overrides.department || 'Bilgisayar Mühendisliği',
    graduation_year: overrides.graduation_year || 2020 + (index % 5),
    ...overrides,
  };
};

/**
 * Announcement Factory
 * @param {Object} overrides 
 * @returns {Object}
 */
const announcementFactory = (overrides = {}) => {
  return {
    title: overrides.title || 'Genel Duyuru Başlığı',
    content: overrides.content || 'Duyurunun detaylı içeriği burada yer almaktadır.',
    category: overrides.category || 'Genel',
    author: overrides.author || 'Mezunlar Ofisi',
    author_id: overrides.author_id !== undefined ? overrides.author_id : null,
    date: overrides.date || new Date().toISOString().split('T')[0],
    ...overrides,
  };
};

/**
 * Event Factory
 * @param {Object} overrides 
 * @returns {Object}
 */
const eventFactory = (overrides = {}) => {
  const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return {
    title: overrides.title || 'Mezun Buluşması Etkinliği',
    description: overrides.description || 'Tüm mezunlarımızın katılımına açık networking etkinliği.',
    location: overrides.location || 'Ana Kampüs Oditoryum',
    event_date: overrides.event_date || defaultDate,
    capacity: overrides.capacity !== undefined ? overrides.capacity : 100,
    organizer_id: overrides.organizer_id !== undefined ? overrides.organizer_id : null,
    ...overrides,
  };
};

/**
 * Event Registration Factory
 * @param {Object} overrides 
 * @returns {Object}
 */
const eventRegistrationFactory = (overrides = {}) => {
  return {
    event_id: overrides.event_id,
    user_id: overrides.user_id,
    status: overrides.status || 'registered',
    ...overrides,
  };
};

module.exports = {
  departmentFactory,
  userFactory,
  announcementFactory,
  eventFactory,
  eventRegistrationFactory,
};
