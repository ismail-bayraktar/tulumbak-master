import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * CourierIntegrationConfig Model
 * Stores configuration for different courier platforms (MuditaKurye, Aras, Yurtici, etc.)
 * Credentials are encrypted before storage for security
 */

const courierIntegrationConfigSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    apiUrl: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
        // Encrypted before save
    },
    apiSecret: {
        type: String
        // Encrypted before save (if applicable)
    },
    restaurantId: {
        type: String // For MuditaKurye, restaurant ID
    },
    authType: {
        type: String,
        enum: ['bearer', 'basic', 'api_key', 'oauth2'],
        default: 'bearer'
    },
    enabled: {
        type: Boolean,
        default: false
    },
    testMode: {
        type: Boolean,
        default: true // Start in test mode by default
    },
    rateLimits: {
        perMinute: {
            type: Number,
            default: 60
        },
        perHour: {
            type: Number,
            default: 1000
        }
    },
    retryConfig: {
        maxRetries: {
            type: Number,
            default: 5
        },
        baseDelay: {
            type: Number,
            default: 1000 // 1 second
        },
        maxDelay: {
            type: Number,
            default: 300000 // 5 minutes
        }
    },
    circuitBreaker: {
        enabled: {
            type: Boolean,
            default: true
        },
        failureThreshold: {
            type: Number,
            default: 5
        },
        timeout: {
            type: Number,
            default: 60000 // 60 seconds
        },
        halfOpenRequests: {
            type: Number,
            default: 1
        }
    },
    statusMapping: {
        type: Map,
        of: String,
        default: new Map([
            ['VALIDATED', 'Siparişiniz Alındı'],
            ['ASSIGNED', 'Kuryeye Atandı'],
            ['PREPARED', 'Hazırlanıyor'],
            ['ON_DELIVERY', 'Yolda'],
            ['DELIVERED', 'Teslim Edildi'],
            ['CANCELED', 'İptal Edildi']
        ])
    },
    webhookConfig: {
        enabled: {
            type: Boolean,
            default: true
        },
        url: {
            type: String,
            default: process.env.WEBHOOK_BASE_URL || 'https://api.tulumbak.com/api/webhook/courier'
        },
        secretKey: {
            type: String
            // Encrypted before save
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
        }]
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
    },
    lastTestAt: {
        type: Number
    },
    lastTestStatus: {
        type: String,
        enum: ['success', 'failed', null],
        default: null
    }
});

// Helper function to encrypt field
function encryptField(text) {
    const encryptionKey = process.env.WEBHOOK_ENCRYPTION_KEY || process.env.JWT_SECRET || 'default_encryption_key_change_in_production';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.substring(0, 32).padEnd(32, '0')), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return 'enc:' + iv.toString('hex') + ':' + encrypted;
}

// Helper function to decrypt field
function decryptField(encryptedText) {
    if (!encryptedText || !encryptedText.startsWith('enc:')) {
        return encryptedText; // Not encrypted, return as is
    }

    try {
        const parts = encryptedText.substring(4).split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const encryptionKey = process.env.WEBHOOK_ENCRYPTION_KEY || process.env.JWT_SECRET || 'default_encryption_key_change_in_production';
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.substring(0, 32).padEnd(32, '0')), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error('Failed to decrypt field');
    }
}

// Encrypt credentials before save
courierIntegrationConfigSchema.pre('save', function(next) {
    // Encrypt API key
    if (this.isModified('apiKey') && this.apiKey && !this.apiKey.startsWith('enc:')) {
        this.apiKey = encryptField(this.apiKey);
    }

    // Encrypt API secret if exists
    if (this.isModified('apiSecret') && this.apiSecret && !this.apiSecret.startsWith('enc:')) {
        this.apiSecret = encryptField(this.apiSecret);
    }

    // Encrypt webhook secret key if exists
    if (this.isModified('webhookConfig.secretKey') && this.webhookConfig?.secretKey && !this.webhookConfig.secretKey.startsWith('enc:')) {
        this.webhookConfig.secretKey = encryptField(this.webhookConfig.secretKey);
    }

    this.updatedAt = Date.now();
    next();
});

// Decrypt methods
courierIntegrationConfigSchema.methods.getDecryptedApiKey = function() {
    return decryptField(this.apiKey);
};

courierIntegrationConfigSchema.methods.getDecryptedApiSecret = function() {
    return this.apiSecret ? decryptField(this.apiSecret) : null;
};

courierIntegrationConfigSchema.methods.getDecryptedWebhookSecret = function() {
    return this.webhookConfig?.secretKey ? decryptField(this.webhookConfig.secretKey) : null;
};

// Virtual for getting decrypted credentials
courierIntegrationConfigSchema.virtual('credentials').get(function() {
    return {
        apiKey: this.getDecryptedApiKey(),
        apiSecret: this.getDecryptedApiSecret(),
        webhookSecret: this.getDecryptedWebhookSecret()
    };
});

// Instance method to test connection
courierIntegrationConfigSchema.methods.testConnection = async function() {
    // This will be implemented in the service layer
    // Placeholder for now
    return {
        success: false,
        message: 'Test connection not implemented yet'
    };
};

// Static method for encryption (for use in controllers)
courierIntegrationConfigSchema.statics.encryptField = function(text) {
    return encryptField(text);
};

// Indexes
// platform already has unique: true which creates an index automatically
courierIntegrationConfigSchema.index({ enabled: 1 });
courierIntegrationConfigSchema.index({ testMode: 1 });

const CourierIntegrationConfigModel = mongoose.models.courier_integration_config || mongoose.model('courier_integration_config', courierIntegrationConfigSchema);

export default CourierIntegrationConfigModel;