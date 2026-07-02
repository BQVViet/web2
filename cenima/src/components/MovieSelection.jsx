import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import '../styles/MovieSelection.css';
import movieApi from '../api/movieApi';

const fallbackMovies = [
  { id: 1, title: 'Avengers: Endgame', image: '/images/avengers_endgame.jpg', label: 'T18', youtubeId: 'TcMBFSGVi1c' },
  { id: 2, title: 'Mai', image: '/images/mai.jpg', label: 'T18', youtubeId: 'EX6clvId19s' },
  { id: 3, title: 'Toy Story 5', image: '/images/movie_poster_3_1781694624622.png', label: 'P', youtubeId: 'JcpWXaA2qeg' },
  { id: 4, title: 'Colony', image: '/images/movie_poster_4_1781694635599.png', label: 'T16', youtubeId: '8hP9D6kZseM' }
];

const MovieSelection = ({ onBuyTicket, onPlayTrailer, onViewDetails, filter = 'ALL', onFilterChange }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('ALL');
  const sliderRef = useRef(null);

  const genreTranslations = {
    'Action': 'Hành Động',
    'Adventure': 'Phiêu Lưu',
    'Sci-Fi': 'Viễn Tưởng',
    'Drama': 'Tâm Lý',
    'Romance': 'Tình Cảm',
    'Comedy': 'Hài',
    'Horror': 'Kinh Dị',
    'Thriller': 'Giật Gân',
    'Animation': 'Hoạt Hình',
    'Family': 'Gia Đình',
    'Fantasy': 'Kỳ Ảo',
    'Crime': 'Tội Phạm'
  };

  const translateGenre = (enGenre) => genreTranslations[enGenre] || enGenre;

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const getNormalizedStatus = (status) => {
    if (!status) return '';
    const s = status.toUpperCase();
    if (s === 'ĐANG CHIẾU' || s === 'DANG_CHIEU') return 'DANG_CHIEU';
    if (s === 'SẮP CHIẾU' || s === 'SAP_CHIEU') return 'SAP_CHIEU';
    if (s === 'NGỪNG CHIẾU' || s === 'NGUNG_CHIEU') return 'NGUNG_CHIEU';
    return s;
  };

  const getAgeRatingClass = (rating) => {
    if (!rating) return 'age-default';
    if (rating.includes('18')) return 'age-18';
    if (rating.includes('16')) return 'age-16';
    if (rating.includes('13') || rating === 'K') return 'age-13';
    if (rating === 'P') return 'age-p';
    return 'age-default';
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieApi.getAllMovies();
        if (data && data.length > 0) {
          const mappedMovies = data.map(m => {
            let yId = 'TcMBFSGVi1c'; // Default fallback
            if (m.trailerUrl) {
              try {
                const url = new URL(m.trailerUrl);
                yId = url.searchParams.get('v') || url.pathname.split('/').pop() || yId;
              } catch (e) {}
            } else if (m.title.toLowerCase().includes('mai')) {
              yId = 'EX6clvId19s';
            }
            return {
              ...m,
              image: m.posterUrl || '/images/movie_poster_1_1781694599129.png',
              label: m.ageRating || '', 
              youtubeId: yId 
            };
          });
          setMovies(mappedMovies);
        } else {
          setMovies(fallbackMovies);
        }
      } catch (error) {
        console.error("Failed to fetch movies from API: ", error);
        setMovies(fallbackMovies);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  if (loading) {
    return <div className="movie-selection container"><h2 style={{textAlign: 'center', padding: '50px'}}>Đang tải phim...</h2></div>;
  }

  // Extract unique genres for the dropdown
  const allGenres = [...new Set(movies.flatMap(m => (m.genre || '').split(',').map(g => g.trim())).filter(Boolean))];

  const displayMovies = movies.filter(m => {
    const normalizedStatus = getNormalizedStatus(m.status);
    const matchStatus = filter === 'ALL' || normalizedStatus === filter;
    const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = genreFilter === 'ALL' || (m.genre && m.genre.includes(genreFilter));
    return matchStatus && matchSearch && matchGenre;
  });

  return (
    <div className="movie-selection container">
      {filter !== 'ALL' && (
        <div className="breadcrumb" style={{ padding: '20px 0', fontSize: '14px', color: '#666' }}>
          <span style={{cursor: 'pointer'}} onClick={() => onFilterChange('ALL')}>🏠 Trang chủ</span> &gt; 
          <span style={{cursor: 'pointer'}} onClick={() => onFilterChange('ALL')}> Phim</span> &gt; 
          <span style={{color: '#222', fontWeight: 'bold'}}> {filter === 'DANG_CHIEU' ? 'Phim Đang Chiếu' : 'Phim Sắp Chiếu'}</span>
        </div>
      )}

      {filter === 'ALL' ? (
        <div className="section-title">
          <h2>LỰA CHỌN PHIM</h2>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #222', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '300', margin: 0, paddingBottom: '15px', color: '#222' }}>
            {filter === 'DANG_CHIEU' ? 'Phim Đang Chiếu' : 'Phim Sắp Chiếu'}
          </h1>
          <div 
            onClick={() => onFilterChange(filter === 'DANG_CHIEU' ? 'SAP_CHIEU' : 'DANG_CHIEU')}
            style={{ fontSize: '18px', color: '#666', cursor: 'pointer', paddingBottom: '15px', textTransform: 'uppercase' }}
          >
            {filter === 'DANG_CHIEU' ? 'PHIM SẮP CHIẾU' : 'PHIM ĐANG CHIẾU'}
          </div>
        </div>
      )}

      {/* Search & Filter Bar (Only on specific pages, not main page) */}
      {filter !== 'ALL' && (
        <div className="search-filter-bar" style={{ display: 'flex', gap: '15px', marginBottom: '30px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm tên phim..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '25px', border: '1px solid #ccc', width: '250px', outline: 'none' }}
          />
          <select 
            value={genreFilter} 
            onChange={(e) => setGenreFilter(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
          >
            <option value="ALL">Tất cả thể loại</option>
            {allGenres.map(g => (
              <option key={g} value={g}>{translateGenre(g)}</option>
            ))}
          </select>
        </div>
      )}
      
      {filter === 'ALL' ? (
        <div className="slider-wrapper">
          {displayMovies.length > 4 && (
            <button className="slider-btn prev" onClick={scrollLeft}>&lt;</button>
          )}
          <div className="movie-grid slider-mode" ref={sliderRef}>
            {displayMovies.length > 0 ? displayMovies.map(movie => (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster">
                  {movie.label && movie.label.trim() !== '' && (
                    <span className={`age-label ${getAgeRatingClass(movie.label)}`}>{movie.label}</span>
                  )}
                  <img src={movie.image} alt={movie.title} />
                  
                  <div className="play-button-overlay">
                    <div className="play-icon" onClick={() => onPlayTrailer(movie.youtubeId)}>
                      <Play fill="currentColor" />
                    </div>
                  </div>

                  <div className="movie-overlay">
                    <button className="btn-buy btn-detail" onClick={() => onViewDetails && onViewDetails(movie)}>XEM CHI TIẾT</button>
                    <button className="btn-buy" onClick={() => onBuyTicket(movie.title)}>MUA VÉ</button>
                  </div>
                </div>
                <h3 className="movie-title">{movie.title}</h3>
              </div>
            )) : (
              <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: 'var(--cgv-text-muted)' }}>Không tìm thấy phim phù hợp.</h3>
              </div>
            )}
          </div>
          {displayMovies.length > 4 && (
            <button className="slider-btn next" onClick={scrollRight}>&gt;</button>
          )}
        </div>
      ) : (
        <div className="movie-grid">
          {displayMovies.length > 0 ? displayMovies.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster">
                {movie.label && movie.label.trim() !== '' && (
                  <span className={`age-label ${getAgeRatingClass(movie.label)}`}>{movie.label}</span>
                )}
                <img src={movie.image} alt={movie.title} />
                
                <div className="play-button-overlay">
                  <div className="play-icon" onClick={() => onPlayTrailer(movie.youtubeId)}>
                    <Play fill="currentColor" />
                  </div>
                </div>

                <div className="movie-overlay">
                  <button className="btn-buy btn-detail" onClick={() => onViewDetails && onViewDetails(movie)}>XEM CHI TIẾT</button>
                  <button className="btn-buy" onClick={() => onBuyTicket(movie.title)}>MUA VÉ</button>
                </div>
              </div>
              <h3 className="movie-title">{movie.title}</h3>
            </div>
          )) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <h3 style={{ color: 'var(--cgv-text-muted)' }}>Không tìm thấy phim phù hợp.</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieSelection;
