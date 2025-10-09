import React, { useEffect, useState } from "react";

const TaskTable = ({ refresh }) => {
  const taskData = [
    { date: "2025-10-01", task: "Fixed bug in login API" },
    { date: "2025-10-02", task: "Implemented dashboard UI" },
    { date: "2025-10-03", task: "Connected backend to frontend" },
    { date: "2025-10-04", task: "Wrote unit tests for services" },
    { date: "2025-10-05", task: "Updated documentation" },
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
    <div>
      <h2>Your Past Submissions</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Task Submitted</th>
          </tr>
        </thead>
        <tbody>
          {localTaskData &&
            localTaskData.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.date}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.task}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
