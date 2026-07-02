import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import movieApi from '../api/movieApi';
import '../styles/Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Pagination & Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const GENRES = [
    'Hành động', 'Hài hước', 'Tình cảm', 'Kinh dị',
    'Khoa học viễn tưởng', 'Hoạt hình', 'Tâm lý', 'Phiêu lưu'
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

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
    const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (m.director || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (m.genre || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = filterGenre === '' || m.genre === filterGenre;
    const matchStatus = filterStatus === '' || m.status === filterStatus;
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
                  <img src={movie.posterUrl} alt={movie.title} className="card-image" />
                </div>
                <div className="card-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span>{movie.durationMinutes} phút</span>
                    {movie.genre && <span className="genre-tag">{movie.genre}</span>}
                  </div>
                  <div className="card-actions-inline">
                    <button 
                      className="action-btn-small edit"
                      onClick={() => handleEditMovie(movie)}
                    >
                      <Edit2 size={14} /> Sửa
                    </button>
                    <button 
                      className="action-btn-small delete"
                      onClick={() => handleDeleteMovie(movie.id)}
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
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} /> Prev
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
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Movies;
