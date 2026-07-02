import React from 'react';
import { User, Video, Clapperboard, MonitorPlay, Ticket, Phone, Newspaper, Edit } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ isLoggedIn, userName, onLoginClick, onLogout, onFilterChange, currentFilter = 'ALL' }) => {
  const handleFilterClick = (e, filterType) => {
    e.preventDefault();
    if (onFilterChange) onFilterChange(filterType);
    
    // Cuộn xuống phần danh sách phim mượt mà
    const movieSection = document.querySelector('.movie-selection') || document.querySelector('.user-profile-page');
    if (movieSection) {
      movieSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left" style={{display: 'flex', gap: '15px'}}>
            <span className="partner-link">TIN MỚI & ƯU ĐÃI</span>
            <span className="partner-link">VÉ CỦA TÔI</span>
          </div>
          <div className="top-right">
            {isLoggedIn ? (
              <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                <a href="#" className="login-link" onClick={(e) => handleFilterClick(e, 'PROFILE')}>
                  <User size={14} className="icon" /> XIN CHÀO, {userName?.toUpperCase()}
                </a>
                <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                  ĐĂNG XUẤT
                </a>
              </div>
            ) : (
              <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>
                <User size={14} className="icon" /> ĐĂNG NHẬP / ĐĂNG KÝ
              </a>
            )}
            <div className="lang-switch">
              <span className="active">VN</span>
              <span>EN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-perforation"></div>

      {/* Main Navigation */}
      <div className="main-nav-container">
        <div className="container main-nav-inner">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={(e) => handleFilterClick(e, 'ALL')}>
            <h1 className="logo-text">CGV<span style={{fontSize:'2rem', verticalAlign:'top'}}>*</span></h1>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li className="nav-item">
                <a href="#" onClick={(e) => handleFilterClick(e, 'ALL')}>PHIM</a>
                <ul className="dropdown">
                  <li><a href="#" onClick={(e) => handleFilterClick(e, 'DANG_CHIEU')}>Phim Đang Chiếu</a></li>
                  <li><a href="#" onClick={(e) => handleFilterClick(e, 'SAP_CHIEU')}>Phim Sắp Chiếu</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#">RẠP CGV</a>
                <ul className="dropdown">
                  <li><a href="#">Tất Cả Các Rạp</a></li>
                  <li><a href="#">Rạp Đặc Biệt</a></li>
                  <li><a href="#">Rạp 3D</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#">THÀNH VIÊN</a>
                <ul className="dropdown">
                  <li><a href="#" onClick={(e) => { if(isLoggedIn) handleFilterClick(e, 'PROFILE'); else { e.preventDefault(); onLoginClick(); } }}>Tài Khoản CGV</a></li>
                  <li><a href="#">Quyền Lợi</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#">CULTUREPLEX</a>
                <ul className="dropdown">
                  <li><a href="#">Quầy Online</a></li>
                  <li><a href="#">Thuê Rạp & Vé Nhóm</a></li>
                  <li><a href="#">CGV EGift</a></li>
                  <li><a href="#">CGV Rules</a></li>
                </ul>
              </li>
            </ul>
          </nav>
          
          <div className="header-promos">
            <div className="promo-item"><span>MUA VÉ NGAY</span></div>
          </div>
        </div>
      </div>
      
      <div className="ticket-perforation"></div>

      {/* Sub Menu (Quick links like in the screenshot) */}
      {currentFilter === 'ALL' && (
        <div className="sub-menu-container">
           <div className="container sub-menu-inner">
              <div className="sub-item">
              <div className="sub-item-icon"><Clapperboard size={20} /></div>
              <span className="sub-item-text-en">CGV CINEMAS</span>
              <span className="sub-item-text-vn">RẠP CGV</span>
            </div>
            <div className="sub-item">
              <div className="sub-item-icon"><Video size={20} /></div>
              <span className="sub-item-text-en">NOW SHOWING</span>
              <span className="sub-item-text-vn">PHIM ĐANG CHIẾU</span>
            </div>
            <div className="sub-item">
              <div className="sub-item-icon"><MonitorPlay size={20} /></div>
              <span className="sub-item-text-en">CGV SPECIAL</span>
              <span className="sub-item-text-vn">ĐẶC TRƯNG CGV</span>
            </div>
            <div className="sub-item">
              <div className="sub-item-icon"><Ticket size={20} /></div>
              <span className="sub-item-text-en">HALL RENTAL</span>
              <span className="sub-item-text-vn">THUÊ RẠP & VÉ NHÓM</span>
            </div>
            <div className="sub-item">
              <div className="sub-item-icon"><Phone size={20} /></div>
              <span className="sub-item-text-en">CONTACT CGV</span>
              <span className="sub-item-text-vn">LIÊN HỆ CGV</span>
            </div>
            <div className="sub-item">
              <div className="sub-item-icon"><Newspaper size={20} /></div>
              <span className="sub-item-text-en">NEWS & OFFERS</span>
              <span className="sub-item-text-vn">TIN MỚI & ƯU ĐÃI</span>
            </div>
            <div className="sub-item">
              <div className="sub-item-icon"><Edit size={20} /></div>
              <span className="sub-item-text-en">REGISTER NOW</span>
              <span className="sub-item-text-vn">ĐĂNG KÝ NGAY</span>
            </div>
         </div>
      </div>
      )}
    </header>
  );
};

export default Header;
