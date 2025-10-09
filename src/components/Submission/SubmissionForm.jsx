import React from 'react';
import SubmissionTabs from './SubmissionTabs';
import TextEntryTab from './TextEntryTab';
import AudioEntryTab from './AudioEntryTab';
import BulkEntryTab from './BulkEntryTab';

const SubmissionForm = ({
  activeTab,
  onTabChange,
  textUpdate,
  onTextChange,
  isRecording,
  audioFile,
  onStartRecording,
  onStopRecording,
  onAudioUpload,
  bulkFile,
  onBulkUpload,
  isSubmitting,
  isProcessing,
  onSubmit,
  onReset,
  fileInputRef
}) => {
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'text':
        return (
          <TextEntryTab 
            textUpdate={textUpdate}
            onTextChange={onTextChange}
            isProcessing={isProcessing}
          />
        );
      case 'audio':
        return (
          <AudioEntryTab
            isRecording={isRecording}
            audioFile={audioFile}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onAudioUpload={onAudioUpload}
            fileInputRef={fileInputRef}
          />
        );
      case 'bulk':
        return (
          <BulkEntryTab
            bulkFile={bulkFile}
            onBulkUpload={onBulkUpload}
          />
        );
      default:
        return null;
    }
  };

  const isFormValid = () => {
    switch (activeTab) {
      case 'text': return textUpdate.trim();
      case 'audio': return audioFile;
      case 'bulk': return bulkFile;
      default: return false;
    }
  };

  return (
    <div className="main-card">
      <div className="card-header">
        <h2>Daily Work Submission</h2>
        <p>Choose your preferred method to submit daily updates</p>
      </div>

      <SubmissionTabs activeTab={activeTab} onTabChange={onTabChange} />

      <form onSubmit={onSubmit} className="form-content">
        {renderActiveTab()}

        <div className="submit-section">
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onReset}
              disabled={isSubmitting || isProcessing}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || isProcessing || !isFormValid()}
            >
              {isSubmitting || isProcessing ? (
                <>
                  <span className="spinner"></span>
                  {isProcessing ? 'AI Processing...' : 'Submitting...'}
                </>
              ) : (
                'Submit for AI Processing'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;