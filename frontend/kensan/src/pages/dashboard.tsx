import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Dashboard() {
  const [ovenTemp, setOvenTemp] = useState<number | null>(null);

  useEffect(() => {
    // Read oven temperature from the OPC UA API
    fetch('http://localhost:3001/api/read?name=ovenTemperature', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.value === 'number') {
          setOvenTemp(data.value);
        } else {
          console.warn('Unexpected oven temperature response:', data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch /api/test:', err);
      });
  }, []);

  return (
    <div className="kensan-container">
      <Sidebar activeItem="dashboard" />

      <div className="kensan-main-content">
        <Header buttonColor="green" />

        <main className="kensan-dashboard-main">
          <div className="kensan-dashboard-grid">
            <div className="kensan-card top1">
              {ovenTemp !== null ? (
                <p>Oven temperature: {ovenTemp} °C</p>
              ) : (
                <p>Loading oven temperature...</p>
              )}
            </div>
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
