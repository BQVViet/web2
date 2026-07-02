import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import showtimeApi from '../api/showtimeApi';
import movieApi from '../api/movieApi';
import roomApi from '../api/roomApi';
import '../styles/Movies.css';

const ShowtimeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [formData, setFormData] = useState({
    movieId: '',
    roomId: '',
    showDate: '',
    startTime: '',
    endTime: '',
    basePrice: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movieData, roomData] = await Promise.all([
        movieApi.getAll(),
        roomApi.getAll()
      ]);
      setMovies(movieData);
      setRooms(roomData);

      if (isEdit) {
        const showtime = await showtimeApi.getById(id);
        if (showtime) {
          setFormData({
            movieId: showtime.movieId || '',
            roomId: showtime.roomId || '',
            showDate: showtime.showDate || '',
            startTime: showtime.startTime || '',
            endTime: showtime.endTime || '',
            basePrice: showtime.basePrice || ''
          });
        } else {
          alert("Không tìm thấy lịch chiếu!");
          navigate('/showtimes');
        }
      } else if (movieData.length > 0 && roomData.length > 0) {
        setFormData(prev => ({
          ...prev,
          movieId: movieData[0].id,
          roomId: roomData[0].id
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        movieId: parseInt(formData.movieId),
        roomId: parseInt(formData.roomId),
        basePrice: parseFloat(formData.basePrice)
      };

      if (isEdit) {
        await showtimeApi.update(id, payload);
        alert('Cập nhật lịch chiếu thành công!');
      } else {
        await showtimeApi.create(payload);
        alert('Thêm lịch chiếu mới thành công!');
      }
      navigate('/showtimes');
    } catch (error) {
      console.error("Lỗi lưu lịch chiếu:", error);
      alert('Có lỗi xảy ra khi lưu lịch chiếu!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="movies-page">
      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        <h2 style={{ color: 'inherit', marginBottom: '30px', marginTop: 0 }}>
          {isEdit ? 'Cập nhật Lịch Chiếu' : 'Thêm Lịch Chiếu Mới'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Chọn Phim *</label>
              <select name="movieId" value={formData.movieId} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }}>
                <option value="" disabled>-- Chọn Phim --</option>
                {movies.map(m => (
                  <option key={m.id} value={m.id} style={{ color: 'black' }}>{m.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Chọn Phòng Chiếu *</label>
              <select name="roomId" value={formData.roomId} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }}>
                <option value="" disabled>-- Chọn Phòng --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id} style={{ color: 'black' }}>{r.name} ({r.capacity} ghế)</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Ngày chiếu *</label>
              <input type="date" name="showDate" value={formData.showDate} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Giờ bắt đầu *</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Giờ kết thúc *</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Giá vé (VNĐ) *</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required min="0" step="1000"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={() => navigate('/showtimes')} style={{ padding: '12px 25px', borderRadius: '8px', background: 'var(--border-color)', color: 'inherit', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              Hủy
            </button>
            <button type="submit" disabled={saving} style={{ padding: '12px 30px', borderRadius: '8px', background: 'var(--primary-color)', color: 'inherit', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ShowtimeForm;
