/**
 * VRSE Studio (VrseBuilder) test configuration.
 * Override via env vars without editing specs.
 */
const path = require('path');

const downloadsPath = process.env.STUDIO_DOWNLOADS_PATH || 'C:\\Users\\User\\Downloads';
const testDataPath = path.join(__dirname, '../test-data');

module.exports = {
  baseUrl: process.env.STUDIO_BASE_URL || 'https://dev.vrsestudio.autovrse.app',

  credentials: {
    username: process.env.STUDIO_USERNAME || 'TDW00118',
    password: process.env.STUDIO_PASSWORD || 'qatest',
  },

  routes: {
    login: '/login',
  },

  downloadsPath,

  testFiles: {
    negativeJson: path.join(downloadsPath, 'vr-bug-report.json'),
    positiveJson: path.join(downloadsPath, 'VrseBuilderJSON_TDW00118.json'),
    negativeExcel: path.join(downloadsPath, 'sample_format (5).xlsx'),
    positiveExcel: path.join(downloadsPath, 'VrseBuilderJSON_TDW00118.xlsx'),
  },

  referenceImages: [
    path.join(downloadsPath, 'Console.png'),
    path.join(downloadsPath, 'Network.png'),
    path.join(downloadsPath, 'image - 2026-06-25T113309.890.png'),
    path.join(downloadsPath, 'image - 2026-06-25T115417.877.png'),
  ],

  storyBuilderUploads: {
    pdf: path.join(downloadsPath, 'Electrical_Isolation_VisualSB 1.pdf'),
    docx: path.join(testDataPath, 'story-builder', 'sample.docx'),
    pptx: path.join(testDataPath, 'story-builder', 'sample.pptx'),
    xlsx: path.join(downloadsPath, 'sample_format (5).xlsx'),
    csv: path.join(testDataPath, 'story-builder', 'sample.csv'),
    txt: path.join(testDataPath, 'story-builder', 'sample.txt'),
    json: path.join(testDataPath, 'story-builder', 'sample.json'),
    md: path.join(testDataPath, 'story-builder', 'sample.md'),
    png: path.join(__dirname, '../../google.png'),
    jpg: path.join(__dirname, '../../image (34).jpg'),
    mp3: path.join(testDataPath, 'story-builder', 'sample.mp3'),
    wav: path.join(testDataPath, 'story-builder', 'sample.wav'),
  },
};
