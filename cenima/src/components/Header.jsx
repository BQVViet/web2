import React, { useState, useEffect } from 'react';
import { User, Video, Clapperboard, MonitorPlay, Ticket, Phone, Newspaper, Edit } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import '../styles/Header.css';

const Header = ({ isLoggedIn, userName, onLoginClick, onLogout, onFilterChange, currentFilter = 'ALL' }) => {
  const [cinemas, setCinemas] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'cinema' | 'benefits' | 'rental' | 'rules' | 'popcorn'
  const [selectedCinema, setSelectedCinema] = useState(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const data = await axiosClient.get('/cinemas');
        setCinemas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load cinemas:", error);
        setCinemas([
          { id: 1, name: 'CGV Vincom Center', address: '72 Lê Thánh Tôn, Q.1, TP.HCM', phone: '19001234' },
          { id: 2, name: 'Lotte Cinema Nam Sài Gòn', address: '469 Nguyễn Hữu Thọ, Q.7, TP.HCM', phone: '19005678' },
          { id: 3, name: 'Galaxy Nguyễn Du', address: '116 Nguyễn Du, Q.1, TP.HCM', phone: '19009090' }
        ]);
      }
    };
    fetchCinemas();
  }, []);

  const handleFilterClick = (e, filterType) => {
    e.preventDefault();
    if (onFilterChange) onFilterChange(filterType);
    
    const movieSection = document.querySelector('.movie-selection') || document.querySelector('.user-profile-page');
    if (movieSection) {
      movieSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCinemaClick = (cinema) => {
    setSelectedCinema(cinema);
    setActiveModal('cinema');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedCinema(null);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-left" style={{display: 'flex', gap: '15px'}}>
            <span 
              className="partner-link" 
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                if (isLoggedIn) {
                  handleFilterClick(e, 'PROFILE_BOOKINGS');
                } else {
                  e.preventDefault();
                  onLoginClick();
                }
              }}
            >
              VÉ CỦA TÔI
            </span>
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
                <a href="#" onClick={(e) => handleFilterClick(e, 'ALL_GRID')}>PHIM</a>
                <ul className="dropdown">
                  <li><a href="#" onClick={(e) => handleFilterClick(e, 'DANG_CHIEU')}>Phim Đang Chiếu</a></li>
                  <li><a href="#" onClick={(e) => handleFilterClick(e, 'SAP_CHIEU')}>Phim Sắp Chiếu</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#" onClick={(e) => e.preventDefault()}>RẠP CGV</a>
                <ul className="dropdown">
                  {cinemas.map((cinema) => (
                    <li key={cinema.id}>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleCinemaClick(cinema); }}>
                        {cinema.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <a href="#" onClick={(e) => e.preventDefault()}>THÀNH VIÊN</a>
                <ul className="dropdown">
                  <li><a href="#" onClick={(e) => { if(isLoggedIn) handleFilterClick(e, 'PROFILE'); else { e.preventDefault(); onLoginClick(); } }}>Tài Khoản CGV</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('benefits'); }}>Quyền Lợi</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a href="#" onClick={(e) => e.preventDefault()}>CULTUREPLEX</a>
                <ul className="dropdown">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('popcorn'); }}>Quầy Online</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('rental'); }}>Thuê Rạp & Vé Nhóm</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveModal('rules'); }}>Quy định CGV</a></li>
                </ul>
              </li>
            </ul>
          </nav>
          
          <div 
            className="header-promos" 
            onClick={() => {
              const movieSection = document.querySelector('.movie-selection');
              if (movieSection) movieSection.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="promo-item"><span>MUA VÉ NGAY</span></div>
          </div>
        </div>
      </div>
      
      <div className="ticket-perforation"></div>

      {/* Sub Menu (Quick links like in the screenshot) */}
      {currentFilter === 'ALL' && (
        <div className="sub-menu-container">
           <div className="container sub-menu-inner">
              <div className="sub-item" onClick={() => {
                if (cinemas.length > 0) handleCinemaClick(cinemas[0]);
              }} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><Clapperboard size={20} /></div>
              <span className="sub-item-text-vn">RẠP CGV</span>
            </div>
            <div className="sub-item" onClick={(e) => handleFilterClick(e, 'DANG_CHIEU')} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><Video size={20} /></div>
              <span className="sub-item-text-vn">PHIM ĐANG CHIẾU</span>
            </div>
            <div className="sub-item" onClick={() => {
              const cultureplex = document.querySelector('.cultureplex-grid');
              if (cultureplex) cultureplex.scrollIntoView({ behavior: 'smooth' });
            }} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><MonitorPlay size={20} /></div>
              <span className="sub-item-text-vn">ĐẶC TRƯNG CGV</span>
            </div>
            <div className="sub-item" onClick={() => setActiveModal('rental')} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><Ticket size={20} /></div>
              <span className="sub-item-text-vn">THUÊ RẠP & VÉ NHÓM</span>
            </div>
            <div className="sub-item" onClick={() => setActiveModal('rental')} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><Phone size={20} /></div>
              <span className="sub-item-text-vn">LIÊN HỆ CGV</span>
            </div>
            <div className="sub-item" onClick={(e) => handleFilterClick(e, 'PROFILE_PROMOTIONS')} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><Newspaper size={20} /></div>
              <span className="sub-item-text-vn">TIN MỚI & ƯU ĐÃI</span>
            </div>
            <div className="sub-item" onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) onLoginClick();
              else handleFilterClick(e, 'PROFILE');
            }} style={{ cursor: 'pointer' }}>
              <div className="sub-item-icon"><Edit size={20} /></div>
              <span className="sub-item-text-vn">ĐĂNG KÝ NGAY</span>
            </div>
         </div>
      </div>
      )}

      {/* MODALS RENDERING */}
      {activeModal === 'cinema' && selectedCinema && (
        <div className="header-modal-overlay" onClick={closeModal}>
          <div className="header-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header-modal-header">
              <h3>CHI TIẾT RẠP: {selectedCinema.name.toUpperCase()}</h3>
              <button className="header-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="header-modal-body">
              <p><strong>Địa chỉ:</strong> {selectedCinema.address}</p>
              <p><strong>Điện thoại liên hệ:</strong> {selectedCinema.phone || '1900 6017'}</p>
              <p><strong>Giờ hoạt động:</strong> 8:00 AM - 12:00 PM</p>
              <div style={{ marginTop: '15px', padding: '12px', background: '#fcf8e3', border: '1px solid #fbeed5', borderRadius: '4px', fontSize: '13px', color: '#c09853' }}>
                Hệ thống âm thanh Dolby Atmos 7.1 đỉnh cao cùng ghế ngồi da êm ái đang sẵn sàng phục vụ quý khách.
              </div>
            </div>
            <div className="header-modal-footer">
              <button className="btn-modal-close" onClick={closeModal}>Đóng</button>
              <button className="btn-modal-action" onClick={(e) => { closeModal(); handleFilterClick(e, 'ALL'); }}>Đặt Vé Ngay</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'benefits' && (
        <div className="header-modal-overlay" onClick={closeModal}>
          <div className="header-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header-modal-header">
              <h3>QUYỀN LỢI THÀNH VIÊN CGV</h3>
              <button className="header-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="header-modal-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <h4 style={{ fontWeight: 'bold', color: '#e71a0f', marginBottom: '8px' }}>Chương trình điểm thưởng CGV Rewards</h4>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>Tích lũy điểm dựa trên tổng giá trị giao dịch mua vé xem phim và bắp nước trực tuyến:</p>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', fontSize: '13px', marginBottom: '15px' }}>
                <li><strong>Thành viên Member:</strong> Tích lũy 5% giá trị giao dịch thành điểm thưởng.</li>
                <li><strong>Thành viên VIP:</strong> Tích lũy 7% giá trị giao dịch, tặng 1 phần bắp nước miễn phí vào tháng sinh nhật.</li>
                <li><strong>Thành viên VVIP:</strong> Tích lũy 10% giá trị giao dịch, nhận 2 phần vé miễn phí cùng bắp nước ngày sinh nhật.</li>
              </ul>
              <p style={{ fontSize: '13px', color: '#666' }}>* Điểm thưởng có thể được sử dụng để quy đổi vé xem phim và combo bắp nước tại mọi cụm rạp CGV Việt Nam.</p>
            </div>
            <div className="header-modal-footer">
              <button className="btn-modal-close" onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'rental' && (
        <div className="header-modal-overlay" onClick={closeModal}>
          <div className="header-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header-modal-header">
              <h3>THUÊ RẠP & ĐẶT VÉ NHÓM</h3>
              <button className="header-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="header-modal-body">
              <p style={{ marginBottom: '12px' }}>CGV cung cấp dịch vụ thuê phòng chiếu phục vụ hội thảo, sự kiện doanh nghiệp, sinh nhật cá nhân hoặc đặt mua vé số lượng lớn với ưu đãi chiết khấu đặc biệt.</p>
              <p><strong>Hotline Sự Kiện:</strong> 1900 6017 (nhánh 2)</p>
              <p><strong>Email đăng ký:</strong> events.vietnam@cgv.vn</p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '10px' }}>* Quý khách vui lòng liên hệ trước ít nhất 7 ngày làm việc để được hỗ trợ chuẩn bị tốt nhất.</p>
            </div>
            <div className="header-modal-footer">
              <button className="btn-modal-close" onClick={closeModal}>Hủy bỏ</button>
              <a href="mailto:events.vietnam@cgv.vn" className="btn-modal-action" style={{ textDecoration: 'none', textAlign: 'center' }}>Gửi Email</a>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'rules' && (
        <div className="header-modal-overlay" onClick={closeModal}>
          <div className="header-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header-modal-header">
              <h3>QUY ĐỊNH CHUNG TẠI RẠP CGV</h3>
              <button className="header-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="header-modal-body" style={{ maxHeight: '350px', overflowY: 'auto', fontSize: '13px' }}>
              <p style={{ marginBottom: '10px' }}>Để đảm bảo trải nghiệm điện ảnh văn minh, CGV quy định:</p>
              <ol style={{ paddingLeft: '20px', listStyleType: 'decimal', marginBottom: '15px' }}>
                <li style={{ marginBottom: '6px' }}>Không mang thức ăn, nước uống từ ngoài vào rạp.</li>
                <li style={{ marginBottom: '6px' }}>Không quay phim, ghi âm hoặc chụp ảnh màn hình phòng chiếu dưới mọi hình thức (vi phạm sẽ bị xử lý theo pháp luật).</li>
                <li style={{ marginBottom: '6px' }}>Vui lòng giữ trật tự và tắt chuông điện thoại trong suốt thời gian chiếu phim.</li>
              </ol>
              <h4 style={{ fontWeight: 'bold', color: '#e71a0f', marginTop: '15px', marginBottom: '6px' }}>Quy định nhãn phân loại độ tuổi phim:</h4>
              <ul style={{ paddingLeft: '15px', listStyleType: 'square' }}>
                <li style={{ marginBottom: '4px' }}><strong>P:</strong> Phim phổ biến rộng rãi cho mọi đối tượng khán giả.</li>
                <li style={{ marginBottom: '4px' }}><strong>K:</strong> Khán giả dưới 13 tuổi được xem khi đi cùng cha mẹ/người giám hộ.</li>
                <li style={{ marginBottom: '4px' }}><strong>T13:</strong> Phim cấm khán giả dưới 13 tuổi.</li>
                <li style={{ marginBottom: '4px' }}><strong>T16:</strong> Phim cấm khán giả dưới 16 tuổi.</li>
                <li style={{ marginBottom: '4px' }}><strong>T18:</strong> Phim cấm khán giả dưới 18 tuổi.</li>
              </ul>
            </div>
            <div className="header-modal-footer">
              <button className="btn-modal-close" onClick={closeModal}>Đã hiểu</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'popcorn' && (
        <div className="header-modal-overlay" onClick={closeModal}>
          <div className="header-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="header-modal-header">
              <h3>QUẦY ONLINE BẮP NƯỚC</h3>
              <button className="header-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="header-modal-body">
              <p style={{ marginBottom: '12px' }}>Quý khách có thể mua kèm các Combo Bắp Nước cực kỳ hấp dẫn ngay tại <strong>Bước 3</strong> của quá trình đặt vé xem phim online:</p>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc', fontSize: '13px', marginBottom: '15px' }}>
                <li><strong>Combo Cá Nhân:</strong> 1 bắp lớn + 1 nước ngọt lớn (chọn vị ngọt/mặn/caramel/phô mai) - chỉ từ 85.000đ.</li>
                <li><strong>Combo Couple:</strong> 1 bắp lớn + 2 nước ngọt lớn - chỉ từ 135.000đ.</li>
                <li><strong>Combo VIP:</strong> 2 bắp lớn + 2 nước ngọt lớn + 1 snack - chỉ từ 185.000đ.</li>
              </ul>
              <p style={{ fontSize: '13px', color: '#e71a0f', fontWeight: 'bold' }}>* Tiết kiệm lên tới 20% khi mua online so với mua trực tiếp tại quầy!</p>
            </div>
            <div className="header-modal-footer">
              <button className="btn-modal-close" onClick={closeModal}>Đóng</button>
              <button className="btn-modal-action" onClick={(e) => { closeModal(); handleFilterClick(e, 'ALL'); }}>Đặt Vé Ngay</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
