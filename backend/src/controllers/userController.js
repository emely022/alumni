const UserModel = require('../models/userModel');
const DepartmentModel = require('../models/departmentModel');
const userView = require('../views/userView');
const registerView = require('../views/registerView');
const loginView = require('../views/loginView');
const profileView = require('../views/profileView');
const { hashPassword, verifyPassword } = require('../utils/password');
const { setCurrentUser } = require('../utils/sessionContext');

/**
 * UserController
 * 
 * Sorumluluk: Web / MVC Controller Katmanı
 * İstekleri karşılar, UserModel üzerinden veri operasyonlarını yürütür
 * ve userView/registerView üzerinden HTML sayfalarını render ederek istemciye sunar.
 */

// GET /register veya /users/new - Üyelik ve Mezun Kayıt Sayfası
const getRegisterPage = async (req, res) => {
  try {
    let departments = [];
    try {
      departments = await DepartmentModel.findAll();
    } catch (_) {
      departments = [
        { id: 1, name: 'Bilgisayar Mühendisliği', code: 'CENG', faculty: 'Mühendislik Fakültesi' },
        { id: 2, name: 'Hukuk', code: 'LAW', faculty: 'Hukuk Fakültesi' },
        { id: 3, name: 'İstanbul Tıp', code: 'MED', faculty: 'İstanbul Tıp Fakültesi' },
        { id: 4, name: 'İşletme', code: 'BUS', faculty: 'İşletme Fakültesi' },
        { id: 5, name: 'İktisat', code: 'ECON', faculty: 'İktisat Fakültesi' },
        { id: 6, name: 'İletişim', code: 'COMM', faculty: 'İletişim Fakültesi' },
      ];
    }

    const success = req.query && req.query.success
      ? (req.query.success === 'true' ? 'Kaydınız başarıyla tamamlandı! İstanbul Üniversitesi Mezunlar Ağına hoş geldiniz.' : req.query.success)
      : null;
    const error = req.query && req.query.error ? req.query.error : null;

    const html = registerView.renderRegisterPage({
      departments,
      success,
      error,
      formData: req.query || {},
    });

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Kayıt sayfası yüklenirken bir hata oluştu: ' + err.message);
  }
};

// POST /register - Yeni Üye & Mezun Kaydını Gerçekleştirir
const handleRegister = async (req, res) => {
  const { name, email, role, department, department_id, graduationYear, phone, linkedinUrl, password, passwordConfirm } = req.body || {};

  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  // Zorunlu alan kontrolü
  if (!name || !email) {
    const errorMsg = 'Ad Soyad ve E-Posta alanları zorunludur.';
    if (isHtml) {
      return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name || '') + '&email=' + encodeURIComponent(email || '') + '&role=' + encodeURIComponent(role || ''));
    }
    return res.status(400).json({ error: errorMsg });
  }

  // E-Posta format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    const errorMsg = 'Lütfen geçerli bir e-posta adresi giriniz.';
    if (isHtml) {
      return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name) + '&role=' + encodeURIComponent(role || ''));
    }
    return res.status(400).json({ error: errorMsg });
  }

  // Şifre zorunluluk kontrolü
  if (!password) {
    const errorMsg = 'Şifre alanı zorunludur.';
    if (isHtml) {
      return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&role=' + encodeURIComponent(role || ''));
    }
    return res.status(400).json({ error: errorMsg });
  }

  // Şifre uzunluk kontrolü (en az 8 karakter)
  if (typeof password !== 'string' || password.length < 8) {
    const errorMsg = 'Şifre en az 8 karakter uzunluğunda olmalıdır.';
    if (isHtml) {
      return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&role=' + encodeURIComponent(role || ''));
    }
    return res.status(400).json({ error: errorMsg });
  }

  // Şifre eşleşme kontrolü
  if (password !== passwordConfirm) {
    const errorMsg = 'Girilen şifreler eşleşmiyor, lütfen kontrol ediniz.';
    if (isHtml) {
      return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&role=' + encodeURIComponent(role || ''));
    }
    return res.status(400).json({ error: errorMsg });
  }

  try {
    // E-Posta tekillik kontrolü
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const errorMsg = 'Bu e-posta adresi (' + email + ') ile kayıtlı bir kullanıcı zaten mevcut.';
      if (isHtml) {
        return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name) + '&role=' + encodeURIComponent(role || ''));
      }
      return res.status(409).json({ error: errorMsg });
    }

    let deptName = department ? String(department).trim() : '';
    let deptId = department_id ? parseInt(department_id, 10) : null;
    if (isNaN(deptId)) deptId = null;

    if (deptId && !deptName) {
      try {
        const foundDept = await DepartmentModel.findById(deptId);
        if (foundDept) {
          deptName = foundDept.name;
        }
      } catch (_) {}
    }

    // Şifreyi Node.js crypto.scrypt ile güvenli hash haline getir
    const passwordHash = await hashPassword(password);

    const newUser = await UserModel.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role: role || 'alumni',
      department: deptName || 'Belirtilmedi',
      department_id: deptId,
      graduationYear: graduationYear ? Number(graduationYear) : new Date().getFullYear(),
      phone: phone ? String(phone).trim() : null,
      linkedinUrl: linkedinUrl ? String(linkedinUrl).trim() : null,
      password_hash: passwordHash,
    });

    if (isHtml) {
      return res.redirect('/register?success=' + encodeURIComponent('Kaydınız başarıyla tamamlandı! İstanbul Üniversitesi Mezun Bilgi Sistemine hoş geldiniz.'));
    }

    return res.status(201).json({
      message: 'Kayıt başarıyla oluşturuldu.',
      user: newUser,
    });
  } catch (err) {
    const errorMsg = err.code === '23505'
      ? 'Bu e-posta adresi zaten sisteme kayıtlı.'
      : 'Kayıt işlemi sırasında bir veritabanı hatası oluştu.';

    if (isHtml) {
      return res.redirect('/register?error=' + encodeURIComponent(errorMsg) + '&name=' + encodeURIComponent(name) + '&role=' + encodeURIComponent(role || ''));
    }
    return res.status(err.code === '23505' ? 409 : 500).json({ error: errorMsg });
  }
};

