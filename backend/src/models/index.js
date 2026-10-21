const UserModel = require('./userModel');
const AnnouncementModel = require('./announcementModel');
const DepartmentModel = require('./departmentModel');
const EventModel = require('./eventModel');
const EventRegistrationModel = require('./eventRegistrationModel');
const JobPostingModel = require('./jobPostingModel');
const ApplicationModel = require('./applicationModel');

/**
 * Model İlişkileri Tanımları (Schema Relationship Mapping)
 * 
 * PostgreSQL migration şemasına dayalı varlıklar arası ilişkiler (1:N, N:N, N:1)
 */
const relationships = {
  departments: {
    users: { type: 'hasMany', model: 'UserModel', foreignKey: 'department_id' },
    jobPostings: { type: 'hasMany', model: 'JobPostingModel', foreignKey: 'department_id' },
  },
  users: {
    department: { type: 'belongsTo', model: 'DepartmentModel', foreignKey: 'department_id' },
    announcements: { type: 'hasMany', model: 'AnnouncementModel', foreignKey: 'author_id' },
    organizedEvents: { type: 'hasMany', model: 'EventModel', foreignKey: 'organizer_id' },
    eventRegistrations: { type: 'hasMany', model: 'EventRegistrationModel', foreignKey: 'user_id' },
    registeredEvents: {
      type: 'belongsToMany',
      model: 'EventModel',
      through: 'event_registrations',
      foreignKey: 'user_id',
      otherKey: 'event_id',
    },
    jobPostings: { type: 'hasMany', model: 'JobPostingModel', foreignKey: 'posted_by' },
    applications: { type: 'hasMany', model: 'ApplicationModel', foreignKey: 'user_id' },
    appliedJobs: {
      type: 'belongsToMany',
      model: 'JobPostingModel',
      through: 'applications',
      foreignKey: 'user_id',
      otherKey: 'job_posting_id',
    },
  },
  announcements: {
    author: { type: 'belongsTo', model: 'UserModel', foreignKey: 'author_id' },
  },
  events: {
    organizer: { type: 'belongsTo', model: 'UserModel', foreignKey: 'organizer_id' },
    registrations: { type: 'hasMany', model: 'EventRegistrationModel', foreignKey: 'event_id' },
    participants: {
      type: 'belongsToMany',
      model: 'UserModel',
      through: 'event_registrations',
      foreignKey: 'event_id',
      otherKey: 'user_id',
    },
  },
  event_registrations: {
    event: { type: 'belongsTo', model: 'EventModel', foreignKey: 'event_id' },
    user: { type: 'belongsTo', model: 'UserModel', foreignKey: 'user_id' },
  },
  job_postings: {
    poster: { type: 'belongsTo', model: 'UserModel', foreignKey: 'posted_by' },
    department: { type: 'belongsTo', model: 'DepartmentModel', foreignKey: 'department_id' },
    applications: { type: 'hasMany', model: 'ApplicationModel', foreignKey: 'job_posting_id' },
    applicants: {
      type: 'belongsToMany',
      model: 'UserModel',
      through: 'applications',
      foreignKey: 'job_posting_id',
      otherKey: 'user_id',
    },
  },
  applications: {
    jobPosting: { type: 'belongsTo', model: 'JobPostingModel', foreignKey: 'job_posting_id' },
    user: { type: 'belongsTo', model: 'UserModel', foreignKey: 'user_id' },
  },
};

module.exports = {
  UserModel,
  userModel: UserModel,
  AnnouncementModel,
  announcementModel: AnnouncementModel,
  DepartmentModel,
  departmentModel: DepartmentModel,
  EventModel,
  eventModel: EventModel,
  EventRegistrationModel,
  eventRegistrationModel: EventRegistrationModel,
  JobPostingModel,
  jobPostingModel: JobPostingModel,
  ApplicationModel,
  applicationModel: ApplicationModel,
  relationships,
};
