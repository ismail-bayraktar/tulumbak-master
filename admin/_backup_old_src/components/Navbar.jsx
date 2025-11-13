import { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { useSidebar } from "../context/SidebarContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = ({ setToken }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isMobile, toggleSidebar } = useSidebar();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const notifications = [
    { id: 1, title: 'Yeni sipariş', message: '5 dakika önce', type: 'order' },
    { id: 2, title: 'Stok uyarısı', message: '30 dakika önce', type: 'warning' },
    { id: 3, title: 'Sistem güncellemesi', message: '1 saat önce', type: 'info' }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}

          {!isMobile && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Yönetim Paneli</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">v2.0</p>
            </div>
          )}
        </div>

        {/* Center - Search Bar (Desktop) */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Arama yapın..."
                className="w-full pl-10 pr-4 py-2 
                         border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-800 
                         text-gray-900 dark:text-white
                         rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200
                         placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            title={isDarkMode ? "Açık moda geç" : "Karanlık moda geç"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              title="Bildirimler"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 
                            bg-white dark:bg-gray-800 
                            rounded-lg shadow-modern-lg 
                            border border-gray-200 dark:border-gray-700 
                            z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Bildirimler</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          notification.type === 'order' ? 'bg-primary-500' :
                          notification.type === 'warning' ? 'bg-warning-500' :
                          'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                    Tüm bildirimleri gör
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {!isMobile && (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 
                            bg-white dark:bg-gray-800 
                            rounded-lg shadow-modern-lg 
                            border border-gray-200 dark:border-gray-700 
                            z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">Admin Kullanıcısı</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">admin@tulumbak.com</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm 
                                   text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 
                                   transition-colors">
                    <User className="w-4 h-4" />
                    Profil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm 
                                   text-gray-700 dark:text-gray-300 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 
                                   transition-colors">
                    <Settings className="w-4 h-4" />
                    Ayarlar
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm 
                             text-red-600 dark:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-900/20 
                             transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button (Mobile Only) */}
          {isMobile && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-danger-600 hover:bg-danger-700 text-white rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;