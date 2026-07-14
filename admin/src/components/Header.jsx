import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <div className="header">
      <div className="header-search glass-panel">
        <Search size={14} className="search-icon" />
        <input type="text" placeholder="Tìm kiếm phim, rạp, suất chiếu..." />
      </div>

      <div className="header-actions">
        <button className="action-btn glass-panel">
          <Bell size={16} />
          <span className="notification-dot"></span>
        </button>
        <div className="profile-btn glass-panel" onClick={() => navigate('/profile')} style={{ gap: '10px', cursor: 'pointer' }}>
          <div className="avatar">{user ? user.fullName.charAt(0).toUpperCase() : 'A'}</div>
          <span className="profile-name">{user ? user.fullName : 'Quản trị viên'}</span>
        </div>
        <button className="action-btn glass-panel" onClick={handleLogout} title="Đăng xuất" style={{ color: '#ef4444' }}>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default Header;
