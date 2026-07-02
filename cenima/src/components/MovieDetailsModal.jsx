import React from 'react';
import '../styles/MovieDetailsModal.css';

const MovieDetailsModal = ({ isOpen, onClose, movie }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay">
      <div className="details-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="details-content">
          <div className="details-poster-wrapper">
            <img src={movie.image || movie.posterUrl} alt={movie.title} className="details-poster" />
          </div>
          <div className="details-info">
            <h2 className="details-title">{movie.title}</h2>
            <div className="details-meta">
              <p><strong>Đạo diễn:</strong> {movie.director || 'Đang cập nhật'}</p>
              <p><strong>Diễn viên:</strong> {movie.cast || 'Đang cập nhật'}</p>
              <p><strong>Thể loại:</strong> {movie.genre || 'Đang cập nhật'}</p>
              <p><strong>Thời lượng:</strong> {movie.durationMinutes ? `${movie.durationMinutes} phút` : 'Đang cập nhật'}</p>
              <p><strong>Ngày khởi chiếu:</strong> {movie.releaseDate || 'Đang cập nhật'}</p>
              <p><strong>Ngôn ngữ:</strong> {movie.language || 'Đang cập nhật'}</p>
            </div>
            <div className="details-description">
              <h3>NỘI DUNG PHIM</h3>
              <p>{movie.description || 'Nội dung phim đang được cập nhật.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
