import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import roomApi from '../api/roomApi';
import cinemaApi from '../api/cinemaApi';
import '../styles/Movies.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCinemaId, setFilterCinemaId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomData, cinemaData] = await Promise.all([
        roomApi.getAll(),
        cinemaApi.getAll()
      ]);
      setRooms(roomData);
      setCinemas(cinemaData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phòng chiếu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng chiếu này không?')) {
      try {
        await roomApi.delete(id);
        setRooms(rooms.filter(r => r.id !== id));
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa phòng chiếu.");
      }
    }
  };

  const handleToggleStatus = async (room) => {
    const nextStatus = room.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
    try {
      await roomApi.update(room.id, { ...room, status: nextStatus });
      setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: nextStatus } : r));
    } catch (error) {
      alert("Có lỗi xảy ra khi đổi trạng thái phòng chiếu.");
    }
  };

  const getCinemaName = (id) => {
    const cinema = cinemas.find(c => c.id === id);
    return cinema ? cinema.name : `Rạp #${id}`;
  };

  const filteredRooms = rooms.filter(r => {
    const matchSearch = (r.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCinema = filterCinemaId === '' || String(r.cinemaId) === String(filterCinemaId);
    const matchStatus = filterStatus === '' || r.status === filterStatus;
    return matchSearch && matchCinema && matchStatus;
  });
  
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-page">
      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, color: 'inherit' }}>Danh sách Phòng chiếu</h2>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Lọc theo Rạp */}
          <select 
            value={filterCinemaId} 
            onChange={(e) => { setFilterCinemaId(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none' }}
          >
            <option value="" style={{color: 'black'}}>Tất cả Rạp</option>
            {cinemas.map(c => (
              <option key={c.id} value={c.id} style={{color: 'black'}}>{c.name}</option>
            ))}
          </select>

          {/* Lọc theo Trạng thái */}
          <select 
            value={filterStatus} 
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none' }}
          >
            <option value="" style={{color: 'black'}}>Tất cả Trạng thái</option>
            <option value="ACTIVE" style={{color: 'black'}}>Hoạt động</option>
            <option value="MAINTENANCE" style={{color: 'black'}}>Bảo trì</option>
          </select>

          {/* Tìm kiếm */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên phòng..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)', color: 'inherit', outline: 'none', width: '220px'
              }}
            />
          </div>
          
          <button 
            className="btn-primary" 
            onClick={() => navigate('/rooms/create')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Thêm Phòng
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'inherit' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="glass-panel" style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '15px' }}>ID</th>
                  <th style={{ padding: '15px' }}>Tên Phòng</th>
                  <th style={{ padding: '15px' }}>Rạp Phim</th>
                  <th style={{ padding: '15px' }}>Sức chứa (Ghế)</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentRooms.map((room) => (
                  <tr key={room.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px' }}>#{room.id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{room.name}</td>
                    <td style={{ padding: '15px' }}>{getCinemaName(room.cinemaId)}</td>
                    <td style={{ padding: '15px' }}>{room.capacity} ghế</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <label style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '44px',
                          height: '22px',
                          cursor: 'pointer'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={room.status === 'ACTIVE'} 
                            onChange={() => handleToggleStatus(room)}
                            style={{ opacity: 0, width: 0, height: 0 }} 
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: room.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(156, 163, 175, 0.3)',
                            transition: '0.3s',
                            borderRadius: '22px',
                            border: '1px solid var(--border-color)'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '16px',
                              width: '16px',
                              left: '2px',
                              bottom: '2px',
                              backgroundColor: '#ffffff',
                              transition: '0.3s',
                              borderRadius: '50%',
                              transform: room.status === 'ACTIVE' ? 'translateX(22px)' : 'translateX(0)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                          </span>
                        </label>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          color: room.status === 'ACTIVE' ? '#10b981' : 'var(--text-muted)',
                          minWidth: '65px',
                          textAlign: 'left'
                        }}>
                          {room.status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <button 
                        onClick={() => navigate(`/rooms/edit/${room.id}`)}
                        style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '5px', marginRight: '10px' }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentRooms.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không tìm thấy phòng chiếu nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', gap: '10px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === page ? '#ffffff' : 'rgba(255,255,255,0.1)', color: currentPage === page ? '#000000' : 'white', border: 'none', cursor: 'pointer', fontWeight: currentPage === page ? 'bold' : 'normal' }}>
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ padding: '8px 12px', borderRadius: '8px', background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)', color: 'inherit', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomList;
