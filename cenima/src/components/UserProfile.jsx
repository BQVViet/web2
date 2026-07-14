import React, { useState, useEffect } from 'react';
import { User, Lock, Save, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';
import '../styles/UserProfile.css';
import authApi from '../api/authApi';
import axiosClient from '../api/axiosClient';

const UserProfile = ({ onProfileUpdate, onFilterChange, defaultTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookings, setBookings] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [profileData, setProfileData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
    fetchBookings();
    fetchPromotions();
  }, []);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getProfile();
      setProfileData({
        id: data.id || '',
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || ''
      });
    } catch (err) {
      setError('Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await axiosClient.get('/invoices/my');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Không thể tải lịch sử đặt vé.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const data = await axiosClient.get('/promotions');
      setPromotions(Array.isArray(data) ? data : getFallbackPromotions());
    } catch (err) {
      setPromotions(getFallbackPromotions());
    }
  };

  const getFallbackPromotions = () => [
    {
      id: 1,
      title: "ĐỒNG GIÁ 79.000 ĐỒNG",
      description: "Áp dụng cho tất cả khách hàng thành viên CGV trên toàn quốc khi đặt vé trực tuyến.",
      imageUrl: "/images/media__1781694318215.png"
    },
    {
      id: 2,
      title: "NEW FUNCTION ONLINE PACKAGE",
      description: "Trọn gói tiện lợi, trọn vẹn trải nghiệm dịch vụ bắp nước và vé xem phim trực tuyến.",
      imageUrl: "/images/media__1781694331166.png"
    },
    {
      id: 3,
      title: "GIA NHẬP NGAY - QUÀ TẶNG ĐẦY TAY",
      description: "Đăng ký thành viên CGV hôm nay nhận ngay những phần quà hấp dẫn từ CGV Cinemas.",
      imageUrl: "/images/media__1781694342202.png"
    },
    {
      id: 4,
      title: "HAPPY BIRTHDAY TO CGV MEMBERS!",
      description: "Quà tặng sinh nhật đặc biệt dành riêng cho các thành viên thân thiết của CGV.",
      imageUrl: "/images/media__1781694364694.png"
    }
  ];

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!profileData.fullName || !profileData.phone) {
      setError('Vui lòng nhập đầy đủ Họ Tên và Số Điện Thoại');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.updateProfile({
        fullName: profileData.fullName,
        phone: profileData.phone
      });
      setSuccess('Cập nhật thông tin thành công!');
      if (onProfileUpdate) {
        onProfileUpdate(data.fullName);
      }
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin mật khẩu');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const totalSpending = bookings.reduce((sum, b) => {
    if (b.paymentStatus === 'SUCCESS' || b.paymentStatus === 'PAID') {
      return sum + (b.totalAmount || 0);
    }
    return sum;
  }, 0);

  const cgvPoints = Math.floor(totalSpending * 0.05);

  const getMemberTier = (spending) => {
    if (spending >= 3000000) return { name: 'VVIP', class: 'vvip' };
    if (spending >= 1000000) return { name: 'VIP', class: 'vip' };
    return { name: 'MEMBER', class: 'member' };
  };

  const tier = getMemberTier(totalSpending);

  return (
    <div className="user-profile-page container">
      <div className="breadcrumb">

      </div>

      {/* CGV Membership Dashboard */}
      <div className="cgv-member-dashboard">
        <div className="cgv-card-container">
          <div className={`cgv-member-card ${tier.class}`}>
            <div className="card-header">
              <span className="card-brand">CGV<span className="card-brand-star">*</span></span>
              <span className="card-tier">{tier.name}</span>
            </div>
            <div className="card-body">
              <div className="card-name">{profileData.fullName ? profileData.fullName.toUpperCase() : 'KHÁCH HÀNG'}</div>
              <div className="card-number">9011 2345 6789 {String(profileData.id || 0).padStart(4, '0')}</div>
            </div>
            <div className="card-footer">
              <div className="simulated-barcode">
                <div className="barcode-lines"></div>
                <div className="barcode-text">901123456789{String(profileData.id || 0).padStart(4, '0')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cgv-stats-container">
          <div className="cgv-welcome">
            Xin chào, <strong>{profileData.fullName}</strong>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">ĐIỂM CGV</div>
              <div className="stat-value">{(cgvPoints).toLocaleString('vi-VN')} P</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">VOUCHER</div>
              <div className="stat-value">2</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">TỔNG CHI TIÊU</div>
              <div className="stat-value">{totalSpending.toLocaleString('vi-VN')} ₫</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">CẤP ĐỘ THÀNH VIÊN</div>
              <div className="stat-value" style={{ color: tier.class === 'vvip' ? '#0f172a' : tier.class === 'vip' ? '#d4af37' : '#e71a0f' }}>{tier.name}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <ul>
            <li
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
            >
              THÔNG TIN TÀI KHOẢN
            </li>
            <li
              className={activeTab === 'password' ? 'active' : ''}
              onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
            >
              ĐỔI MẬT KHẨU
            </li>
            <li
              className={activeTab === 'bookings' ? 'active' : ''}
              onClick={() => { setActiveTab('bookings'); setError(''); setSuccess(''); fetchBookings(); }}
            >
              LỊCH SỬ ĐẶT VÉ
            </li>
            <li
              className={activeTab === 'promotions' ? 'active' : ''}
              onClick={() => { setActiveTab('promotions'); setError(''); setSuccess(''); fetchPromotions(); }}
            >
              TIN MỚI & ƯU ĐÃI
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          <div className="content-box">
            <h2 className="content-title">
              {activeTab === 'profile' ? 'THÔNG TIN CHUNG' : activeTab === 'password' ? 'ĐỔI MẬT KHẨU' : activeTab === 'bookings' ? 'LỊCH SỬ ĐẶT VÉ' : 'TIN MỚI & ƯU ĐÃI'}
            </h2>

            {error && <div className="alert-message error"><AlertCircle size={16} /> {error}</div>}
            {success && <div className="alert-message success"><CheckCircle2 size={16} /> {success}</div>}
            {loading && <div className="loading-spinner">Đang xử lý...</div>}

            {!loading && activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Email (Tên đăng nhập)</label>
                  <input type="email" value={profileData.email} disabled className="disabled-input" />
                  <span className="hint">Bạn không thể thay đổi email đã đăng ký.</span>
                </div>
                <div className="form-group">
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="form-group">
                  <label>Số Điện Thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn"><Save size={18} /> LƯU LẠI</button>
                </div>
              </form>
            )}

            {!loading && activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn"><Save size={18} /> LƯU LẠI</button>
                </div>
              </form>
            )}

            {!loading && activeTab === 'bookings' && (
              <div className="bookings-history" style={{ marginTop: '20px' }}>
                {bookings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {bookings.map((b) => (
                      <div key={b.id} style={{ border: '1px solid var(--cgv-border)', borderRadius: '12px', padding: '20px', background: 'var(--cgv-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--cgv-border)', paddingBottom: '10px', marginBottom: '15px' }}>
                          <span style={{ fontWeight: '900', color: 'var(--cgv-dark)', fontSize: '15px' }}>HÓA ĐƠN #TKT{b.id}</span>
                          <span style={{ fontSize: '12px', color: 'var(--cgv-text-muted)', fontWeight: 'bold' }}>
                            Ngày đặt: {new Date(b.createdDate).toLocaleDateString('vi-VN')} {new Date(b.createdDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', color: 'var(--cgv-text)' }}>
                          <div><strong>Phim:</strong> {b.movieTitle || 'Không xác định'}</div>
                          <div><strong>Rạp:</strong> {b.cinemaName || 'Không xác định'} - {b.roomName}</div>
                          <div><strong>Suất chiếu:</strong> {b.showDate} | {b.startTime ? b.startTime.slice(0, 5) : ''}</div>
                          <div><strong>Ghế ngồi:</strong> {b.seats || 'Không có ghế'}</div>
                          {b.foods && (
                            <div style={{ gridColumn: 'span 2' }}>
                              <strong>Bắp nước:</strong> {b.foods}
                            </div>
                          )}
                          <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--cgv-border)', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--cgv-text-muted)' }}><strong>Thanh toán:</strong> {b.paymentMethod}</span>
                            <span style={{ fontWeight: '900', color: 'var(--cgv-red)', fontSize: '18px' }}>{b.totalAmount.toLocaleString('vi-VN')} ₫</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--cgv-text-muted)', padding: '40px', fontSize: '15px' }}>
                    Bạn chưa có lịch sử đặt vé nào trên hệ thống.
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'promotions' && (
              <div className="promotions-history" style={{ marginTop: '20px' }}>
                {promotions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {promotions.map((p) => (
                      <div key={p.id} style={{ display: 'flex', gap: '20px', border: '1px solid var(--cgv-border)', borderRadius: '12px', padding: '16px', background: 'var(--cgv-bg)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ width: '180px', minWidth: '180px', height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <h3 style={{ fontWeight: '900', color: 'var(--cgv-dark)', fontSize: '16px', marginBottom: '8px' }}>{p.title}</h3>
                          <p style={{ fontSize: '13.5px', color: 'var(--cgv-text)', lineHeight: 1.5 }}>{p.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--cgv-text-muted)', padding: '40px', fontSize: '15px' }}>
                    Hiện tại chưa có chương trình ưu đãi nào mới.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

