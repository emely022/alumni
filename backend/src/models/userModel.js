/**
 * User Model (In-Memory)
 * 
 * Veritabanı bağlantısı kullanılmadan, bellek üzerinde (in-memory) çalışan
 * ve CRUD (Create, Read, Update, Delete) operasyonlarını sağlayan model katmanıdır.
 */

// Başlangıç tohum verileri (In-memory data store)
let users = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@alumni.edu',
    department: 'Bilgisayar Mühendisliği',
    graduationYear: 2022,
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    email: 'ayse@alumni.edu',
    department: 'Endüstri Mühendisliği',
    graduationYear: 2023,
  },
];

/**
 * Tüm kullanıcıları döner (Read - All)
 * @returns {Array} Kullanıcı listesi
 */
const findAll = () => {
  return [...users];
};

/**
 * ID'ye göre kullanıcı arar (Read - By ID)
 * @param {number|string} id - Kullanıcı ID'si
 * @returns {Object|null} Kullanıcı nesnesi veya bulunamazsa null
 */
const findById = (id) => {
  const numericId = parseInt(id, 10);
  const user = users.find((u) => u.id === numericId);
  return user ? { ...user } : null;
};

/**
 * Yeni bir kullanıcı oluşturur ve listeye ekler (Create)
 * @param {Object} userData - Yeni kullanıcı bilgileri
 * @returns {Object} Oluşturulan kullanıcı nesnesi
 */
const create = (userData) => {
  const { name, email, department, graduationYear } = userData;
  const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {
    id: nextId,
    name,
    email,
    department: department || 'Belirtilmedi',
    graduationYear: graduationYear ? Number(graduationYear) : new Date().getFullYear(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return { ...newUser };
};

/**
 * Kullanıcıyı tamamen günceller / üzerine yazar (Update - PUT)
 * @param {number|string} id - Güncellenecek kullanıcı ID'si
 * @param {Object} userData - Güncel kullanıcı bilgileri
 * @returns {Object|null} Güncellenmiş kullanıcı veya bulunamazsa null
 */
const replace = (id, userData) => {
  const numericId = parseInt(id, 10);
  const userIndex = users.findIndex((u) => u.id === numericId);

  if (userIndex === -1) {
    return null;
  }

  const { name, email, department, graduationYear } = userData;
  const updatedUser = {
    id: numericId,
    name,
    email,
    department,
    graduationYear: Number(graduationYear),
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  return { ...updatedUser };
};

/**
 * Kullanıcıyı kısmi olarak günceller (Update - PATCH)
 * @param {number|string} id - Güncellenecek kullanıcı ID'si
 * @param {Object} partialData - Güncellenecek alanlar
 * @returns {Object|null} Güncellenmiş kullanıcı veya bulunamazsa null
 */
const update = (id, partialData) => {
  const numericId = parseInt(id, 10);
  const userIndex = users.findIndex((u) => u.id === numericId);

  if (userIndex === -1) {
    return null;
  }

  const currentUser = users[userIndex];
  const { name, email, department, graduationYear } = partialData;

  const updatedUser = {
    ...currentUser,
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(department !== undefined && { department }),
    ...(graduationYear !== undefined && { graduationYear: Number(graduationYear) }),
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  return { ...updatedUser };
};

/**
 * Kullanıcıyı ID'ye göre listeden siler (Delete)
 * @param {number|string} id - Silinecek kullanıcı ID'si
 * @returns {Object|null} Silinen kullanıcı veya bulunamazsa null
 */
const remove = (id) => {
  const numericId = parseInt(id, 10);
  const userIndex = users.findIndex((u) => u.id === numericId);

  if (userIndex === -1) {
    return null;
  }

  const [deletedUser] = users.splice(userIndex, 1);
  return { ...deletedUser };
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
