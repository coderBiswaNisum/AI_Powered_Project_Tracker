import React from 'react';
import './Header.css';
import logo from '../../assets/Images/logo.PNG';

const Header = () => {
  return (
    <div className="professional-header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col"style={{display:'flex',justifyContent:'space-between'}}>
            <div className="header-brand">
              <img src={logo} alt="AI Project Tracker Logo" width={50} />
              <div className="header-titles">
                <h1 className="header-title">AI-Powered Project Tracker</h1>
                <p className="header-subtitle">Professional Work Submission Portal</p>
              </div>
            </div>
             <div className="user-info">
              
              <span className="user-name">Biswaranjan Pradhan</span>
              <div className="user-avatar">BRP</div>
            </div>
          </div>
          <div className="col-auto">
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;