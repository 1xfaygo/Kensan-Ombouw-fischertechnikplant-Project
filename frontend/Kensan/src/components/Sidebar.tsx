import React, { useState } from 'react';

/**
 * 📱 KENSAN SIDEBAR - EXACT ZOALS IN HET EXPRESSJS DESIGN
 * 
 * Verticale sidebar aan de linkerkant met:
 * - Logo bovenaan
 * - Menu items verticaal onder elkaar met witte balk links en rechts als actief
 * - Light mode toggle onderaan
 * - User status helemaal onderaan
 */

interface SidebarProps {
  activeItem?: string;
}

function Sidebar({ activeItem: initialActiveItem = 'dashboard' }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  return (
    <div className="kensan-sidebar">
      {/* LOGO BOVENAAN */}
      <div style={{ padding: '0 0.5rem 1rem' }}>
        <img 
          src="/logo.png" 
          alt="Kensan Logo" 
          className="kensan-sidebar-logo"
        />
      </div>

      {/* DIVIDER */}
      <div className="kensan-divider" />

      {/* MENU ITEMS - VERTICAAL */}
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
        {/* LIGHT MODE TOGGLE */}
        <div style={{ padding: '0.35rem 0.6rem' }}>
          <button className="kensan-theme-toggle-btn">
            <span 
              className="material-symbols-outlined"
              style={{ 
                color: '#FFD325', 
                fontSize: '17px',
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              sunny
            </span>
          </button>
        </div>

        {/* DIVIDER */}
        <div className="kensan-divider" style={{ margin: 0 }} />

        {/* USER INFO */}
        <div className="kensan-user-info">
          {/* User Icon */}
          <div 
            style={{ 
              width: '26px',
              height: '26px',
              borderRadius: '999px',
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255,255,255,.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span 
              className="material-symbols-outlined"
              style={{ 
                fontSize: '16px', 
                color: '#fff', 
                opacity: 0.75 
              }}
            >
              person
            </span>
          </div>

          {/* "not logged in" text */}
          <span 
            style={{ 
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255,255,255,.05)',
              color: '#525252',
              padding: '5px 14px',
              borderRadius: '9px',
              fontSize: '11px'
            }}
          >
            not logged in
          </span>

          {/* Settings icon */}
          <div 
            style={{ 
              width: '26px',
              height: '26px',
              borderRadius: '999px',
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255,255,255,.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span 
              className="material-symbols-outlined"
              style={{ 
                fontSize: '16px', 
                color: '#fff', 
                opacity: 0.75 
              }}
            >
              settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MENU ITEM - Met witte balk links en rechts als actief
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
      <span 
        className="material-symbols-outlined"
        style={{ 
          fontSize: '19px',
          color: isActive ? '#fff' : '#525252',
          transition: 'color 0.15s ease'
        }}
      >
        {icon}
      </span>
      <span 
        style={{ 
          filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))',
          transition: 'color 0.15s ease'
        }}
      >
        {label}
      </span>
      
      {/* Witte balk rechts met fade animatie */}
      {isActive && (
        <div className="kensan-menu-indicator" />
      )}
    </div>
  );
}

export default Sidebar;
