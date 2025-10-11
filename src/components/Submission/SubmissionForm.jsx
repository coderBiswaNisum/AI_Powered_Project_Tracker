import React, { useState } from "react";
import SubmissionTabs from "./SubmissionTabs";
import TextEntryTab from "./TextEntryTab";
import AudioEntryTab from "./AudioEntryTab";
import BulkEntryTab from "./BulkEntryTab";
import { employeeTasks } from "../../assets/Objects/EmployeeTaskList";

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
  fileInputRef,
  selectedDate,
  setSelectedDate,
  statusTask,
  setStatusTask,
  selectedTask,
  setSelectedTask,
}) => {
  // const [selectedTask, setSelectedTask] = useState("");
  // const [statusTask, setStatusTask] = useState("");
  // const today = new Date().toISOString().split("T")[0];
  // const [selectedDate, setSelectedDate] = useState(today);
  // console.log(taskNStatus);
  const renderActiveTab = () => {
    switch (activeTab) {
      case "text":
        return (
          <TextEntryTab
            textUpdate={textUpdate}
            onTextChange={onTextChange}
            isProcessing={isProcessing}
          />
        );
      case "audio":
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
      case "bulk":
        return <BulkEntryTab bulkFile={bulkFile} onBulkUpload={onBulkUpload} />;
      default:
        return null;
    }
  };

  const isFormValid = () => {
    switch (activeTab) {
      case "text":
        return textUpdate.trim();
      case "audio":
        return audioFile;
      case "bulk":
        return bulkFile;
      default:
        return false;
    }
  };

  const handleDropdownChange = (e) => {
    setSelectedTask(e.target.value);
    // setTaskNStatus(taskNStatus.name)
  };

  const handleStatusChange = (e) => {
    setStatusTask(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="main-card">
      <div className="card-header">
        <h2>Daily Work Submission</h2>
        <p>Choose your preferred method to submit daily updates</p>
      </div>

      <div className="container" style={{ marginTop: "2rem", display: "flex" }}>
        <div style={{ width: "50%", marginBottom: "2rem", textAlign: "left" }}>
          {/* <label htmlFor="taskDropdown">Select a Task:</label> */}
          <h3>Select a Task:</h3>
          <select
            id="taskDropdown"
            value={selectedTask}
            onChange={handleDropdownChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            <option value="" disabled>
              Select a task
            </option>
            {employeeTasks.tasks.map((task) => (
              <option key={task.id} value={task.title}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            width: "20%",
            marginBottom: "2rem",
            textAlign: "left",
            marginLeft: "2rem",
          }}
        >
          {/* <label htmlFor="taskDropdown">Select Status:</label> */}
          <h3>Select Status:</h3>
          <select
            id="taskDropdown"
            value={statusTask}
            onChange={handleStatusChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="not_started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div
          style={{
            width: "20%",
            padding: "8px",
            borderRadius: "4px",
            marginLeft: "1rem",
          }}
        >
          <h3>Select Date</h3>
          <input
            type="date"
            id="datePicker"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          />
        </div>
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
                  {isProcessing ? "AI Processing..." : "Submitting..."}
                </>
              ) : (
                "Submit for AI Processing"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
