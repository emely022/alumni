// In-memory data store (Veritabanı kullanılmadan bellek üzerinde tutulur - "do not database" kuralı)
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

// GET /api/users - Tüm kullanıcıları listeler
const getUsers = (req, res) => {
  res.status(200).json(users);
};

// GET /api/users/:id - ID'ye göre tekil kullanıcı getirir
const getUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id, 10));
  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }
  return res.status(200).json(user);
};

// POST /api/users - Yeni kullanıcı ekler
const createUser = (req, res) => {
  const { name, email, department, graduationYear } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'name ve email alanları zorunludur.',
    });
  }

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

  return res.status(201).json({
    message: 'Kullanıcı başarıyla eklendi',
    user: newUser,
  });
};

// PUT /api/users/:id - Kullanıcıyı tamamen değiştirir (Tüm alanlar zorunlu)
const updateUserPut = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const { name, email, department, graduationYear } = req.body;

  // PUT: Tüm alanlar zorunludur
  if (!name || !email || !department || graduationYear === undefined || graduationYear === null || graduationYear === '') {
    return res.status(400).json({
      error: 'PUT isteğinde tüm alanlar (name, email, department, graduationYear) zorunludur.',
    });
  }

  // Kullanıcının tüm bilgilerini tamamen değiştirip (overwrite) günceller
  const updatedUser = {
    id: userId,
    name,
    email,
    department,
    graduationYear: Number(graduationYear),
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;

  return res.status(200).json({
    message: 'Kullanıcı güncellendi',
    user: updatedUser,
  });
};

// PATCH /api/users/:id - Kullanıcıyı kısmi olarak günceller (Sadece gönderilen alanlar değişir)
const updateUserPatch = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const { name, email, department, graduationYear } = req.body;
  const currentUser = users[userIndex];

  // PATCH: Sadece gelen alanları güncelle, diğer alanları koru
  const updatedUser = {
    ...currentUser,
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(department !== undefined && { department }),
    ...(graduationYear !== undefined && { graduationYear: Number(graduationYear) }),
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;

  return res.status(200).json({
    message: 'Kullanıcı güncellendi',
    user: updatedUser,
  });
};

// DELETE /api/users/:id - Kullanıcıyı siler
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  return res.status(200).json({
    message: 'Kullanıcı başarıyla silindi',
    user: deletedUser,
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};


