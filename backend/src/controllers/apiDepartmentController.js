const DepartmentModel = require('../models/departmentModel');

/**
 * ApiDepartmentController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı - Bölümler (Departments)
 * Direkt CRUD ve ilişkisel (nested) endpoint'leri yönetir.
 */

// GET /api/departments - Tüm bölümleri listeler
const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.findAll();
    return res.status(200).json(departments);
  } catch (err) {
    return res.status(500).json({ error: 'Bölümler alınırken hata oluştu.' });
  }
};

// GET /api/departments/:id - ID'ye göre tekil bölüm detayını döner
const getDepartmentById = async (req, res) => {
  try {
    const department = await DepartmentModel.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }
    return res.status(200).json(department);
  } catch (err) {
    return res.status(500).json({ error: 'Bölüm detayı alınırken hata oluştu.' });
  }
};

// POST /api/departments - Yeni bölüm ekler
const createDepartment = async (req, res) => {
  try {
    const { name, code, faculty } = req.body || {};

    if (!name || !code || !faculty) {
      return res.status(400).json({
        error: 'name, code ve faculty alanları zorunludur.',
      });
    }

    const newDept = await DepartmentModel.create({ name, code, faculty });
    return res.status(201).json({
      message: 'Bölüm başarıyla eklendi',
      department: newDept,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu bölüm adı veya kodu zaten kayıtlı.' });
    }
    return res.status(500).json({ error: 'Bölüm eklenirken hata oluştu.' });
  }
};

// PUT /api/departments/:id - Bölümü tamamen günceller (PUT)
const updateDepartmentPut = async (req, res) => {
  try {
    const deptId = parseInt(req.params.id, 10);
    const department = await DepartmentModel.findById(deptId);

    if (!department) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    const { name, code, faculty } = req.body || {};

    if (!name || !code || !faculty) {
      return res.status(400).json({
        error: 'PUT isteğinde name, code ve faculty alanları zorunludur.',
      });
    }

    const updated = await DepartmentModel.replace(deptId, { name, code, faculty });
    return res.status(200).json({
      message: 'Bölüm güncellendi',
      department: updated,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu bölüm adı veya kodu zaten kullanımda.' });
    }
    return res.status(500).json({ error: 'Bölüm güncellenirken hata oluştu.' });
  }
};

// PATCH /api/departments/:id - Bölümü kısmi günceller (PATCH)
const updateDepartmentPatch = async (req, res) => {
  try {
    const deptId = parseInt(req.params.id, 10);
    const department = await DepartmentModel.findById(deptId);

    if (!department) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    const updated = await DepartmentModel.update(deptId, req.body || {});
    return res.status(200).json({
      message: 'Bölüm güncellendi',
      department: updated,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Bu bölüm adı veya kodu zaten kullanımda.' });
    }
    return res.status(500).json({ error: 'Bölüm güncellenirken hata oluştu.' });
  }
};

// DELETE /api/departments/:id - Bölümü siler
const deleteDepartment = async (req, res) => {
  try {
    const deptId = parseInt(req.params.id, 10);
    const deleted = await DepartmentModel.remove(deptId);

    if (!deleted) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    return res.status(200).json({
      message: 'Bölüm başarıyla silindi',
      department: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Bölüm silinirken hata oluştu: Bağlı kayıtlar olabilir.' });
  }
};

// =========================================================================
// İÇ İÇE (NESTED) ENDPOINT'LER
// =========================================================================

// GET /api/departments/:id/users - Bölüme kayıtlı mezunları döner (1:N)
const getDepartmentUsers = async (req, res) => {
  try {
    const deptId = parseInt(req.params.id, 10);
    const department = await DepartmentModel.findById(deptId);

    if (!department) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    const users = await DepartmentModel.getUsers(deptId);
    return res.status(200).json({
      departmentId: deptId,
      departmentName: department.name,
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Bölüm mezunları alınırken hata oluştu.' });
  }
};

// GET /api/departments/:id/job-postings - Bölüme hedeflenmiş iş ilanlarını döner (1:N)
const getDepartmentJobPostings = async (req, res) => {
  try {
    const deptId = parseInt(req.params.id, 10);
    const department = await DepartmentModel.findById(deptId);

    if (!department) {
      return res.status(404).json({ error: 'Bölüm bulunamadı' });
    }

    const jobs = await DepartmentModel.getJobPostings(deptId);
    return res.status(200).json({
      departmentId: deptId,
      departmentName: department.name,
      totalJobs: jobs.length,
      jobPostings: jobs,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Bölüm iş ilanları alınırken hata oluştu.' });
  }
};

const ApiDepartmentController = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartmentPut,
  updateDepartmentPatch,
  deleteDepartment,
  // Nested
  getDepartmentUsers,
  getDepartmentJobPostings,
};

module.exports = ApiDepartmentController;
