import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/MovieModal.css';

const MovieModal = ({ isOpen, onClose, onSave, movie, genres = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    cast: '',
    genre: '',
    durationMinutes: '',
    releaseDate: '',
    language: '',
    description: '',
    posterUrl: '',
    trailerUrl: '',
    status: 'SẮP CHIẾU'
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        director: movie.director || '',
        cast: movie.cast || '',
        genre: movie.genre || '',
        durationMinutes: movie.durationMinutes || '',
        releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : '',
        language: movie.language || '',
        description: movie.description || '',
        posterUrl: movie.posterUrl || '',
        trailerUrl: movie.trailerUrl || '',
        status: movie.status || 'SẮP CHIẾU',
        ageRating: movie.ageRating || 'P'
      });
    } else {
      setFormData({
        title: '',
        director: '',
        cast: '',
        genre: genres.length > 0 ? genres[0] : '',
        durationMinutes: '',
        releaseDate: '',
        language: '',
        description: '',
        posterUrl: '',
        trailerUrl: '',
        status: 'SẮP CHIẾU',
        ageRating: 'P'
      });
    }
  }, [movie, isOpen, genres]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{movie ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form className="movie-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên phim</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Đạo diễn</label>
              <input type="text" name="director" value={formData.director} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Diễn viên</label>
              <input type="text" name="cast" value={formData.cast} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Thể loại</label>
              <select name="genre" value={formData.genre} onChange={handleChange} required>
                <option value="">-- Chọn thể loại --</option>
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Thời lượng (phút)</label>
              <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ngày phát hành</label>
              <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Ngôn ngữ</label>
              <input type="text" name="language" value={formData.language} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Giới hạn tuổi</label>
              <select name="ageRating" value={formData.ageRating} onChange={handleChange}>
                <option value="P">P (Mọi lứa tuổi)</option>
                <option value="K">K (Dưới 13t xem cùng cha mẹ)</option>
                <option value="13+">13+</option>
                <option value="16+">16+</option>
                <option value="18+">18+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="SẮP CHIẾU">SẮP CHIẾU</option>
                <option value="ĐANG CHIẾU">ĐANG CHIẾU</option>
                <option value="NGỪNG CHIẾU">NGỪNG CHIẾU</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 3' }}>
              <label>Link Ảnh Bìa (Poster URL)</label>
              <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Link Trailer (Youtube URL)</label>
              <input type="url" name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Nội dung phim</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Hủy</button>
            <button type="submit" className="save-btn">{movie ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieModal;
