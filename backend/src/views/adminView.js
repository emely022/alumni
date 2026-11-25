/**
 * Admin Panel View (Yönetim Paneli HTML Şablon Katmanı)
 *
 * İstanbul Üniversitesi Mezun Bilgi Sistemi - Sistem Yönetim Paneli (/admin)
 * design.md kurallarına (%100) uyumlu:
 * - Zemin: #214539 (Koyu Orman Yeşili)
 * - Kart Yüzeyi: #FFFFFF (Beyaz)
 * - Birincil Aksiyon: #F5BA13 (Sarı Hap Buton, #111827 koyu metin)
 * - Font: Arial, sans-serif (İtalik stil kullanılmaz)
 */

const { renderLayout, escapeHtml } = require('./layout');

const ROLE_LABELS = {
  admin: '🛡️ Admin (Yönetici)',
  alumni: '🎓 Mezun',
  student: '📚 Öğrenci',
  coordinator: '🏛️ Koordinatör',
  employer: '🏢 İşveren',
};

const APPLICATION_STATUS_LABELS = {
  pending: '⏳ Beklemede (pending)',
  reviewed: '👀 İncelendi (reviewed)',
  interview: '🗣️ Mülakat (interview)',
  accepted: '✅ Kabul Edildi (accepted)',
  rejected: '❌ Reddedildi (rejected)',
};

