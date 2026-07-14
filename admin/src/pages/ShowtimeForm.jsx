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
    showDate: ''
  });

  const [slots, setSlots] = useState([
    { startTime: '', endTime: '', basePrice: '' }
  ]);

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
            showDate: showtime.showDate || ''
          });
          setSlots([
            { id: showtime.id, startTime: showtime.startTime || '', endTime: showtime.endTime || '', basePrice: showtime.basePrice || '' }
          ]);
        } else {
          alert("Không tìm thấy lịch chiếu!");
          navigate('/showtimes');
        }
      } else {
        // For new showtimes
        if (movieData.length > 0 && roomData.length > 0) {
          setFormData({
            movieId: movieData[0].id,
            roomId: roomData[0].id,
            showDate: ''
          });
        }
        setSlots([{ startTime: '', endTime: '', basePrice: '85000' }]);
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

  const handleSlotChange = (index, field, value) => {
    setSlots(prev => prev.map((s, idx) => {
      if (idx === index) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const addSlot = () => {
    setSlots(prev => [...prev, { startTime: '', endTime: '', basePrice: slots[slots.length - 1]?.basePrice || '85000' }]);
  };

  const removeSlot = async (index) => {
    const slot = slots[index];
    if (slot.id) {
      if (window.confirm("Bạn có chắc chắn muốn xóa hẳn khung giờ này khỏi hệ thống?")) {
        try {
          await showtimeApi.delete(slot.id);
          setSlots(prev => prev.filter((_, idx) => idx !== index));
          alert("Đã xóa khung giờ thành công!");
          if (slots.length === 1) {
            navigate('/showtimes');
          }
        } catch (e) {
          alert("Lỗi khi xóa khung giờ!");
        }
      }
    } else {
      setSlots(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (slots.some(s => !s.startTime || !s.endTime || !s.basePrice)) {
        alert('Vui lòng nhập đầy đủ thông tin tất cả khung giờ!');
        setSaving(false);
        return;
      }

      const requests = slots.map(slot => {
        const payload = {
          movieId: parseInt(formData.movieId),
          roomId: parseInt(formData.roomId),
          showDate: formData.showDate,
          startTime: slot.startTime && slot.startTime.length === 5 ? `${slot.startTime}:00` : slot.startTime,
          endTime: slot.endTime && slot.endTime.length === 5 ? `${slot.endTime}:00` : slot.endTime,
          basePrice: parseFloat(slot.basePrice)
        };
        if (slot.id) {
          return showtimeApi.update(slot.id, payload);
        } else {
          return showtimeApi.create(payload);
        }
      });

      await Promise.all(requests);
      alert('Lưu lịch chiếu thành công!');
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
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
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
          </div>

          {/* Time Slots Area */}
          <div style={{ marginTop: '10px' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>Danh sách khung giờ chiếu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {slots.map((slot, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Giờ bắt đầu *</label>
                    <input type="text" value={slot.startTime} onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)} required
                      placeholder="Ví dụ: 14:30" pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Định dạng 24h (HH:mm), ví dụ: 14:30"
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Giờ kết thúc *</label>
                    <input type="text" value={slot.endTime} onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)} required
                      placeholder="Ví dụ: 16:30" pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Định dạng 24h (HH:mm), ví dụ: 16:30"
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Giá vé (VNĐ) *</label>
                    <input type="number" value={slot.basePrice} onChange={(e) => handleSlotChange(index, 'basePrice', e.target.value)} required min="0" step="1000" placeholder="85000"
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
                  </div>
                  <div style={{ alignSelf: 'end', paddingBottom: '2px' }}>
                    <button type="button" onClick={() => removeSlot(index)} disabled={slots.length === 1}
                      style={{ padding: '10px 16px', background: slots.length === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(239, 68, 68, 0.1)', color: slots.length === 1 ? 'var(--text-muted)' : '#ef4444', border: slots.length === 1 ? '1px solid transparent' : '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', cursor: slots.length === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addSlot}
              style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '6px', background: 'var(--border-color)', color: 'inherit', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
              + Thêm Khung Giờ
            </button>
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
