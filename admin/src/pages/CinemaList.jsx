import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import cinemaApi from '../api/cinemaApi';

const CinemaList = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getCity = (address) => {
    const addr = (address || '').toLowerCase();
    if (addr.includes('hồ chí minh') || addr.includes('tp.hcm') || addr.includes('hcm') || addr.includes('sài gòn')) return 'HCM';
    if (addr.includes('hà nội') || addr.includes('hn')) return 'HN';
    if (addr.includes('đà nẵng') || addr.includes('dn')) return 'DN';
    if (addr.includes('cần thơ') || addr.includes('ct')) return 'CT';
    return 'OTHER';
  };

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
        
        const newFiltered = cinemas.filter(c => c.id !== id && ((c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.address || '').toLowerCase().includes(searchTerm.toLowerCase())));
        if (newFiltered.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa rạp phim.");
      }
    }
  };

  const filteredCinemas = cinemas.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === 'ALL' || getCity(c.address) === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  const totalPages = Math.ceil(filteredCinemas.length / itemsPerPage);
  const currentCinemas = filteredCinemas.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/cinemas/create" className="btn-primary">
          <Plus size={18} /> Thêm Rạp Mới
        </Link>
      </div>

      <div className="filters-bar glass-panel" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên rạp hoặc địa chỉ..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-main)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            outline: 'none',
            fontSize: '14px',
            minWidth: '180px'
          }}
        >
          <option value="ALL">Tất cả thành phố</option>
          <option value="HCM">TP. Hồ Chí Minh</option>
          <option value="HN">Hà Nội</option>
          <option value="DN">Đà Nẵng</option>
          <option value="CT">Cần Thơ</option>
          <option value="OTHER">Thành phố khác</option>
        </select>
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
            ) : currentCinemas.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Không tìm thấy rạp phim nào
                </td>
              </tr>
            ) : (
              currentCinemas.map((cinema) => (
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

export default CinemaList;
