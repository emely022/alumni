/**
 * AdminController
 *
 * Sorumluluk: Sistem Yönetim Paneli (/admin) ve Veri Manipülasyonu
 * Yalnızca 'admin' rolüne sahip kullanıcıların erişebildiği merkezi yönetim paneli
 * üzerinden kullanıcılar, roller (RBAC), akademik bölümler, duyurular, iş ilanları
 * ve başvurular üzerindeki tüm veri manipülasyonu (CRUD + Rol Atama) işlemlerini yürütür.
 */

const UserModel = require('../models/userModel');
const DepartmentModel = require('../models/departmentModel');
const AnnouncementModel = require('../models/announcementModel');
const JobPostingModel = require('../models/jobPostingModel');
const ApplicationModel = require('../models/applicationModel');
const adminView = require('../views/adminView');
const { hashPassword } = require('../utils/password');
const { setCurrentUser } = require('../utils/sessionContext');

const safeFetch = async (fn, fallback = []) => {
  try {
    return await fn();
  } catch (_) {
    return fallback;
  }
};

// GET /admin - Merkezi Sistem Yönetim Paneli
const getAdminDashboard = async (req, res) => {
  try {
    const [users, departments, announcements, jobPostings, applications] = await Promise.all([
      safeFetch(() => UserModel.findAll(), []),
      safeFetch(() => DepartmentModel.findAll(), []),
      safeFetch(() => AnnouncementModel.findAll(), []),
      safeFetch(() => JobPostingModel.findAll(), []),
      safeFetch(() => ApplicationModel.findAll(), []),
    ]);

    const success = req.query && req.query.success ? req.query.success : null;
    const error = req.query && req.query.error ? req.query.error : null;
    const currentUser = req.session && req.session.user ? req.session.user : null;

    const html = adminView.renderAdminDashboard({
      users,
      departments,
      announcements,
      jobPostings,
      applications,
      currentUser,
      success,
      error,
    });

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Yönetim paneli yüklenirken bir hata oluştu.');
  }
};

// POST /admin/assign-self - Aktif oturumdaki kullanıcıya 'admin' rolü atar ve panele yönlendirir
const assignAdminToSelf = async (req, res) => {
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  if (!req.session || !req.session.user) {
    if (isHtml) return res.redirect('/login');
    return res.status(401).json({ error: 'Oturum açmanız gerekmektedir.' });
  }

  try {
    const userId = req.session.user.id;
    const updated = await UserModel.updateRoleAndStatus(userId, {
      role: 'admin',
      isActive: true,
    });

    req.session.user.role = 'admin';
    setCurrentUser(req.session.user);

    if (isHtml) {
      return res.redirect(
        '/admin?success=' +
          encodeURIComponent(
            `Hesabınıza (${req.session.user.name}) yönetici (admin) rolü başarıyla atandı!`
          )
      );
    }

    return res.status(200).json({
      message: 'Hesabınıza admin rolü atandı.',
      user: updated || req.session.user,
    });
  } catch (err) {
    if (isHtml) {
      return res.redirect('/admin?error=' + encodeURIComponent('Rol atanırken hata oluştu.'));
    }
    return res.status(500).json({ error: 'Rol atanırken hata oluştu.' });
  }
};

// POST /admin/users/create - Yönetim panelinden yeni kullanıcı / admin oluşturur
const createUserAsAdmin = async (req, res) => {
  const { name, email, password, role, department_id, graduationYear } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  if (!name || !email || !password || String(password).length < 8) {
    const msg = 'Ad Soyad, E-Posta ve en az 8 karakterli Şifre zorunludur.';
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  try {
    let deptName = 'Belirtilmedi';
    const deptId = department_id ? parseInt(department_id, 10) : null;
    if (deptId && !isNaN(deptId)) {
      const foundDept = await safeFetch(() => DepartmentModel.findById(deptId), null);
      if (foundDept && foundDept.name) {
        deptName = foundDept.name;
      }
    }

    const passwordHash = await hashPassword(String(password));
    const created = await UserModel.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role: role || 'alumni',
      is_active: true,
      department: deptName,
      department_id: deptId && !isNaN(deptId) ? deptId : null,
      graduationYear: graduationYear ? Number(graduationYear) : new Date().getFullYear(),
      password_hash: passwordHash,
    });

    if (isHtml) {
      return res.redirect(
        '/admin?success=' +
          encodeURIComponent(`Yeni kullanıcı (${created.name} - Rol: ${created.role}) başarıyla eklendi.`)
      );
    }
    return res.status(201).json({ message: 'Kullanıcı oluşturuldu.', user: created });
  } catch (err) {
    const msg =
      err.code === '23505'
        ? 'Bu e-posta adresi zaten sistemde kayıtlı.'
        : 'Kullanıcı oluşturulurken hata oluştu.';
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }
};