const renderAdminDashboard = ({
  users = [],
  departments = [],
  announcements = [],
  jobPostings = [],
  applications = [],
  currentUser = null,
  success = null,
  error = null,
} = {}) => {
  const currentYear = new Date().getFullYear();
  const adminCount = users.filter((u) => u.role === 'admin').length;

  let alertBox = '';
  if (success) {
    alertBox = `
      <div class="alert alert-success">
        <span>✅</span>
        <div><strong>İşlem Başarılı:</strong> ${escapeHtml(success)}</div>
      </div>
    `;
  } else if (error) {
    alertBox = `
      <div class="alert alert-error">
        <span>❌</span>
        <div><strong>Hata:</strong> ${escapeHtml(error)}</div>
      </div>
    `;
  }

  const departmentOptionsHtml = departments
    .map(
      (d) =>
        `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)} (${escapeHtml(d.code)}) - ${escapeHtml(d.faculty)}</option>`
    )
    .join('');

  // 1. Kullanıcı Satırları (Rol ve Durum Manipülasyonu + Sil/Düzenle)
  const userRowsHtml =
    users.length === 0
      ? `<tr><td colspan="7" class="empty-state">Kayıtlı kullanıcı bulunamadı.</td></tr>`
      : users
          .map((u) => {
            const roleVal = u.role || 'alumni';
            const isActiveVal = u.isActive !== false;
            return `
              <tr>
                <td><strong>#${escapeHtml(u.id)}</strong></td>
                <td>
                  <a href="/users/${escapeHtml(u.id)}" style="font-weight: 700; color: #111827; text-decoration: none;">
                    ${escapeHtml(u.name)}
                  </a>
                  <div style="font-size: 12px; color: #6B7280;">${escapeHtml(u.email)}</div>
                </td>
                <td><span class="badge badge-neutral">${escapeHtml(u.department || 'Belirtilmedi')}</span></td>
                <td><strong>${escapeHtml(u.graduationYear || '-')}</strong></td>
                <td colspan="2">
                  <form method="POST" action="/admin/users/${escapeHtml(u.id)}/role" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 0;">
                    <select name="role" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #D1D5DB; font-size: 13px; font-weight: 600; background: #F9FAFB; color: #111827;">
                      ${Object.entries(ROLE_LABELS)
                        .map(
                          ([key, label]) =>
                            `<option value="${key}" ${roleVal === key ? 'selected' : ''}>${label}</option>`
                        )
                        .join('')}
                    </select>
                    <select name="isActive" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #D1D5DB; font-size: 13px; font-weight: 600; background: ${isActiveVal ? '#ECFDF5' : '#FEF2F2'}; color: ${isActiveVal ? '#065F46' : '#991B1B'};">
                      <option value="true" ${isActiveVal ? 'selected' : ''}>🟢 Aktif</option>
                      <option value="false" ${!isActiveVal ? 'selected' : ''}>🔴 Pasif</option>
                    </select>
                    <button type="submit" class="btn btn-primary btn-sm" style="padding: 6px 14px; font-size: 12px;">
                      💾 Kaydet
                    </button>
                  </form>
                </td>
                <td style="white-space: nowrap; text-align: right;">
                  <a href="/users/${escapeHtml(u.id)}/edit" class="btn btn-secondary btn-sm">Düzenle</a>
                  <form method="POST" action="/admin/users/${escapeHtml(u.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${escapeHtml(u.name)} kullanıcısını silmek istediğinize emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;">Sil</button>
                  </form>
                </td>
              </tr>
            `;
          })
          .join('');

  // 2. Bölüm Satırları
  const departmentRowsHtml =
    departments.length === 0
      ? `<tr><td colspan="5" class="empty-state">Kayıtlı akademik bölüm bulunamadı.</td></tr>`
      : departments
          .map(
            (d) => `
              <tr>
                <td><strong>#${escapeHtml(d.id)}</strong></td>
                <td>
                  <form method="POST" action="/admin/departments/${escapeHtml(d.id)}/update" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin: 0;">
                    <input type="text" name="name" value="${escapeHtml(d.name)}" required style="padding: 6px 10px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13px; width: 200px;">
                    <input type="text" name="code" value="${escapeHtml(d.code)}" required style="padding: 6px 10px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13px; width: 85px;">
                    <input type="text" name="faculty" value="${escapeHtml(d.faculty)}" required style="padding: 6px 10px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 13px; width: 210px;">
                    <button type="submit" class="btn btn-primary btn-sm" style="padding: 6px 12px; font-size: 12px;">💾 Güncelle</button>
                  </form>
                </td>
                <td><span class="badge badge-dark">${escapeHtml(d.code)}</span></td>
                <td>${escapeHtml(d.faculty)}</td>
                <td style="text-align: right; white-space: nowrap;">
                  <form method="POST" action="/admin/departments/${escapeHtml(d.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('${escapeHtml(d.name)} bölümünü silmek istediğinize emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm">Sil</button>
                  </form>
                </td>
              </tr>
            `
          )
          .join('');

  // 3. Duyuru Satırları
  const announcementRowsHtml =
    announcements.length === 0
      ? `<tr><td colspan="6" class="empty-state">Kayıtlı duyuru bulunamadı.</td></tr>`
      : announcements
          .map(
            (a) => `
              <tr>
                <td><strong>#${escapeHtml(a.id)}</strong></td>
                <td>
                  <a href="/announcements/${escapeHtml(a.id)}" style="font-weight: 700; color: #111827;">
                    ${escapeHtml(a.title)}
                  </a>
                </td>
                <td><span class="badge badge-warning">${escapeHtml(a.category || 'Genel')}</span></td>
                <td>${escapeHtml(a.author || 'Yönetim')}</td>
                <td>${escapeHtml(a.date || '-')}</td>
                <td style="text-align: right; white-space: nowrap;">
                  <a href="/announcements/${escapeHtml(a.id)}/edit" class="btn btn-secondary btn-sm">Düzenle</a>
                  <form method="POST" action="/admin/announcements/${escapeHtml(a.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('Bu duyuruyu silmek istediğinize emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;">Sil</button>
                  </form>
                </td>
              </tr>
            `
          )
          .join('');

  // 4. İş İlanları Satırları
  const jobRowsHtml =
    jobPostings.length === 0
      ? `<tr><td colspan="6" class="empty-state">Kayıtlı iş ilanı bulunamadı.</td></tr>`
      : jobPostings
          .map((jp) => {
            const active = jp.isActive !== false;
            return `
              <tr>
                <td><strong>#${escapeHtml(jp.id)}</strong></td>
                <td>
                  <a href="/job-postings/${escapeHtml(jp.id)}" style="font-weight: 700; color: #111827;">
                    ${escapeHtml(jp.title)}
                  </a>
                  <div style="font-size: 12px; color: #6B7280;">${escapeHtml(jp.company)} &bull; ${escapeHtml(jp.location || 'Belirtilmedi')}</div>
                </td>
                <td><span class="badge badge-neutral">${escapeHtml(jp.employmentType || 'full-time')}</span></td>
                <td>
                  <span class="badge ${active ? 'badge-success' : 'badge-danger'}">
                    ${active ? '🟢 Yayında' : '🔴 Kapalı'}
                  </span>
                </td>
                <td>${escapeHtml(jp.deadline || 'Süresiz')}</td>
                <td style="text-align: right; white-space: nowrap;">
                  <form method="POST" action="/admin/job-postings/${escapeHtml(jp.id)}/toggle" style="display: inline; margin: 0;">
                    <button type="submit" class="btn btn-secondary btn-sm">
                      ${active ? '⏸️ Pasife Al' : '▶️ Yayına Al'}
                    </button>
                  </form>
                  <a href="/job-postings/${escapeHtml(jp.id)}/edit" class="btn btn-secondary btn-sm" style="margin-left: 4px;">Düzenle</a>
                  <form method="POST" action="/admin/job-postings/${escapeHtml(jp.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('Bu iş ilanını silmek istediğinize emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;">Sil</button>
                  </form>
                </td>
              </tr>
            `;
          })
          .join('');

  // 5. Başvurular Satırları
  const userById = {};
  users.forEach((u) => {
    userById[u.id] = u;
  });
  const jobById = {};
  jobPostings.forEach((j) => {
    jobById[j.id] = j;
  });

  const applicationRowsHtml =
    applications.length === 0
      ? `<tr><td colspan="5" class="empty-state">Kayıtlı iş başvurusu bulunamadı.</td></tr>`
      : applications
          .map((app) => {
            const applicant = userById[app.userId];
            const job = jobById[app.jobPostingId];
            return `
              <tr>
                <td><strong>#${escapeHtml(app.id)}</strong></td>
                <td>
                  <strong>${escapeHtml(job ? job.title : `İlan #${app.jobPostingId}`)}</strong>
                  <div style="font-size: 12px; color: #6B7280;">${escapeHtml(job ? job.company : '')}</div>
                </td>
                <td>
                  <strong>${escapeHtml(applicant ? applicant.name : `Kullanıcı #${app.userId}`)}</strong>
                  <div style="font-size: 12px; color: #6B7280;">${escapeHtml(applicant ? applicant.email : '')}</div>
                </td>
                <td>
                  <form method="POST" action="/admin/applications/${escapeHtml(app.id)}/status" style="display: flex; align-items: center; gap: 8px; margin: 0;">
                    <select name="status" style="padding: 6px 10px; border-radius: 8px; border: 1px solid #D1D5DB; font-size: 13px; font-weight: 600;">
                      ${Object.entries(APPLICATION_STATUS_LABELS)
                        .map(
                          ([stKey, stLabel]) =>
                            `<option value="${stKey}" ${app.status === stKey ? 'selected' : ''}>${stLabel}</option>`
                        )
                        .join('')}
                    </select>
                    <button type="submit" class="btn btn-primary btn-sm" style="padding: 6px 12px; font-size: 12px;">💾 Durumu Güncelle</button>
                  </form>
                </td>
                <td style="text-align: right; white-space: nowrap;">
                  <a href="/applications/${escapeHtml(app.id)}" class="btn btn-secondary btn-sm">Detay</a>
                  <form method="POST" action="/admin/applications/${escapeHtml(app.id)}/delete" style="display: inline; margin: 0;" onsubmit="return confirm('Bu başvuruyu silmek istediğinize emin misiniz?');">
                    <button type="submit" class="btn btn-danger btn-sm" style="margin-left: 4px;">Sil</button>
                  </form>
                </td>
              </tr>
            `;
          })
          .join('');

  const content = `
    ${alertBox}

    <!-- Üst Yönetici Bilgi & Hızlı Gezinme Barı -->
    <div class="card" style="padding: 20px 24px; margin-bottom: 24px; border: 2px solid #F5BA13; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
          <span class="badge badge-dark">🛡️ TAM YETKİLİ YÖNETİCİ OTURUMU</span>
          <span class="badge badge-success">RBAC: ADMIN</span>
        </div>
        <div style="font-size: 15px; color: #111827;">
          Hoş geldiniz, <strong>${escapeHtml(currentUser ? currentUser.name : 'Sistem Yöneticisi')}</strong> (${escapeHtml(currentUser ? currentUser.email : 'admin@istanbul.edu.tr')}). Tüm veritabanı tablolarını buradan doğrudan yönetebilirsiniz.
        </div>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="#admin-users" class="btn btn-primary btn-sm">👥 Kullanıcılar & Roller (${users.length})</a>
        <a href="#admin-departments" class="btn btn-secondary btn-sm">🏛️ Bölümler (${departments.length})</a>
        <a href="#admin-announcements" class="btn btn-secondary btn-sm">📢 Duyurular (${announcements.length})</a>
        <a href="#admin-jobs" class="btn btn-secondary btn-sm">💼 İlanlar (${jobPostings.length})</a>
        <a href="#admin-applications" class="btn btn-secondary btn-sm">📝 Başvurular (${applications.length})</a>
      </div>
    </div>

    <!-- İstatistik / KPI Kartları -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
      <div class="card" style="padding: 20px; margin-bottom: 0;">
        <div style="font-size: 13px; color: #6B7280; font-weight: 700;">TOPLAM KULLANICI / ADMİN</div>
        <div style="font-size: 28px; font-weight: 700; color: #111827; margin-top: 4px;">${users.length} <span style="font-size: 14px; color: #065F46;">(${adminCount} Admin)</span></div>
      </div>
      <div class="card" style="padding: 20px; margin-bottom: 0;">
        <div style="font-size: 13px; color: #6B7280; font-weight: 700;">AKADEMİK BÖLÜMLER</div>
        <div style="font-size: 28px; font-weight: 700; color: #111827; margin-top: 4px;">${departments.length}</div>
      </div>
      <div class="card" style="padding: 20px; margin-bottom: 0;">
        <div style="font-size: 13px; color: #6B7280; font-weight: 700;">KURUMSAL DUYURULAR</div>
        <div style="font-size: 28px; font-weight: 700; color: #111827; margin-top: 4px;">${announcements.length}</div>
      </div>
      <div class="card" style="padding: 20px; margin-bottom: 0;">
        <div style="font-size: 13px; color: #6B7280; font-weight: 700;">İŞ İLANLARI & BAŞVURULAR</div>
        <div style="font-size: 28px; font-weight: 700; color: #111827; margin-top: 4px;">${jobPostings.length} / ${applications.length}</div>
      </div>
    </div>

    <!-- ======================================================================
         1. KULLANICI & ROL (RBAC) YÖNETİMİ
         ====================================================================== -->
    <div class="card" id="admin-users">
      <div class="card-title">
        <span>👥 1. Kullanıcılar ve Rol (RBAC) Yönetimi</span>
        <span class="badge badge-warning">Rol Atama & Veri Manipülasyonu</span>
      </div>
      <p style="font-size: 14px; color: #4B5563; margin-bottom: 18px;">
        Sistemdeki tüm kullanıcıların rollerini (<code>admin</code>, <code>alumni</code>, <code>student</code>, <code>coordinator</code>, <code>employer</code>) ve aktiflik durumlarını anında değiştirebilir, yeni kullanıcı ekleyebilir veya kayıtları silebilirsiniz.
      </p>

      <!-- Hızlı Kullanıcı / Admin Oluşturma Formu -->
      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h4 style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 14px;">➕ Yeni Kullanıcı veya Yönetici (Admin) Ekle</h4>
        <form method="POST" action="/admin/users/create">
          <div class="form-grid">
            <div class="form-group">
              <label>Ad Soyad *</label>
              <input type="text" name="name" required placeholder="Örn: Emel Yurt">
            </div>
            <div class="form-group">
              <label>E-Posta *</label>
              <input type="email" name="email" required placeholder="Örn: emel.admin@istanbul.edu.tr">
            </div>
            <div class="form-group">
              <label>Şifre (En az 8 karakter) *</label>
              <input type="password" name="password" required minlength="8" placeholder="En az 8 karakter">
            </div>
            <div class="form-group">
              <label>Sistem Rolü *</label>
              <select name="role" required>
                <option value="admin">🛡️ Admin (Sistem Yöneticisi)</option>
                <option value="alumni" selected>🎓 Mezun (Alumni)</option>
                <option value="student">📚 Öğrenci (Student)</option>
                <option value="coordinator">🏛️ Koordinatör (Coordinator)</option>
                <option value="employer">🏢 İşveren (Employer)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Akademik Bölüm</label>
              <select name="department_id">
                <option value="">-- Bölüm Seçiniz --</option>
                ${departmentOptionsHtml}
              </select>
            </div>
            <div class="form-group">
              <label>Mezuniyet Yılı</label>
              <input type="number" name="graduationYear" value="${currentYear}" min="1950" max="2100">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">➕ Kullanıcıyı Oluştur</button>
            </div>
          </div>
        </form>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kullanıcı & E-Posta</th>
              <th>Bölüm</th>
              <th>Yıl</th>
              <th colspan="2">Rol (RBAC) & Hesap Durumu Ata</th>
              <th style="text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${userRowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================================
         2. AKADEMİK BÖLÜMLER (DEPARTMENTS) YÖNETİMİ
         ====================================================================== -->
    <div class="card" id="admin-departments">
      <div class="card-title">
        <span>🏛️ 2. Akademik Bölümler Yönetimi (Departments CRUD)</span>
        <span class="badge badge-dark">${departments.length} Bölüm</span>
      </div>

      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 14px;">➕ Yeni Akademik Bölüm Ekle</h4>
        <form method="POST" action="/admin/departments/create" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;">
          <div class="form-group" style="flex: 1; min-width: 200px;">
            <label>Bölüm Adı *</label>
            <input type="text" name="name" required placeholder="Örn: Hukuk">
          </div>
          <div class="form-group" style="width: 140px;">
            <label>Kısa Kod *</label>
            <input type="text" name="code" required placeholder="Örn: LAW">
          </div>
          <div class="form-group" style="flex: 1; min-width: 220px;">
            <label>Fakülte Adı *</label>
            <input type="text" name="faculty" required placeholder="Örn: Hukuk Fakültesi">
          </div>
          <button type="submit" class="btn btn-primary" style="height: 44px;">➕ Bölüm Ekle</button>
        </form>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Satır İçi Bölüm Düzenleme (Ad / Kod / Fakülte)</th>
              <th>Kod</th>
              <th>Fakülte</th>
              <th style="text-align: right;">Sil</th>
            </tr>
          </thead>
          <tbody>
            ${departmentRowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================================
         3. KURUMSAL DUYURULAR (ANNOUNCEMENTS) YÖNETİMİ
         ====================================================================== -->
    <div class="card" id="admin-announcements">
      <div class="card-title">
        <span>📢 3. Kurumsal Duyurular Yönetimi</span>
        <span class="badge badge-warning">${announcements.length} Duyuru</span>
      </div>

      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h4 style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 14px;">➕ Hızlı Duyuru Yayınla</h4>
        <form method="POST" action="/admin/announcements/create">
          <div class="form-grid">
            <div class="form-group">
              <label>Duyuru Başlığı *</label>
              <input type="text" name="title" required placeholder="Örn: Bahar Dönemi Mezunlar Buluşması">
            </div>
            <div class="form-group">
              <label>Kategori</label>
              <input type="text" name="category" value="Kurumsal" placeholder="Etkinlik, Kariyer, Akademik...">
            </div>
            <div class="form-group full-width">
              <label>Duyuru İçeriği *</label>
              <textarea name="content" rows="2" required placeholder="Duyuru metnini giriniz..."></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">📢 Duyuruyu Yayınla</button>
            </div>
          </div>
        </form>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlık</th>
              <th>Kategori</th>
              <th>Yazar</th>
              <th>Tarih</th>
              <th style="text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${announcementRowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================================
         4. İŞ İLANLARI (JOB POSTINGS) YÖNETİMİ
         ====================================================================== -->
    <div class="card" id="admin-jobs">
      <div class="card-title">
        <span>💼 4. Kariyer & İş İlanları Yönetimi</span>
        <a href="/job-postings" class="btn btn-secondary btn-sm">➕ Detaylı İlan Sayfası</a>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>İlan Başlığı & Şirket</th>
              <th>Tür</th>
              <th>Durum</th>
              <th>Son Başvuru</th>
              <th style="text-align: right;">Yönet</th>
            </tr>
          </thead>
          <tbody>
            ${jobRowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================================
         5. İŞ BAŞVURULARI (APPLICATIONS) YÖNETİMİ
         ====================================================================== -->
    <div class="card" id="admin-applications">
      <div class="card-title">
        <span>📝 5. İş Başvuruları & Durum Yönetimi</span>
        <span class="badge badge-dark">${applications.length} Başvuru</span>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Başvurulan İlan</th>
              <th>Başvuran Aday</th>
              <th>Başvuru Durumu Değiştir</th>
              <th style="text-align: right;">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            ${applicationRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return renderLayout({
    title: 'Yönetim Paneli (Admin Panel) | İstanbul Üniversitesi Mezun Bilgi Sistemi',
    activeNav: 'admin',
    pageTitle: '🛡️ Sistem Yönetim Paneli (Admin Panel)',
    pageSubtitle: 'Kullanıcı rollerini (RBAC), mezun kayıtlarını, akademik bölümleri, duyuruları, iş ilanlarını ve başvuruları tek merkezden yönetin.',
    breadcrumbsHtml: '<a href="/">Ana Sayfa</a> <span class="separator">/</span> <span class="current">Yönetim Paneli (Admin)</span>',
    currentUser,
    content,
  });
};

module.exports = {
  renderAdminDashboard,
};
