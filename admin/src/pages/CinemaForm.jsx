import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Building2 } from 'lucide-react';
import cinemaApi from '../api/cinemaApi';

const CinemaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchCinema();
    }
  }, [id]);

  const fetchCinema = async () => {
    try {
      setLoading(true);
      const data = await cinemaApi.getById(id);
      if (data) {
        setFormData({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin rạp:", error);
      alert("Không tìm thấy rạp phim!");
      navigate('/cinemas');
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
    setSaving(true);
    try {
      if (isEdit) {
        await cinemaApi.update(id, formData);
        alert('Cập nhật rạp phim thành công!');
      } else {
        await cinemaApi.create(formData);
        alert('Thêm rạp phim mới thành công!');
      }
      navigate('/cinemas');
    } catch (error) {
      console.error("Lỗi lưu rạp phim:", error);
      alert('Có lỗi xảy ra khi lưu rạp phim!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="movies-container">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Cập nhật Rạp Phim' : 'Thêm Rạp Phim Mới'}</h1>
        <p className="page-subtitle">Điền đầy đủ thông tin bên dưới để lưu rạp</p>
      </div>

      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Tên Rạp chiếu *</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ví dụ: CGV Vincom Bà Triệu"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Địa chỉ *</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                placeholder="Địa chỉ cụ thể của rạp..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>Số điện thoại liên hệ</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Ví dụ: 1900 1522"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '15px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <button 
              type="button" 
              onClick={() => navigate('/cinemas')} 
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

export default CinemaForm;
