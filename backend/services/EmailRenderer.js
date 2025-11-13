import { renderEmailToHTML, generateEmailSubject } from '../emails/utils/renderEmail.js';
import { OrderConfirmation } from '../emails/templates/customer/OrderConfirmation.jsx';
import EmailSettings from '../models/EmailSettings.js';

/**
 * EmailRenderer Class
 * Handles React Email template rendering with design settings integration
 * Follows Single Responsibility Principle - only responsible for rendering
 */
class EmailRenderer {
  constructor() {
    this.templateMap = {
      orderConfirmation: OrderConfirmation,
      // Future templates will be added here
      // orderStatusUpdate: OrderStatusUpdate,
      // courierAssignment: CourierAssignment,
      // orderDelivered: OrderDelivered,
      // orderCancelled: OrderCancelled,
    };
  }

  /**
   * Get email design settings from database
   * @returns {Promise<Object>} Design settings object
   */
  async getDesignSettings() {
    try {
      const settings = await EmailSettings.findOne();

      // Default settings fallback
      const defaults = {
        brandColor: '#d4af37',
        logoUrl: 'https://tulumbak.com/logo.png',
        storeName: 'Tulumbak İzmir Baklava',
        storeEmail: 'info@tulumbak.com',
        storePhone: '0232 XXX XXXX',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        privacyPolicyUrl: 'https://tulumbak.com/privacy',
        emailPreferencesUrl: 'https://tulumbak.com/email-preferences',
        unsubscribeUrl: 'https://tulumbak.com/unsubscribe',
      };

      if (!settings || !settings.design) {
        return defaults;
      }

      // Merge database settings with defaults
      return {
        brandColor: settings.design.brandColor || defaults.brandColor,
        logoUrl: settings.design.logoUrl || defaults.logoUrl,
        storeName: settings.design.storeName || defaults.storeName,
        storeEmail: settings.design.storeEmail || defaults.storeEmail,
        storePhone: settings.design.storePhone || defaults.storePhone,
        fontFamily: settings.design.fontFamily || defaults.fontFamily,
        privacyPolicyUrl: settings.design.privacyPolicyUrl || defaults.privacyPolicyUrl,
        emailPreferencesUrl: settings.design.emailPreferencesUrl || defaults.emailPreferencesUrl,
        unsubscribeUrl: settings.design.unsubscribeUrl || defaults.unsubscribeUrl,
      };
    } catch (error) {
      console.error('Error fetching email design settings:', error);
      // Return defaults on error
      return {
        brandColor: '#d4af37',
        logoUrl: 'https://tulumbak.com/logo.png',
        storeName: 'Tulumbak İzmir Baklava',
        storeEmail: 'info@tulumbak.com',
        storePhone: '0232 XXX XXXX',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        privacyPolicyUrl: 'https://tulumbak.com/privacy',
        emailPreferencesUrl: 'https://tulumbak.com/email-preferences',
        unsubscribeUrl: 'https://tulumbak.com/unsubscribe',
      };
    }
  }

  /**
   * Render React Email template to HTML
   * @param {string} templateType - Template identifier (e.g., 'orderConfirmation')
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Rendered email with subject and HTML
   */
  async renderTemplate(templateType, data) {
    try {
      // Get template component
      const TemplateComponent = this.templateMap[templateType];

      if (!TemplateComponent) {
        throw new Error(`Template '${templateType}' not found. Available templates: ${Object.keys(this.templateMap).join(', ')}`);
      }

      // Get design settings from database
      const designSettings = await this.getDesignSettings();

      // Merge data with design settings
      const templateProps = {
        ...data,
        ...designSettings,
      };

      // Render template to HTML
      const html = await renderEmailToHTML(TemplateComponent, templateProps);

      // Generate subject
      const subject = generateEmailSubject(templateType, data);

      return {
        subject,
        html,
        templateType,
      };
    } catch (error) {
      console.error(`Error rendering email template '${templateType}':`, error);
      throw new Error(`Failed to render email template: ${error.message}`);
    }
  }

  /**
   * Validate template data
   * @param {string} templateType - Template identifier
   * @param {Object} data - Template data to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateTemplateData(templateType, data) {
    const errors = [];

    switch (templateType) {
      case 'orderConfirmation':
        if (!data.customerName) errors.push('customerName is required');
        if (!data.customerEmail) errors.push('customerEmail is required');
        if (!data.orderId) errors.push('orderId is required');
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
          errors.push('items array is required and must not be empty');
        }
        if (typeof data.total !== 'number') errors.push('total must be a number');
        if (!data.shippingAddress) errors.push('shippingAddress is required');
        if (!data.paymentMethod) errors.push('paymentMethod is required');
        break;

      // Future template validations
      default:
        errors.push(`Unknown template type: ${templateType}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get available templates
   * @returns {Array<string>} List of available template identifiers
   */
  getAvailableTemplates() {
    return Object.keys(this.templateMap);
  }
}

// Export singleton instance
export default new EmailRenderer();
