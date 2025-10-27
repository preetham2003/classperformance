import React from 'react';
import './Layout.css';

const Header = ({ teacher }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{teacher?.subject || 'Dashboard'}</h1>
        <div className="header-user-info">
          <p className="user-name">{teacher?.name}</p>
          <p className="user-email">{teacher?.email}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;