// GET /login - Kullanıcı Giriş Sayfası
const getLoginPage = async (req, res) => {
  try {
    const success = req.query && req.query.success ? req.query.success : null;
    const error = req.query && req.query.error ? req.query.error : null;
    const currentUser = req.session && req.session.user ? req.session.user : null;

    const html = loginView.renderLoginPage({
      success,
      error,
      formData: {
        email: req.query && req.query.email ? req.query.email : '',
      },
      currentUser,
    });

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Giriş sayfası yüklenirken bir hata oluştu.');
  }
};

// POST /login - Kullanıcı Kimlik Doğrulaması ve Oturum Başlatma
const handleLogin = async (req, res) => {
  const { email, password } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  // Güvenlik kuralı: E-posta mı şifre mi yanlış olduğunu ASLA belirtmeyen genel mesaj
  const GENERIC_AUTH_ERROR = 'E-posta adresi veya şifre hatalı.';

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    if (isHtml) {
      return res.redirect(
        '/login?error=' + encodeURIComponent(GENERIC_AUTH_ERROR) + '&email=' + encodeURIComponent(email || '')
      );
    }
    return res.status(401).json({ error: GENERIC_AUTH_ERROR });
  }

  try {
    const authRecord = await UserModel.findAuthByEmail(email);

    // Kullanıcı bulunamadıysa, şifre hash'i yoksa veya hesap pasifse aynı genel mesajı dön
    if (!authRecord || !authRecord.user || !authRecord.passwordHash || authRecord.user.isActive === false) {
      if (isHtml) {
        return res.redirect(
          '/login?error=' + encodeURIComponent(GENERIC_AUTH_ERROR) + '&email=' + encodeURIComponent(email)
        );
      }
      return res.status(401).json({ error: GENERIC_AUTH_ERROR });
    }

    // Register ile birebir aynı crypto.scrypt yöntemiyle şifre doğrulaması
    const isPasswordValid = await verifyPassword(password, authRecord.passwordHash);
    if (!isPasswordValid) {
      if (isHtml) {
        return res.redirect(
          '/login?error=' + encodeURIComponent(GENERIC_AUTH_ERROR) + '&email=' + encodeURIComponent(email)
        );
      }
      return res.status(401).json({ error: GENERIC_AUTH_ERROR });
    }

    // Oturum nesnesi (şifre veya hash kesinlikle yer almaz)
    const sessionUser = {
      id: authRecord.user.id,
      name: authRecord.user.name,
      email: authRecord.user.email,
      role: authRecord.user.role || 'alumni',
      department: authRecord.user.department || 'Belirtilmedi',
      department_id: authRecord.user.department_id || null,
      graduationYear: authRecord.user.graduationYear || null,
      phone: authRecord.user.phone || null,
      linkedinUrl: authRecord.user.linkedinUrl || null,
    };

    if (req.session) {
      req.session.user = sessionUser;
    }
    setCurrentUser(sessionUser);

    if (isHtml) {
      return res.redirect('/');
    }

    return res.status(200).json({
      message: 'Giriş başarılı.',
      user: sessionUser,
    });
  } catch (err) {
    if (isHtml) {
      return res.redirect(
        '/login?error=' + encodeURIComponent('Giriş işlemi sırasında bir sunucu hatası oluştu.') + '&email=' + encodeURIComponent(email)
      );
    }
    return res.status(500).json({ error: 'Giriş işlemi sırasında bir sunucu hatası oluştu.' });
  }
};

