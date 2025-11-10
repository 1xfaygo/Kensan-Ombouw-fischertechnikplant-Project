import React, { useState, useEffect, useRef } from 'react';
import { useLogout, useGetIdentity } from '@refinedev/core';

interface SidebarProps {
  activeItem?: string;
}

function Sidebar({ activeItem: initialActiveItem = 'dashboard' }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLogoutMenu, setShowLogoutMenu] = useState<boolean | 'closing'>(false);
  
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  
  const username = identity?.name || identity?.email?.split('@')[0] || 'Guest';
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (showLogoutMenu === true) {
          setShowLogoutMenu('closing');
        }
      }
    };

    if (showLogoutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutMenu]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  };

  return (
    <div className="kensan-sidebar">
      <div style={{ padding: '0 0.5rem 1rem' }}>
        <img 
          src="/logo.png" 
          alt="Kensan Logo" 
          className="kensan-sidebar-logo"
        />
      </div>

      <div className="kensan-divider" />

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

      <div className="kensan-sidebar-footer">
        <div style={{ padding: '0.35rem 0.6rem' }}>
          <button 
            className={`kensan-theme-toggle-btn ${!isDarkMode ? 'light' : ''}`}
            onClick={toggleTheme}
          >
            <span className="material-symbols-outlined kensan-theme-icon sunny">
              sunny
            </span>
            <span className="material-symbols-outlined kensan-theme-icon dark_mode">
              dark_mode
            </span>
          </button>
        </div>

        <div className="kensan-divider" style={{ margin: 0 }} />

        <div className="kensan-user-info" style={{ position: 'relative' }} ref={menuRef}>
          <div className="kensan-user-icon">
            <span className="material-symbols-outlined">
              person
            </span>
          </div>

          <span className="kensan-user-status" style={{ flex: 1 }}>
            {username}
          </span>

          <div 
            className="kensan-user-icon" 
            style={{ cursor: 'pointer' }}
            onClick={() => setShowLogoutMenu(showLogoutMenu ? 'closing' : true)}
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </div>

          {showLogoutMenu && (
            <div
              className={`kensan-logout-menu ${showLogoutMenu === 'closing' ? 'closing' : ''}`}
              onAnimationEnd={() => {
                if (showLogoutMenu === 'closing') {
                  setShowLogoutMenu(false);
                }
              }}
            >
              <button
                onClick={() => {
                  setShowLogoutMenu(false);
                  logout();
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-kensan-white)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  logout
                </span>
                Logout
              </button>
            </div>
          )}
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
