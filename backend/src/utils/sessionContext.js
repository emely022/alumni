const { AsyncLocalStorage } = require('async_hooks');

const sessionAsyncStorage = new AsyncLocalStorage();

/**
 * Aktif HTTP isteğindeki oturum açmış kullanıcıyı döner.
 * @returns {Object|null} Oturumdaki kullanıcı nesnesi ({ id, name, email, role }) veya null
 */
const getCurrentUser = () => {
  const store = sessionAsyncStorage.getStore();
  return store && store.currentUser ? store.currentUser : null;
};

/**
 * Aktif HTTP isteğindeki oturum kullanıcısını günceller.
 * @param {Object|null} user
 */
const setCurrentUser = (user) => {
  const store = sessionAsyncStorage.getStore();
  if (store) {
    store.currentUser = user || null;
  }
};

/**
 * Express middleware: req.session.user bilgisini res.locals.currentUser ve
 * AsyncLocalStorage bağlamına aktarır. Böylece tüm SSR View şablonları
 * (layout.js, homeView.js vb.) aktif kullanıcı bilgisine otomatik erişir.
 */
const sessionContextMiddleware = (req, res, next) => {
  const currentUser = req.session && req.session.user ? req.session.user : null;
  res.locals = res.locals || {};
  res.locals.currentUser = currentUser;

  sessionAsyncStorage.run({ currentUser }, () => {
    next();
  });
};

module.exports = {
  getCurrentUser,
  setCurrentUser,
  sessionContextMiddleware,
};
