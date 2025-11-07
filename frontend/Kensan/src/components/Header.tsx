import React from 'react';

/**
 * HEADER - Hallo username + datum + uitlog knop
 */

interface HeaderProps {
  username?: string;
  buttonColor?: 'green' | 'blue' | 'red';
}

function Header({ username = 'username', buttonColor = 'green' }: HeaderProps) {
  const borderColors = {
    green: '#00FF00',
    blue: '#00B0FF', 
    red: '#FF0000'
  };

  return (
    <div 
      className="w-full px-8 py-6 flex items-start justify-between"
      style={{ backgroundColor: '#171717' }}
    >
      {/* LINKS: Hallo tekst */}
      <div>
        <h1 
          className="text-3xl mb-1"
          style={{ 
            color: '#FFFFFF',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
          }}
        >
          Hallo, {'{username}'}
        </h1>
        <p 
          className="text-base"
          style={{ 
            color: '#525252',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
          }}
        >
          » {'{maand}'} {'{dag}'}
        </p>
      </div>

      {/* RECHTS: Uitlog knop */}
      <button 
        className="px-10 py-3 rounded-lg border-2"
        style={{ 
          backgroundColor: 'transparent',
          borderColor: borderColors[buttonColor],
          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
        }}
      >
        <span 
          className="material-symbols-outlined"
          style={{ color: '#FFFFFF', fontSize: '24px' }}
        >
          power_settings_new
        </span>
      </button>
    </div>
  );
}

export default Header;
