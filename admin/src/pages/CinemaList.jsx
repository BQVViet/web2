import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, MapPin, Phone } from 'lucide-react';
import cinemaApi from '../api/cinemaApi';

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const data = await cinemaApi.getAll();
      setCinemas(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách rạp phim:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa rạp phim này không? Các phòng chiếu và suất chiếu thuộc rạp này cũng có thể bị ảnh hưởng!')) {
      try {
        await cinemaApi.delete(id);
        setCinemas(cinemas.filter(c => c.id !== id));
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa rạp phim.");
      }
    }
  };

  const filteredCinemas = cinemas.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movies-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Quản lý Rạp Phim</h1>
          <p className="page-subtitle">Danh sách các cụm rạp trên toàn quốc</p>
        </div>
        <Link to="/cinemas/create" className="btn-primary">
          <Plus size={18} /> Thêm Rạp Mới
        </Link>
      </div>

      <div className="filters-bar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên rạp hoặc địa chỉ..." 
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
              <th>Tên Rạp</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredCinemas.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Không tìm thấy rạp phim nào
                </td>
              </tr>
            ) : (
              filteredCinemas.map((cinema) => (
                <tr key={cinema.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>#{cinema.id}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{cinema.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} /> {cinema.address}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {cinema.phone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} /> {cinema.phone}
                      </div>
                    ) : 'Không có'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link to={`/cinemas/edit/${cinema.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        <Edit size={14} /> Sửa
                      </Link>
                      <button 
                        onClick={() => handleDelete(cinema.id)}
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

export default CinemaList;
