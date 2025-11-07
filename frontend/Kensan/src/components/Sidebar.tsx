import React, { useState } from 'react';

/**
 * KENSAN SIDEBAR - EXACTLY AS IN THE EXPRESSJS DESIGN
 * 
 * Vertical sidebar on the left with:
 * - Logo at the top
 * - Menu items stacked vertically with white bar on left and right when active
 * - Light mode toggle at the bottom
 * - User status at the very bottom
 */

interface SidebarProps {
  activeItem?: string;
}

function Sidebar({ activeItem: initialActiveItem = 'dashboard' }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle light-mode class on the root element
    if (!isDarkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
    console.log(`Theme switched to: ${!isDarkMode ? 'Light' : 'Dark'} mode`);
  };

  return (
    <div className="kensan-sidebar">
      {/* LOGO AT THE TOP */}
      <div style={{ padding: '0 0.5rem 1rem' }}>
        <img 
          src="/logo.png" 
          alt="Kensan Logo" 
          className="kensan-sidebar-logo"
        />
      </div>

      {/* DIVIDER */}
      <div className="kensan-divider" />

      {/* MENU ITEMS - VERTICAL */}
      <nav className="kensan-menu">
        <MenuItem 
          icon="dashboard"
          label="Dashboard"
          isActive={activeItem === 'dashboard'}
          onClick={() => setActiveItem('dashboard')}
        />
        <MenuItem 
          icon="shelves"
          label="Warehouse"
          isActive={activeItem === 'warehouse'}
          onClick={() => setActiveItem('warehouse')}
        />
        <MenuItem 
          icon="grid_view"
          label="Coming soon!"
          isActive={activeItem === 'coming1'}
          onClick={() => setActiveItem('coming1')}
        />
        <MenuItem 
          icon="grid_view"
          label="Coming soon!"
          isActive={activeItem === 'coming2'}
          onClick={() => setActiveItem('coming2')}
        />
        <MenuItem 
          icon="file_save"
          label="Documentatie"
          isActive={activeItem === 'documentatie'}
          onClick={() => setActiveItem('documentatie')}
        />
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="kensan-sidebar-footer">
        {/* THEME TOGGLE */}
        <div style={{ padding: '0.35rem 0.6rem' }}>
          <button 
            className={`kensan-theme-toggle-btn ${!isDarkMode ? 'light' : ''}`}
            onClick={toggleTheme}
          >
            {/* Sunny icon - visible in DARK mode (left) */}
            <span className="material-symbols-outlined kensan-theme-icon sunny">
              sunny
            </span>
            
            {/* Dark mode icon - visible in LIGHT mode (right) */}
            <span className="material-symbols-outlined kensan-theme-icon dark_mode">
              dark_mode
            </span>
          </button>
        </div>

        {/* DIVIDER */}
        <div className="kensan-divider" style={{ margin: 0 }} />

        {/* USER INFO */}
        <div className="kensan-user-info">
          {/* User Icon */}
          <div className="kensan-user-icon">
            <span className="material-symbols-outlined">
              person
            </span>
          </div>

          {/* "not logged in" text */}
          <span className="kensan-user-status">
            not logged in
          </span>

          {/* Settings icon */}
          <div className="kensan-user-icon">
            <span className="material-symbols-outlined">
              settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MENU ITEM - With white bar on left and right when active
 */
interface MenuItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function MenuItem({ icon, label, isActive = false, disabled = false, onClick }: MenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`kensan-menu-item ${isActive ? 'active' : ''}`}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        backgroundColor: (!disabled && !isActive && isHovered) ? 'rgba(255,255,255,0.02)' : undefined
      }}
    >
      <span className="material-symbols-outlined">
        {icon}
      </span>
      <span className="kensan-menu-item-label">
        {label}
      </span>
      
      {/* White bar on the right with fade animation */}
      {isActive && (
        <div className="kensan-menu-indicator" />
      )}
    </div>
  );
}

export default Sidebar;
