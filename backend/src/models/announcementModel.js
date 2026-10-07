/**
 * Announcement Model (In-Memory)
 * 
 * Veritabanı bağlantısı kullanılmadan, bellek üzerinde (in-memory) çalışan
 * ve CRUD (Create, Read, Update, Delete) operasyonlarını sağlayan duyuru modelidir.
 */

// Başlangıç örnek duyuru verileri (In-memory store)
let announcements = [
  {
    id: 1,
    title: '2026 Yıllık Mezunlar Buluşması',
    content: 'Tüm mezunlarımızı 15 Mayıs 2026 tarihinde ana kampüsümüzde düzenlenecek geleneksel buluşmaya davet ediyoruz.',
    category: 'Etkinlik',
    author: 'Mezunlar Ofisi',
    date: '2026-05-15',
    createdAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Sonbahar Kariyer ve Mentorluk Günleri',
    content: 'Yeni mezunlarımız ile sektör lideri deneyimli mezunlarımızı buluşturan mentorluk programı başvuruları başladı.',
    category: 'Kariyer',
    author: 'Kariyer Merkezi',
    date: '2026-11-10',
    createdAt: '2026-10-03T11:30:00.000Z',
  },
];

/**
 * Tüm duyuruları döner (Read - All)
 * @returns {Array} Duyurular listesi
 */
const findAll = () => {
  return [...announcements];
};

/**
 * ID'ye göre duyuru arar (Read - By ID)
 * @param {number|string} id - Duyuru ID'si
 * @returns {Object|null} Duyuru nesnesi veya bulunamazsa null
 */
const findById = (id) => {
  const numericId = parseInt(id, 10);
  const announcement = announcements.find((a) => a.id === numericId);
  return announcement ? { ...announcement } : null;
};

/**
 * Yeni bir duyuru oluşturur (Create)
 * @param {Object} data - Duyuru bilgileri
 * @returns {Object} Oluşturulan duyuru nesnesi
 */
const create = (data) => {
  const { title, content, category, author, date } = data;
  const nextId = announcements.length > 0 ? Math.max(...announcements.map((a) => a.id)) + 1 : 1;

  const now = new Date();
  const newAnnouncement = {
    id: nextId,
    title,
    content,
    category: category || 'Genel',
    author: author || 'Yönetim',
    date: date || now.toISOString().split('T')[0],
    createdAt: now.toISOString(),
  };

  announcements.push(newAnnouncement);
  return { ...newAnnouncement };
};

/**
 * Duyuruyu tamamen günceller / üzerine yazar (Update - PUT)
 * @param {number|string} id - Güncellenecek duyuru ID'si
 * @param {Object} data - Yeni duyuru bilgileri
 * @returns {Object|null} Güncellenmiş duyuru veya bulunamazsa null
 */
const replace = (id, data) => {
  const numericId = parseInt(id, 10);
  const index = announcements.findIndex((a) => a.id === numericId);

  if (index === -1) {
    return null;
  }

  const { title, content, category, author, date } = data;
  const updatedAnnouncement = {
    id: numericId,
    title,
    content,
    category: category || 'Genel',
    author: author || 'Yönetim',
    date: date || announcements[index].date,
    createdAt: announcements[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  announcements[index] = updatedAnnouncement;
  return { ...updatedAnnouncement };
};

/**
 * Duyuruyu kısmi olarak günceller (Update - PATCH)
 * @param {number|string} id - Güncellenecek duyuru ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Object|null} Güncellenmiş duyuru veya bulunamazsa null
 */
const update = (id, partialData) => {
  const numericId = parseInt(id, 10);
  const index = announcements.findIndex((a) => a.id === numericId);

  if (index === -1) {
    return null;
  }

  const current = announcements[index];
  const { title, content, category, author, date } = partialData;

  const updatedAnnouncement = {
    ...current,
    ...(title !== undefined && { title }),
    ...(content !== undefined && { content }),
    ...(category !== undefined && { category }),
    ...(author !== undefined && { author }),
    ...(date !== undefined && { date }),
    updatedAt: new Date().toISOString(),
  };

  announcements[index] = updatedAnnouncement;
  return { ...updatedAnnouncement };
};

/**
 * Duyuruyu ID'ye göre siler (Delete)
 * @param {number|string} id - Silinecek duyuru ID'si
 * @returns {Object|null} Silinen duyuru veya bulunamazsa null
 */
const remove = (id) => {
  const numericId = parseInt(id, 10);
  const index = announcements.findIndex((a) => a.id === numericId);

  if (index === -1) {
    return null;
  }

  const [deletedAnnouncement] = announcements.splice(index, 1);
  return { ...deletedAnnouncement };
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
