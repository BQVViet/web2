import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bannerApi from '../api/bannerApi';
import '../styles/Movies.css';

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    imageUrl: '',
    targetUrl: '',
    title: '',
    isActive: true
  });

  useEffect(() => {
    if (isEdit) {
      fetchBanner();
    }
  }, [id]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const data = await bannerApi.getAll();
      const banner = data.find(b => b.id.toString() === id);
      if (banner) {
        setFormData(banner);
      } else {
        alert("Không tìm thấy banner!");
        navigate('/banners');
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await bannerApi.update(id, formData);
        alert('Cập nhật banner thành công!');
      } else {
        await bannerApi.create(formData);
        alert('Thêm banner mới thành công!');
      }
      navigate('/banners');
    } catch (error) {
      console.error("Lỗi lưu banner:", error);
      alert('Có lỗi xảy ra khi lưu banner!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="movies-page" style={{ padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        <h2 style={{ color: 'inherit', marginBottom: '30px', marginTop: 0 }}>
          {isEdit ? 'Cập nhật Banner' : 'Thêm Banner Mới'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* Cột trái: Form nhập liệu */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Tiêu đề (Tùy chọn)</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>URL Hình ảnh *</label>
              <input type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} required placeholder="Ví dụ: /images/banner1.png hoặc http..."
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Link Đích (Tùy chọn)</label>
              <input type="text" name="targetUrl" value={formData.targetUrl || ''} onChange={handleChange} placeholder="Ví dụ: /movies/1"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="isActive" style={{ color: 'var(--text-secondary)', fontSize: '15px', cursor: 'pointer', userSelect: 'none' }}>
                Hiển thị Banner này trên trang chủ
              </label>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button type="button" onClick={() => navigate('/banners')} style={{ padding: '12px 25px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}>
                Hủy
              </button>
              <button type="submit" disabled={saving} style={{ padding: '12px 30px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color) 0%, #b9150b 100%)', color: 'inherit', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </div>

          {/* Cột phải: Xem trước hình ảnh */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Xem trước Hình ảnh</label>
            <div style={{ 
              width: '100%', 
              height: '300px', 
              borderRadius: '8px', 
              border: '2px dashed var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background: 'var(--bg-surface-hover)'
            }}>
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                    e.target.nextSibling.style.display = 'none';
                  }}
                />
              ) : null}
              <div style={{ display: formData.imageUrl ? 'none' : 'block', color: formData.imageUrl ? '#ef4444' : '#9ca3af', textAlign: 'center', padding: '20px' }}>
                {formData.imageUrl ? 'Link ảnh bị lỗi hoặc không tồn tại' : 'Chưa có link ảnh'}
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
              * Gợi ý: Copy link hình ảnh trên mạng dán vào, hoặc nhập đường dẫn tương đối (VD: /images/banner.jpg). Banner sẽ hiển thị tốt nhất với tỉ lệ ngang (16:9 hoặc 21:9).
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BannerForm;
