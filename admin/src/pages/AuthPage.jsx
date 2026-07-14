import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';
import authApi from '../api/authApi';
import '../styles/Auth.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
  }, [location]);

  const toggleMode = (mode) => {
    setError('');
    if (mode === 'login' && !isLogin) {
      navigate('/login');
    } else if (mode === 'register' && isLogin) {
      navigate('/register');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authApi.login({ email: loginEmail, password: loginPassword });
      if (response.role !== 'ADMIN' && response.role !== 'STAFF') {
        setError('Bạn không có quyền truy cập trang quản trị!');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', response.token);
      localStorage.setItem('adminUser', JSON.stringify({
        fullName: response.fullName,
        role: response.role,
        email: loginEmail
      }));
      navigate('/');
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (regData.password !== regData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        fullName: regData.fullName,
        email: regData.email,
        phone: regData.phone,
        password: regData.password,
        role: 'ADMIN' // Specify ADMIN role for this portal
      });
      alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      navigate('/login');
    } catch (err) {
      setError('Đăng ký thất bại. Email hoặc SĐT đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        {/* Left Side (CGV Style Banner) */}
        <div className="auth-banner">
          <div className="banner-overlay"></div>
          
          <div className="auth-toggle-container">
            <div 
              className={`toggle-tab ${isLogin ? 'active' : ''}`}
              onClick={() => toggleMode('login')}
            >
              ĐĂNG NHẬP
            </div>
            <div 
              className={`toggle-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => toggleMode('register')}
            >
              ĐĂNG KÝ
            </div>
          </div>
        </div>

        {/* Right Side (Forms) */}
        <div className="auth-form-container">
          <div className="auth-icon-top">
            <div className="icon-circle">
              <User size={32} color="white" />
            </div>
            <h2>{isLogin ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}</h2>
          </div>

          {error && <div className="error-msg">{error}</div>}

          {isLogin ? (
            <form className="auth-form-inner" onSubmit={handleLoginSubmit}>
              <div className="input-line-group">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="input-line-group">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="form-options">
                <a href="#" className="forgot-link">Quên mật khẩu?</a>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Đang tải...' : 'ĐĂNG NHẬP'}
                </button>
              </div>
            </form>
          ) : (
            <form className="auth-form-inner" onSubmit={handleRegisterSubmit}>
              <div className="input-line-group">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Họ và Tên" 
                  value={regData.fullName}
                  onChange={e => setRegData({...regData, fullName: e.target.value})}
                  required 
                />
              </div>

              <div className="input-line-group">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={regData.email}
                  onChange={e => setRegData({...regData, email: e.target.value})}
                  required 
                />
              </div>

              <div className="input-line-group">
                <Phone size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Số điện thoại" 
                  value={regData.phone}
                  onChange={e => setRegData({...regData, phone: e.target.value})}
                  required 
                />
              </div>

              <div className="input-line-group">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  value={regData.password}
                  onChange={e => setRegData({...regData, password: e.target.value})}
                  required 
                />
              </div>

              <div className="input-line-group">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Xác nhận mật khẩu" 
                  value={regData.confirmPassword}
                  onChange={e => setRegData({...regData, confirmPassword: e.target.value})}
                  required 
                />
              </div>

              <div className="form-options register-options">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Đang tải...' : 'ĐĂNG KÝ'}
                </button>
              </div>
            </form>
          )}

          {/* Social Login Footer */}
          <div className="social-login">
            <span>Hoặc đăng nhập với</span>
            <div className="social-icons">
              <button className="social-btn google">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
                Google
              </button>
              <button className="social-btn facebook">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
