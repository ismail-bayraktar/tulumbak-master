import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Clock,
  MapPin,
  Ticket,
  Building,
  Mail,
  MessageSquare,
  Truck,
  FileText,
  Store,
  ChevronDown,
  ChevronRight,
  Activity,
  Users,
  TrendingUp,
  Archive,
  Image,
  PackageSearch,
  Navigation
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { assets } from "../assets/assets.js";

const Sidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    orders: false,
    branch: false,
    courier: false,
    settings: false,
    reports: false
  });

  const { isCollapsed, isMobile, toggleSidebar, closeSidebar } = useSidebar();
  const { isDarkMode } = useTheme();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationItems = [
    // Main Navigation
    {
      section: 'main',
      items: [
        {
          to: '/dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard',
          description: 'Genel bakış ve istatistikler'
        },
        {
          to: '/add',
          icon: Package,
          label: 'Ürün Ekle',
          description: 'Yeni ürün ekle'
        },
        {
          to: '/list',
          icon: ShoppingCart,
          label: 'Ürün Listesi',
          description: 'Tüm ürünleri görüntüle'
        }
      ]
    },

    // Orders Section
    {
      section: 'orders',
      items: [
        {
          to: '/orders',
          icon: FileText,
          label: 'Siparişler',
          description: 'Tüm siparişleri yönet'
        },
        {
          to: '/corporate-orders',
          icon: Building,
          label: 'Kurumsal Siparişler',
          description: 'Kurumsal müşteri siparişleri'
        },
        {
          to: '/order-processing',
          icon: PackageSearch,
          label: 'Sipariş İşleme',
          description: 'Sipariş hazırlama ve kurye atama'
        }
      ]
    },

    // Branch Management Section
    {
      section: 'branch',
      items: [
        {
          to: '/branches',
          icon: Store,
          label: 'Şubeler',
          description: 'Şube yönetimi'
        },
        {
          to: '/delivery-zones',
          icon: MapPin,
          label: 'Teslimat Bölgeleri',
          description: 'Teslimat bölgeleri ayarları'
        },
        {
          to: '/time-slots',
          icon: Clock,
          label: 'Zaman Aralıkları',
          description: 'Teslimat zaman dilimleri'
        },
        {
          to: '/branch-assignment-settings',
          icon: Settings,
          label: 'Şube Atama Ayarları',
          description: 'Şube atama modu ve ayarları'
        }
      ]
    },

    // Esnaf Express Courier Section
    {
      section: 'courier',
      items: [
        {
          to: '/courier-test',
          icon: Truck,
          label: 'Kurye Entegrasyonu',
          description: 'Esnaf Express kurye yönetimi'
        }
      ]
    },

    // Settings Section
    {
      section: 'settings',
      items: [
        {
          to: '/media-library',
          icon: Image,
          label: 'Medya Kütüphanesi',
          description: 'Görsel ve medya dosyaları yönetimi'
        },
        {
          to: '/slider',
          icon: Activity,
          label: 'Slider Yönetimi',
          description: 'Ana sayfa slider ayarları'
        },
        {
          to: '/coupons',
          icon: Ticket,
          label: 'Kuponlar',
          description: 'İndirim kuponları yönetimi'
        },
        {
          to: '/settings',
          icon: Settings,
          label: 'Ayarlar',
          description: 'Genel sistem ayarları'
        },
        {
          to: '/email-logs',
          icon: Mail,
          label: 'Email Logları',
          description: 'Email gönderim logları'
        },
        {
          to: '/sms-logs',
          icon: MessageSquare,
          label: 'SMS Logları',
          description: 'SMS gönderim logları'
        }
      ]
    },

    // Reports Section
    {
      section: 'reports',
      items: [
        {
          to: '/reports',
          icon: BarChart3,
          label: 'Raporlar',
          description: 'Detaylı raporlar ve analizler'
        }
      ]
    }
  ];

  const SectionIcon = ({ iconName, className }) => {
    const icons = {
        main: Archive,
        orders: ShoppingCart,
        branch: Store,
        courier: Truck,
        settings: Settings,
        reports: BarChart3
    };

    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64 h-screen
        flex flex-col
        bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 
        shadow-sidebar
        transition-all duration-300 ease-in-out
      `}>
      {/* Sidebar Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Tulumbak Logo"
            className={`${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'} object-contain flex-shrink-0`}
          />
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tulumbak</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Desktop Toggle Button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex absolute top-6 -right-3 w-6 h-6 bg-primary-500 hover:bg-primary-600 text-white rounded-full items-center justify-center shadow-md transition-colors"
          >
            <ChevronRight className={`w-3 h-3 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className="p-4 space-y-6">
          {navigationItems.map((navSection) => (
            <div key={navSection.section} className="space-y-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(navSection.section)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold 
                  text-gray-500 dark:text-gray-400 
                  hover:text-gray-700 dark:hover:text-gray-200 
                  transition-colors duration-200
                  hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <SectionIcon
                    iconName={navSection.section}
                    className="w-4 h-4 flex-shrink-0"
                  />
                  {!isCollapsed && (
                    <span className="uppercase tracking-wider">
                      {navSection.section === 'main' && 'Ana Menü'}
                      {navSection.section === 'orders' && 'Siparişler'}
                      {navSection.section === 'branch' && 'Şube'}
                      {navSection.section === 'courier' && 'Esnaf Express'}
                      {navSection.section === 'settings' && 'Ayarlar'}
                      {navSection.section === 'reports' && 'Raporlar'}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="transition-transform duration-200">
                    {expandedSections[navSection.section] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Section Items */}
              {expandedSections[navSection.section] && (
                <div className="ml-2 space-y-1 animate-fade-in">
                  {navSection.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={closeSidebar}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200
                        ${isActive
                          ? 'sidebar-item-active text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30'
                          : 'sidebar-item hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.label}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {item.description}
                              </p>
                            </div>
                          )}
                          {isActive && !isCollapsed && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-success-500 rounded-full flex-shrink-0"></div>
            <span>Sistem Aktif</span>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Sidebar;
