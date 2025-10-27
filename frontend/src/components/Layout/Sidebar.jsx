import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import './Layout.css';

const Sidebar = ({ isOpen, onToggle, currentPage, onNavigate, onLogout }) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'list', label: 'Student Performance', icon: '👥' },
    { id: 'add', label: 'Add/Edit Performance', icon: '➕' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="sidebar-title">Menu</h2>}
        <button
          onClick={onToggle}
          className="sidebar-toggle"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item ${currentPage === item.id ? 'nav-item-active' : ''}`}
            aria-current={currentPage === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="logout-button"
        aria-label="Logout"
      >
        <LogOut size={20} />
        {isOpen && <span>Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;