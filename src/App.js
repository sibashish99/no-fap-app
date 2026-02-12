import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Load data from LocalStorage or set defaults
  const [lastDate, setLastDate] = useState(localStorage.getItem('lastDate') || null);
  const [longestStreak, setLongestStreak] = useState(Number(localStorage.getItem('longestStreak')) || 0);
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')) || []);
  const [now, setNow] = useState(new Date());

  // Update the 'now' timer every second for the live counter
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds into d, h, m, s
  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const handleAction = () => {
    const currentTimeStr = new Date().toISOString();
    
    // Calculate if this was a new record
    if (lastDate) {
      const diff = Math.floor((new Date() - new Date(lastDate)) / 1000);
      if (diff > longestStreak) {
        setLongestStreak(diff);
        localStorage.setItem('longestStreak', diff);
      }
    }

    // Save to History
    const newHistory = [currentTimeStr, ...history].slice(0, 10); // Store last 10 resets
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));

    // Set Last Date
    setLastDate(currentTimeStr);
    localStorage.setItem('lastDate', currentTimeStr);
  };

  // Calculate current running difference
  const currentDiffSeconds = lastDate 
    ? Math.floor((now - new Date(lastDate)) / 1000) 
    : 0;

  return (
    <div className="app-wrapper">
      <div className="tracker-card">
        <h1 className="tracker-title">NO FAP TRACKER</h1>

        <div className="counter-box">
          <p className="counter-label">Current Running Streak</p>
          <div className="time-display">{formatTime(currentDiffSeconds)}</div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <p className="counter-label">Longest Win</p>
            <div className="stat-val" style={{color: '#fbbf24'}}>{formatTime(longestStreak)}</div>
          </div>
          <div className="stat-card">
            <p className="counter-label">Last Time Fapped</p>
            <div className="stat-val">
              {lastDate ? new Date(lastDate).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        <button className="fap-button" onClick={handleAction}>
          I DID AGAIN :)
        </button>

        <div className="history-container">
          <p className="history-title">Recent History</p>
          <div className="history-scroll">
            {history.length > 0 ? history.map((item, index) => (
              <div key={index} className="history-item">
                <span>{new Date(item).toLocaleString()}</span>
                <span style={{color: '#64748b'}}>#{history.length - index}</span>
              </div>
            )) : <p style={{fontSize: '0.8rem', color: '#64748b'}}>No history yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;