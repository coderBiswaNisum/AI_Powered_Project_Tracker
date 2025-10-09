import React from 'react';
import './InfoPanel.css';

const InfoPanel = () => {
  const features = [
    { icon: '🔤', title: 'Text Normalization', description: 'Converts informal updates to professional reports' },
    { icon: '🌐', title: 'Multi-language Support', description: 'Processes audio in any language' },
    { icon: '📈', title: 'Data Extraction', description: 'Extracts key metrics from bulk uploads' }
  ];

  return (
    <div className="info-panel">
      <div className="info-header">
        <i className="info-icon">🤖</i>
        <h3>AI Processing Features</h3>
      </div>
      <div className="info-features">
        {features.map((feature, index) => (
          <div key={index} className="feature">
            <i className="feature-icon">{feature.icon}</i>
            <div>
              <strong>{feature.title}</strong>
              <span>{feature.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoPanel;