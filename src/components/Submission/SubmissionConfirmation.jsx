import React from 'react';
import "./SubmissionConfirmation.css"

const SubmissionConfirmation = ({
  showConfirmation,
  originalText,
  processedText,
  isSubmitting,
  onEdit,
  onReprocess,
  onConfirm,
  onClose
}) => {
  if (!showConfirmation) return null;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <div className="modal-header">
          <h2>Confirm Your Submission</h2>
          <p>AI has processed your text to professional one. Please Review and confirm.</p>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="text-comparison">
            <div className="original-text">
              <h4>Original Text:</h4>
              <div className="text-box">
                {originalText}
              </div>
            </div>
            
            <div className="processed-text">
              <h4>AI Processed Version:</h4>
              <div className="text-box professional">
                {processedText}
              </div>
            </div>
          </div>
<div style={{marginTop: '40px'}}></div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-edit"
              onClick={onEdit}
              disabled={isSubmitting}
            >
              <i className="edit-icon">✏️</i>
              Edit Text
            </button>
            
            <button
              type="button"
              className="btn-reprocess"
              onClick={onReprocess}
              disabled={isSubmitting}
            >
              <i className="reprocess-icon">🔄</i>
              Reprocess
            </button>
            
            <button
              type="button"
              className="btn-confirm"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="confirm-icon">✅</i>
                  Confirm & Submit to Database
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;