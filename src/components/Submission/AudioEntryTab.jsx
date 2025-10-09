import React from 'react';

const AudioEntryTab = ({ 
  isRecording, 
  audioFile, 
  onStartRecording, 
  onStopRecording, 
  onAudioUpload,
  fileInputRef 
}) => {
  return (
    <div className="tab-panel active">
      <div className="form-group">
        <label className="form-label">Audio Recording</label>
        <div className="audio-section">
          <div className="audio-controls">
            {!isRecording ? (
              <button type="button" className="record-button" onClick={onStartRecording}>
                <i className="record-icon">●</i>
                Start Recording
              </button>
            ) : (
              <button type="button" className="stop-button" onClick={onStopRecording}>
                <i className="stop-icon">■</i>
                Stop Recording
              </button>
            )}
            <div className="audio-upload">
              <input
                type="file"
                accept="audio/*"
                onChange={onAudioUpload}
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
  );
};

export default AudioEntryTab;