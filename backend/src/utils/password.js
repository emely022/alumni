const crypto = require('crypto');
const util = require('util');

const scryptAsync = util.promisify(crypto.scrypt);

/**
 * Parolayı Node.js'in yerleşik crypto.scrypt fonksiyonu ve rastgele bir tuz (salt)
 * kullanarak güvenli bir şekilde karma (hash) haline getirir.
 * 
 * Şifreler ASLA düz metin olarak saklanmaz.
 * Çıktı formatı: `${salt}:${derivedKey}` (hex formatında)
 * 
 * @param {string} password - Kullanıcının düz metin parolası
 * @returns {Promise<string>} Hex formatında tuz ve anahtar içeren hash dizesi
 */
const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Geçersiz parola girdisi.');
  }

  // 16 byte (128 bit) kriptografik rastgele tuz
  const salt = crypto.randomBytes(16).toString('hex');

  // scrypt ile 64 byte (512 bit) türetilmiş anahtar
  const derivedKey = await scryptAsync(password, salt, 64);

  return `${salt}:${derivedKey.toString('hex')}`;
};

/**
 * Kullanıcının girdiği düz metin parolayı saklanan scrypt karmasıyla karşılaştırır.
 * Zamanlama saldırılarını (timing attack) önlemek için timingSafeEqual kullanılır.
 * 
 * @param {string} password - Doğrulanacak düz metin parola
 * @param {string} storedHash - Veritabanındaki `${salt}:${derivedKey}` karması
 * @returns {Promise<boolean>} Eşleşiyorsa true, aksi halde false
 */
const verifyPassword = async (password, storedHash) => {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }

  const [salt, keyHex] = parts;
  if (!salt || !keyHex) {
    return false;
  }

  try {
    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedKey = await scryptAsync(password, salt, 64);

    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }

    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (_) {
    return false;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
};
