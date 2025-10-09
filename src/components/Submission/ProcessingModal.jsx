import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

const ProcessingModal = ({
  show,
  onHide,
  processingStatus, // 'submitting', 'success', 'error'
  processedText,
  originalText,
  onFinalSubmit,
  onEdit,
  onRetry,
  errorMessage = ''
}) => {
  // Handle cancel with confirmation
  const handleCancel = () => {
    if (processingStatus === 'submitting') {
      if (window.confirm('Are you sure you want to cancel? The AI processing will be interrupted.')) {
        onHide();
      }
    } else {
      onHide();
    }
  };

  // Handle final submission
  const handleFinalSubmit = () => {
    onFinalSubmit(processedText);
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleCancel}
      centered
      size="lg"
      backdrop={processingStatus === 'submitting' ? 'static' : true}
    >
      <Modal.Header closeButton={processingStatus !== 'submitting'}>
        <Modal.Title>
          {processingStatus === 'submitting' && '🔄 AI Processing'}
          {processingStatus === 'success' && '✅ Processing Complete'}
          {processingStatus === 'error' && '❌ Processing Failed'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Submitting State */}
        {processingStatus === 'submitting' && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>Submitting your response...</h5>
            <p className="text-muted">AI is processing your text. This may take a few seconds.</p>
          </div>
        )}

        {/* Success State */}
        {processingStatus === 'success' && (
          <div className="processed-content">
            <h6 className="mb-3">AI Processed Version:</h6>
            <div className="border rounded p-3 bg-light mb-3">
              <p className="mb-0">{processedText}</p>
            </div>
            
            <div className="original-text-preview">
              <details>
                <summary className="text-muted small">View Original Text</summary>
                <div className="border rounded p-2 mt-2 bg-white">
                  <p className="mb-0 small">{originalText}</p>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Error State */}
        {processingStatus === 'error' && (
          <Alert variant="danger">
            <h6>Processing Failed</h6>
            <p className="mb-2">{errorMessage || 'An error occurred while processing your text.'}</p>
            <small>Please try again or check your connection.</small>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        {/* Submitting State Actions */}
        {processingStatus === 'submitting' && (
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        )}

        {/* Success State Actions */}
        {processingStatus === 'success' && (
          <>
            <Button variant="outline-secondary" onClick={onEdit}>
              ✏️ Edit
            </Button>
            <Button variant="outline-warning" onClick={onRetry}>
              🔄 Retry
            </Button>
            <Button variant="primary" onClick={handleFinalSubmit}>
              ✅ Submit to Database
            </Button>
          </>
        )}

        {/* Error State Actions */}
        {processingStatus === 'error' && (
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Close
            </Button>
            <Button variant="primary" onClick={onRetry}>
              🔄 Try Again
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ProcessingModal;