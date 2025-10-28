import settingsModel from "../models/SettingsModel.js";

/**
 * Get all settings or by category
 */
export const getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = {};
    if (category) {
      query.category = category;
    }
    
    const settings = await settingsModel.find(query);
    
    // Convert to key-value object for easier frontend consumption
    const settingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value;
    });
    
    res.json({ success: true, settings: settingsObject });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Get single setting by key
 */
export const getSetting = async (req, res) => {
  try {
    const { key } = req.body;
    const setting = await settingsModel.findOne({ key });
    
    if (!setting) {
      return res.json({ success: false, message: "Setting not found" });
    }
    
    res.json({ success: true, setting });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Create or update setting
 */
export const updateSetting = async (req, res) => {
  try {
    const { key, value, category, description } = req.body;
    
    if (!key || value === undefined) {
      return res.json({ success: false, message: "Key and value are required" });
    }
    
    const setting = await settingsModel.findOneAndUpdate(
      { key },
      { 
        value, 
        category: category || 'general',
        description,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, setting, message: "Setting updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Update multiple settings at once
 */
export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body; // Array of {key, value, category}
    
    if (!Array.isArray(settings)) {
      return res.json({ success: false, message: "Settings must be an array" });
    }
    
    const updatePromises = settings.map(async ({ key, value, category, description }) => {
      return await settingsModel.findOneAndUpdate(
        { key },
        { 
          value, 
          category: category || 'general',
          description,
          updatedAt: Date.now()
        },
        { upsert: true, new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Delete setting
 */
export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.body;
    
    await settingsModel.findOneAndDelete({ key });
    
    res.json({ success: true, message: "Setting deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Test email configuration
 */
const testEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    
    if (!email) {
      return res.json({ success: false, message: "Email address is required" });
    }

    // Import emailService dynamically to avoid circular dependency
    const { default: emailService } = await import("../services/EmailService.js");
    
    const result = await emailService.sendEmail({
      from: `"Tulumbak Baklava" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject || 'Test Email - Tulumbak',
      html: message || `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>Bu bir test email'idir.</p>
          <p>Email ayarlarınız doğru yapılandırılmış!</p>
        </div>
      `
    });

    if (result.success) {
      res.json({ success: true, message: "Test email sent successfully" });
    } else {
      res.json({ success: false, message: result.message || "Failed to send test email" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Initialize default settings if not exists
 */
export const initDefaultSettings = async () => {
  try {
    const defaultSettings = [
      {
        key: 'email_enabled',
        value: true,
        category: 'email',
        description: 'Enable email notifications'
      },
      {
        key: 'email_smtp_host',
        value: process.env.SMTP_HOST || '',
        category: 'email',
        description: 'SMTP host'
      },
      {
        key: 'email_smtp_port',
        value: parseInt(process.env.SMTP_PORT) || 587,
        category: 'email',
        description: 'SMTP port'
      },
      {
        key: 'email_smtp_user',
        value: process.env.SMTP_USER || '',
        category: 'email',
        description: 'SMTP username'
      },
      {
        key: 'stock_min_threshold',
        value: 10,
        category: 'stock',
        description: 'Minimum stock threshold for alerts'
      },
      {
        key: 'stock_enable_alerts',
        value: true,
        category: 'stock',
        description: 'Enable low stock alerts'
      },
      {
        key: 'rate_limit_max_requests',
        value: 100,
        category: 'security',
        description: 'Maximum requests per window'
      },
      {
        key: 'rate_limit_window_ms',
        value: 900000, // 15 minutes
        category: 'security',
        description: 'Rate limit window in milliseconds'
      }
    ];
    
    for (const setting of defaultSettings) {
      await settingsModel.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true }
      );
    }
    
    console.log('Default settings initialized');
  } catch (error) {
    console.error('Error initializing default settings:', error);
  }
};

export { getSettings, getSetting, updateSetting, updateSettings, deleteSetting, testEmail, initDefaultSettings };

