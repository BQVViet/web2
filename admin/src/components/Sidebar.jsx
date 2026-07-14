import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Film, Tv, Star, Calendar,
  Bookmark, PlaySquare, Building2, Coffee, Ticket, Armchair, Lightbulb
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const userStr = localStorage.getItem('adminUser');
  let userRole = '';
  if (userStr) {
    try {
      userRole = JSON.parse(userStr).role;
    } catch (e) {
      console.error(e);
    }
  }
  const isStaff = userRole === 'STAFF';

  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-logo">
        <img src="/logo.svg" alt="Admin Cinema Logo" className="sidebar-logo-image" />

      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <h4 className="menu-title">KHÁM PHÁ</h4>
          {!isStaff && (
            <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} end>
              <Home size={16} />
              <span>Tổng quan</span>
            </NavLink>
          )}
          <NavLink to="/movies" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Film size={16} />
            <span>Quản lý phim</span>
          </NavLink>
          <NavLink to="/food-drinks" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Coffee size={16} />
            <span>Quản lý đồ ăn</span>
          </NavLink>
          <NavLink to="/showtimes" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Calendar size={16} />
            <span>Lịch chiếu</span>
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Tv size={16} />
            <span>Phòng chiếu</span>
          </NavLink>
          <NavLink to="/cinemas" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Building2 size={16} />
            <span>Rạp chiếu</span>
          </NavLink>
          {!isStaff && (
            <NavLink to="/banners" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <PlaySquare size={16} />
              <span>Banner</span>
            </NavLink>
          )}
          <NavLink to="/seats" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Armchair size={16} />
            <span>Ghế ngồi</span>
          </NavLink>
          {!isStaff && (
            <NavLink to="/lights" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <Lightbulb size={16} />
              <span>Sơ đồ đèn</span>
            </NavLink>
          )}

          {!isStaff && (
            <NavLink to="/vouchers" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <Bookmark size={16} />
              <span>Mã giảm giá</span>
            </NavLink>
          )}
          {!isStaff && (
            <NavLink to="/users" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              <Star size={16} />
              <span>Người dùng</span>
            </NavLink>
          )}
          <NavLink to="/invoices" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            <Ticket size={16} />
            <span>Đơn vé</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