// POST /logout - Oturumu Sonlandırır ve Çerezi Temizler
const handleLogout = (req, res) => {
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
  setCurrentUser(null);

  const finishLogout = () => {
    if (res && typeof res.clearCookie === 'function') {
      res.clearCookie('iu_alumni.sid');
    }
    if (isHtml) {
      return res.redirect('/login?success=' + encodeURIComponent('Oturumunuz güvenli bir şekilde sonlandırıldı.'));
    }
    return res.status(200).json({ message: 'Oturum başarıyla sonlandırıldı.' });
  };

  if (req && req.session && typeof req.session.destroy === 'function') {
    return req.session.destroy(() => {
      finishLogout();
    });
  }

  if (req && req.session) {
    req.session.user = null;
  }
  return finishLogout();
};

// GET /profile - Oturum açmış kullanıcının yalnızca kendi profil sayfası
const getProfilePage = async (req, res) => {
  try {
    const sessionUser = req.session && req.session.user ? req.session.user : null;
    if (!sessionUser) {
      return res.redirect('/login');
    }

    // İşlemler URL'deki id'ye göre değil oturumdaki kullanıcıya (sessionUser.id) göre yapılır
    let user = null;
    try {
      user = await UserModel.findById(sessionUser.id);
    } catch (_) {}
    user = user || sessionUser;

    // Oturum verisini en güncel veritabanı kaydıyla senkronize tut
    req.session.user = {
      ...sessionUser,
      name: user.name,
      email: user.email,
      role: user.role || sessionUser.role || 'alumni',
      department: user.department || sessionUser.department || 'Belirtilmedi',
      department_id: user.department_id !== undefined ? user.department_id : sessionUser.department_id,
      graduationYear: user.graduationYear !== undefined ? user.graduationYear : sessionUser.graduationYear,
      phone: user.phone !== undefined ? user.phone : sessionUser.phone,
      linkedinUrl: user.linkedinUrl !== undefined ? user.linkedinUrl : sessionUser.linkedinUrl,
    };
    setCurrentUser(req.session.user);

    let applicationsCount = 0;
    let jobPostingsCount = 0;
    let announcementsCount = 0;
    try {
      const [apps, jobs, anns] = await Promise.all([
        UserModel.getApplications(sessionUser.id).catch(() => []),
        UserModel.getJobPostings(sessionUser.id).catch(() => []),
        UserModel.getAnnouncements(sessionUser.id).catch(() => []),
      ]);
      applicationsCount = apps.length;
      jobPostingsCount = jobs.length;
      announcementsCount = anns.length;
    } catch (_) {}

    const success = req.query && req.query.success ? req.query.success : null;
    const error = req.query && req.query.error ? req.query.error : null;

    const html = profileView.renderProfilePage(req.session.user, {
      success,
      error,
      summary: {
        applicationsCount,
        jobPostingsCount,
        announcementsCount,
      },
    });

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Profil sayfası yüklenirken bir hata oluştu.');
  }
};

