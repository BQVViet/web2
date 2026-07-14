import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Coffee, Edit, ArrowLeft, Eye, EyeOff, Archive } from 'lucide-react';
import foodDrinkApi from '../api/foodDrinkApi';

const FoodDrinkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await foodDrinkApi.getById(id);
      if (data) {
        setItem(data);
      } else {
        alert('Không tìm thấy combo bắp nước!');
        navigate('/food-drinks');
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin combo:', error);
      alert('Không thể tải thông tin combo.');
      navigate('/food-drinks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!item) return;
    const nextActive = !item.active;
    try {
      const updated = await foodDrinkApi.update(item.id, { ...item, active: nextActive });
      setItem(prev => ({ ...prev, ...updated }));
    } catch (error) {
      alert('Có lỗi xảy ra khi đổi trạng thái hiển thị.');
    }
  };

  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-primary)', padding: '100px', textAlign: 'center', fontSize: '16px' }}>
        Đang tải thông tin combo...
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="movies-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/food-drinks')} 
          className="btn-secondary"
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Chi tiết Combo Bắp Nước</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Xem chi tiết sản phẩm và quản lý trạng thái tại quầy</p>
        </div>
      </div>

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {/* Left Column: Image Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', minHeight: '300px' }}>
          <div style={{
            width: '100%',
            maxWidth: '300px',
            height: '300px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{ display: item.imageUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Coffee size={80} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </div>

        {/* Right Column: Information Sheet */}
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              color: 'var(--primary-color)', 
              background: 'rgba(229, 9, 20, 0.1)', 
              padding: '4px 8px', 
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Combo #{item.id}
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '12px 0 6px 0', color: 'var(--text-primary)' }}>
              {item.name}
            </h2>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />

          <div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mô tả combo</h4>
            <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {item.description || 'Không có mô tả chi tiết cho combo này.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Giá bán</h4>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                {formatCurrency(item.price)}
              </span>
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tồn kho thực tế</h4>
              <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Archive size={18} style={{ color: 'var(--text-muted)' }} /> {item.stockQuantity ?? 0}
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trạng thái bán</h4>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: item.active ? '#10b981' : 'var(--text-muted)' }}>
                {item.active ? 'Đang mở bán trên hệ thống CGV' : 'Đang tạm ẩn'}
              </span>
              <button 
                onClick={handleToggleVisibility}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {item.active ? <EyeOff size={14} /> : <Eye size={14} />} {item.active ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <Link 
              to={`/food-drinks/edit/${item.id}`} 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: 'fit-content' }}
            >
              <Edit size={16} /> Chỉnh sửa thông tin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDrinkDetails;
