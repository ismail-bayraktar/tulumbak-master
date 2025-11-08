import mongoose from "mongoose";
import crypto from "crypto";

/**
 * WebhookConfig Model
 * Stores webhook configuration for different courier platforms
 * Secret keys are encrypted before storage
 */

const webhookConfigSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    secretKey: {
        type: String,
        required: true
        // Encrypted before save
    },
    webhookUrl: {
        type: String,
        default: process.env.WEBHOOK_BASE_URL || 'https://api.tulumbak.com/api/webhook/courier'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    events: [{
        type: String,
        enum: [
            'order.status.updated',
            'order.delivered',
            'order.failed',
            'order.cancelled',
            'order.assigned',
            'courier.location.updated'
        ]
    }],
    rateLimit: {
        perMinute: {
            type: Number,
            default: 100
        },
        perHour: {
            type: Number,
            default: 1000
        }
    },
    retryConfig: {
        maxRetries: {
            type: Number,
            default: 3
        },
        retryDelay: {
            type: Number,
            default: 1000 // milliseconds
        }
    },
    lastTestAt: {
        type: Number
    },
    lastTestStatus: {
        type: String,
        enum: ['success', 'failed', null],
        default: null
    },
    metadata: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    updatedAt: {
        type: Number,
        default: Date.now
    }
});

// Encrypt secret key before saving
webhookConfigSchema.pre('save', function(next) {
    if (this.isModified('secretKey') && this.secretKey) {
        // Only encrypt if not already encrypted (check if starts with 'enc:')
        if (!this.secretKey.startsWith('enc:')) {
            const encryptionKey = process.env.WEBHOOK_ENCRYPTION_KEY || process.env.JWT_SECRET;
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.substring(0, 32).padEnd(32, '0')), iv);
            let encrypted = cipher.update(this.secretKey, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            this.secretKey = 'enc:' + iv.toString('hex') + ':' + encrypted;
        }
    }
    this.updatedAt = Date.now();
    next();
});

// Method to decrypt secret key
webhookConfigSchema.methods.getDecryptedSecretKey = function() {
    if (!this.secretKey.startsWith('enc:')) {
        return this.secretKey; // Not encrypted, return as is
    }
    
    try {
        const parts = this.secretKey.substring(4).split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const encryptionKey = process.env.WEBHOOK_ENCRYPTION_KEY || process.env.JWT_SECRET;
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.substring(0, 32).padEnd(32, '0')), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error('Failed to decrypt secret key');
    }
};

// Indexes
// Note: platform already has index from unique: true
webhookConfigSchema.index({ enabled: 1 });

const webhookConfigModel = mongoose.models.webhook_config || mongoose.model("webhook_config", webhookConfigSchema);

export default webhookConfigModel;

