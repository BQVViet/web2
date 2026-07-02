import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import authApi from '../api/authApi';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authApi.login({ email, password });
      
      // Check if user is an ADMIN
      if (response.role !== 'ADMIN') {
        setError('Bạn không có quyền truy cập trang quản trị này!');
        setLoading(false);
        return;
      }
      
      // Save info to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('adminUser', JSON.stringify({
        fullName: response.fullName,
        role: response.role,
        email: email
      }));
      
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Email hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo.svg" alt="Cinema Admin" style={{ height: '40px' }} />
          </div>
          <h2>Đăng nhập Hệ thống</h2>
          <p>Chào mừng bạn trở lại, vui lòng đăng nhập để tiếp tục</p>
        </div>

        {error && (
          <div className="auth-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@cinema.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xác thực...' : (
              <>
                Đăng Nhập <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Chưa có tài khoản quản trị? <Link to="/register">Đăng ký ngay</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
