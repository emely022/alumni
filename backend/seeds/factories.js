/**
 * Entity Factories for Alumni Tracking System
 * 
 * ddd.md veri tasarım dokümanı ile birebir uyumlu test ve seed veri üreticileri (factories).
 * İhtiyaca göre varsayılan alan değerleri üretir veya verilen override değerleri ile birleştirir.
 */

let userCounter = 1;
let deptCounter = 1;
let jobCounter = 1;

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

/**
 * Job Posting Factory
 * @param {Object} overrides 
 * @returns {Object}
 */
const jobPostingFactory = (overrides = {}) => {
  const index = jobCounter++;
  return {
    title: overrides.title || `Yazılım Geliştirici ${index}`,
    company: overrides.company || `Teknoloji Şirketi ${index}`,
    location: overrides.location || 'İstanbul / Hibrit',
    employment_type: overrides.employment_type || overrides.employmentType || 'full-time',
    description: overrides.description || 'Modern web ve bulut teknolojileri üzerine projeler geliştirecek ekip arkadaşı arıyoruz.',
    requirements: overrides.requirements || 'Node.js, PostgreSQL ve Docker tecrübesi.',
    contact_email: overrides.contact_email || overrides.contactEmail || `kariyer${index}@teknoloji.com`,
    application_url: overrides.application_url || overrides.applicationUrl || `https://kariyer.teknoloji${index}.com/ilan`,
    salary_range: overrides.salary_range || overrides.salaryRange || '80.000 - 120.000 TL',
    deadline: overrides.deadline || '2026-12-31',
    is_active: overrides.is_active !== undefined ? overrides.is_active : (overrides.isActive !== undefined ? overrides.isActive : true),
    posted_by: overrides.posted_by !== undefined ? overrides.posted_by : (overrides.postedBy !== undefined ? overrides.postedBy : null),
    department_id: overrides.department_id !== undefined ? overrides.department_id : (overrides.departmentId !== undefined ? overrides.departmentId : null),
    ...overrides,
  };
};

module.exports = {
  departmentFactory,
  userFactory,
  announcementFactory,
  eventFactory,
  eventRegistrationFactory,
  jobPostingFactory,
};
