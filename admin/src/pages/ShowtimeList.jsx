import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import showtimeApi from '../api/showtimeApi';
import movieApi from '../api/movieApi';
import roomApi from '../api/roomApi';
import cinemaApi from '../api/cinemaApi';
import '../styles/Movies.css';

const ShowtimeList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [movieFilter, setMovieFilter] = useState('ALL');
  const [cinemaFilter, setCinemaFilter] = useState('ALL');
  const [roomFilter, setRoomFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // Reset room filter if selected room doesn't belong to the selected cinema
  useEffect(() => {
    if (cinemaFilter !== 'ALL') {
      const selectedRoom = rooms.find(r => String(r.id) === String(roomFilter));
      if (selectedRoom && String(selectedRoom.cinemaId) !== String(cinemaFilter)) {
        setRoomFilter('ALL');
      }
    }
  }, [cinemaFilter, roomFilter, rooms]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showtimeData, movieData, roomData, cinemaData] = await Promise.all([
        showtimeApi.getAll(),
        movieApi.getAll(),
        roomApi.getAll(),
        cinemaApi.getAll()
      ]);
      setShowtimes(showtimeData);
      setMovies(movieData);
      setRooms(roomData);
      setCinemas(cinemaData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu lịch chiếu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này không?')) {
      try {
        await showtimeApi.delete(id);
        setShowtimes(showtimes.filter(s => s.id !== id));
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa lịch chiếu.");
      }
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('vi-VN');
    }
    return String(value);
  };

  const formatTime = (value) => {
    if (!value) return '';
    const time = String(value);
    return time.length >= 5 ? time.slice(0, 5) : time;
  };

  const getMovieName = (id) => {
    const movie = movies.find(m => m.id === id);
    return movie ? movie.title : `Phim #${id}`;
  };

  const getRoomName = (id) => {
    const room = rooms.find(r => r.id === id);
    return room ? room.name : `Phòng #${id}`;
  };

  const getCinemaName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 'Không rõ';
    const cinema = cinemas.find(c => c.id === room.cinemaId);
    return cinema ? cinema.name : `Rạp #${room.cinemaId}`;
  };

  // Advanced Filter logic
  const filteredShowtimes = showtimes.filter(s => {
    const room = rooms.find(r => r.id === s.roomId);
    const cinemaId = room ? room.cinemaId : null;

    const matchesSearch = 
      getMovieName(s.movieId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoomName(s.roomId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCinemaName(s.roomId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.showDate || '').includes(searchTerm);
      
    const matchesMovie = movieFilter === 'ALL' || String(s.movieId) === String(movieFilter);
    const matchesCinema = cinemaFilter === 'ALL' || (cinemaId && String(cinemaId) === String(cinemaFilter));
    const matchesRoom = roomFilter === 'ALL' || String(s.roomId) === String(roomFilter);
    const matchesDate = !dateFilter || s.showDate === dateFilter;
    
    return matchesSearch && matchesMovie && matchesCinema && matchesRoom && matchesDate;
  });
  
  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);
  const currentShowtimes = filteredShowtimes.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-page">
      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, color: 'inherit' }}>Danh sách Lịch chiếu</h2>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Movie Filter */}
          <select 
            value={movieFilter} 
            onChange={(e) => { setMovieFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">-- Tất cả phim --</option>
            {movies.map(m => (
              <option key={m.id} value={m.id} style={{ color: 'black' }}>{m.title}</option>
            ))}
          </select>

          {/* Cinema Filter */}
          <select 
            value={cinemaFilter} 
            onChange={(e) => { setCinemaFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">-- Tất cả rạp --</option>
            {cinemas.map(c => (
              <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.name}</option>
            ))}
          </select>

          {/* Room Filter */}
          <select 
            value={roomFilter} 
            onChange={(e) => { setRoomFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">-- Tất cả phòng --</option>
            {rooms
              .filter(r => cinemaFilter === 'ALL' || String(r.cinemaId) === String(cinemaFilter))
              .map(r => (
                <option key={r.id} value={r.id} style={{ color: 'black' }}>{r.name}</option>
              ))
            }
          </select>

          {/* Date Filter */}
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'inherit', outline: 'none', cursor: 'pointer' }}
          />

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)', color: 'inherit', outline: 'none', width: '150px'
              }}
            />
          </div>
          
          <button 
            className="btn-primary" 
            onClick={() => navigate('/showtimes/create')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Thêm Lịch chiếu
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
                  <th style={{ padding: '15px' }}>Phim</th>
                  <th style={{ padding: '15px' }}>Rạp chiếu</th>
                  <th style={{ padding: '15px' }}>Phòng chiếu</th>
                  <th style={{ padding: '15px' }}>Ngày chiếu</th>
                  <th style={{ padding: '15px' }}>Khung giờ</th>
                  <th style={{ padding: '15px' }}>Giá vé (VNĐ)</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentShowtimes.map((showtime) => (
                  <tr key={showtime.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px' }}>#{showtime.id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{getMovieName(showtime.movieId)}</td>
                    <td style={{ padding: '15px' }}>{getCinemaName(showtime.roomId)}</td>
                    <td style={{ padding: '15px' }}>{getRoomName(showtime.roomId)}</td>
                    <td style={{ padding: '15px' }}>{formatDate(showtime.showDate)}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '4px 8px', background: 'var(--border-color)', borderRadius: '4px' }}>
                        {formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#10b981', fontWeight: 'bold' }}>
                      {showtime.basePrice ? showtime.basePrice.toLocaleString() + ' đ' : 'N/A'}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <button 
                        onClick={() => navigate(`/showtimes/edit/${showtime.id}`)}
                        style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: '5px', marginRight: '10px' }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(showtime.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentShowtimes.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      Không tìm thấy lịch chiếu nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
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

export default ShowtimeList;
