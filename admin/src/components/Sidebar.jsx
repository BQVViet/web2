import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Film, Tv, TrendingUp, Star, Calendar,
  Bookmark, Clock, Radio, PlaySquare, Building2, Coffee
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-logo">
        <img src="/logo.svg" alt="Admin Cinema Logo" className="sidebar-logo-image" />

      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <h4 className="menu-title">KHÁM PHÁ</h4>
          <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} end>
            <Home size={16} />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Film size={16} />
            <span>Phim</span>
          </NavLink>
          <NavLink to="/cinemas" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Building2 size={16} />
            <span>Rạp chiếu</span>
          </NavLink>
          <NavLink to="/food-drinks" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Coffee size={16} />
            <span>Bắp nước</span>
          </NavLink>
          <NavLink to="/banners" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <PlaySquare size={16} />
            <span>Banners</span>
          </NavLink>
          <NavLink to="/showtimes" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Calendar size={16} />
            <span>Lịch chiếu</span>
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Tv size={16} />
            <span>Phòng chiếu</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Star size={16} />
            <span>Người dùng</span>
          </NavLink>
          <NavLink to="/invoices" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Bookmark size={16} />
            <span>Đơn vé</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