// POST /admin/users/:id/role - Kullanıcının rolünü (RBAC) ve aktiflik durumunu değiştirir
const updateUserRoleAndStatus = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { role, isActive } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const updated = await UserModel.updateRoleAndStatus(userId, { role, isActive });
    if (!updated) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Kullanıcı bulunamadı.'));
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    // Aktif oturumdaki kullanıcının kendi rolü güncellendiyse oturumu da senkronize et
    if (req.session && req.session.user && Number(req.session.user.id) === userId) {
      req.session.user.role = updated.role;
      setCurrentUser(req.session.user);
    }

    if (isHtml) {
      return res.redirect(
        '/admin?success=' +
          encodeURIComponent(
            `#${updated.id} ${updated.name} kullanıcısının rolü '${updated.role}' (${updated.isActive ? 'Aktif' : 'Pasif'}) olarak güncellendi.`
          )
      );
    }
    return res.status(200).json({ message: 'Kullanıcı rolü güncellendi.', user: updated });
  } catch (err) {
    if (isHtml) {
      return res.redirect('/admin?error=' + encodeURIComponent('Kullanıcı rolü güncellenirken hata oluştu.'));
    }
    return res.status(500).json({ error: 'Kullanıcı rolü güncellenirken hata oluştu.' });
  }
};

// POST /admin/users/:id/delete - Kullanıcıyı siler
const deleteUserAsAdmin = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const deleted = await UserModel.remove(userId);
    if (!deleted) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Silinecek kullanıcı bulunamadı.'));
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`#${deleted.id} ${deleted.name} kaydı sistemden silindi.`)
      );
    }
    return res.status(200).json({ message: 'Kullanıcı silindi.', user: deleted });
  } catch (err) {
    if (isHtml) {
      return res.redirect('/admin?error=' + encodeURIComponent('Kullanıcı silinirken hata oluştu.'));
    }
    return res.status(500).json({ error: 'Kullanıcı silinirken hata oluştu.' });
  }
};

// POST /admin/departments/create - Yeni akademik bölüm ekler
const createDepartmentAsAdmin = async (req, res) => {
  const { name, code, faculty } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  if (!name || !code || !faculty) {
    const msg = 'Bölüm adı, kısa kodu ve fakülte adı zorunludur.';
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  try {
    const created = await DepartmentModel.create({
      name: String(name).trim(),
      code: String(code).trim().toUpperCase(),
      faculty: String(faculty).trim(),
    });
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`'${created.name} (${created.code})' bölümü başarıyla eklendi.`)
      );
    }
    return res.status(201).json({ message: 'Bölüm eklendi.', department: created });
  } catch (err) {
    const msg = err.code === '23505' ? 'Bu bölüm adı veya kodu zaten mevcut.' : 'Bölüm eklenirken hata oluştu.';
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }
};

// POST /admin/departments/:id/update - Akademik bölümü günceller
const updateDepartmentAsAdmin = async (req, res) => {
  const deptId = parseInt(req.params.id, 10);
  const { name, code, faculty } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const updated = await DepartmentModel.update(deptId, {
      name: name ? String(name).trim() : undefined,
      code: code ? String(code).trim().toUpperCase() : undefined,
      faculty: faculty ? String(faculty).trim() : undefined,
    });
    if (!updated) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Bölüm bulunamadı.'));
      return res.status(404).json({ error: 'Bölüm bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`#${updated.id} '${updated.name}' bölümü güncellendi.`)
      );
    }
    return res.status(200).json({ message: 'Bölüm güncellendi.', department: updated });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Bölüm güncellenirken hata oluştu.'));
    return res.status(500).json({ error: 'Bölüm güncellenirken hata oluştu.' });
  }
};

// POST /admin/departments/:id/delete - Akademik bölümü siler
const deleteDepartmentAsAdmin = async (req, res) => {
  const deptId = parseInt(req.params.id, 10);
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const deleted = await DepartmentModel.remove(deptId);
    if (!deleted) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Bölüm bulunamadı.'));
      return res.status(404).json({ error: 'Bölüm bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`'${deleted.name}' bölümü sistemden silindi.`)
      );
    }
    return res.status(200).json({ message: 'Bölüm silindi.', department: deleted });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Bölüm silinirken hata oluştu.'));
    return res.status(500).json({ error: 'Bölüm silinirken hata oluştu.' });
  }
};

// POST /admin/announcements/create - Yeni duyuru yayınlar
const createAnnouncementAsAdmin = async (req, res) => {
  const { title, content, category } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  if (!title || !content) {
    const msg = 'Duyuru başlığı ve içeriği zorunludur.';
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent(msg));
    return res.status(400).json({ error: msg });
  }

  try {
    const currentUser = req.session && req.session.user ? req.session.user : null;
    const created = await AnnouncementModel.create({
      title: String(title).trim(),
      content: String(content).trim(),
      category: category ? String(category).trim() : 'Kurumsal',
      author: currentUser ? currentUser.name : 'Sistem Yöneticisi',
      author_id: currentUser ? currentUser.id : null,
    });
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`'${created.title}' duyurusu başarıyla yayınlandı.`)
      );
    }
    return res.status(201).json({ message: 'Duyuru yayınlandı.', announcement: created });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Duyuru eklenirken hata oluştu.'));
    return res.status(500).json({ error: 'Duyuru eklenirken hata oluştu.' });
  }
};

