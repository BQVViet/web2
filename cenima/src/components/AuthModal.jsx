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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login({ email, password });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify({ fullName: res.fullName, role: res.role }));
          onLoginSuccess(res.fullName);
        }
      } else {
        if (password !== confirmPassword) {
          alert('Mật khẩu xác nhận không khớp!');
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
      alert(isLogin ? 'Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu.' : 'Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="auth-header">
          <h2 className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>ĐĂNG NHẬP</h2>
          <h2 className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>ĐĂNG KÝ</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <input type="text" placeholder="Họ và tên" required value={fullName} onChange={e => setFullName(e.target.value)} />
              <input type="tel" placeholder="Số điện thoại" required value={phone} onChange={e => setPhone(e.target.value)} />
            </>
          )}
          <input 
            type="text" 
            placeholder={isLogin ? "Email hoặc Số điện thoại" : "Email"} 
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
          {!isLogin && (
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'ĐANG XỬ LÝ...' : (isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
