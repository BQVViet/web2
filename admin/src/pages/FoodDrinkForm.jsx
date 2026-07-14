import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, Coffee } from 'lucide-react';
import foodDrinkApi from '../api/foodDrinkApi';

const getInitialFormData = () => ({
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  imageUrl: '',
  active: true
});

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-main)',
  color: 'var(--text-primary)',
  fontSize: '15px'
};

const labelStyle = {
  color: 'var(--text-secondary)',
  fontSize: '14px',
  fontWeight: '600'
};

const FoodDrinkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(getInitialFormData);

  useEffect(() => {
    if (isEdit) {
      fetchItem();
    } else {
      setFormData(getInitialFormData());
      setErrorMessage('');
    }
  }, [id, isEdit]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await foodDrinkApi.getById(id);
      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price ?? '',
          stockQuantity: data.stockQuantity ?? '',
          imageUrl: data.imageUrl || '',
          active: data.active !== false
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin combo:', error);
      alert('Không tìm thấy combo bắp nước!');
      navigate('/food-drinks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Vui lòng nhập tên combo.');
      return false;
    }

    const price = Number(formData.price);
    if (!Number.isFinite(price) || price < 0) {
      setErrorMessage('Giá bán phải là số không âm.');
      return false;
    }

    const stockQuantity = Number(formData.stockQuantity);
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setErrorMessage('Số lượng tồn phải là số nguyên không âm.');
      return false;
    }

    if (!formData.imageUrl.trim()) {
      setErrorMessage('Vui lòng nhập URL hình ảnh.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        imageUrl: formData.imageUrl.trim(),
        active: formData.active !== false
      };

      if (isEdit) {
        await foodDrinkApi.update(id, payload);
        alert('Cập nhật combo thành công!');
        navigate('/food-drinks');
      } else {
        await foodDrinkApi.create(payload);
        alert('Thêm combo mới thành công!');
        setFormData(getInitialFormData());
      }
    } catch (error) {
      console.error('Lỗi lưu combo:', error);
      alert('Có lỗi xảy ra khi lưu combo bắp nước!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="movies-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer' }}>← Quay lại</button>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{isEdit ? 'Cập nhật Combo Bắp Nước' : 'Thêm Combo Mới'}</h1>
          <p className="page-subtitle">Nhập thông tin chi tiết cho sản phẩm tại quầy</p>
        </div>
      </div>

      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {errorMessage && (
            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Tên Combo *</label>
                <div style={{ position: 'relative' }}>
                  <Coffee size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Combo Couple (2 Bắp + 2 Nước)"
                    style={{ ...inputStyle, paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Giá Bán (VNĐ) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Ví dụ: 150000"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Số lượng tồn *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Ví dụ: 20"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>URL Hình ảnh *</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: /images/combo.jpg hoặc http..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Trạng thái hiển thị</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  />
                  <span>Hiển thị combo này trên quầy bán</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Mô Tả Chi Tiết</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả về sản phẩm (Ví dụ: Bao gồm 1 bắp phô mai và 2 ly coca cỡ vừa)..."
                  rows="4"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Xem trước Hình ảnh</label>
              <div style={{
                width: '100%',
                height: '250px',
                borderRadius: '12px',
                border: '2px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'var(--bg-main)'
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
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => navigate('/food-drinks')}
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

export default FoodDrinkForm;
