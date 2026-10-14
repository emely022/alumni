const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

/**
 * Migration Runner
 * 
 * backend/migrations/ klasöründeki sıralı SQL dosyalarını okur,
 * migrations tablosunu kullanarak daha önce çalıştırılmamış migration'ları
 * sırayla ve transaction güvenliğiyle çalıştırır.
 */

// Migration dosyalarının bulunabileceği olası dizin yolları
const getMigrationsDir = () => {
  const candidatePaths = [
    path.resolve(__dirname, '../../migrations'),
    path.resolve(__dirname, '../migrations'),
    path.resolve(process.cwd(), 'backend/migrations'),
    path.resolve(process.cwd(), 'migrations'),
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidatePaths[0];
};

const runMigrations = async () => {
  const migrationsDir = getMigrationsDir();

  if (!fs.existsSync(migrationsDir)) {
    console.warn(`[Migrations] Migration dizini bulunamadı: ${migrationsDir}`);
    return { applied: 0, skipped: 0, total: 0 };
  }

  console.log(`[Migrations] Migration dizini: ${migrationsDir}`);

  // 1. Migration takip tablosunu oluştur
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Daha önce çalıştırılmış migration'ları çek
  const { rows } = await pool.query('SELECT name FROM migrations;');
  const executedMigrations = new Set(rows.map((row) => row.name));

  // 3. SQL dosyalarını alfabetik sırayla listele
  const allFiles = fs.readdirSync(migrationsDir);
  const migrationFiles = allFiles
    .filter((file) => file.endsWith('.sql'))
    .sort();

  let appliedCount = 0;
  let skippedCount = 0;

  for (const file of migrationFiles) {
    if (executedMigrations.has(file)) {
      console.log(`[Migrations] Atlandı (zaten çalıştırılmış): ${file}`);
      skippedCount++;
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`[Migrations] Çalıştırılıyor: ${file}...`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1);', [file]);
      await client.query('COMMIT');

      console.log(`[Migrations] ✅ Başarıyla uygulandı: ${file}`);
      appliedCount++;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`[Migrations] ❌ Hata oluştu (${file}):`, err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  console.log(`[Migrations] Tamamlandı: ${appliedCount} yeni uygulandı, ${skippedCount} atlandı, toplam ${migrationFiles.length} dosya.`);
  return { applied: appliedCount, skipped: skippedCount, total: migrationFiles.length };
};

module.exports = {
  runMigrations,
};
