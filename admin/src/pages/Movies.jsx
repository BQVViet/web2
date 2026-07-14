import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import movieApi from '../api/movieApi';
import '../styles/Movies.css';
import MovieDetailsModal from '../components/MovieDetailsModal';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Pagination & Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [detailMovie, setDetailMovie] = useState(null);

  const GENRES = [
    'Hành động', 'Hài hước', 'Tình cảm', 'Kinh dị',
    'Khoa học viễn tưởng', 'Hoạt hình', 'Tâm lý', 'Phiêu lưu'
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const resolvePosterSrc = (movie) => {
    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect fill="#111827" width="100%" height="100%"/><text x="50%" y="50%" font-size="20" fill="#6B7280" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>')}`;
    if (!movie || !movie.posterUrl) return { src: placeholder, isPlaceholder: true };
    const trimmed = movie.posterUrl.trim();
    let src;
    if (!/^https?:\/\//i.test(trimmed) && !/^\//.test(trimmed)) {
      src = `${window.location.origin}/${trimmed.replace(/^\/+/, '')}`;
    } else {
      src = trimmed;
    }
    return { src, isPlaceholder: false };
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await movieApi.getAll();
      setMovies(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    navigate('/movies/create');
  };

  const handleEditMovie = (movie) => {
    navigate(`/movies/edit/${movie.id}`);
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này không?')) {
      try {
        await movieApi.delete(id);
        setMovies(movies.filter(m => m.id !== id));
        
        const newFiltered = movies.filter(m => m.id !== id && m.title.toLowerCase().includes(searchTerm.toLowerCase()));
        if (newFiltered.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa phim.");
      }
    }
  };

  const filteredMovies = movies.filter(m => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (m.title || '').toLowerCase().includes(q) ||
                        (m.director || '').toLowerCase().includes(q) ||
                        (m.genre || '').toLowerCase().includes(q);

    const normalizeStatus = (s) => {
      if (!s) return '';
      const x = s.toString().toUpperCase();
      if (x.includes('DANG') || x.includes('ĐANG') || x.includes('DANG_CHIEU') || x.includes('DANG-CHIEU')) return 'DANG_CHIEU';
      if (x.includes('SAP') || x.includes('SẮP') || x.includes('SAP_CHIEU') || x.includes('SAP-CHIEU')) return 'SAP_CHIEU';
      if (x.includes('NGUNG') || x.includes('NGỪNG') || x.includes('NGUNG_CHIEU') || x.includes('NGUNG-CHIEU')) return 'NGUNG_CHIEU';
      return x.replace(/[^A-Z0-9]/g, '');
    };

    const matchGenre = filterGenre === '' || (m.genre && m.genre.toLowerCase().includes(filterGenre.toLowerCase()));
    const matchStatus = filterStatus === '' || (normalizeStatus(m.status) === normalizeStatus(filterStatus));

    return matchSearch && matchGenre && matchStatus;
  });
  
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const currentMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-page">
      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, color: 'inherit' }}>Danh sách Phim</h2>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Lọc theo Thể loại */}
          <select 
            value={filterGenre} 
            onChange={(e) => { setFilterGenre(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none' }}
          >
            <option value="" style={{color: 'black'}}>Tất cả Thể loại</option>
            {GENRES.map(g => <option key={g} value={g} style={{color: 'black'}}>{g}</option>)}
          </select>

          {/* Lọc theo Trạng thái */}
          <select 
            value={filterStatus} 
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none' }}
          >
            <option value="" style={{color: 'black'}}>Tất cả Trạng thái</option>
            <option value="SẮP CHIẾU" style={{color: 'black'}}>SẮP CHIẾU</option>
            <option value="ĐANG CHIẾU" style={{color: 'black'}}>ĐANG CHIẾU</option>
            <option value="NGỪNG CHIẾU" style={{color: 'black'}}>NGỪNG CHIẾU</option>
          </select>

          {/* Tìm kiếm */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)', color: 'inherit', outline: 'none', width: '220px'
              }}
            />
          </div>
          
          <button 
            onClick={handleAddMovie}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px', 
              background: 'linear-gradient(135deg, var(--primary-color) 0%, #b9150b 100%)', 
              color: 'inherit', border: 'none', cursor: 'pointer', fontWeight: 'bold' 
            }}
          >
            <Plus size={18} /> Thêm Phim
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'inherit' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="movies-grid" style={{ marginTop: '20px' }}>
            {currentMovies.map((movie) => (
              <div key={movie.id} className="movie-card glass-panel" style={{ padding: 0 }}>
                <div className="card-image-container">
                  {/* clicking the image opens details */}
                  <div onClick={() => navigate(`/movies/details/${movie.id}`)} style={{ position: 'absolute', inset: 0, zIndex: 5, cursor: 'pointer' }} />
                  <div className="card-badges">
                    <div className="left-badges">
                      <span className="quality-badge new">HD</span>
                      {movie.ageRating && (
                        <span className={`age-badge age-${movie.ageRating.toLowerCase().replace('+', '')}`}>
                          {movie.ageRating}
                        </span>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const res = resolvePosterSrc(movie);
                    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect fill="#111827" width="100%" height="100%"/><text x="50%" y="50%" font-size="20" fill="#6B7280" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>')}`;
                    return (
                      <>
                        <img
                          src={res.src}
                          alt={movie.title}
                          className="card-image"
                          onError={(e) => { console.warn('Poster failed to load:', movie.id, res.src); if (e && e.target) e.target.src = placeholder; }}
                        />
                        <div className="poster-url" title={res.src}>
                          {res.isPlaceholder ? 'No image' : res.src.replace(window.location.origin, '')}
                        </div>
                      </>
                    );
                  })()}
                </div>
                    <div className="card-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  {movie.director && <div className="movie-director">Đạo diễn: {movie.director}</div>}
                  <div className="movie-meta">
                    <span>{movie.durationMinutes ? `${movie.durationMinutes} phút` : '—'}</span>
                    {movie.genre ? <span className="genre-tag">{movie.genre}</span> : <span className="genre-tag">Không rõ</span>}
                  </div>
                  <div className="card-actions-inline">
                    <button 
                      className="action-btn-small edit"
                      onClick={(e) => { e.stopPropagation(); handleEditMovie(movie); }}
                    >
                      <Edit2 size={14} /> Sửa
                    </button>
                    <button 
                      className="action-btn-small delete"
                      onClick={(e) => { e.stopPropagation(); handleDeleteMovie(movie.id); }}
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
              {currentMovies.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                Không tìm thấy phim nào.
              </div>
            )}
          </div>
          
          {totalPages > 0 && (
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

export default Movies;
