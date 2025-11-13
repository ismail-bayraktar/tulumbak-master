import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Phone, MessageSquare, Headphones, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { trackWhatsAppClick } from '../utils/ga4.js';

/**
 * WhatsApp Support Floating Button Component
 * 
 * Features:
 * - SSR safe (client-side mount guard)
 * - Mobile/Desktop URL detection
 * - Position presets + offset
 * - Product page auto-message
 * - A11y support
 * - GA4 event tracking
 */
const WhatsAppSupport = ({ productName, productUrl }) => {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Client-side mount guard (SSR safe)
  useEffect(() => {
    setMounted(true);
    
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch WhatsApp settings
  useEffect(() => {
    if (!mounted) return;

    const fetchSettings = async () => {
      try {
        // Public endpoint - no auth required
        const response = await axios.get(`${backendUrl}/api/settings/whatsapp`);
        if (response.data.success) {
          setSettings(response.data.settings);
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp settings:', error);
      }
    };

    fetchSettings();
  }, [mounted]);

  // Don't render if not mounted or settings not loaded
  if (!mounted || !settings) {
    return null;
  }

  // Don't render if disabled
  if (!settings.enabled) {
    return null;
  }

  // Get device-specific settings
  const deviceSettings = isMobile ? settings.mobile : settings.desktop;

  // Check if we should show on product page
  const isProductPage = location.pathname.startsWith('/product/');
  if (isProductPage && !deviceSettings.showOnProduct) {
    return null;
  }

  // Get icon component
  const getIconComponent = () => {
    if (settings.iconType === 'customSvg' && settings.iconSvg) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: settings.iconSvg }}
          style={{ 
            width: '20px', 
            height: '20px', 
            display: 'inline-block',
            color: deviceSettings.iconColor 
          }}
          aria-hidden="true"
        />
      );
    }

    // React Icon (Lucide)
    const iconMap = {
      MessageCircle,
      Phone,
      MessageSquare,
      Headphones,
      HelpCircle
    };

    const IconComponent = iconMap[settings.iconName] || MessageCircle;
    return (
      <IconComponent 
        size={20} 
        style={{ color: deviceSettings.iconColor }}
        aria-hidden="true"
      />
    );
  };

  // Build WhatsApp URL
  const buildWhatsAppUrl = () => {
    // E.164 formatından sadece rakamları al (başındaki + işaretini kaldır)
    // Örnek: +905551234567 -> 905551234567
    const phone = settings.phoneE164.replace(/[^\d]/g, '');
    
    let message = 'Merhaba, Tulumbak İzmir Baklava sitesinden yazıyorum.';

    // Auto-fill product info on product pages
    if (isProductPage && productName && productUrl) {
      const fullProductUrl = `${window.location.origin}${productUrl}`;
      message = `Merhaba, ${productName} (${fullProductUrl}) hakkında bilgi almak istiyorum.`;
    }

    // Mesajı URL encode et
    const encodedMessage = encodeURIComponent(message);

    // wa.me hem mobil hem masaüstünde çalışır (iOS, Android, Windows, Mac)
    // Format: https://wa.me/905xxxxxxxxx?text=encoded_message
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  // Handle click
  const handleClick = (e) => {
    e.preventDefault();
    
    // Track GA4 event
    trackWhatsAppClick({
      page: location.pathname,
      ...(productName && { product_name: productName })
    });

    // Open WhatsApp
    window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  // Get position styles
  const getPositionStyles = () => {
    const styles = {
      position: 'fixed',
      zIndex: 50,
      ...(deviceSettings.position.includes('bottom') && {
        bottom: `${deviceSettings.offsetY}px`
      }),
      ...(deviceSettings.position.includes('top') && {
        top: `${deviceSettings.offsetY}px`
      }),
      ...(deviceSettings.position.includes('right') && {
        right: `${deviceSettings.offsetX}px`
      }),
      ...(deviceSettings.position.includes('left') && {
        left: `${deviceSettings.offsetX}px`
      }),
      ...(deviceSettings.position.includes('center') && {
        top: '50%',
        transform: 'translateY(-50%)'
      })
    };
    return styles;
  };

  return (
    <a
      href={buildWhatsAppUrl()}
      onClick={handleClick}
      aria-label={`${deviceSettings.buttonText} - WhatsApp desteği`}
      className="whatsapp-support-button"
      style={{
        ...getPositionStyles(),
        backgroundColor: deviceSettings.bgColor,
        color: deviceSettings.textColor,
        padding: isMobile ? '10px 16px' : '12px 20px',
        borderRadius: '12px',
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        lineHeight: '1.2'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${deviceSettings.bgColor}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
    >
      {getIconComponent()}
      <span>{deviceSettings.buttonText}</span>
    </a>
  );
};

export default WhatsAppSupport;

