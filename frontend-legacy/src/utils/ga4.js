/**
 * Google Analytics 4 (GA4) Event Tracking Helper
 * 
 * Usage:
 * import { trackEvent } from '../utils/ga4';
 * trackEvent('click_whatsapp_support', { page: '/product/123', product_name: 'Baklava' });
 */

/**
 * Check if GA4 is available
 */
const isGA4Available = () => {
  return typeof window !== 'undefined' && window.gtag;
};

/**
 * Track GA4 event
 * @param {string} eventName - Event name (e.g., 'click_whatsapp_support')
 * @param {Object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!isGA4Available()) {
    // Silently fail if GA4 is not available (development or not configured)
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] Event tracked:', eventName, eventParams);
    }
    return;
  }

  try {
    window.gtag('event', eventName, eventParams);
  } catch (error) {
    console.error('[GA4] Error tracking event:', error);
  }
};

/**
 * Track WhatsApp support click
 * @param {Object} params - Event parameters
 * @param {string} params.page - Current page path
 * @param {string} [params.product_name] - Product name (if on product page)
 */
export const trackWhatsAppClick = ({ page, product_name }) => {
  trackEvent('click_whatsapp_support', {
    page,
    ...(product_name && { product_name })
  });
};