// GET /settings - Oturum açmış kullanıcının kendi ayarlar ve şifre değiştirme sayfası
const getSettingsPage = async (req, res) => {
  try {
    const sessionUser = req.session && req.session.user ? req.session.user : null;
    if (!sessionUser) {
      return res.redirect('/login');
    }

    let user = null;
    try {
      user = await UserModel.findById(sessionUser.id);
    } catch (_) {}
    user = user || sessionUser;

    let departments = [];
    try {
      departments = await DepartmentModel.findAll();
    } catch (_) {
      departments = [
        { id: 1, name: 'Bilgisayar Mühendisliği', code: 'CENG', faculty: 'Mühendislik Fakültesi' },
        { id: 2, name: 'Hukuk', code: 'LAW', faculty: 'Hukuk Fakültesi' },
        { id: 3, name: 'İstanbul Tıp', code: 'MED', faculty: 'İstanbul Tıp Fakültesi' },
        { id: 4, name: 'İşletme', code: 'BUS', faculty: 'İşletme Fakültesi' },
      ];
    }

    const success = req.query && req.query.success ? req.query.success : null;
    const error = req.query && req.query.error ? req.query.error : null;

    const html = profileView.renderSettingsPage(user, {
      departments,
      success,
      error,
    });

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Ayarlar sayfası yüklenirken bir hata oluştu.');
  }
};

// POST /settings/password - Oturumdaki kullanıcının kendi şifresini değiştirmesi
const handleChangePassword = async (req, res) => {
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
  const sessionUser = req.session && req.session.user ? req.session.user : null;

  if (!sessionUser) {
    if (isHtml) return res.redirect('/login');
    return res.status(401).json({ error: 'Oturum açmanız gerekmektedir.' });
  }

  const { currentPassword, newPassword, newPasswordConfirm } = req.body || {};

  if (!currentPassword) {
    const msg = 'Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.';
    if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    const msg = 'Yeni şifre en az 8 karakter uzunluğunda olmalıdır.';
    if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  if (newPassword !== newPasswordConfirm) {
    const msg = 'Yeni şifre ve yeni şifre tekrarı birbiriyle eşleşmiyor.';
    if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  try {
    // URL'deki id'ye göre değil oturumdaki kullanıcıya (sessionUser.id) göre doğrulama
    const authRecord = await UserModel.findAuthById(sessionUser.id);
    if (!authRecord || !authRecord.user) {
      const msg = 'Kullanıcı hesabı doğrulanamadı.';
      if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
      return res.status(404).json({ error: msg });
    }

    if (authRecord.passwordHash) {
      const isCurrentValid = await verifyPassword(currentPassword, authRecord.passwordHash);
      if (!isCurrentValid) {
        const msg = 'Mevcut şifreniz hatalı.';
        if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
        return res.status(400).json({ error: msg });
      }
    }

    const newHash = await hashPassword(newPassword);
    await UserModel.updatePasswordHash(sessionUser.id, newHash);

    const successMsg = 'Şifreniz başarıyla değiştirildi.';
    if (isHtml) {
      return res.redirect('/settings?success=' + encodeURIComponent(successMsg));
    }
    return res.status(200).json({ message: successMsg });
  } catch (err) {
    const msg = 'Şifre güncellenirken bir hata oluştu.';
    if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
    return res.status(500).json({ error: msg });
  }
};

// POST /settings - Oturumdaki kullanıcının kendi profil bilgilerini güncellemesi (Rol değiştirilemez!)
const handleUpdateSettings = async (req, res) => {
  const body = req.body || {};

  // Eğer aynı endpoint'e şifre değiştirme formu gönderildiyse şifre işleyicisine yönlendir
  if (body.formType === 'password' || (body.currentPassword && body.newPassword)) {
    return handleChangePassword(req, res);
  }

  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
  const sessionUser = req.session && req.session.user ? req.session.user : null;

  if (!sessionUser) {
    if (isHtml) return res.redirect('/login');
    return res.status(401).json({ error: 'Oturum açmanız gerekmektedir.' });
  }

  const { name, email, department, department_id, graduationYear, phone, linkedinUrl } = body;

  if (!name || !String(name).trim() || !email || !String(email).trim()) {
    const msg = 'Ad Soyad ve E-Posta alanları zorunludur.';
    if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  try {
    let deptName = department ? String(department).trim() : '';
    let deptId = department_id ? parseInt(department_id, 10) : null;
    if (isNaN(deptId)) deptId = null;

    if (deptId && !deptName) {
      try {
        const foundDept = await DepartmentModel.findById(deptId);
        if (foundDept && foundDept.name) {
          deptName = foundDept.name;
        }
      } catch (_) {}
    }

    // İşlem yalnızca oturumdaki kullanıcı (sessionUser.id) üzerinde yapılır; role alanı ASLA değiştirilmez
    const updatedUser = await UserModel.updateOwnProfile(sessionUser.id, {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      department: deptName || sessionUser.department || 'Belirtilmedi',
      department_id: deptId,
      graduationYear: graduationYear ? Number(graduationYear) : sessionUser.graduationYear,
      phone: phone !== undefined ? phone : sessionUser.phone,
      linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : sessionUser.linkedinUrl,
    });

    // Güncelleme sonrası oturumdaki ve Header'daki kullanıcı adını anında güncelle (rol sabit kalır)
    req.session.user = {
      ...sessionUser,
      name: updatedUser ? updatedUser.name : String(name).trim(),
      email: updatedUser ? updatedUser.email : String(email).trim().toLowerCase(),
      role: sessionUser.role,
      department: updatedUser ? updatedUser.department : (deptName || sessionUser.department),
      department_id: updatedUser ? updatedUser.department_id : deptId,
      graduationYear: updatedUser ? updatedUser.graduationYear : Number(graduationYear),
      phone: updatedUser ? updatedUser.phone : (phone ? String(phone).trim() : null),
      linkedinUrl: updatedUser ? updatedUser.linkedinUrl : (linkedinUrl ? String(linkedinUrl).trim() : null),
    };
    setCurrentUser(req.session.user);

    const successMsg = 'Profil bilgileriniz başarıyla güncellendi.';
    if (isHtml) {
      return res.redirect('/settings?success=' + encodeURIComponent(successMsg));
    }

    return res.status(200).json({
      message: successMsg,
      user: req.session.user,
    });
  } catch (err) {
    const msg =
      err.code === '23505'
        ? 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.'
        : 'Bilgileriniz güncellenirken bir hata oluştu.';
    if (isHtml) return res.redirect('/settings?error=' + encodeURIComponent(msg));
    return res.status(err.code === '23505' ? 409 : 500).json({ error: msg });
  }
};

// GET /users - Mezunlar listesini ve oluşturma formunu içeren HTML sayfası
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();

    // Tarayıcıdan HTML isteği geldiyse View katmanından HTML render et
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      let success = null;
      if (req.query && req.query.created) {
        success = 'Yeni mezun başarıyla sisteme eklendi!';
      } else if (req.query && req.query.updated) {
        success = 'Mezun bilgileri başarıyla güncellendi!';
      } else if (req.query && req.query.deleted) {
        success = 'Mezun kaydı başarıyla silindi!';
      }

      const error = req.query && req.query.error ? req.query.error : null;
      return res.status(200).send(userView.renderUsersPage(users, { success, error }));
    }

    // API veya JSON fallback
    return res.status(200).json(users);
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(userView.renderUsersPage([], { error: 'Mezunlar listesi alınırken veritabanı hatası oluştu.' }));
    }
    return res.status(500).json({ error: 'Kullanıcılar alınırken hata oluştu.' });
  }
};

