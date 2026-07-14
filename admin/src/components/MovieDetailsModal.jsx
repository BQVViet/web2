import React from 'react';
import '../styles/MovieDetailsModal.css';

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="mdm-overlay">
      <aside className="mdm-drawer" role="dialog" aria-label={`Chi tiết ${movie.title}`}>
        <div className="mdm-drawer-header">
          <button className="mdm-back" onClick={onClose}>← Quay lại</button>
          <div>
            <h3 className="mdm-title">Chi tiết phim</h3>
            <p className="mdm-subtitle">{movie.title}</p>
          </div>
        </div>
        <div className="mdm-drawer-body">
          <div className="mdm-thumb">
            <img src={movie.posterUrl || ''} alt={movie.title} onError={(e) => { e.target.src = ''; }} />
          </div>
          <div className="mdm-form">
            <div className="mdm-field">
              <label>Đạo diễn</label>
              <input type="text" value={movie.director || ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Dàn diễn viên</label>
              <input type="text" value={movie.cast || ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Thể loại</label>
              <input type="text" value={movie.genre || ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Thời lượng (phút)</label>
              <input type="text" value={movie.durationMinutes ? `${movie.durationMinutes} phút` : ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Ngày phát hành</label>
              <input type="text" value={movie.releaseDate || ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Ngôn ngữ</label>
              <input type="text" value={movie.language || ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Giới hạn tuổi</label>
              <input type="text" value={movie.ageRating || ''} readOnly />
            </div>
            <div className="mdm-field">
              <label>Trạng thái</label>
              <input type="text" value={movie.status || ''} readOnly />
            </div>
            <div className="mdm-field mdm-textarea">
              <label>Mô tả</label>
              <textarea value={movie.description || ''} readOnly />
            </div>
            {movie.trailerUrl && (
              <div className="mdm-field mdm-full-width">
                <label>Trailer</label>
                <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className="mdm-link">Mở trailer</a>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MovieDetailsModal;
