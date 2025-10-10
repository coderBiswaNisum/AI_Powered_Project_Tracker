import React from "react";
import {employeeTasks} from "../../assets/Objects/EmployeeTaskList"

const TaskList = () => {

  return (
    <div style={{ maxWidth: "100%", margin: "20px auto" }}>
        <h2>Assigned Tasks</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>#</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Priority</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {employeeTasks.tasks.map((task) => (
            <tr key={task.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.id}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.title}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.priority}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
