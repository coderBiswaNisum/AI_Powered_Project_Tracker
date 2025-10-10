import React, { useState } from 'react';
import './ProjectManagerDashboard.css';
import logo from '../assets/Images/nisum-technologies-logo.webp';


const ProjectManagerDashboard = () => {
  const [selectedProject, setSelectedProject] = useState('project-1');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Dummy data structure
  const dummyData = {
    projects: [
      {
        id: 'project-1',
        name: 'AI-Powered Project Tracker',
        manager: 'Rajesh Kumar',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        status: 'In Progress',
        employees: [
          {
            id: 'emp-1',
            name: 'Biswaranjan Pradhan',
            role: 'Frontend Developer',
            email: 'biswa@company.com',
            joinDate: '2024-01-20',
            avatar: 'BP',
            submissions: [
              {
                id: 'sub-1',
                date: '2024-05-20',
                selectedTask: 'User Authentication',
                status: 'Completed',
                originalWorkDescription: 'worked on login page, fixed some bugs in the form validation, added error messages',
                processedWorkDescription: 'Implemented comprehensive user authentication system including login interface development. Resolved form validation issues and enhanced user experience by integrating detailed error messaging. Conducted thorough testing to ensure system reliability.',
                submittedAt: '2024-05-20 09:30:00',
                aiProcessed: true
              },
              {
                id: 'sub-2',
                date: '2024-05-19',
                selectedTask: 'Dashboard UI',
                status: 'Completed',
                originalWorkDescription: 'created the main dashboard layout, added charts and stats cards, made it responsive',
                processedWorkDescription: 'Developed and deployed the primary dashboard interface featuring integrated analytics charts and statistical overview cards. Ensured full responsive design compatibility across various device platforms and conducted user experience optimization.',
                submittedAt: '2024-05-19 17:45:00',
                aiProcessed: true
              },
              {
                id: 'sub-3',
                date: '2024-05-18',
                selectedTask: 'API Integration',
                status: 'In Progress',
                originalWorkDescription: 'connecting frontend with backend APIs, handling errors, writing api functions',
                processedWorkDescription: 'Currently integrating frontend components with backend API endpoints. Implementing comprehensive error handling mechanisms and developing reusable API utility functions to ensure system stability and maintainability.',
                submittedAt: '2024-05-18 14:20:00',
                aiProcessed: true
              }
            ]
          },
          {
            id: 'emp-2',
            name: 'Priya Sharma',
            role: 'Backend Developer',
            email: 'priya@company.com',
            joinDate: '2024-01-25',
            avatar: 'PS',
            submissions: [
              {
                id: 'sub-4',
                date: '2024-05-20',
                selectedTask: 'Database Design',
                status: 'Completed',
                originalWorkDescription: 'designed user schema, created relationships between tables, optimized queries',
                processedWorkDescription: 'Architected and implemented comprehensive database schema for user management system. Established relational table structures and optimized SQL queries for enhanced performance and scalability.',
                submittedAt: '2024-05-20 11:15:00',
                aiProcessed: true
              },
              {
                id: 'sub-5',
                date: '2024-05-19',
                selectedTask: 'Authentication API',
                status: 'Completed',
                originalWorkDescription: 'built JWT authentication, password encryption, user sessions',
                processedWorkDescription: 'Developed secure JWT-based authentication system with robust password encryption protocols and comprehensive user session management. Implemented security best practices throughout the authentication workflow.',
                submittedAt: '2024-05-19 16:30:00',
                aiProcessed: true
              }
            ]
          },
          {
            id: 'emp-3',
            name: 'Amit Patel',
            role: 'UI/UX Designer',
            email: 'amit@company.com',
            joinDate: '2024-02-10',
            avatar: 'AP',
            submissions: [
              {
                id: 'sub-6',
                date: '2024-05-20',
                selectedTask: 'Design System',
                status: 'Completed',
                originalWorkDescription: 'created color palette, typography scale, component library',
                processedWorkDescription: 'Established comprehensive design system including cohesive color palette, typography hierarchy, and reusable component library. Ensured design consistency and scalability across all application interfaces.',
                submittedAt: '2024-05-20 10:45:00',
                aiProcessed: true
              },
              {
                id: 'sub-7',
                date: '2024-05-19',
                selectedTask: 'Wireframing',
                status: 'In Progress',
                originalWorkDescription: 'working on admin panel wireframes, user flow diagrams',
                processedWorkDescription: 'Currently developing detailed wireframes for administrative panel and creating comprehensive user flow diagrams to optimize navigation and user experience throughout the application.',
                submittedAt: '2024-05-19 15:20:00',
                aiProcessed: true
              }
            ]
          },
          {
            id: 'emp-4',
            name: 'Sneha Reddy',
            role: 'QA Engineer',
            email: 'sneha@company.com',
            joinDate: '2024-02-15',
            avatar: 'SR',
            submissions: [
              {
                id: 'sub-8',
                date: '2024-05-20',
                selectedTask: 'Testing',
                status: 'Completed',
                originalWorkDescription: 'tested login functionality, wrote test cases, found 3 bugs',
                processedWorkDescription: 'Executed comprehensive testing of login functionality and developed detailed test case documentation. Identified and documented three critical bugs for resolution, enhancing overall system reliability.',
                submittedAt: '2024-05-20 13:50:00',
                aiProcessed: true
              }
            ]
          }
        ]
      },
      {
        id: 'project-2',
        name: 'E-commerce Mobile App',
        manager: 'Sanjay Mehta',
        startDate: '2024-03-01',
        endDate: '2024-08-15',
        status: 'Planning',
        employees: [
          {
            id: 'emp-5',
            name: 'Rohan Verma',
            role: 'Mobile Developer',
            email: 'rohan@company.com',
            joinDate: '2024-03-05',
            avatar: 'RV',
            submissions: []
          }
        ]
      }
    ]
  };

  const currentProject = dummyData.projects.find(proj => proj.id === selectedProject);
  const selectedEmployeeData = currentProject.employees.find(emp => emp.id === selectedEmployee);

  // Filter submissions by date if selected
  const filteredSubmissions = selectedEmployeeData?.submissions.filter(sub => 
    selectedDate ? sub.date === selectedDate : true
  ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-in-progress';
      case 'Pending': return 'status-pending';
      case 'Blocked': return 'status-blocked';
      default: return 'status-default';
    }
  };

  return (
    <div className="project-manager-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
            <img src={logo} alt="AI Project Tracker Logo" style={{width:'200px',height:'100%'}} />
          <h1>Project Manager Dashboard</h1>
          <div className="project-selector">
            <label>Select Project:</label>
            <select 
              value={selectedProject} 
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedEmployee(null);
              }}
            >
              {dummyData.projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Project Overview */}
        <div className="project-overview">
          <div className="overview-card">
            <h3>{currentProject.name}</h3>
            <div className="project-meta">
              <span><strong>Manager:</strong> {currentProject.manager}</span>
              <span><strong>Status:</strong> {currentProject.status}</span>
              <span><strong>Team Size:</strong> {currentProject.employees.length} members</span>
            </div>
          </div>
        </div>

        <div className="main-layout">
          {/* Employees List */}
          <div className="employees-section">
            <h2>Team Members</h2>
            <div className="employees-list">
              {currentProject.employees.map(employee => (
                <div 
                  key={employee.id}
                  className={`employee-card ${selectedEmployee === employee.id ? 'selected' : ''}`}
                  onClick={() => setSelectedEmployee(employee.id)}
                >
                  <div className="employee-avatar">
                    {employee.avatar}
                  </div>
                  <div className="employee-info">
                    <h4>{employee.name}</h4>
                    <p>{employee.role}</p>
                    <span className="submission-count">
                      {employee.submissions.length} submissions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions Details */}
          <div className="submissions-section">
            {selectedEmployeeData ? (
              <>
                <div className="submissions-header">
                  <div className="employee-header">
                    <div className="employee-avatar large">
                      {selectedEmployeeData.avatar}
                    </div>
                    <div>
                      <h2>{selectedEmployeeData.name}</h2>
                      <p>{selectedEmployeeData.role} • {selectedEmployeeData.email}</p>
                    </div>
                  </div>
                  
                  <div className="filters">
                    <label>Filter by Date:</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    {selectedDate && (
                      <button 
                        className="clear-filter"
                        onClick={() => setSelectedDate('')}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {filteredSubmissions.length > 0 ? (
                  <div className="submissions-list">
                    {filteredSubmissions.map(submission => (
                      <div key={submission.id} className="submission-card">
                        <div className="submission-header">
                          <div className="submission-date">
                            Submitted at: {submission.submittedAt}
                          </div>
                          <div className="submission-meta">
                            <span className={`status ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </span>
                            <span className="task">
                              <strong>Task:</strong> {submission.selectedTask}
                            </span>
                          </div>
                        </div>
                        
                        <div className="work-description">
                        
                          
                          <div className="processed-description">
                            <label>
                              Work Description
                            </label>
                            <p>{submission.processedWorkDescription}</p>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-submissions">
                    <p>No submissions found {selectedDate && `for ${selectedDate}`}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="select-employee-prompt">
                <div className="prompt-content">
                  <h3>Select a Team Member</h3>
                  <p>Click on an employee from the list to view their work submissions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;