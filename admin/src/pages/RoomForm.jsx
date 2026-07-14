import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import roomApi from '../api/roomApi';
import cinemaApi from '../api/cinemaApi';
import seatApi from '../api/seatApi';
import '../styles/Movies.css';

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [seats, setSeats] = useState([]);

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
      const seatsData = await seatApi.getAll();
      setSeats(seatsData);

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

  const handleSeatClick = async (seat) => {
    let nextType = 'STANDARD';
    if (seat.type === 'STANDARD') nextType = 'VIP';
    else if (seat.type === 'VIP') nextType = 'COUPLE';
    else if (seat.type === 'COUPLE') nextType = 'STANDARD';
    
    try {
      await seatApi.update(seat.id, {
        ...seat,
        type: nextType
      });
      // Fetch seats again to refresh UI
      const updatedSeats = await seatApi.getAll();
      setSeats(updatedSeats);
    } catch (error) {
      console.error("Lỗi khi cập nhật loại ghế:", error);
      alert("Không thể cập nhật loại ghế!");
    }
  };

  const handleGenerateSeats = async () => {
    const capacity = Number(formData.capacity) || 40;
    const rowCount = Math.max(3, Math.min(10, Math.ceil(capacity / 10)));
    const seatsPerRow = Math.max(6, Math.ceil(capacity / rowCount));
    const generated = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const rowLetter = String.fromCharCode(65 + rowIndex);
      
      if (rowIndex === rowCount - 1) {
        // Hàng cuối cùng luôn là ghế đôi (COUPLE)
        const coupleCount = Math.floor(seatsPerRow / 2);
        for (let seatIndex = 1; seatIndex <= coupleCount; seatIndex += 1) {
          generated.push({
            rowNumber: rowLetter,
            seatNumber: seatIndex,
            type: 'COUPLE',
            status: 'AVAILABLE',
            roomId: Number(id)
          });
        }
      } else {
        // Hàng giữa là ghế VIP, hàng đầu là ghế STANDARD
        const isVIPRow = rowIndex >= Math.floor(rowCount / 3) && rowIndex < rowCount - 1;
        const seatType = isVIPRow ? 'VIP' : 'STANDARD';
        for (let seatIndex = 1; seatIndex <= seatsPerRow; seatIndex += 1) {
          generated.push({
            rowNumber: rowLetter,
            seatNumber: seatIndex,
            type: seatType,
            status: 'AVAILABLE',
            roomId: Number(id)
          });
        }
      }
    }

    try {
      setLoading(true);
      await Promise.all(generated.map((item) => seatApi.create(item)));
      const seatsData = await seatApi.getAll();
      setSeats(seatsData);
      alert(`Đã tạo thành công ${generated.length} ghế cho phòng chiếu này.`);
    } catch (error) {
      console.error("Lỗi khi tạo sơ đồ ghế:", error);
      alert("Không thể tạo sơ đồ ghế tự động.");
    } finally {
      setLoading(false);
    }
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

  const roomSeats = seats.filter(s => s.roomId === Number(id));
  // Filter unique seats visually
  const uniqueRoomSeats = [];
  const uniqueKeys = new Set();
  roomSeats.forEach(s => {
    const key = `${s.rowNumber}-${s.seatNumber}`;
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueRoomSeats.push(s);
    }
  });

  const seatGrid = {};
  uniqueRoomSeats.forEach(seat => {
    if (!seatGrid[seat.rowNumber]) seatGrid[seat.rowNumber] = [];
    seatGrid[seat.rowNumber].push(seat);
  });
  Object.keys(seatGrid).forEach(row => {
    seatGrid[row].sort((a, b) => a.seatNumber - b.seatNumber);
  });
  const sortedRows = Object.keys(seatGrid).sort();

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

        {isEdit && (
          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
            {uniqueRoomSeats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '15px' }}>Phòng chiếu này chưa có sơ đồ ghế ngồi.</p>
                <button 
                  type="button" 
                  onClick={handleGenerateSeats} 
                  className="btn-primary"
                  style={{ padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  + Tạo sơ đồ ghế tự động
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Sơ Đồ Ghế Hiện Tại ({uniqueRoomSeats.length} ghế)
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '10px' }}>
                    (Nhấp vào ghế để đổi nhanh loại ghế STANDARD / VIP / COUPLE)
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '30px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  
                  {/* Screen Indicator */}
                  <div style={{ width: '80%', height: '8px', background: '#3b82f6', borderRadius: '4px', margin: '0 auto 8px auto', boxShadow: '0 4px 12px rgba(59,130,246,0.5)' }}></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '2px' }}>MÀN HÌNH CHÍNH</div>
                  
                  {/* Seating Grid Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
                    {sortedRows.map(row => (
                      <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '24px', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'left' }}>{row}</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {seatGrid[row].map(seat => {
                            let bg = '#10B981'; // Standard
                            if (seat.type === 'VIP') bg = '#F59E0B';
                            if (seat.type === 'COUPLE') bg = '#ec4899';
                            
                            return (
                              <React.Fragment key={seat.id}>
                                <div
                                  onClick={() => handleSeatClick(seat)}
                                  style={{
                                    width: seat.type === 'COUPLE' ? '70px' : '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    background: bg,
                                    color: 'white',
                                    border: seat.status === 'DISABLED' ? '2px solid #999' : 'none',
                                    opacity: seat.status === 'DISABLED' ? 0.5 : 1,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.1s'
                                  }}
                                  title={`Click để đổi loại ghế | Hàng ${row} Ghế ${seat.seatNumber} - ${seat.type}`}
                                >
                                  {seat.seatNumber}
                                </div>
                                {/* Lối đi phân chia cụm ghế */}
                                {(seat.seatNumber === Math.floor(seatGrid[row].length / 4) || seat.seatNumber === seatGrid[row].length - Math.floor(seatGrid[row].length / 4)) && (
                                  <div className="aisle-spacer" style={{ width: '20px' }}></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <div style={{ width: '24px', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'right' }}>{row}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', marginRight: '20px' }}>🟡 VIP • 🟢 Standard • 💗 Couple</span>
                  <span>Ghế mờ = Không hoạt động (Bảo trì)</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomForm;