// GET /users/:id - ID'ye göre tekil mezun profil sayfası
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
        return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(200).send(userView.renderUserProfilePage(user));
    }

    return res.status(200).json(user);
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.path || !req.path.startsWith('/api'))) {
      return res.status(500).send(userView.renderUserNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'Kullanıcı detayı alınırken hata oluştu.' });
  }
};

// GET /users/:id/edit - Seçilen mezunun bilgilerini önceden doldurulmuş düzenleme formuyla gösterir
const getEditUserForm = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const error = req.query && req.query.error ? req.query.error : null;
    return res.status(200).send(userView.renderEditUserPage(user, { error }));
  } catch (err) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(500).send(userView.renderUserNotFoundPage(req.params.id));
    }
    return res.status(500).json({ error: 'Kullanıcı düzenleme formu yüklenirken hata oluştu.' });
  }
};

// POST /users - Yeni mezun oluşturur (HTML form veya API)
const createUser = async (req, res) => {
  const { name, email, department, graduationYear } = req.body || {};

  // Zorunlu alan kontrolü
  if (!name || !email) {
    // HTML form isteği ise hata ile tekrar listeye yönlendir
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/users?error=' + encodeURIComponent('İsim ve e-posta alanları zorunludur.'));
    }
    return res.status(400).json({
      error: 'name ve email alanları zorunludur.',
    });
  }

  try {
    // Model katmanına yeni kullanıcı ekle
    const newUser = await UserModel.create({
      name,
      email,
      department,
      graduationYear,
    });

    // HTML form gönderimi ise başarıyla listeye yönlendir
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/users?created=true');
    }

    // JSON isteği ise 201 JSON dön
    return res.status(201).json({
      message: 'Kullanıcı başarıyla eklendi',
      user: newUser,
    });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = err.code === '23505'
      ? 'Bu e-posta adresi zaten kayıtlı.'
      : 'Kullanıcı eklenirken veritabanı hatası oluştu.';

    if (isHtml) {
      return res.redirect('/users?error=' + encodeURIComponent(errorMsg));
    }
    return res.status(err.code === '23505' ? 400 : 500).json({ error: errorMsg });
  }
};

