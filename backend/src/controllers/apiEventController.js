const EventModel = require('../models/eventModel');
const EventRegistrationModel = require('../models/eventRegistrationModel');

/**
 * ApiEventController
 * 
 * Sorumluluk: RESTful API (JSON) Katmanı - Etkinlikler ve Katılım Kayıtları
 * Etkinlik CRUD, katılım işlemleri ve ilişkisel (nested) endpoint'leri yönetir.
 */

// =========================================================================
// ETKİNLİK DİREKT CRUD
// =========================================================================

// GET /api/events - Tüm etkinlikleri listeler
const getEvents = async (req, res) => {
  try {
    const events = await EventModel.findAll();
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlikler alınırken hata oluştu.' });
  }
};

// GET /api/events/:id - Tekil etkinlik detayı
const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }
    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik detayı alınırken hata oluştu.' });
  }
};

// POST /api/events - Yeni etkinlik oluşturur
const createEvent = async (req, res) => {
  try {
    const { title, description, location, eventDate, capacity, organizerId } = req.body || {};

    if (!title || !description || !location || !eventDate) {
      return res.status(400).json({
        error: 'title, description, location ve eventDate alanları zorunludur.',
      });
    }

    const newEvent = await EventModel.create({
      title,
      description,
      location,
      eventDate,
      capacity,
      organizerId,
    });

    return res.status(201).json({
      message: 'Etkinlik başarıyla eklendi',
      event: newEvent,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik eklenirken hata oluştu.' });
  }
};

// PUT /api/events/:id - Etkinliği tamamen günceller (PUT)
const updateEventPut = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    const { title, description, location, eventDate, capacity, organizerId } = req.body || {};

    if (!title || !description || !location || !eventDate) {
      return res.status(400).json({
        error: 'PUT isteğinde title, description, location ve eventDate alanları zorunludur.',
      });
    }

    const updated = await EventModel.replace(eventId, {
      title,
      description,
      location,
      eventDate,
      capacity,
      organizerId,
    });

    return res.status(200).json({
      message: 'Etkinlik güncellendi',
      event: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik güncellenirken hata oluştu.' });
  }
};

// PATCH /api/events/:id - Etkinliği kısmi günceller (PATCH)
const updateEventPatch = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    const updated = await EventModel.update(eventId, req.body || {});
    return res.status(200).json({
      message: 'Etkinlik güncellendi',
      event: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik güncellenirken hata oluştu.' });
  }
};

// DELETE /api/events/:id - Etkinliği siler
const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const deleted = await EventModel.remove(eventId);

    if (!deleted) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    return res.status(200).json({
      message: 'Etkinlik başarıyla silindi',
      event: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik silinirken hata oluştu.' });
  }
};

// =========================================================================
// ETKİNLİK İÇ İÇE (NESTED) ENDPOINT'LER
// =========================================================================

// GET /api/events/:id/organizer - Etkinliğin organizatörünü döner (N:1)
const getEventOrganizer = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    const organizer = await EventModel.getOrganizer(eventId);
    if (!organizer) {
      return res.status(404).json({ error: 'Bu etkinliğe atanmış bir organizatör bulunamadı' });
    }

    return res.status(200).json(organizer);
  } catch (err) {
    return res.status(500).json({ error: 'Organizatör bilgisi alınırken hata oluştu.' });
  }
};

// GET /api/events/:id/registrations - Etkinliğe ait kayıtları döner (1:N)
const getEventRegistrations = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    const registrations = await EventModel.getRegistrations(eventId);
    return res.status(200).json({
      eventId,
      totalRegistrations: registrations.length,
      registrations,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik kayıtları alınırken hata oluştu.' });
  }
};

// GET /api/events/:id/participants - Etkinliğe katılan mezunları döner (N:N)
const getEventParticipants = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    const participants = await EventModel.getParticipants(eventId);
    return res.status(200).json({
      eventId,
      eventTitle: event.title,
      totalParticipants: participants.length,
      participants,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Katılımcı listesi alınırken hata oluştu.' });
  }
};

// POST /api/events/:id/registrations - Etkinliğe mezun kaydı ekler (Nested Create)
const registerToEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Etkinlik bulunamadı' });
    }

    const { userId, status } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: 'userId alanı zorunludur.' });
    }

    // Mükerrer kayıt kontrolü
    const existing = await EventRegistrationModel.findByEventAndUser(eventId, userId);
    if (existing) {
      return res.status(400).json({ error: 'Bu kullanıcı zaten bu etkinliğe kayıtlı.' });
    }

    const registration = await EventRegistrationModel.create({
      eventId,
      userId,
      status: status || 'registered',
    });

    return res.status(201).json({
      message: 'Etkinliğe kayıt başarıyla yapıldı',
      registration,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Etkinlik kaydı oluşturulurken hata oluştu.' });
  }
};

