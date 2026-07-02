import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import movieApi from '../api/movieApi';
import '../styles/Movies.css';

const MovieForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', director: '', cast: '', genre: '',
    durationMinutes: '', releaseDate: '', language: '',
    description: '', posterUrl: '', trailerUrl: '',
    status: 'SẮP CHIẾU', ageRating: 'P'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await movieApi.getById(id);
      setFormData({
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
      console.error("Lỗi khi tải thông tin phim:", error);
      alert('Không thể tải thông tin phim, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await movieApi.update(id, formData);
        alert('Cập nhật phim thành công!');
      } else {
        await movieApi.create(formData);
        alert('Thêm phim mới thành công!');
      }
      navigate('/movies');
    } catch (error) {
      console.error("Lỗi lưu phim:", error);
      alert('Có lỗi xảy ra khi lưu phim!');
    }
  };

  if (loading) {
    return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;
  }

  return (
    <div className="movies-page" style={{ padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        <h2 style={{ color: 'inherit', marginBottom: '30px', marginTop: 0 }}>
          {isEdit ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Tên phim *</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Đạo diễn</label>
              <input type="text" name="director" value={formData.director || ''} onChange={handleChange} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Dàn diễn viên</label>
              <input type="text" name="cast" value={formData.cast || ''} onChange={handleChange} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Thể loại</label>
              <select name="genre" value={formData.genre || ''} onChange={handleChange} required
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }}>
                <option value="" style={{color: 'black'}}>-- Chọn thể loại --</option>
                <option value="Hành động" style={{color: 'black'}}>Hành động</option>
                <option value="Hài hước" style={{color: 'black'}}>Hài hước</option>
                <option value="Tình cảm" style={{color: 'black'}}>Tình cảm</option>
                <option value="Kinh dị" style={{color: 'black'}}>Kinh dị</option>
                <option value="Khoa học viễn tưởng" style={{color: 'black'}}>Khoa học viễn tưởng</option>
                <option value="Hoạt hình" style={{color: 'black'}}>Hoạt hình</option>
                <option value="Tâm lý" style={{color: 'black'}}>Tâm lý</option>
                <option value="Phiêu lưu" style={{color: 'black'}}>Phiêu lưu</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Thời lượng (phút)</label>
              <input type="number" name="durationMinutes" value={formData.durationMinutes || ''} onChange={handleChange} required min="1"
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Ngày phát hành</label>
              <input type="date" name="releaseDate" value={formData.releaseDate || ''} onChange={handleChange} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Ngôn ngữ</label>
              <input type="text" name="language" value={formData.language || ''} onChange={handleChange} placeholder="Tiếng Anh - Phụ đề TV"
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Giới hạn tuổi</label>
              <select name="ageRating" value={formData.ageRating || 'P'} onChange={handleChange} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }}>
                <option value="P" style={{color: 'black'}}>P (Mọi lứa tuổi)</option>
                <option value="K" style={{color: 'black'}}>K (Dưới 13t xem cùng cha mẹ)</option>
                <option value="13+" style={{color: 'black'}}>13+</option>
                <option value="16+" style={{color: 'black'}}>16+</option>
                <option value="18+" style={{color: 'black'}}>18+</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Trạng thái</label>
              <select name="status" value={formData.status || 'SẮP CHIẾU'} onChange={handleChange}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }}>
                <option value="SẮP CHIẾU" style={{color: 'black'}}>SẮP CHIẾU</option>
                <option value="ĐANG CHIẾU" style={{color: 'black'}}>ĐANG CHIẾU</option>
                <option value="NGỪNG CHIẾU" style={{color: 'black'}}>NGỪNG CHIẾU</option>
              </select>
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 3' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>URL Ảnh Poster</label>
              <input type="text" name="posterUrl" value={formData.posterUrl || ''} onChange={handleChange} placeholder="VD: /images/abc.png hoặc link http..."
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>URL Trailer Youtube</label>
              <input type="text" name="trailerUrl" value={formData.trailerUrl || ''} onChange={handleChange} 
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 'bold' }}>Mô tả nội dung</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3"
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '14px', resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={() => navigate('/movies')} style={{ padding: '12px 25px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold' }}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MovieForm;