// POST /users/:id/update - Form gönderildiğinde mezun bilgilerini günceller ve /users adresine yönlendirir
const updateUserForm = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const { name, email, department, graduationYear } = req.body || {};

    if (!name || !email) {
      return res.redirect(`/users/${userId}/edit?error=` + encodeURIComponent('İsim ve e-posta alanları zorunludur.'));
    }

    const updatedUser = await UserModel.replace(userId, {
      name,
      email,
      department,
      graduationYear,
    });

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/users?updated=true');
    }

    return res.status(200).json({
      message: 'Kullanıcı güncellendi',
      user: updatedUser,
    });
  } catch (err) {
    const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));
    const errorMsg = err.code === '23505'
      ? 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.'
      : 'Kullanıcı güncellenirken hata oluştu.';

    if (isHtml) {
      return res.redirect(`/users/${userId}/edit?error=` + encodeURIComponent(errorMsg));
    }
    return res.status(err.code === '23505' ? 400 : 500).json({ error: errorMsg });
  }
};

// POST /users/:id/delete - Mezun kaydını siler ve /users adresine yönlendirir
const deleteUserForm = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const deletedUser = await UserModel.remove(userId);

    if (!deletedUser) {
      if (req && req.accepts && req.accepts('html')) {
        return res.status(404).send(userView.renderUserNotFoundPage(req.params.id));
      }
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/users?deleted=true');
    }

    return res.status(200).json({
      message: 'Kullanıcı başarıyla silindi',
      user: deletedUser,
    });
  } catch (err) {
    if (req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'))) {
      return res.redirect('/users?error=' + encodeURIComponent('Kullanıcı silinirken hata oluştu: İlişkili kayıtlar olabilir.'));
    }
    return res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu.' });
  }
};

// PUT /users/:id - Kullanıcıyı tamamen günceller (Geriye dönük uyumluluk)
const updateUserPut = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const { name, email, department, graduationYear } = req.body || {};

    if (!name || !email || !department || graduationYear === undefined || graduationYear === null || graduationYear === '') {
      return res.status(400).json({
        error: 'PUT isteğinde tüm alanlar (name, email, department, graduationYear) zorunludur.',
      });
    }

    const updatedUser = await UserModel.replace(userId, {
      name,
      email,
      department,
      graduationYear,
    });

    return res.status(200).json({
      message: 'Kullanıcı güncellendi',
      user: updatedUser,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.' });
    }
    return res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu.' });
  }
};

// PATCH /users/:id - Kullanıcıyı kısmi olarak günceller (Geriye dönük uyumluluk)
const updateUserPatch = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const { name, email, department, graduationYear } = req.body || {};

    const updatedUser = await UserModel.update(userId, {
      name,
      email,
      department,
      graduationYear,
    });

    return res.status(200).json({
      message: 'Kullanıcı güncellendi',
      user: updatedUser,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.' });
    }
    return res.status(500).json({ error: 'Kullanıcı güncellenirken hata oluştu.' });
  }
};

// DELETE /users/:id - Kullanıcıyı siler (Geriye dönük uyumluluk)
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = await UserModel.remove(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    return res.status(200).json({
      message: 'Kullanıcı başarıyla silindi',
      user: deletedUser,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu.' });
  }
};

const UserController = {
  getRegisterPage,
  handleRegister,
  getLoginPage,
  handleLogin,
  handleLogout,
  getProfilePage,
  getSettingsPage,
  handleUpdateSettings,
  handleChangePassword,
  getUsers,
  getUserById,
  getEditUserForm,
  createUser,
  updateUserForm,
  deleteUserForm,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};

module.exports = {
  ...UserController,
  UserController,
};
