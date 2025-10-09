import React from 'react';

const SubmissionTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'text', icon: '📝', label: 'Text Entry' },
    { id: 'audio', icon: '🎤', label: 'Audio Update' },
    { id: 'bulk', icon: '📊', label: 'Bulk Upload' }
  ];

  return (
    <div className="submission-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          <i className="tab-icon">{tab.icon}</i>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SubmissionTabs;