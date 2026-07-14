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

  const [previewSrc, setPreviewSrc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    // prefer selectedFile preview, otherwise use posterUrl
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewSrc(url);
      return () => URL.revokeObjectURL(url);
    }
    if (formData.posterUrl) {
      setPreviewSrc(formData.posterUrl);
    } else {
      setPreviewSrc('');
    }
  }, [formData.posterUrl, selectedFile]);

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

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // do not overwrite posterUrl until user submits; preview only
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    // if there was a temporary object URL it will be revoked by effect cleanup
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
    <div className="movies-page" style={{ padding: '12px' }}>
      <div className="glass-panel" style={{ width: '100%', padding: '14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: '8px 12px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer' }}>← Quay lại</button>
            <div>
              <h2 style={{ color: 'inherit', margin: 0, fontSize: '1.2rem' }}>{isEdit ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới'}</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>{isEdit ? 'Chỉnh sửa thông tin phim' : 'Nhập thông tin phim mới'}</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/movies')} style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer', fontSize: '14px' }}>Về danh sách</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.65fr 0.95fr', gap: '10px', fontSize: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Tên phim *</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Đạo diễn</label>
              <input type="text" name="director" value={formData.director || ''} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Dàn diễn viên</label>
              <input type="text" name="cast" value={formData.cast || ''} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Thể loại</label>
              <select name="genre" value={formData.genre || ''} onChange={handleChange} required style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>
                <option value="" style={{ color: 'black' }}>-- Chọn thể loại --</option>
                <option value="Hành động" style={{ color: 'black' }}>Hành động</option>
                <option value="Hài hước" style={{ color: 'black' }}>Hài hước</option>
                <option value="Tình cảm" style={{ color: 'black' }}>Tình cảm</option>
                <option value="Kinh dị" style={{ color: 'black' }}>Kinh dị</option>
                <option value="Khoa học viễn tưởng" style={{ color: 'black' }}>Khoa học viễn tưởng</option>
                <option value="Hoạt hình" style={{ color: 'black' }}>Hoạt hình</option>
                <option value="Tâm lý" style={{ color: 'black' }}>Tâm lý</option>
                <option value="Phiêu lưu" style={{ color: 'black' }}>Phiêu lưu</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Thời lượng (phút)</label>
              <input type="number" name="durationMinutes" value={formData.durationMinutes || ''} onChange={handleChange} min="1" style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Ngày phát hành</label>
              <input type="date" name="releaseDate" value={formData.releaseDate || ''} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Ngôn ngữ</label>
              <input type="text" name="language" value={formData.language || ''} onChange={handleChange} placeholder="Tiếng Việt" style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Giới hạn tuổi</label>
              <select name="ageRating" value={formData.ageRating || 'P'} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>
                <option value="P" style={{ color: 'black' }}>P</option>
                <option value="K" style={{ color: 'black' }}>K</option>
                <option value="13+" style={{ color: 'black' }}>13+</option>
                <option value="16+" style={{ color: 'black' }}>16+</option>
                <option value="18+" style={{ color: 'black' }}>18+</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Trạng thái</label>
              <select name="status" value={formData.status || 'SẮP CHIẾU'} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }}>
                <option value="SẮP CHIẾU" style={{ color: 'black' }}>SẮP CHIẾU</option>
                <option value="ĐANG CHIẾU" style={{ color: 'black' }}>ĐANG CHIẾU</option>
                <option value="NGỪNG CHIẾU" style={{ color: 'black' }}>NGỪNG CHIẾU</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>URL Trailer Youtube</label>
              <input type="text" name="trailerUrl" value={formData.trailerUrl || ''} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>URL Ảnh Poster</label>
              <input type="text" name="posterUrl" value={formData.posterUrl || ''} onChange={(e) => { handleChange(e); setSelectedFile(null); }} placeholder="VD: /images/abc.png hoặc link http..." style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', gridColumn: '1 / -1' }}>
              <input id="posterFile" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <label htmlFor="posterFile" style={{ cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-color)', color: 'inherit' }}>Chọn file</label>
              <button type="button" onClick={() => setPreviewSrc(formData.posterUrl || '')} style={{ padding: '10px 14px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer' }}>Xem trước URL</button>
              {selectedFile && <button type="button" onClick={handleClearFile} style={{ padding: '10px 14px', borderRadius: '10px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Xóa file</button>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-surface)', boxShadow: '0 8px 18px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px', maxHeight: '380px' }}>
              <img src={previewSrc || formData.posterUrl || ''} alt="Poster Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.05)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 'bold' }}>Mô tả nội dung</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="5" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', fontSize: '13px', resize: 'vertical', minHeight: '130px' }} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => navigate('/movies')} style={{ padding: '10px 20px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border-color)', color: 'inherit', cursor: 'pointer', fontWeight: '600' }}>Hủy</button>
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '10px', fontWeight: '700' }}>{isEdit ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
