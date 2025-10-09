import React from 'react';

const TextEntryTab = ({ textUpdate, onTextChange, isProcessing }) => {
  return (
    <div className="tab-panel active">
      <div className="form-group">
        <label className="form-label">Daily Work Description</label>
        <textarea
          className="form-control professional-textarea"
          value={textUpdate}
          onChange={onTextChange}
          placeholder="Describe your accomplishments, challenges, and next steps in your own words..."
          rows="6"
          disabled={isProcessing}
        />
        <div className="form-helper">
          <i className="helper-icon">💡</i>
          Write naturally - AI will convert it to professional format
        </div>
      </div>
    </div>
  );
};

export default TextEntryTab;