// =========================================================================
// EVENT REGISTRATIONS DİREKT VE İLİŞKİSEL ENDPOINT'LER
// =========================================================================

// GET /api/event-registrations - Tüm kayıtları listeler
const getRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistrationModel.findAll();
    return res.status(200).json(registrations);
  } catch (err) {
    return res.status(500).json({ error: 'Kayıtlar listelenirken hata oluştu.' });
  }
};

// GET /api/event-registrations/:id - Tekil kayıt detayını döner
const getRegistrationById = async (req, res) => {
  try {
    const registration = await EventRegistrationModel.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }
    return res.status(200).json(registration);
  } catch (err) {
    return res.status(500).json({ error: 'Kayıt detayı alınırken hata oluştu.' });
  }
};

// POST /api/event-registrations - Yeni kayıt oluşturur
const createRegistration = async (req, res) => {
  try {
    const { eventId, userId, status } = req.body || {};

    if (!eventId || !userId) {
      return res.status(400).json({ error: 'eventId ve userId alanları zorunludur.' });
    }

    const existing = await EventRegistrationModel.findByEventAndUser(eventId, userId);
    if (existing) {
      return res.status(400).json({ error: 'Bu kullanıcı zaten bu etkinliğe kayıtlı.' });
    }

    const registration = await EventRegistrationModel.create({
      eventId,
      userId,
      status: status || 'registered',
    });

    return res.status(201).json({
      message: 'Kayıt başarıyla oluşturuldu',
      registration,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kayıt eklenirken hata oluştu.' });
  }
};

// PATCH /api/event-registrations/:id - Kayıt durumunu günceller (registered, attended, cancelled)
const updateRegistrationStatus = async (req, res) => {
  try {
    const regId = parseInt(req.params.id, 10);
    const registration = await EventRegistrationModel.findById(regId);

    if (!registration) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    const { status } = req.body || {};
    if (!status || !['registered', 'attended', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: "status alanı zorunludur ve 'registered', 'attended' veya 'cancelled' olmalıdır.",
      });
    }

    const updated = await EventRegistrationModel.updateStatus(regId, status);
    return res.status(200).json({
      message: 'Kayıt durumu güncellendi',
      registration: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kayıt durumu güncellenirken hata oluştu.' });
  }
};

// DELETE /api/event-registrations/:id - Kaydı siler
const deleteRegistration = async (req, res) => {
  try {
    const regId = parseInt(req.params.id, 10);
    const deleted = await EventRegistrationModel.remove(regId);

    if (!deleted) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    return res.status(200).json({
      message: 'Kayıt başarıyla silindi',
      registration: deleted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Kayıt silinirken hata oluştu.' });
  }
};

// GET /api/event-registrations/:id/event - Kaydın bağlı olduğu etkinliği döner
const getRegistrationEvent = async (req, res) => {
  try {
    const regId = parseInt(req.params.id, 10);
    const event = await EventRegistrationModel.getEvent(regId);

    if (!event) {
      return res.status(404).json({ error: 'Kayıt veya ilişkili etkinlik bulunamadı' });
    }

    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({ error: 'İlişkili etkinlik alınırken hata oluştu.' });
  }
};

// GET /api/event-registrations/:id/user - Kaydı yapan kullanıcıyı döner
const getRegistrationUser = async (req, res) => {
  try {
    const regId = parseInt(req.params.id, 10);
    const user = await EventRegistrationModel.getUser(regId);

    if (!user) {
      return res.status(404).json({ error: 'Kayıt veya ilişkili kullanıcı bulunamadı' });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'İlişkili kullanıcı alınırken hata oluştu.' });
  }
};

const ApiEventController = {
  getEvents,
  getEventById,
  createEvent,
  updateEventPut,
  updateEventPatch,
  deleteEvent,
  // Event nested
  getEventOrganizer,
  getEventRegistrations,
  getEventParticipants,
  registerToEvent,
  // Registrations direct & nested
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistrationStatus,
  deleteRegistration,
  getRegistrationEvent,
  getRegistrationUser,
};

module.exports = ApiEventController;
