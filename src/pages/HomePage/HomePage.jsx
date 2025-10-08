import React, { useState, useRef } from 'react';
import './HomePage.css';
  import logo from '../../assets/Images/logo.PNG'


const HomePage = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [textUpdate, setTextUpdate] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setTextUpdate(e.target.value);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['.csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (allowedTypes.some(type => file.name.toLowerCase().includes(type) || file.type.includes(type))) {
        setBulkFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textUpdate && !audioFile && !bulkFile) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Work submitted successfully! AI processing complete.');
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setTextUpdate('');
    setAudioFile(null);
    setBulkFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Add actual recording implementation here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Add actual recording stop implementation here
  };

  return (
    <>
    
    
    <div className="professional-container">
      {/* Header */}
      <div className="">
        <div className="container">
        <div className="row align-items-center">
            <div className="col">
                <img src={logo} alt="" width={50}/>
              <h1 className="header-title">AI-Powered Project Tracker</h1>
              <p className="header-subtitle">Professional Work Submission Portal</p>
            </div>
            <div className="col-auto">
              <div className="user-info">
                <div className="user-avatar">BRP</div>
                <span className="user-name">Biswaranjan Pradhan<br /></span>
              </div>
            </div>
          </div>  
        </div>
      </div>

      {/* Main Content */}
      <div className="container main-content">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            {/* Stats Cards */}
            <div className="row stats-row mb-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-number">24</div>
                  <div className="stat-label">Projects Active</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-number">156</div>
                  <div className="stat-label">Submissions This Week</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">AI Accuracy</div>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="main-card">
              <div className="card-header">
                <h2>Daily Work Submission</h2>
                <p>Choose your preferred method to submit daily updates</p>
              </div>

              {/* Navigation Tabs */}
              <div className="submission-tabs">
                <button 
                  className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  <i className="icon-text">📝</i>
                  Text Entry
                </button>
                <button 
                  className={`tab-button ${activeTab === 'audio' ? 'active' : ''}`}
                  onClick={() => setActiveTab('audio')}
                >
                  <i className="icon-audio">🎤</i>
                  Audio Update
                </button>
                <button 
                  className={`tab-button ${activeTab === 'bulk' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bulk')}
                >
                  <i className="icon-bulk">📊</i>
                  Bulk Upload
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="form-content">
                {/* Text Tab */}
                {activeTab === 'text' && (
                  <div className="tab-panel active">
                    <div className="form-group">
                      <label className="form-label">Daily Work Description</label>
                      <textarea
                        className="form-control professional-textarea"
                        value={textUpdate}
                        onChange={handleTextChange}
                        placeholder="Describe your accomplishments, challenges, and next steps..."
                        rows="6"
                      />
                      <div className="form-helper">
                        <i className="helper-icon">💡</i>
                        Be specific about tasks completed and time spent
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Tab */}
                {activeTab === 'audio' && (
                  <div className="tab-panel active">
                    <div className="form-group">
                      <label className="form-label">Audio Recording</label>
                      <div className="audio-section">
                        <div className="audio-controls">
                          {!isRecording ? (
                            <button type="button" className="record-button" onClick={startRecording}>
                              <i className="record-icon">●</i>
                              Start Recording
                            </button>
                          ) : (
                            <button type="button" className="stop-button" onClick={stopRecording}>
                              <i className="stop-icon">■</i>
                              Stop Recording
                            </button>
                          )}
                          <div className="audio-upload">
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={handleAudioUpload}
                              className="file-input"
                              ref={fileInputRef}
                            />
                            <button type="button" className="upload-button" onClick={() => fileInputRef.current?.click()}>
                              <i className="upload-icon">📁</i>
                              Upload Audio File
                            </button>
                          </div>
                        </div>
                        {audioFile && (
                          <div className="file-preview">
                            <i className="file-icon">🎵</i>
                            {audioFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bulk Tab */}
                {activeTab === 'bulk' && (
                  <div className="tab-panel active">
                    <div className="form-group">
                      <label className="form-label">Bulk Data Upload</label>
                      <div className="bulk-section">
                        <div className="upload-area">
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleBulkUpload}
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
                )}

                {/* Submit Section */}
                <div className="submit-section">
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting || (!textUpdate && !audioFile && !bulkFile)}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Processing with AI...
                        </>
                      ) : (
                        <>
                          Submit for AI Processing
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Info Panel */}
            <div className="info-panel">
              <div className="info-header">
                <i className="info-icon">🤖</i>
                <h3>AI Processing Features</h3>
              </div>
              <div className="info-features">
                <div className="feature">
                  <i className="feature-icon">🔤</i>
                  <div>
                    <strong>Text Normalization</strong>
                    <span>Converts informal updates to professional reports</span>
                  </div>
                </div>
                <div className="feature">
                  <i className="feature-icon">🌐</i>
                  <div>
                    <strong>Multi-language Support</strong>
                    <span>Processes audio in any language</span>
                  </div>
                </div>
                <div className="feature">
                  <i className="feature-icon">📈</i>
                  <div>
                    <strong>Data Extraction</strong>
                    <span>Extracts key metrics from bulk uploads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;