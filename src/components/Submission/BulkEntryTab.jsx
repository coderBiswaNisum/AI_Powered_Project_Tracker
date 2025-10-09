import React from 'react';

const BulkEntryTab = ({ bulkFile, onBulkUpload }) => {
  return (
    <div className="tab-panel active">
      <div className="form-group">
        <label className="form-label">Bulk Data Upload</label>
        <div className="bulk-section">
          <div className="upload-area">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={onBulkUpload}
              className="file-input"
            />
            <div className="upload-placeholder">
              <i className="upload-icon">📊</i>
              <h4>Upload CSV or Excel File</h4>
              <p>Drag & drop your file here or click to browse</p>
              <small>Supports: .CSV, .XLSX, .XLS</small>
            </div>
          </div>
          {bulkFile && (
            <div className="file-preview success">
              <i className="file-icon">✅</i>
              <div>
                <strong>{bulkFile.name}</strong>
                <small>Ready for processing</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkEntryTab;