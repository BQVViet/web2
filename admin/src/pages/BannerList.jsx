import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bannerApi from '../api/bannerApi';
import '../styles/Movies.css';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerApi.getAll();
      setBanners(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (banner) => {
    const nextActive = !banner.isActive;
    try {
      const updated = await bannerApi.update(banner.id, { ...banner, isActive: nextActive });
      setBanners(prev => prev.map(b => (b.id === banner.id ? { ...b, ...updated } : b)));
    } catch (error) {
      alert('Có lỗi xảy ra khi đổi trạng thái hiển thị banner.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này không?')) {
      try {
        await bannerApi.delete(id);
        setBanners(banners.filter(b => b.id !== id));
        
        const newFiltered = banners.filter(b => b.id !== id && (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
        if (newFiltered.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa banner.");
      }
    }
  };

  const filteredBanners = banners.filter(b => 
    (b.title || b.imageUrl).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const currentBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-page">
      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'inherit' }}>Danh sách Banner</h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm banner..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)', color: 'inherit', outline: 'none', width: '250px'
              }}
            />
          </div>
          
          <button 
            className="btn-primary" 
            onClick={() => navigate('/banners/create')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Thêm Banner
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'inherit' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="glass-panel" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '15px' }}>ID</th>
                  <th style={{ padding: '15px' }}>Hình Ảnh</th>
                  <th style={{ padding: '15px' }}>Tiêu đề</th>
                  <th style={{ padding: '15px' }}>Link URL</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentBanners.map((banner) => (
                  <tr key={banner.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px' }}>#{banner.id}</td>
                    <td style={{ padding: '15px' }}>
                      <img src={banner.imageUrl} alt="Banner" style={{ width: '120px', height: '60px', objectFit: 'contain', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                    </td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{banner.title || 'Không có'}</td>
                    <td style={{ padding: '15px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {banner.targetUrl || 'Trống'}
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
                            checked={banner.isActive !== false} 
                            onChange={() => handleToggleActive(banner)}
                            style={{ opacity: 0, width: 0, height: 0 }} 
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: banner.isActive !== false ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.3)',
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
                              transform: banner.isActive !== false ? 'translateX(22px)' : 'translateX(0)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </span>
                        </label>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          color: banner.isActive !== false ? '#10b981' : 'var(--text-muted)',
                          minWidth: '35px',
                          textAlign: 'left'
                        }}>
                          {banner.isActive !== false ? 'Hiện' : 'Ẩn'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <button 
                        onClick={() => navigate(`/banners/details/${banner.id}`)}
                        style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '5px', marginRight: '10px' }}
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/banners/edit/${banner.id}`)}
                        style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: '5px', marginRight: '10px' }}
                        title="Chỉnh sửa banner"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                        title="Xóa banner"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentBanners.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không tìm thấy banner nào.
                    </td>
                  </tr>
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
        </>
      )}
    </div>
  );
};

export default BannerList;
