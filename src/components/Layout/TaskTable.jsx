import React, { useEffect, useState } from "react";

const TaskTable = ({ refresh }) => {
  const taskData = [
    {
      date: "2025-10-01",
      selectedTask: "Fix bug in login API",
      status: "In Progress",
      workDescription:
        "Investigating and fixing the bug causing login issues for users.",
    },
    {
      date: "2025-10-02",
      selectedTask: "Implement dashboard UI",
      status: "In Progress",
      workDescription:
        "Designed and implemented the user interface for the project dashboard.",
    },
    {
      date: "2025-10-03",
      selectedTask: "Connect backend to frontend",
      status: "Pending",
      workDescription:
        "Work in progress to connect the backend API with the frontend user interface.",
    },
    {
      date: "2025-10-04",
      selectedTask: "Write unit tests for services",
      status: "In Progress",
      workDescription:
        "Creating unit tests for the services module to ensure proper functionality.",
    },
    {
      date: "2025-10-05",
      selectedTask: "Update documentation",
      status: "In Progress",
      workDescription:
        "Reviewed and updated project documentation for the latest features and fixes.",
    },
  ];

  const [localTaskData, setLocalTaskData] = useState(
    JSON.parse(localStorage.getItem("taskData"))
  );

  // Set initial data if localStorage is empty
  useEffect(() => {
    if (!localTaskData) {
      localStorage.setItem("taskData", JSON.stringify(taskData));
      setLocalTaskData(taskData);
    }
  }, []);

  // Re-fetch from localStorage when `refresh` changes
  useEffect(() => {
    const stored = localStorage.getItem("taskData");
    if (stored) {
      setLocalTaskData(JSON.parse(stored));
    }
  }, [refresh]);

  return (
    <div className="container">
      <h2>Your Past Submissions</h2>
      <table style={{ width: "100%", borderCollapse: "collapse",textAlign:'left' }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Selected Task
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              Work Description
            </th>
          </tr>
        </thead>
        <tbody>
          {localTaskData &&
            localTaskData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.date}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.selectedTask}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item.workDescription}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
