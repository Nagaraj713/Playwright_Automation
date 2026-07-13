/**
 * Central config for Pulse Dashboard tests.
 * Override via env vars in CI/local without editing specs.
 */
module.exports = {
  baseUrl: process.env.PULSE_BASE_URL || 'https://dev-pulse-dashboard.autovrse-training.com',

  credentials: {
    username: process.env.PULSE_USERNAME || 'admin@autovrse.in',
    password: process.env.PULSE_PASSWORD || 'admin',
  },

  routes: {
    login: '/auth/login/',
    users: '/users',
    evaluations: '/evaluations',
    analytics: '/analytics',
    modules: '/modules',
    trainings: '/trainings',
    devices: '/devices',
    schedules: '/schedules',
    groups: '/groups',
  },

  files: {
    supportVideo: process.env.SUPPORT_VIDEO_PATH || 'C:\\Users\\User\\Downloads\\MetaLayerAction_2.mp4',
  },

  testData: {
    moduleRow:
      'Toggle select row QA_TEST_INTERNAL_2 Platform Team Test Repo 1776319820 Add Tag',
    usersRow: 'Toggle select row test456 123456',
    evaluationBulkDeleteRow:
      'Toggle select row Platform Admin 1 PFadmin1 MCQ Mode Multiplayer 01/04/2026 12:21 - 01/04/2026 12:22 1 minute 16 seconds 30 / 30 Pass Platform Team Row Actions',
    trainingBulkDeleteRow:
      'Toggle select row camp8 Chromatica Bootcamp Camp8- Nupur Single Player 27/04/2026 14:23 - 27/04/2026 15:23 1 hour 17 seconds completed Row Actions',
    deviceDetailText: 'Unknown DeviceID: a52f395f70active1Domains1Users',
  },
};
