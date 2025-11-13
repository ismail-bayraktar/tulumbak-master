import mongoose from 'mongoose';

const emailSettingsSchema = new mongoose.Schema(
  {
    // SMTP Configuration
    smtp: {
      enabled: { type: Boolean, default: false },
      host: { type: String, required: true },
      port: { type: Number, required: true, default: 587 },
      secure: { type: Boolean, default: false },
      user: { type: String, required: true },
      password: { type: String, required: true },
      fromName: { type: String, default: 'Tulumbak Baklava' },
      fromEmail: { type: String, required: true },
    },

    // Email Triggers - Toggle on/off individually
    triggers: {
      userRegistration: { type: Boolean, default: true },
      orderCreated: { type: Boolean, default: true },
      orderStatusUpdate: { type: Boolean, default: true },
      orderPreparing: { type: Boolean, default: true },
      courierAssigned: { type: Boolean, default: true },
      orderDelivered: { type: Boolean, default: true },
      paymentReceived: { type: Boolean, default: true },
      paymentFailed: { type: Boolean, default: false },
      lowStock: { type: Boolean, default: true },
      newReview: { type: Boolean, default: false },
    },

    // Logging Configuration
    logging: {
      enabled: { type: Boolean, default: true },
      retentionDays: { type: Number, default: 30 }, // How long to keep logs
      logSuccessful: { type: Boolean, default: true },
      logFailed: { type: Boolean, default: true },
    },

    // General Settings
    general: {
      enabled: { type: Boolean, default: true }, // Master on/off switch
      bccAdmin: { type: Boolean, default: false }, // BCC admin on all emails
      adminEmail: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists (singleton pattern)
emailSettingsSchema.index({ _id: 1 }, { unique: true });

const EmailSettings = mongoose.model('EmailSettings', emailSettingsSchema);

export default EmailSettings;
