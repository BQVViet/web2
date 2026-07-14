import React, { useState } from 'react';
import '../styles/AuthModal.css';
import authApi from '../api/authApi';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  if (!isOpen) return null;

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin === 'forgot') {
        const res = await authApi.forgotPassword(email);
        showToast(res.message || 'Mật khẩu mới đã được gửi về Gmail của bạn!', 'success');
        setTimeout(() => {
          setIsLogin(true); // Quay lại trang đăng nhập sau khi thông báo hiện
        }, 1500);
      } else if (isLogin) {
        const res = await authApi.login({ email, password });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify({ fullName: res.fullName, role: res.role }));
          onLoginSuccess(res.fullName);
        }
      } else {
        if (password !== confirmPassword) {
          showToast('Mật khẩu xác nhận không khớp!', 'error');
          setLoading(false);
          return;
        }
        const res = await authApi.register({ fullName, email, phone, password });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify({ fullName: res.fullName, role: res.role }));
          onLoginSuccess(res.fullName);
        }
      }
    } catch (error) {
      console.error("Auth failed:", error);
      if (isLogin === 'forgot') {
        showToast(error.response?.data?.message || 'Không thể khôi phục mật khẩu. Vui lòng kiểm tra lại email.', 'error');
      } else {
        showToast(error.response?.data?.message || (isLogin ? 'Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.' : 'Đăng ký thất bại. Email có thể đã tồn tại.'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          <div className="toast-icon">
            {notification.type === 'success' ? '✓' : '✕'}
          </div>
          <div className="toast-message">{notification.message}</div>
        </div>
      )}
      <div className="modal-overlay">
        <div className="auth-modal">
          <button className="close-btn" onClick={onClose}>×</button>
          
          {isLogin === 'forgot' ? (
            <>
              <div className="auth-header">
                <h2 className="active">QUÊN MẬT KHẨU</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div style={{ marginBottom: '15px', color: '#888', fontSize: '13.5px', textAlign: 'center', lineHeight: '1.5' }}>
                  Vui lòng nhập Email đã đăng ký. Hệ thống sẽ sinh mật khẩu mới và gửi về Gmail của bạn.
                </div>
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginBottom: '15px' }}
                />
                
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'ĐANG XỬ LÝ...' : 'GỬI MẬT KHẨU MỚI'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <span 
                    onClick={() => setIsLogin(true)} 
                    style={{ fontSize: '14px', color: '#E71A0F', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Quay lại đăng nhập
                  </span>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="auth-header">
                <h2 className={isLogin === true ? 'active' : ''} onClick={() => setIsLogin(true)}>ĐĂNG NHẬP</h2>
                <h2 className={isLogin === false ? 'active' : ''} onClick={() => setIsLogin(false)}>ĐĂNG KÝ</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="auth-form">
                {isLogin === false && (
                  <>
                    <input type="text" placeholder="Họ và tên" required value={fullName} onChange={e => setFullName(e.target.value)} />
                    <input type="tel" placeholder="Số điện thoại" required value={phone} onChange={e => setPhone(e.target.value)} />
                  </>
                )}
                <input 
                  type="text" 
                  placeholder={isLogin === true ? "Email hoặc Số điện thoại" : "Email"} 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isLogin === false && (
                  <input 
                    type="password" 
                    placeholder="Xác nhận mật khẩu" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                )}
                
                {isLogin === true && (
                  <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '15px' }}>
                    <span 
                      onClick={() => setIsLogin('forgot')} 
                      style={{ fontSize: '13px', color: '#E71A0F', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Quên mật khẩu?
                    </span>
                  </div>
                )}
                
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'ĐANG XỬ LÝ...' : (isLogin === true ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
