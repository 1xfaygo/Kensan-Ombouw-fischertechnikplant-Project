import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { usePlantData } from '../hooks/usePlantData';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import '../kensan.css';

interface HistoricalData {
  timestamp: number;
  warehouseStock: number;
}

function Dashboard() {
  const { data, isOnline, error, timeUntilRefresh } = usePlantData();
  const lastUpdateTime = useRef<number>(0);
  
  // Load stock history from localStorage on mount
  const [stockHistory, setStockHistory] = useState<HistoricalData[]>(() => {
    try {
      const saved = localStorage.getItem('stockHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out old data (older than 2 minutes)
        const twoMinutesAgo = Date.now() - 120000;
        return parsed.filter((item: HistoricalData) => item.timestamp > twoMinutesAgo);
      }
    } catch (error) {
      console.error('Failed to load stock history:', error);
    }
    return [];
  });

  // Save stock history to localStorage whenever it changes
  useEffect(() => {
    if (stockHistory.length > 0) {
      localStorage.setItem('stockHistory', JSON.stringify(stockHistory));
    }
  }, [stockHistory]);

  // Track stock history for the chart - updates only when timeUntilRefresh resets (every 5 seconds)
  useEffect(() => {
    const now = Date.now();
    // Only add a new data point if at least 4 seconds have passed since last update
    // This prevents multiple additions when data object changes
    if (now - lastUpdateTime.current >= 4000) {
      const newDataPoint = {
        timestamp: now,
        warehouseStock: data.warehouseStock,
      };

      setStockHistory((prev) => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points (100 seconds of history)
        return updated.slice(-20);
      });

      lastUpdateTime.current = now;
    }
  }, [data.warehouseStock, timeUntilRefresh]); // Track stock changes and refresh timer

  // Status indicator component
  const StatusIndicator = ({ running, label }: { running: boolean; label: string }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: '6px',
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: running ? '#32F21D' : '#F21D1D',
        boxShadow: running 
          ? '0 0 8px rgba(50, 242, 29, 0.6)' 
          : '0 0 8px rgba(242, 29, 29, 0.6)',
      }} />
      <span style={{ fontSize: '0.85rem', color: 'var(--color-kensan-light_gray)' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="kensan-container">
      <Sidebar activeItem="dashboard" />

      <div className="kensan-main-content">
        <Header buttonColor={data.ovenRunning && data.craneRunning ? "green" : "red"} />

        <main className="kensan-dashboard-main">
          {/* Connection Status Banner */}
          <div style={{
            padding: '0.75rem 1.5rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: isOnline 
              ? 'rgba(50, 242, 29, 0.1)' 
              : 'rgba(242, 156, 29, 0.1)',
            border: `1px solid ${isOnline ? '#32F21D' : '#F29C1D'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ 
                color: isOnline ? '#32F21D' : '#F29C1D',
                fontSize: '20px'
              }}>
                {isOnline ? 'wifi' : 'wifi_off'}
              </span>
              <span style={{ color: 'var(--color-kensan-white)', fontSize: '0.9rem' }}>
                {isOnline ? 'Connected to API' : 'Using Test Data - API Offline'}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              padding: '4px 12px',
              borderRadius: '6px'
            }}>
              <span className="material-symbols-outlined" style={{ 
                color: 'var(--color-cyberdefense-orange)',
                fontSize: '18px'
              }}>
                refresh
              </span>
              <span style={{ 
                color: 'var(--color-kensan-white)', 
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                {timeUntilRefresh}s
              </span>
            </div>
          </div>

          <div className="kensan-dashboard-grid">
            {/* Top Cards - Status Overview */}
            <div className="kensan-card top1" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ 
                  margin: 0, 
                  color: 'var(--color-cyberdefense-orange)',
                  fontSize: '1rem',
                  fontWeight: 600 
                }}>
                  Oven Status
                </h3>
                <StatusIndicator running={data.ovenRunning} label={data.ovenStatus} />
                <div style={{ 
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.8rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    Temperature: {data.ovenRunning ? 'Active' : 'Standby'}
                  </p>
                </div>
              </div>
            </div>

            <div className="kensan-card top2" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ 
                  margin: 0, 
                  color: 'var(--color-cyberdefense-orange)',
                  fontSize: '1rem',
                  fontWeight: 600 
                }}>
                  Crane Status
                </h3>
                <StatusIndicator running={data.craneRunning} label={data.cranePosition} />
                <div style={{ 
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.8rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    Moving: {data.craneMove ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            <div className="kensan-card top3" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ 
                  margin: 0, 
                  color: 'var(--color-cyberdefense-orange)',
                  fontSize: '1rem',
                  fontWeight: 600 
                }}>
                  Conveyor Belt
                </h3>
                <StatusIndicator running={data.conveyerRunning} label="Conveyor" />
                <div style={{ 
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.8rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    Status: {data.conveyerRunning ? 'Running' : 'Stopped'}
                  </p>
                </div>
              </div>
            </div>

            {/* Wide Card - Stock History Chart */}
            <div className="kensan-card wide" style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                color: 'var(--color-cyberdefense-orange)',
                fontSize: '1.1rem',
                fontWeight: 600 
              }}>
                Warehouse Stock History
              </h3>
              {stockHistory.length > 1 ? (
                <LineChart
                  dataset={stockHistory.map(point => ({
                    timestamp: new Date(point.timestamp),
                    warehouseStock: point.warehouseStock
                  }))}
                  xAxis={[
                    {
                      dataKey: 'timestamp',
                      scaleType: 'time',
                      valueFormatter: (value) => new Date(value).toLocaleTimeString(),
                    },
                  ]}
                  yAxis={[
                    {
                      label: 'Stock Level',
                      labelStyle: {
                        fill: 'var(--color-kensan-white)',
                      },
                    },
                  ]}
                  series={[
                    {
                      dataKey: 'warehouseStock',
                      label: 'Stock',
                      showMark: true,
                      color: '#29AAE2',
                    },
                  ]}
                  height={220}
                  grid={{ vertical: true, horizontal: true }}
                  sx={{
                    '& .MuiChartsAxis-line': { stroke: 'var(--color-kensan-light_gray)' },
                    '& .MuiChartsAxis-tick': { stroke: 'var(--color-kensan-light_gray)' },
                    '& .MuiChartsAxis-tickLabel': { fill: 'var(--color-kensan-white) !important' },
                    '& .MuiChartsAxis-label': { fill: 'var(--color-kensan-white) !important' },
                    '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.05)' },
                    '& .MuiChartsLegend-label': { fill: 'var(--color-kensan-white) !important' },
                    '& .MuiChartsLegend-series text': { fill: 'var(--color-kensan-white) !important' },
                  }}
                />
              ) : (
                <div style={{ 
                  height: '220px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-kensan-light_gray)'
                }}>
                  Collecting data...
                </div>
              )}
            </div>

            {/* Tall Card - Warehouse Details */}
            <div className="kensan-card tall" style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 1.5rem 0', 
                color: 'var(--color-cyberdefense-orange)',
                fontSize: '1.1rem',
                fontWeight: 600 
              }}>
                Warehouse Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <StatusIndicator running={data.warehouseRunning} label="Warehouse System" />
                
                <div style={{ 
                  padding: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '0.85rem', 
                      color: 'var(--color-kensan-light_gray)' 
                    }}>
                      Current Position
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '1.5rem', 
                      color: 'var(--color-kensan-white)',
                      fontWeight: 600
                    }}>
                      X: {data.warehouseLocationX} / Y: {data.warehouseLocationY}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '0.85rem', 
                      color: 'var(--color-kensan-light_gray)' 
                    }}>
                      Stock Level
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '2rem', 
                        color: 'var(--color-kensan-light_blue)',
                        fontWeight: 700
                      }}>
                        {data.warehouseStock}
                      </p>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-kensan-light_gray)' }}>
                        items
                      </span>
                    </div>
                  </div>


                </div>

                {/* Mini pie chart for operations */}
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '0.85rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    System Status Overview
                  </p>
                  <PieChart
                    series={[
                      {
                        data: [
                          { 
                            id: 0, 
                            value: data.ovenRunning ? 1 : 0, 
                            label: 'Oven',
                            color: '#F89820'
                          },
                          { 
                            id: 1, 
                            value: data.craneRunning ? 1 : 0, 
                            label: 'Crane',
                            color: '#29AAE2'
                          },
                          { 
                            id: 2, 
                            value: data.conveyerRunning ? 1 : 0, 
                            label: 'Conveyor',
                            color: '#1BB14B'
                          },
                          { 
                            id: 3, 
                            value: data.warehouseRunning ? 1 : 0, 
                            label: 'Warehouse',
                            color: '#7C3AED'
                          },
                        ],
                      },
                    ]}
                    height={160}
                    sx={{
                      '& .MuiChartsLegend-label': { fill: 'var(--color-kensan-white) !important', fontSize: '0.75rem' },
                      '& .MuiChartsLegend-series text': { fill: 'var(--color-kensan-white) !important' },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="kensan-card bot1" style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                color: 'var(--color-cyberdefense-orange)',
                fontSize: '1rem',
                fontWeight: 600 
              }}>
                System Metrics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                }}>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    Active Systems
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.8rem', 
                    color: 'var(--color-kensan-white)',
                    fontWeight: 700
                  }}>
                    {[data.ovenRunning, data.craneRunning, data.conveyerRunning, data.warehouseRunning]
                      .filter(Boolean).length} / 4
                  </p>
                </div>
              </div>
            </div>

            <div className="kensan-card bot2" style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                color: 'var(--color-cyberdefense-orange)',
                fontSize: '1rem',
                fontWeight: 600 
              }}>
                Data Source
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '12px',
                  backgroundColor: isOnline 
                    ? 'rgba(50, 242, 29, 0.1)' 
                    : 'rgba(242, 156, 29, 0.1)',
                  borderRadius: '6px',
                  border: `1px solid ${isOnline ? '#32F21D' : '#F29C1D'}`,
                }}>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    Connection Status
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1rem', 
                    color: 'var(--color-kensan-white)',
                    fontWeight: 600
                  }}>
                    {isOnline ? 'Live API' : 'Test Data'}
                  </p>
                </div>
                <div style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                }}>
                  <p style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-kensan-light_gray)' 
                  }}>
                    Data Origin
                  </p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.85rem', 
                    color: 'var(--color-kensan-white)' 
                  }}>
                    {isOnline ? 'OPC UA Client' : 'Local Test Server'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
