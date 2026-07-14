import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import seatApi from '../api/seatApi';
import roomApi from '../api/roomApi';
import showtimeApi from '../api/showtimeApi';
import cinemaApi from '../api/cinemaApi';

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');
  const [form, setForm] = useState({ rowNumber: '', seatNumber: '', type: 'STANDARD', status: 'AVAILABLE', roomId: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchCinemas();
    fetchShowtimes();
    fetchSeats();
  }, []);

  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(String(rooms[0].id));
    }
  }, [rooms, selectedRoomId]);

  useEffect(() => {
    if (selectedShowtimeId) {
      fetchSeatMap(selectedShowtimeId);
    } else {
      setSeatMap([]);
    }
  }, [selectedShowtimeId]);

  useEffect(() => {
    if (!selectedShowtimeId) return;

    // Load seat map immediately
    fetchSeatMap(selectedShowtimeId);

    // Then set up polling every 3 seconds
    const intervalId = window.setInterval(() => {
      console.log('🔄 Polling seat map...');
      fetchSeatMap(selectedShowtimeId);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
      console.log('🛑 Polling stopped');
    };
  }, [selectedShowtimeId]);

  const fetchRooms = async () => {
    try {
      const data = await roomApi.getAll();
      const roomList = Array.isArray(data) ? data : [];
      setRooms(roomList);
      if (roomList.length > 0 && !selectedRoomId) {
        setSelectedRoomId(String(roomList[0].id));
      }
    } catch (error) {
      console.error('Lỗi khi tải phòng chiếu:', error);
    }
  };

  const fetchCinemas = async () => {
    try {
      const data = await cinemaApi.getAll();
      setCinemas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải rạp chiếu:', error);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const data = await showtimeApi.getAll();
      setShowtimes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải suất chiếu:', error);
    }
  };

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const data = await seatApi.getAll();
      setSeats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải ghế ngồi:', error);
      alert('Không thể tải danh sách ghế ngồi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatMap = async (showtimeId) => {
    if (!showtimeId) {
      setSeatMap([]);
      return;
    }

    try {
      const data = await showtimeApi.getSeatMap(showtimeId);
      if (data && Array.isArray(data?.seats) && data.seats.length > 0) {
        console.log('📍 Seat map updated:', data.seats.length, 'seats');
        setSeatMap(data.seats);
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải sơ đồ ghế theo suất chiếu:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (e) => {
    const value = e.target.value;
    setSelectedRoomId(value);
    setSelectedShowtimeId('');
    setForm((prev) => ({ ...prev, roomId: value }));
  };

  const handleShowtimeChange = (e) => {
    const value = e.target.value;
    setSelectedShowtimeId(value);
    const showtime = showtimes.find((item) => String(item.id) === String(value));
    if (showtime) {
      setSelectedRoomId(String(showtime.roomId));
      setForm((prev) => ({ ...prev, roomId: String(showtime.roomId) }));
    }
  };

  const handleGenerateSeats = async () => {
    const room = rooms.find((item) => String(item.id) === String(selectedRoomId));
    if (!room) {
      alert('Vui lòng chọn phòng trước.');
      return;
    }

    const existingSeats = seats.filter((item) => Number(item.roomId) === Number(selectedRoomId));
    if (existingSeats.length > 0) {
      const confirmed = window.confirm(
        `Phòng này đã có ${existingSeats.length} ghế. Bạn muốn xóa tất cả và tạo lại không?`
      );
      if (!confirmed) return;

      try {
        await seatApi.deleteByRoom(selectedRoomId);
      } catch (error) {
        console.error('Lỗi khi xóa ghế cũ:', error);
        alert(error.response?.data?.message || 'Không thể xóa ghế cũ vì đã có vé được bán trong phòng này!');
        return;
      }
    }

    const capacity = Number(room.capacity) || 40;
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
            roomId: Number(selectedRoomId)
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
            roomId: Number(selectedRoomId)
          });
        }
      }
    }


    try {
      await Promise.all(generated.map((item) => seatApi.create(item)));
      await fetchSeats();
      if (selectedShowtimeId) {
        await fetchSeatMap(selectedShowtimeId);
      }
      alert(`Đã tạo ${generated.length} ghế cho phòng ${room.name || room.id}.`);
    } catch (error) {
      console.error('Lỗi khi tạo sơ đồ ghế:', error);
      alert('Không thể tạo sơ đồ ghế tự động.');
    }
  };

  const handleSeatClick = async (seat) => {
    // 1. Populate the form for manual editing/reference
    setEditingId(seat.id);
    setForm({
      rowNumber: seat.rowNumber || '',
      seatNumber: seat.seatNumber ?? '',
      type: seat.type || 'STANDARD',
      status: seat.status || 'AVAILABLE',
      roomId: seat.roomId ?? selectedRoomId
    });

    // 2. Perform quick direct toggle on click
    if (selectedShowtimeId) {
      if (seat.status === 'DISABLED') {
        alert('Ghế này đang không hoạt động (bảo trì), không thể đặt vé!');
        return;
      }
      const nextStatus = seat.status === 'BOOKED' ? 'AVAILABLE' : 'BOOKED';
      try {
        if (nextStatus === 'BOOKED') {
          await showtimeApi.bookSeat(selectedShowtimeId, seat.id);
        } else {
          await showtimeApi.releaseSeat(selectedShowtimeId, seat.id);
        }
        await fetchSeatMap(selectedShowtimeId);
      } catch (error) {
        console.error('Lỗi khi đổi trạng thái đặt vé:', error);
      }
    } else {
      // Cycle seat type: STANDARD -> VIP -> COUPLE -> STANDARD
      let nextType = 'STANDARD';
      if (seat.type === 'STANDARD') nextType = 'VIP';
      else if (seat.type === 'VIP') nextType = 'COUPLE';
      else if (seat.type === 'COUPLE') nextType = 'STANDARD';

      try {
        await seatApi.update(seat.id, {
          ...seat,
          type: nextType
        });
        await fetchSeats();
      } catch (error) {
        console.error('Lỗi khi cập nhật nhanh loại ghế:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        roomId: Number(form.roomId || selectedRoomId),
        rowNumber: form.rowNumber.trim().toUpperCase(),
        seatNumber: Number(form.seatNumber)
      };

      let targetId = editingId;
      if (!targetId) {
        // Find if seat already exists in the selected room
        const existingSeat = seats.find(s =>
          Number(s.roomId) === payload.roomId &&
          s.rowNumber === payload.rowNumber &&
          Number(s.seatNumber) === payload.seatNumber
        );
        if (existingSeat) {
          targetId = existingSeat.id;
        }
      }

      // 1. Save seat details physically
      if (targetId) {
        await seatApi.update(targetId, payload);
      } else {
        const created = await seatApi.create(payload);
        targetId = created.id;
      }

      // 2. Handle manual ticket booking/release if showtime is selected
      if (selectedShowtimeId && targetId) {
        if (form.status === 'BOOKED') {
          await showtimeApi.bookSeat(selectedShowtimeId, targetId);
        } else if (form.status === 'AVAILABLE') {
          await showtimeApi.releaseSeat(selectedShowtimeId, targetId);
        }
      }

      alert('Lưu thông tin ghế thành công!');
      setForm({ rowNumber: '', seatNumber: '', type: 'STANDARD', status: 'AVAILABLE', roomId: selectedRoomId || '' });
      setEditingId(null);
      fetchSeats();
      if (selectedShowtimeId) {
        fetchSeatMap(selectedShowtimeId);
      }
    } catch (error) {
      console.error('Lỗi lưu ghế:', error);
      alert('Có lỗi khi lưu ghế ngồi.');
    }
  };

  const handleEdit = (seat) => {
    setEditingId(seat.id);
    setForm({
      rowNumber: seat.rowNumber || '',
      seatNumber: seat.seatNumber ?? '',
      type: seat.type || 'STANDARD',
      status: seat.status || 'AVAILABLE',
      roomId: seat.roomId ?? selectedRoomId
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ghế này?')) return;
    try {
      await seatApi.delete(id);
      alert('Xóa ghế thành công!');
      fetchSeats();
    } catch (error) {
      console.error('Lỗi khi xóa ghế:', error);
      alert('Không thể xóa ghế này.');
    }
  };

  const getUniqueSeats = (seatList) => {
    const seatMap = new Map();
    seatList.forEach((seat) => {
      const key = `${seat.rowNumber || ''}-${seat.seatNumber || ''}`;
      const existing = seatMap.get(key);
      if (!existing) {
        seatMap.set(key, seat);
      } else {
        const priority = { BOOKED: 3, DISABLED: 2, AVAILABLE: 1 };
        const existingPriority = priority[existing.status] || 0;
        const candidatePriority = priority[seat.status] || 0;
        if (candidatePriority > existingPriority) {
          seatMap.set(key, seat);
        }
      }
    });
    return Array.from(seatMap.values());
  };

  const filteredSeats = useMemo(() => {
    const roomId = Number(selectedRoomId);
    const baseSource = selectedShowtimeId ? seatMap : seats;
    const base = baseSource.filter((seat) => (!Number.isNaN(roomId) ? Number(seat.roomId) === roomId : true));
    const unique = getUniqueSeats(base);
    const query = searchTerm.toLowerCase();
    return unique.filter((seat) => `${seat.rowNumber || ''} ${seat.seatNumber || ''} ${seat.type || ''}`.toLowerCase().includes(query));
  }, [seatMap, seats, searchTerm, selectedRoomId, selectedShowtimeId]);

  const seatGrid = useMemo(() => {
    const rows = Array.from(new Set(filteredSeats.map((seat) => seat.rowNumber))).sort((a, b) => a.localeCompare(b));
    return rows.map((row) => {
      const rowSeats = filteredSeats.filter((seat) => seat.rowNumber === row).sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));
      return { row, rowSeats };
    });
  }, [filteredSeats]);

  const getShowtimeLabel = (showtime) => {
    const room = rooms.find(r => String(r.id) === String(showtime.roomId));
    const roomName = room ? room.name : `Phòng #${showtime.roomId}`;
    const cinemaName = room ? (cinemas.find(c => String(c.id) === String(room.cinemaId))?.name || `Rạp #${room.cinemaId}`) : 'Không rõ';
    return `#${showtime.id} - ${cinemaName} (${roomName}) - ${showtime.showDate}`;
  };

  const selectedRoom = rooms.find((room) => String(room.id) === String(selectedRoomId));

  return (
    <div className="movies-page">
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ minWidth: '220px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Chọn suất chiếu</label>
            <select value={selectedShowtimeId} onChange={handleShowtimeChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }}>
              <option value="">-- Chọn suất chiếu --</option>
              {showtimes.map((showtime) => (
                <option key={showtime.id} value={showtime.id}>
                  {getShowtimeLabel(showtime)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: '220px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Chọn phòng</label>
            <select value={selectedRoomId} onChange={handleRoomChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }}>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name || `Phòng ${room.id}`}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: '180px', padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Phòng đang xem</div>
            <div style={{ fontWeight: 700 }}>{selectedRoom?.name || 'Chưa chọn'}</div>
          </div>
          <button type="button" onClick={handleGenerateSeats} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Tạo sơ đồ ghế
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Hàng ghế</label>
            <input name="rowNumber" value={form.rowNumber} onChange={handleChange} required placeholder="A" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Số ghế</label>
            <input name="seatNumber" type="number" min="1" value={form.seatNumber} onChange={handleChange} required placeholder="1" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Loại ghế</label>
            <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }}>
              <option value="STANDARD">Standard</option>
              <option value="VIP">VIP</option>
              <option value="COUPLE">Couple</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }}>
              <option value="AVAILABLE">Còn trống</option>
              <option value="BOOKED">Đã đặt</option>
              <option value="DISABLED">Không hoạt động</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Phòng</label>
            <input name="roomId" type="number" min="1" value={form.roomId || selectedRoomId} onChange={handleChange} required placeholder="1" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'end', gap: '10px' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> {editingId ? 'Cập nhật' : 'Thêm ghế'}
            </button>
            {editingId ? (
              <button type="button" onClick={() => { setEditingId(null); setForm({ rowNumber: '', seatNumber: '', type: 'STANDARD', status: 'AVAILABLE', roomId: selectedRoomId || '' }); }} className="btn-secondary">
                Hủy
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '16px', maxWidth: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo hàng / số / loại ghế" style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'inherit' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Đang tải dữ liệu...</div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Sơ đồ ghế <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'normal' }}>({filteredSeats.length} ghế)</span></h3>

                {/* Chú thích màu sắc */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)' }}></div> Standard
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)' }}></div> VIP
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)' }}></div> Couple
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(156,163,175,0.15)', border: '1px solid rgba(156,163,175,0.4)', opacity: 0.4 }}></div> Đã đặt
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'rgba(107,114,128,0.15)', border: '1px solid rgba(107,114,128,0.4)' }}></div> Bảo trì
                  </div>
                </div>
              </div>
              
              {/* Seating Grid Area */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '30px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                
                {/* Screen Indicator */}
                <div style={{ width: '80%', height: '8px', background: '#3b82f6', borderRadius: '4px', margin: '0 auto 8px auto', boxShadow: '0 4px 12px rgba(59,130,246,0.5)' }}></div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '2px' }}>MÀN HÌNH CHÍNH</div>
                
                {/* Rows mapping */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
                  {seatGrid.length > 0 ? seatGrid.map(({ row, rowSeats }) => (
                    <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '24px', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'left' }}>{row}</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {rowSeats.map((seat) => {
                          let bg = 'rgba(96,165,250,0.15)'; // STANDARD (light blue)
                          let border = 'rgba(96,165,250,0.4)';
                          let hoverBg = 'rgba(96,165,250,0.3)';
                          if (seat.type === 'VIP') {
                            bg = 'rgba(245,158,11,0.15)'; border = 'rgba(245,158,11,0.4)'; hoverBg = 'rgba(245,158,11,0.3)';
                          } else if (seat.type === 'COUPLE') {
                            bg = 'rgba(236,72,153,0.15)'; border = 'rgba(236,72,153,0.4)'; hoverBg = 'rgba(236,72,153,0.3)';
                          }
                          if (seat.status === 'BOOKED') {
                            bg = '#cbd5e1'; border = '1px solid #94a3b8'; hoverBg = '#cbd5e1';
                          } else if (seat.status === 'DISABLED') {
                            bg = 'rgba(107,114,128,0.15)'; border = 'rgba(107,114,128,0.4)'; hoverBg = 'rgba(107,114,128,0.3)';
                          }

                          const isEditing = editingId === seat.id;
                          let borderStyle = isEditing ? '2px solid #ffffff' : `1px solid ${border}`;
                          let scale = isEditing ? 'scale(1.15)' : 'scale(1)';
                          let zIndex = isEditing ? 2 : 1;
                          let shadow = isEditing ? '0 0 12px #ffffff' : '0 2px 4px rgba(0,0,0,0.1)';

                          return (
                            <React.Fragment key={seat.id}>
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                style={{
                                  width: seat.type === 'COUPLE' ? '70px' : '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  border: borderStyle,
                                  background: bg,
                                  color: seat.status === 'BOOKED' || seat.status === 'DISABLED' ? 'var(--text-muted)' : 'var(--text-primary)',
                                  cursor: 'pointer',
                                  fontWeight: 700,
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s',
                                  transform: scale,
                                  zIndex: zIndex,
                                  boxShadow: shadow,
                                  opacity: seat.status === 'BOOKED' || seat.status === 'DISABLED' ? 0.4 : 1
                                }}
                                title={`Ghế ${seat.rowNumber}${seat.seatNumber} - ${seat.type} - ${seat.status}`}
                                onMouseEnter={(e) => { if (!isEditing) e.target.style.background = hoverBg; }}
                                onMouseLeave={(e) => { if (!isEditing) e.target.style.background = bg; }}
                              >
                                {seat.seatNumber}
                              </button>
                              {/* Lối đi phân chia cụm ghế */}
                              {(seat.seatNumber === Math.floor(rowSeats.length / 4) || seat.seatNumber === rowSeats.length - Math.floor(rowSeats.length / 4)) && (
                                <div className="aisle-spacer" style={{ width: '20px' }}></div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <div style={{ width: '24px', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'right' }}>{row}</div>
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có ghế nào trong phòng này.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatManagement;
