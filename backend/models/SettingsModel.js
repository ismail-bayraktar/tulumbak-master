import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  category: {
    type: String,
    enum: ['email', 'security', 'stock', 'general', 'payment', 'delivery'],
    required: true
  },
  description: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

const settingsModel = mongoose.models.settings || mongoose.model("settings", settingsSchema);

export default settingsModel;
