import React from 'react';
import './StatsCards.css';

const StatsCards = () => {
  const stats = [
    { number: 'Albertsons', label: 'Projects Name' },
    { number: '24', label: 'Tasks Assigned' },
    { number: '20', label: 'Tasks Completed' }
  ];

  return (
    <div className="stats-row">
      {stats.map((stat, index) => (
        <div key={index} className="col-md-4">
          <div className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;