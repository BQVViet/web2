import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Coffee, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import foodDrinkApi from '../api/foodDrinkApi';

const FoodDrinkList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await foodDrinkApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bắp nước:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (item) => {
    const nextActive = !item.active;
    try {
      const updated = await foodDrinkApi.update(item.id, { ...item, active: nextActive });
      setItems(prev => prev.map(it => (it.id === item.id ? { ...it, ...updated } : it)));
      if (selectedItem?.id === item.id) {
        setSelectedItem({ ...selectedItem, ...updated });
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi đổi trạng thái hiển thị.');
    }
  };

  const handleHide = async (item) => {
    if (window.confirm('Bạn muốn ẩn combo này khỏi trang hiển thị?')) {
      try {
        const updated = await foodDrinkApi.update(item.id, { ...item, active: false });
        setItems(prev => prev.map(it => (it.id === item.id ? { ...it, ...updated } : it)));
        if (selectedItem?.id === item.id) {
          setSelectedItem({ ...selectedItem, ...updated });
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi ẩn combo.');
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

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-container">
      <div className="filters-bar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên combo hoặc mô tả..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <Link to="/food-drinks/create" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
          <Plus size={18} /> Thêm Combo Mới
        </Link>
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
              <th style={{ textAlign: 'center' }}>Trạng thái</th>
              <th style={{ textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Coffee size={48} style={{ opacity: 0.2 }} />
                    <p>Không tìm thấy món nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
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
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <label style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '44px',
                        height: '22px',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="checkbox" 
                          checked={item.active} 
                          onChange={() => handleToggleVisibility(item)}
                          style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: item.active ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.3)',
                          transition: '0.3s',
                          borderRadius: '22px',
                          border: '1px solid var(--border-color)'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '16px',
                            width: '16px',
                            left: '2px',
                            bottom: '2px',
                            backgroundColor: '#ffffff',
                            transition: '0.3s',
                            borderRadius: '50%',
                            transform: item.active ? 'translateX(22px)' : 'translateX(0)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }} />
                        </span>
                      </label>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: item.active ? '#10b981' : 'var(--text-muted)',
                        minWidth: '35px',
                        textAlign: 'left'
                      }}>
                        {item.active ? 'Hiện' : 'Ẩn'}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <Link
                        to={`/food-drinks/details/${item.id}`}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} /> Chi tiết
                      </Link>
                      <Link to={`/food-drinks/edit/${item.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        <Edit size={14} /> Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', gap: '10px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === page ? '#ffffff' : 'rgba(255,255,255,0.1)', color: currentPage === page ? '#000000' : 'white', border: 'none', cursor: 'pointer', fontWeight: currentPage === page ? 'bold' : 'normal' }}>
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDrinkList;
