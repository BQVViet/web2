import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import showtimeApi from '../api/showtimeApi';
import movieApi from '../api/movieApi';
import roomApi from '../api/roomApi';
import '../styles/Movies.css';

const ShowtimeList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showtimeData, movieData, roomData] = await Promise.all([
        showtimeApi.getAll(),
        movieApi.getAll(),
        roomApi.getAll()
      ]);
      setShowtimes(showtimeData);
      setMovies(movieData);
      setRooms(roomData);
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

  const getMovieName = (id) => {
    const movie = movies.find(m => m.id === id);
    return movie ? movie.title : `Phim #${id}`;
  };

  const getRoomName = (id) => {
    const room = rooms.find(r => r.id === id);
    return room ? room.name : `Phòng #${id}`;
  };

  // Filter based on movie name or room name
  const filteredShowtimes = showtimes.filter(s => 
    getMovieName(s.movieId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoomName(s.roomId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.showDate || '').includes(searchTerm)
  );
  
  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);
  const currentShowtimes = filteredShowtimes.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="movies-page">
      <div className="filter-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'inherit' }}>Danh sách Lịch chiếu</h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên phim, phòng, ngày..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)', color: 'inherit', outline: 'none', width: '250px'
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
                    <td style={{ padding: '15px' }}>{getRoomName(showtime.roomId)}</td>
                    <td style={{ padding: '15px' }}>{showtime.showDate}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '4px 8px', background: 'var(--border-color)', borderRadius: '4px' }}>
                        {showtime.startTime} - {showtime.endTime}
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
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
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
                <ChevronLeft size={16} /> Prev
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
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShowtimeList;
