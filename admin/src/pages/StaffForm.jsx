import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, User, Mail, Phone, Lock, Shield } from 'lucide-react';
import userApi from '../api/userApi';

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STAFF'
  });

  useEffect(() => {
    if (isEdit) {
      fetchStaff();
    }
  }, [id]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await userApi.getById(id);
      if (data) {
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '', // Blank by default when editing
          role: data.role || 'STAFF'
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin nhân viên:", error);
      alert("Không tìm thấy thông tin nhân viên!");
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || (!isEdit && !formData.password)) {
      setErrorMsg('Vui lòng nhập đầy đủ các trường thông tin bắt buộc (*).');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      if (isEdit) {
        const payload = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role
        };
        if (formData.password && formData.password.trim() !== '') {
          payload.password = formData.password;
        }
        await userApi.updateUser(id, payload);
        alert('Cập nhật thông tin nhân viên thành công!');
      } else {
        await userApi.createUser(formData);
        alert('Thêm nhân viên mới thành công!');
      }
      navigate('/users');
    } catch (error) {
      console.error("Lỗi lưu nhân viên:", error);
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin nhân viên.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '50px', textAlign: 'center' }}>Đang tải thông tin nhân viên...</div>;

  return (
    <div className="movies-container">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Cập nhật Nhân Viên' : 'Thêm Nhân Viên Mới'}</h1>
        <p className="page-subtitle">Điền đầy đủ thông tin bên dưới để lưu tài khoản nhân viên</p>
      </div>

      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)', color: '#f87171',
            padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
            fontSize: '14.5px', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 'bold'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Họ và tên *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ví dụ: Nguyễn Văn A"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Địa chỉ Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ví dụ: nhanvien@gmail.com"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Số điện thoại</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Ví dụ: 0987654321"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>
                Mật khẩu {isEdit ? '(Để trống nếu không muốn đổi)' : '*'}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required={!isEdit}
                  placeholder={isEdit ? "Nhập mật khẩu mới..." : "Nhập mật khẩu tài khoản..."}
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Vai trò hệ thống *</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <select 
                  name="role"
                  value={formData.role} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="STAFF">Nhân viên (STAFF)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <button 
              type="button" 
              onClick={() => navigate('/users')} 
              className="btn-secondary"
            >
              <X size={18} /> Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="btn-primary"
            >
              <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StaffForm;
