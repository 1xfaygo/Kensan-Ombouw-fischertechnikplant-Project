import React from 'react';
import { useGetIdentity } from '@refinedev/core';

interface HeaderProps {
  buttonColor?: 'green' | 'blue' | 'red';
}

function Header({ buttonColor = 'green' }: HeaderProps) {
  const { data: identity } = useGetIdentity();
  
  const username = identity?.name || identity?.email?.split('@')[0] || 'User';
  
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[now.getMonth()];
  const day = now.getDate();

  const powerBtnClass = buttonColor === 'green' ? 'power-on' : 
                        buttonColor === 'blue' ? 'power-busy' : 
                        'power-off';

  return (
    <div className="kensan-header">
      <div>
        <h1 className="kensan-header-title">
          Hello, {username}
        </h1>
        <p className="kensan-header-subtitle">
          » {day} {month}
        </p>
      </div>

      <button className={`kensan-power-btn ${powerBtnClass}`}>
        <span className="material-symbols-outlined">
          power_settings_new
        </span>
      </button>
    </div>
  );
}

export default Header;
