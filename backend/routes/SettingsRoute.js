import express from 'express';
import {
  getSettings,
  getSetting,
  updateSetting,
  updateSettings,
  deleteSetting,
  testEmail,
  testSms
} from '../controllers/SettingsController.js';
import adminAuth from '../middleware/AdminAuth.js';

const settingsRouter = express.Router();

// All routes require admin authentication
settingsRouter.get('/', adminAuth, getSettings);
settingsRouter.post('/single', adminAuth, getSetting);
settingsRouter.post('/update', adminAuth, updateSetting);
settingsRouter.post('/update-multiple', adminAuth, updateSettings);
settingsRouter.post('/test-email', adminAuth, testEmail);
settingsRouter.post('/test-sms', adminAuth, testSms);
settingsRouter.delete('/', adminAuth, deleteSetting);

export default settingsRouter;


