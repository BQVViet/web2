import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import roomApi from '../api/roomApi';
import cinemaApi from '../api/cinemaApi';
import '../styles/Movies.css';

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cinemas, setCinemas] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    status: 'ACTIVE',
    cinemaId: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const cinemaData = await cinemaApi.getAll();
      setCinemas(cinemaData);

      if (isEdit) {
        const room = await roomApi.getById(id);
        if (room) {
          setFormData({
            name: room.name || '',
            capacity: room.capacity || '',
            status: room.status || 'ACTIVE',
            cinemaId: room.cinemaId || ''
          });
        } else {
          alert("Không tìm thấy phòng chiếu!");
          navigate('/rooms');
        }
      } else if (cinemaData.length > 0) {
        setFormData(prev => ({
          ...prev,
          cinemaId: cinemaData[0].id
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
        capacity: parseInt(formData.capacity),
        cinemaId: parseInt(formData.cinemaId)
      };

      if (isEdit) {
        await roomApi.update(id, payload);
        alert('Cập nhật phòng chiếu thành công!');
      } else {
        await roomApi.create(payload);
        alert('Thêm phòng chiếu mới thành công!');
      }
      navigate('/rooms');
    } catch (error) {
      console.error("Lỗi lưu phòng chiếu:", error);
      alert('Có lỗi xảy ra khi lưu phòng chiếu!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'inherit', padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="movies-page">
      <div className="glass-panel" style={{ width: '100%', padding: '30px' }}>
        <h2 style={{ color: 'inherit', marginBottom: '30px', marginTop: 0 }}>
          {isEdit ? 'Cập nhật Phòng Chiếu' : 'Thêm Phòng Chiếu Mới'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Chọn Rạp *</label>
              <select name="cinemaId" value={formData.cinemaId} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }}>
                <option value="" disabled>-- Chọn Rạp --</option>
                {cinemas.map(c => (
                  <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Tên Phòng *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ví dụ: P. 01"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Sức chứa (Số ghế) *</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1"
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 'bold' }}>Trạng thái *</label>
              <select name="status" value={formData.status} onChange={handleChange} required
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit' }}>
                <option value="ACTIVE" style={{ color: 'black' }}>Hoạt động</option>
                <option value="MAINTENANCE" style={{ color: 'black' }}>Bảo trì</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={() => navigate('/rooms')} style={{ padding: '12px 25px', borderRadius: '8px', background: 'var(--border-color)', color: 'inherit', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
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

export default RoomForm;
