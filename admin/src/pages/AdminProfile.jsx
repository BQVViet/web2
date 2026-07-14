import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Save, Shield, Key, Check, AlertCircle } from 'lucide-react';
import userApi from '../api/userApi';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [profileData, setProfileData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'ADMIN'
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setProfileData({
        id: data.id || '',
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        role: 'ADMIN'
      });
    } catch (err) {
      console.error(err);
      showToast('Không thể tải thông tin hồ sơ của bạn.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileData.fullName || !profileData.phone) {
      showToast('Vui lòng điền họ tên và số điện thoại.', 'error');
      return;
    }

    try {
      setSaving(true);
      const data = await userApi.updateProfile({
        fullName: profileData.fullName,
        phone: profileData.phone
      });
      showToast('Cập nhật thông tin hồ sơ thành công!', 'success');
      
      // Update local storage so the header displays the new name
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        const parsed = JSON.parse(adminUser);
        parsed.fullName = data.fullName;
        localStorage.setItem('adminUser', JSON.stringify(parsed));
      }
      
      // Force reload or trigger state update in header
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      showToast('Cập nhật thông tin thất bại.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('Vui lòng nhập đầy đủ các trường mật khẩu.', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Mật khẩu mới phải từ 6 ký tự trở lên.', 'error');
      return;
    }

    try {
      setSaving(true);
      await userApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      showToast('Thay đổi mật khẩu thành công!', 'success');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Đổi mật khẩu thất bại. Mật khẩu cũ không đúng.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="movies-page">
      <style>{`
        .profile-header-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8)) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 30px;
          margin-bottom: 30px;
        }
        
        .profile-avatar-wrapper {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .profile-avatar-wrapper:hover {
          transform: scale(1.05);
        }
        
        .admin-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .admin-label {
          font-size: 11px;
          font-weight: 800;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .admin-input-wrapper {
          position: relative;
        }
        
        .admin-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        
        .admin-input-field {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .admin-input-field:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15);
          background: rgba(15, 23, 42, 0.8);
        }
        
        .admin-input-field:focus + .admin-input-icon {
          color: var(--primary-color);
        }
        
        .admin-input-field:disabled {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-muted);
          border-color: rgba(255, 255, 255, 0.05);
          cursor: not-allowed;
        }
        
        .profile-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #1e293b;
          border-radius: 12px;
          padding: 16px 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          min-width: 320px;
          animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .profile-toast.success {
          border-left: 4px solid #10b981;
        }
        
        .profile-toast.error {
          border-left: 4px solid #ef4444;
        }
        
        .profile-toast-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .profile-toast.success .profile-toast-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .profile-toast.error .profile-toast-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .profile-toast-msg {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .profile-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 10px;
          border: none;
          font-weight: 800;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .profile-submit-btn.primary {
          background: linear-gradient(135deg, var(--primary-color), #ff4742);
          color: white;
          box-shadow: 0 4px 15px rgba(225, 29, 72, 0.3);
        }
        
        .profile-submit-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(225, 29, 72, 0.45);
        }
        
        .profile-submit-btn.warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
        }
        
        .profile-submit-btn.warning:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        .profile-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`profile-toast ${toast.type}`}>
          <div className="profile-toast-icon">
            {toast.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          </div>
          <div className="profile-toast-msg">{toast.message}</div>
        </div>
      )}

      {/* Profile Header Block */}
      <div className="glass-panel profile-header-card">
        {/* Animated Accent Glow */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }} />
        
        {/* Admin Avatar Badge */}
        <div className="profile-avatar-wrapper">
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), #ff4742)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '900',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(225, 29, 72, 0.3)',
            border: '3px solid rgba(255, 255, 255, 0.1)'
          }}>
            {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <span style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '16px',
            height: '16px',
            background: '#10b981',
            border: '3px solid #0f172a',
            borderRadius: '50%'
          }} title="Online" />
        </div>

        <div className="profile-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {profileData.fullName || 'Admin'}
            </h2>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
            }}>
              SUPER ADMIN
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
            Hệ thống Quản trị CGV Cinemas | Email: {profileData.email}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
          {/* Cập nhật thông tin chung */}
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '700' }}>
              <User size={20} color="var(--primary-color)" /> Thông tin tài khoản
            </h3>

            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '20px' }}>
              <div className="admin-input-group">
                <label className="admin-label">EMAIL ĐĂNG NHẬP</label>
                <div className="admin-input-wrapper">
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="admin-input-field"
                  />
                  <Mail size={16} className="admin-input-icon" />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bạn không thể thay đổi email đã đăng ký.</span>
              </div>

              <div className="admin-input-group">
                <label className="admin-label" style={{ color: 'var(--text-primary)' }}>HỌ VÀ TÊN</label>
                <div className="admin-input-wrapper">
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Nhập họ và tên"
                    className="admin-input-field"
                    required
                  />
                  <User size={16} className="admin-input-icon" />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label" style={{ color: 'var(--text-primary)' }}>SỐ ĐIỆN THOẠI</label>
                <div className="admin-input-wrapper">
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Nhập số điện thoại"
                    className="admin-input-field"
                    required
                  />
                  <Phone size={16} className="admin-input-icon" />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">VAI TRÒ HỆ THỐNG</label>
                <div className="admin-input-wrapper">
                  <input
                    type="text"
                    value="QUẢN TRỊ VIÊN (ADMIN)"
                    disabled
                    className="admin-input-field"
                    style={{ color: '#f59e0b', fontWeight: 'bold' }}
                  />
                  <Shield size={16} className="admin-input-icon" />
                </div>
              </div>

              <button
                type="submit"
                className="profile-submit-btn primary"
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT HỒ SƠ'}
              </button>
            </form>
          </div>

          {/* Đổi mật khẩu */}
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '700' }}>
              <Lock size={20} color="#F59E0B" /> Thay đổi mật khẩu
            </h3>

            <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '20px' }}>
              <div className="admin-input-group">
                <label className="admin-label" style={{ color: 'var(--text-primary)' }}>MẬT KHẨU HIỆN TẠI</label>
                <div className="admin-input-wrapper">
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="admin-input-field"
                    required
                  />
                  <Key size={16} className="admin-input-icon" />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label" style={{ color: 'var(--text-primary)' }}>MẬT KHẨU MỚI</label>
                <div className="admin-input-wrapper">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="admin-input-field"
                    required
                  />
                  <Key size={16} className="admin-input-icon" />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label" style={{ color: 'var(--text-primary)' }}>XÁC NHẬN MẬT KHẨU MỚI</label>
                <div className="admin-input-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                    className="admin-input-field"
                    required
                  />
                  <Key size={16} className="admin-input-icon" />
                </div>
              </div>

              <button
                type="submit"
                className="profile-submit-btn warning"
                disabled={saving}
              >
                <Lock size={18} /> {saving ? 'ĐANG ĐỔI...' : 'ĐỔI MẬT KHẨU'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
