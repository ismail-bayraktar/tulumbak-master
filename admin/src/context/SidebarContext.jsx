import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobile,
        toggleSidebar,
        closeSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};