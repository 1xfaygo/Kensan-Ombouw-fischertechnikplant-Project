import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Dashboard() {
  return (
    <div className="kensan-container">
      <Sidebar activeItem="dashboard" />

      <div className="kensan-main-content">
        <Header buttonColor="green" />

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
