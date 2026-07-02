import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Coffee, Tag } from 'lucide-react';
import foodDrinkApi from '../api/foodDrinkApi';

const FoodDrinkList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await foodDrinkApi.getAll();
      setItems(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bắp nước:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa combo này không?')) {
      try {
        await foodDrinkApi.delete(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa.");
      }
    }
  };

  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const filteredItems = items.filter(item => 
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movies-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Quản lý Bắp Nước</h1>
          <p className="page-subtitle">Danh sách các combo đồ ăn, thức uống tại quầy</p>
        </div>
        <Link to="/food-drinks/create" className="btn-primary">
          <Plus size={18} /> Thêm Combo Mới
        </Link>
      </div>

      <div className="filters-bar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên combo hoặc mô tả..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container glass-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Hình ảnh</th>
              <th>Tên món</th>
              <th>Mô tả</th>
              <th>Giá bán</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Coffee size={48} style={{ opacity: 0.2 }} />
                    <p>Không tìm thấy món nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>#{item.id}</td>
                  <td style={{ textAlign: 'center' }}>
                    {item.imageUrl ? (
                      <div style={{ 
                        width: '60px', height: '60px', margin: '0 auto',
                        borderRadius: '8px', overflow: 'hidden', 
                        background: 'var(--bg-surface-hover)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <Coffee size={24} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        width: '60px', height: '60px', margin: '0 auto',
                        borderRadius: '8px', background: 'var(--bg-surface-hover)',
                        border: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                      }}>
                        <Coffee size={24} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                      {item.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {item.description || 'Không có mô tả'}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <Link to={`/food-drinks/edit/${item.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        <Edit size={14} /> Sửa
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodDrinkList;