// POST /admin/announcements/:id/delete - Duyuruyu siler
const deleteAnnouncementAsAdmin = async (req, res) => {
  const annId = parseInt(req.params.id, 10);
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const deleted = await AnnouncementModel.remove(annId);
    if (!deleted) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Duyuru bulunamadı.'));
      return res.status(404).json({ error: 'Duyuru bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`'#${deleted.id} ${deleted.title}' duyurusu silindi.`)
      );
    }
    return res.status(200).json({ message: 'Duyuru silindi.', announcement: deleted });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Duyuru silinirken hata oluştu.'));
    return res.status(500).json({ error: 'Duyuru silinirken hata oluştu.' });
  }
};

// POST /admin/job-postings/:id/toggle - İş ilanının aktif/pasif durumunu değiştirir
const toggleJobPostingAsAdmin = async (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const current = await JobPostingModel.findById(jobId);
    if (!current) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('İş ilanı bulunamadı.'));
      return res.status(404).json({ error: 'İş ilanı bulunamadı.' });
    }

    const updated = await JobPostingModel.update(jobId, { isActive: !current.isActive });
    if (isHtml) {
      return res.redirect(
        '/admin?success=' +
          encodeURIComponent(
            `'${updated.title}' ilanı ${updated.isActive ? 'yayına alındı' : 'pasife alındı'}.`
          )
      );
    }
    return res.status(200).json({ message: 'İlan durumu güncellendi.', jobPosting: updated });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('İlan durumu güncellenemedi.'));
    return res.status(500).json({ error: 'İlan durumu güncellenemedi.' });
  }
};

// POST /admin/job-postings/:id/delete - İş ilanını siler
const deleteJobPostingAsAdmin = async (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const deleted = await JobPostingModel.remove(jobId);
    if (!deleted) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('İş ilanı bulunamadı.'));
      return res.status(404).json({ error: 'İş ilanı bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`'${deleted.title}' iş ilanı sistemden silindi.`)
      );
    }
    return res.status(200).json({ message: 'İş ilanı silindi.', jobPosting: deleted });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('İş ilanı silinirken hata oluştu.'));
    return res.status(500).json({ error: 'İş ilanı silinirken hata oluştu.' });
  }
};

// POST /admin/applications/:id/status - İş başvurusu durumunu değiştirir
const updateApplicationStatusAsAdmin = async (req, res) => {
  const appId = parseInt(req.params.id, 10);
  const { status } = req.body || {};
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const updated = await ApplicationModel.updateStatus(appId, status);
    if (!updated) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Başvuru bulunamadı.'));
      return res.status(404).json({ error: 'Başvuru bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' +
          encodeURIComponent(`#${updated.id} numaralı başvurunun durumu '${updated.status}' olarak güncellendi.`)
      );
    }
    return res.status(200).json({ message: 'Başvuru durumu güncellendi.', application: updated });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Başvuru durumu güncellenemedi.'));
    return res.status(500).json({ error: 'Başvuru durumu güncellenemedi.' });
  }
};

// POST /admin/applications/:id/delete - İş başvurusunu siler
const deleteApplicationAsAdmin = async (req, res) => {
  const appId = parseInt(req.params.id, 10);
  const isHtml = req && req.accepts && req.accepts('html') && (!req.is || !req.is('json'));

  try {
    const deleted = await ApplicationModel.remove(appId);
    if (!deleted) {
      if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Başvuru bulunamadı.'));
      return res.status(404).json({ error: 'Başvuru bulunamadı.' });
    }
    if (isHtml) {
      return res.redirect(
        '/admin?success=' + encodeURIComponent(`#${deleted.id} numaralı iş başvurusu silindi.`)
      );
    }
    return res.status(200).json({ message: 'Başvuru silindi.', application: deleted });
  } catch (err) {
    if (isHtml) return res.redirect('/admin?error=' + encodeURIComponent('Başvuru silinirken hata oluştu.'));
    return res.status(500).json({ error: 'Başvuru silinirken hata oluştu.' });
  }
};

module.exports = {
  getAdminDashboard,
  assignAdminToSelf,
  createUserAsAdmin,
  updateUserRoleAndStatus,
  deleteUserAsAdmin,
  createDepartmentAsAdmin,
  updateDepartmentAsAdmin,
  deleteDepartmentAsAdmin,
  createAnnouncementAsAdmin,
  deleteAnnouncementAsAdmin,
  toggleJobPostingAsAdmin,
  deleteJobPostingAsAdmin,
  updateApplicationStatusAsAdmin,
  deleteApplicationAsAdmin,
};
