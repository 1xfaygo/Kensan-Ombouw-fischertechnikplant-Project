import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

/**
 * KENSAN DASHBOARD - With grid layout as in the ExpressJS design
 */

function Dashboard() {
  const [username, setUsername] = useState('username');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    // Set the date
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const d = new Date();
    const day = d.getDate();
    const month = months[d.getMonth()];
    setDateString(`${day} ${month}`);
  }, []);

  return (
    <div className="kensan-container">
      {/* SIDEBAR LEFT */}
      <Sidebar activeItem="dashboard" />

      {/* MAIN CONTENT RIGHT */}
      <div className="kensan-main-content">
        {/* HEADER */}
        <div className="kensan-header">
          <div>
            <h1 className="kensan-header-title">
              Hallo, {username}
            </h1>
            <p className="kensan-header-subtitle">
              » {dateString}
            </p>
          </div>

          <button className="kensan-power-btn power-on">
            <span className="material-symbols-outlined">
              power_settings_new
            </span>
          </button>
        </div>

        {/* DASHBOARD GRID */}
        <main className="kensan-dashboard-main">
          <div className="kensan-dashboard-grid">
            <div className="kensan-card top1"></div>
            <div className="kensan-card top2"></div>
            <div className="kensan-card top3"></div>
            <div className="kensan-card wide"></div>
            <div className="kensan-card tall"></div>
            <div className="kensan-card bot1"></div>
            <div className="kensan-card bot2"></div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
