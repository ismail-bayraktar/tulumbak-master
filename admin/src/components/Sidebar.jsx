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
  Archive
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext.jsx";

const Sidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    orders: false,
    settings: false,
    reports: false
  });

  const { isCollapsed, isMobile, toggleSidebar, closeSidebar } = useSidebar();

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
          to: '/courier-management',
          icon: Truck,
          label: 'Kurye Yönetimi',
          description: 'Kurye takibi ve yönetimi'
        },
        {
          to: '/corporate-orders',
          icon: Building,
          label: 'Kurumsal Siparişler',
          description: 'Kurumsal müşteri siparişleri'
        }
      ]
    },

    // Settings Section
    {
      section: 'settings',
      items: [
        {
          to: '/slider',
          icon: Activity,
          label: 'Slider Yönetimi',
          description: 'Ana sayfa slider ayarları'
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
          to: '/coupons',
          icon: Ticket,
          label: 'Kuponlar',
          description: 'İndirim kuponları yönetimi'
        },
        {
          to: '/branches',
          icon: Store,
          label: 'Şubeler',
          description: 'Şube yönetimi'
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
        w-64 min-h-screen bg-white border-r border-gray-200 shadow-sidebar
        transition-all duration-300 ease-in-out
      `}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tulumbak</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
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
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-6">
          {navigationItems.map((navSection) => (
            <div key={navSection.section} className="space-y-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(navSection.section)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                      {navSection.section === 'settings' && 'Ayarlar'}
                      {navSection.section === 'reports' && 'Raporlar'}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  expandedSections[navSection.section] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )
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
                          ? 'sidebar-item-active text-primary-700 bg-primary-50'
                          : 'sidebar-item hover:bg-gray-100 text-gray-700'
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500">
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
