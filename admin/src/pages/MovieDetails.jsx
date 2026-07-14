import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import '../styles/Movies.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await movieApi.getById(id);
      setMovie({
        title: data.title || '',
        director: data.director || '',
        cast: data.cast || '',
        genre: data.genre || '',
        durationMinutes: data.durationMinutes || '',
        releaseDate: data.releaseDate || '',
        language: data.language || '',
        description: data.description || '',
        posterUrl: data.posterUrl || '',
        trailerUrl: data.trailerUrl || '',
        status: data.status || 'SẮP CHIẾU',
        ageRating: data.ageRating || 'P'
      });
    } catch (error) {
      console.error('Lỗi khi tải thông tin phim:', error);
      alert('Không thể tải thông tin phim, vui lòng thử lại!');
      navigate('/movies');
    } finally {
      setLoading(false);
    }
  };

  const resolvePosterSrc = (movieData) => {
    const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect fill="#111827" width="100%" height="100%"/><text x="50%" y="50%" font-size="20" fill="#6B7280" dominant-baseline="middle" text-anchor="middle">No Image</text></svg>')}`;
    if (!movieData || !movieData.posterUrl) return { src: placeholder, isPlaceholder: true };
    const trimmed = movieData.posterUrl.trim();
    if (!/^https?:\/\//i.test(trimmed) && !/^\//.test(trimmed)) {
      return { src: `${window.location.origin}/${trimmed.replace(/^\/+/, '')}`, isPlaceholder: false };
    }
    return { src: trimmed, isPlaceholder: false };
  };

  if (loading) {
    return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;
  }

  if (!movie) {
    return null;
  }

  const poster = resolvePosterSrc(movie);

  return (
    <div className="movies-page" style={{ padding: '12px' }}>
      <div className="glass-panel" style={{ width: '100%', padding: '14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: '8px 12px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer' }}>← Quay lại</button>
            <div>
              <h2 style={{ color: 'inherit', margin: 0, fontSize: '1.15rem' }}>Chi tiết Phim</h2>
              <p style={{ margin: '3px 0 0', color: 'var(--text-muted)', fontSize: '11.5px' }}>Xem thông tin phim ở dạng form chỉ đọc</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate(`/movies/edit/${id}`)} style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--primary-color)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Sửa phim</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Tên phim</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.title}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Đạo diễn</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.director}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Dàn diễn viên</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.cast}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Thể loại</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.genre}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Thời lượng (phút)</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.durationMinutes ? `${movie.durationMinutes} phút` : ''}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Ngày phát hành</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.releaseDate}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Ngôn ngữ</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.language}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Giới hạn tuổi</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.ageRating}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Trạng thái</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>{movie.status}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>URL Ảnh Poster</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px', wordBreak: 'break-all' }}>{movie.posterUrl}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>URL Trailer Youtube</label>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px', wordBreak: 'break-all' }}>{movie.trailerUrl}</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 'bold' }}>Mô tả nội dung</label>
                <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px', lineHeight: '1.6', minHeight: '120px', whiteSpace: 'pre-wrap' }}>{movie.description}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-surface)', boxShadow: '0 10px 22px rgba(0,0,0,0.08)' }}>
              <img src={poster.src} alt={movie.title} style={{ width: '100%', minHeight: '200px', maxHeight: '450px', objectFit: 'contain', background: 'rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
