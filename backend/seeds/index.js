const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { pool } = require('../src/config/db');
const { runMigrations } = require('../src/config/migrate');
const {
  departmentFactory,
  userFactory,
  announcementFactory,
  eventFactory,
  eventRegistrationFactory,
  jobPostingFactory,
} = require('./factories');

/**
 * Database Seeder
 * 
 * ddd.md veri tasarımındaki tabloları factory fonksiyonlarını kullanarak
 * örnek ve gerçekçi verilerle doldurur (Seed).
 * Mükerrer kayıtları engellemek için ON CONFLICT kontrolleri içerir.
 */

const seedDatabase = async () => {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...\n');

  try {
    // 1. Önce migration'ların tamamlandığından emin ol
    console.log('📌 Migration kontrolü yapılıyor...');
    await runMigrations();

    // 2. Departments Seed
    console.log('\n🏛️  Bölümler (departments) ekleniyor...');
    const departmentDefinitions = [
      departmentFactory({ name: 'Bilgisayar Mühendisliği', code: 'CENG', faculty: 'Mühendislik Fakültesi' }),
      departmentFactory({ name: 'Endüstri Mühendisliği', code: 'IE', faculty: 'Mühendislik Fakültesi' }),
      departmentFactory({ name: 'Makine Mühendisliği', code: 'ME', faculty: 'Mühendislik Fakültesi' }),
      departmentFactory({ name: 'İşletme', code: 'BA', faculty: 'İktisadi ve İdari Bilimler Fakültesi' }),
      departmentFactory({ name: 'Elektrik-Elektronik Mühendisliği', code: 'EEE', faculty: 'Mühendislik Fakültesi' }),
    ];

    const departmentMap = {}; // name -> id mapping
    for (const dept of departmentDefinitions) {
      const res = await pool.query(
        `INSERT INTO departments (name, code, faculty)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET code = EXCLUDED.code, faculty = EXCLUDED.faculty
         RETURNING id, name, code;`,
        [dept.name, dept.code, dept.faculty]
      );
      const row = res.rows[0];
      departmentMap[row.name] = row.id;
      console.log(`   + [Department] #${row.id} - ${row.name} (${row.code})`);
    }

    // 3. Users Seed
    console.log('\n👥 Mezunlar / Kullanıcılar (users) ekleniyor...');
    const userDefinitions = [
      userFactory({
        name: 'Ahmet Yılmaz',
        email: 'ahmet@alumni.edu',
        department_id: departmentMap['Bilgisayar Mühendisliği'],
        department: 'Bilgisayar Mühendisliği',
        graduation_year: 2022,
      }),
      userFactory({
        name: 'Ayşe Kaya',
        email: 'ayse@alumni.edu',
        department_id: departmentMap['Endüstri Mühendisliği'],
        department: 'Endüstri Mühendisliği',
        graduation_year: 2023,
      }),
      userFactory({
        name: 'Mehmet Demir',
        email: 'mehmet.demir@alumni.edu',
        department_id: departmentMap['Makine Mühendisliği'],
        department: 'Makine Mühendisliği',
        graduation_year: 2021,
      }),
      userFactory({
        name: 'Zeynep Çelik',
        email: 'zeynep.celik@alumni.edu',
        department_id: departmentMap['Bilgisayar Mühendisliği'],
        department: 'Bilgisayar Mühendisliği',
        graduation_year: 2024,
      }),
      userFactory({
        name: 'Canan Öztürk',
        email: 'canan.ozturk@alumni.edu',
        department_id: departmentMap['İşletme'],
        department: 'İşletme',
        graduation_year: 2020,
      }),
    ];

    const userMap = {}; // email -> id mapping
    const userIds = [];
    for (const u of userDefinitions) {
      const res = await pool.query(
        `INSERT INTO users (name, email, department_id, department, graduation_year)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            department_id = EXCLUDED.department_id,
            department = EXCLUDED.department,
            graduation_year = EXCLUDED.graduation_year,
            updated_at = CURRENT_TIMESTAMP
         RETURNING id, name, email;`,
        [u.name, u.email, u.department_id, u.department, u.graduation_year]
      );
      const row = res.rows[0];
      userMap[row.email] = row.id;
      userIds.push(row.id);
      console.log(`   + [User] #${row.id} - ${row.name} (${row.email})`);
    }

    // 4. Announcements Seed
    console.log('\n📢 Duyurular (announcements) ekleniyor...');
    const announcementDefinitions = [
      announcementFactory({
        title: '2026 Yıllık Mezunlar Buluşması',
        content: 'Tüm mezunlarımızı 15 Mayıs 2026 tarihinde ana kampüsümüzde düzenlenecek geleneksel buluşmaya davet ediyoruz.',
        category: 'Etkinlik',
        author: 'Mezunlar Ofisi',
        author_id: userMap['ahmet@alumni.edu'],
        date: '2026-05-15',
      }),
      announcementFactory({
        title: 'Sonbahar Kariyer ve Mentorluk Günleri',
        content: 'Yeni mezunlarımız ile sektör lideri deneyimli mezunlarımızı buluşturan mentorluk programı başvuruları başladı.',
        category: 'Kariyer',
        author: 'Kariyer Merkezi',
        author_id: userMap['ayse@alumni.edu'],
        date: '2026-11-10',
      }),
      announcementFactory({
        title: 'Yapay Zeka ve Geleceğin Meslekleri Semineri',
        content: 'Mühendislik Fakültesi mezunlarımız için düzenlenecek online panel serisi kayıtları açıldı.',
        category: 'Akademik',
        author: 'Rektörlük',
        author_id: userMap['zeynep.celik@alumni.edu'],
        date: '2026-12-01',
      }),
    ];

    for (const a of announcementDefinitions) {
      // Başlığa göre kontrol et, mükerrer oluşumu engelle
      const existing = await pool.query('SELECT id FROM announcements WHERE title = $1 LIMIT 1;', [a.title]);
      let annId;
      if (existing.rows.length > 0) {
        annId = existing.rows[0].id;
        await pool.query(
          `UPDATE announcements SET content = $1, category = $2, author = $3, author_id = $4, date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6;`,
          [a.content, a.category, a.author, a.author_id, a.date, annId]
        );
        console.log(`   * [Announcement Güncellendi] #${annId} - ${a.title}`);
      } else {
        const res = await pool.query(
          `INSERT INTO announcements (title, content, category, author, author_id, date)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id;`,
          [a.title, a.content, a.category, a.author, a.author_id, a.date]
        );
        annId = res.rows[0].id;
        console.log(`   + [Announcement] #${annId} - ${a.title}`);
      }
    }

    // 5. Events Seed
    console.log('\n🎉 Etkinlikler (events) ekleniyor...');
    const eventDefinitions = [
      eventFactory({
        title: '2026 Bahar Mezunlar Kokteyli',
        description: 'Tüm mezunlarımızın katılımına açık açık hava bahar kokteyli ve networking alanı.',
        location: 'Ana Kampüs Rektörlük Bahçesi',
        event_date: '2026-05-20T18:00:00Z',
        capacity: 250,
        organizer_id: userMap['ahmet@alumni.edu'],
      }),
      eventFactory({
        title: 'Girişimcilik ve Teknoloji Zirvesi',
        description: 'Başarılı mezun girişimcilerin tecrübe paylaşımı yapacağı panel oturumları.',
        location: 'Kültür Merkezi Salon 1',
        event_date: '2026-06-12T13:30:00Z',
        capacity: 150,
        organizer_id: userMap['ayse@alumni.edu'],
      }),
      eventFactory({
        title: 'Geleneksel Mezunlar Yemeği',
        description: 'Dönem mezunlarımızı buluşturan akşam yemeği organizasyonu.',
        location: 'Boğaziçi Mezunlar Lokali',
        event_date: '2026-09-18T19:00:00Z',
        capacity: 200,
        organizer_id: userMap['mehmet.demir@alumni.edu'],
      }),
    ];

    const eventIds = [];
    for (const ev of eventDefinitions) {
      const existing = await pool.query('SELECT id FROM events WHERE title = $1 LIMIT 1;', [ev.title]);
      let evId;
      if (existing.rows.length > 0) {
        evId = existing.rows[0].id;
        await pool.query(
          `UPDATE events SET description = $1, location = $2, event_date = $3, capacity = $4, organizer_id = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6;`,
          [ev.description, ev.location, ev.event_date, ev.capacity, ev.organizer_id, evId]
        );
        console.log(`   * [Event Güncellendi] #${evId} - ${ev.title}`);
      } else {
        const res = await pool.query(
          `INSERT INTO events (title, description, location, event_date, capacity, organizer_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id;`,
          [ev.title, ev.description, ev.location, ev.event_date, ev.capacity, ev.organizer_id]
        );
        evId = res.rows[0].id;
        console.log(`   + [Event] #${evId} - ${ev.title}`);
      }
      eventIds.push(evId);
    }

    // 6. Event Registrations Seed
    console.log('\n📝 Etkinlik Kayıtları (event_registrations) ekleniyor...');
    const registrationDefinitions = [
      eventRegistrationFactory({ event_id: eventIds[0], user_id: userIds[1], status: 'registered' }),
      eventRegistrationFactory({ event_id: eventIds[0], user_id: userIds[2], status: 'attended' }),
      eventRegistrationFactory({ event_id: eventIds[0], user_id: userIds[3], status: 'registered' }),
      eventRegistrationFactory({ event_id: eventIds[1], user_id: userIds[0], status: 'registered' }),
      eventRegistrationFactory({ event_id: eventIds[1], user_id: userIds[3], status: 'attended' }),
      eventRegistrationFactory({ event_id: eventIds[2], user_id: userIds[4], status: 'registered' }),
    ];

    for (const reg of registrationDefinitions) {
      const res = await pool.query(
        `INSERT INTO event_registrations (event_id, user_id, status)
         VALUES ($1, $2, $3)
         ON CONFLICT (event_id, user_id) DO UPDATE SET status = EXCLUDED.status
         RETURNING id, event_id, user_id, status;`,
        [reg.event_id, reg.user_id, reg.status]
      );
      const row = res.rows[0];
      console.log(`   + [Registration] #${row.id} - Event #${row.event_id} ➔ User #${row.user_id} (${row.status})`);
    }

    // 7. Job Postings Seed
    await seedJobPostings(pool, { departmentMap, userMap });

    console.log('\n✨ Tüm seed verileri veritabanına başarıyla yüklendi!');
  } catch (err) {
    console.error('\n❌ Seed işlemi sırasında hata oluştu:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

/**
 * Job Postings Seed Runner
 * Hem seedDatabase içinden hem de bağımsız olarak çalıştırılabilir.
 * @param {Object} [customPool] - pg Pool nesnesi
 * @param {Object} [mappings] - { departmentMap, userMap }
 */
const seedJobPostings = async (customPool = pool, mappings = {}) => {
  let { departmentMap, userMap } = mappings;

  // Harici/bağımsız çağrıldıysa veritabanındaki mevcut kayıtları eşleştir
  if (!departmentMap) {
    departmentMap = {};
    const deptRes = await customPool.query('SELECT id, name FROM departments;');
    deptRes.rows.forEach(r => { departmentMap[r.name] = r.id; });
  }

  if (!userMap) {
    userMap = {};
    const userRes = await customPool.query('SELECT id, email FROM users;');
    userRes.rows.forEach(r => { userMap[r.email] = r.id; });
  }

  console.log('\n💼 İş İlanları (job_postings) ekleniyor...');
  const jobPostingDefinitions = [
    jobPostingFactory({
      title: 'Kıdemli Full Stack Geliştirici',
      company: 'Trendyol Tech',
      location: 'İstanbul / Hibrit',
      employment_type: 'full-time',
      description: 'E-ticaret platformumuzun mikroservis mimarisine katkı sağlayacak, yüksek trafikli sistemlerde tecrübeli yazılım mühendisi arıyoruz.',
      requirements: 'Node.js, PostgreSQL, Docker, Redis ve en az 3 yıl yazılım geliştirme deneyimi.',
      contact_email: 'tech-careers@trendyol.com',
      application_url: 'https://trendyol.com/careers/senior-fullstack',
      salary_range: '90.000 - 130.000 TL',
      deadline: '2026-11-30',
      is_active: true,
      posted_by: userMap['ahmet@alumni.edu'] || Object.values(userMap)[0] || null,
      department_id: departmentMap['Bilgisayar Mühendisliği'] || Object.values(departmentMap)[0] || null,
    }),
    jobPostingFactory({
      title: 'Veri Analisti ve İş Zekası Uzmanı',
      company: 'Getir',
      location: 'İstanbul / Maslak',
      employment_type: 'full-time',
      description: 'Operasyonel verilerin analizi, KPI panolarının hazırlanması ve karar destek modellerinin geliştirilmesinden sorumlu olunacaktır.',
      requirements: 'SQL, Python/R, Tableau/PowerBI bilgisi ve analitik düşünme yeteneği.',
      contact_email: 'bi-jobs@getir.com',
      application_url: 'https://getir.com/careers/data-analyst',
      salary_range: '75.000 - 100.000 TL',
      deadline: '2026-12-15',
      is_active: true,
      posted_by: userMap['ayse@alumni.edu'] || Object.values(userMap)[1] || null,
      department_id: departmentMap['Endüstri Mühendisliği'] || Object.values(departmentMap)[1] || null,
    }),
    jobPostingFactory({
      title: 'Frontend Geliştirici (React / Vue)',
      company: 'Insider',
      location: 'Uzaktan (Remote)',
      employment_type: 'remote',
      description: 'Global SaaS ürünlerimizin kullanıcı arayüzlerini ve web deneyimlerini geliştirecek yazılımcılar arıyoruz.',
      requirements: 'JavaScript (ES6+), React.js veya Vue.js, TailwindCSS ve REST API entegrasyon tecrübesi.',
      contact_email: 'talent@useinsider.com',
      application_url: 'https://useinsider.com/careers/frontend-dev',
      salary_range: '80.000 - 110.000 TL',
      deadline: '2026-10-31',
      is_active: true,
      posted_by: userMap['zeynep.celik@alumni.edu'] || Object.values(userMap)[2] || null,
      department_id: departmentMap['Bilgisayar Mühendisliği'] || Object.values(departmentMap)[0] || null,
    }),
    jobPostingFactory({
      title: 'Yazılım Mühendisliği Stajyeri',
      company: 'Peak Games',
      location: 'İstanbul / Levent',
      employment_type: 'internship',
      description: 'Mobil oyun ve backend servisleri geliştirme süreçlerinde yer alacak yetenekli stajyerler aranmaktadır.',
      requirements: 'Üniversitelerin ilgili mühendislik bölümlerinde son sınıf veya yeni mezun, temel algoritma ve OOP bilgisi.',
      contact_email: 'internship@peak.com',
      application_url: 'https://peak.com/internship-2026',
      salary_range: '30.000 - 45.000 TL',
      deadline: '2026-06-30',
      is_active: true,
      posted_by: userMap['mehmet.demir@alumni.edu'] || Object.values(userMap)[3] || null,
      department_id: departmentMap['Bilgisayar Mühendisliği'] || Object.values(departmentMap)[0] || null,
    }),
    jobPostingFactory({
      title: 'Ürün Yöneticisi (Product Manager)',
      company: 'Hepsiburada',
      location: 'İstanbul / Şişli',
      employment_type: 'full-time',
      description: 'Müşteri odaklı dijital ürünlerimizin vizyon, yol haritası ve geliştirme süreçlerini yönetecek ürün lideri.',
      requirements: 'Agile/Scrum metodolojileri, pazar analizi ve en az 2 yıl ürün yönetimi deneyimi.',
      contact_email: 'jobs@hepsiburada.com',
      application_url: 'https://hepsiburada.com/careers/product-manager',
      salary_range: '85.000 - 120.000 TL',
      deadline: '2026-11-20',
      is_active: true,
      posted_by: userMap['canan.ozturk@alumni.edu'] || Object.values(userMap)[4] || null,
      department_id: departmentMap['İşletme'] || Object.values(departmentMap)[3] || null,
    }),
  ];

  const jobPostingIds = [];
  for (const jp of jobPostingDefinitions) {
    const existing = await customPool.query(
      'SELECT id FROM job_postings WHERE title = $1 AND company = $2 LIMIT 1;',
      [jp.title, jp.company]
    );
    let jpId;
    if (existing.rows.length > 0) {
      jpId = existing.rows[0].id;
      await customPool.query(
        `UPDATE job_postings
         SET location = $1, employment_type = $2, description = $3, requirements = $4,
             contact_email = $5, application_url = $6, salary_range = $7, deadline = $8,
             is_active = $9, posted_by = $10, department_id = $11, updated_at = CURRENT_TIMESTAMP
         WHERE id = $12;`,
        [
          jp.location, jp.employment_type, jp.description, jp.requirements,
          jp.contact_email, jp.application_url, jp.salary_range, jp.deadline,
          jp.is_active, jp.posted_by, jp.department_id, jpId
        ]
      );
      console.log(`   * [Job Posting Güncellendi] #${jpId} - ${jp.title} @ ${jp.company}`);
    } else {
      const res = await customPool.query(
        `INSERT INTO job_postings (
           title, company, location, employment_type, description, requirements,
           contact_email, application_url, salary_range, deadline, is_active,
           posted_by, department_id
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id;`,
        [
          jp.title, jp.company, jp.location, jp.employment_type, jp.description, jp.requirements,
          jp.contact_email, jp.application_url, jp.salary_range, jp.deadline, jp.is_active,
          jp.posted_by, jp.department_id
        ]
      );
      jpId = res.rows[0].id;
      console.log(`   + [Job Posting] #${jpId} - ${jp.title} @ ${jp.company}`);
    }
    jobPostingIds.push(jpId);
  }

  return jobPostingIds;
};

// Doğrudan çalıştırıldığında fonksiyonu çağır
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('job-postings') || args.includes('job_postings') || args.includes('--job-postings')) {
    (async () => {
      try {
        console.log('📌 Migration kontrolü yapılıyor...');
        await runMigrations();
        await seedJobPostings(pool);
        console.log('\n✨ İş ilanları seed işlemi başarıyla tamamlandı!');
      } catch (err) {
        console.error('\n❌ İş ilanları seed işlemi sırasında hata oluştu:', err);
        process.exitCode = 1;
      } finally {
        await pool.end();
      }
    })();
  } else {
    seedDatabase();
  }
}

module.exports = {
  seedDatabase,
  seedJobPostings,
};
