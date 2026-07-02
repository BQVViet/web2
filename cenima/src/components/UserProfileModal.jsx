import React, { useState, useEffect } from 'react';
import { X, User, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/UserProfileModal.css';
import authApi from '../api/authApi';

const UserProfileModal = ({ isOpen, onClose, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
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
    if (isOpen) {
      loadProfile();
      setActiveTab('profile');
      setError('');
      setSuccess('');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getProfile();
      setProfileData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone
      });
    } catch (err) {
      setError('Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        
        <div className="profile-header">
          <h2>TÀI KHOẢN CGV</h2>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
          >
            <User size={18} /> THÔNG TIN CÁ NHÂN
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
          >
            <Lock size={18} /> ĐỔI MẬT KHẨU
          </button>
        </div>

        <div className="profile-content">
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
              <button type="submit" className="save-btn"><Save size={18} /> LƯU THAY ĐỔI</button>
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
              <button type="submit" className="save-btn"><Save size={18} /> CẬP NHẬT MẬT KHẨU</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
