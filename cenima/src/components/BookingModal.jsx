import React, { useState, useEffect } from 'react';
import '../styles/BookingModal.css';
import axiosClient from '../api/axiosClient';

const generateDates = () => {
  const result = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 45; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      fullDate: d.toISOString().split('T')[0],
      month: String(d.getMonth() + 1).padStart(2, '0'),
      dayOfWeek: dayNames[d.getDay()],
      date: String(d.getDate()).padStart(2, '0')
    });
  }
  return result;
};

const BookingModal = ({ isOpen, onClose, movieTitle, initialStep = 1, initialSuccessInfo = null, initialShowtime = null, initialSelectedSeats = [] }) => {
  const dates = generateDates();
  const [step, setStep] = useState(initialStep); // Steps: 1 (Showtime), 2 (Seats), 3 (Foods), 4 (Payment), 5 (Success)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4500);
  };
  
  // Selection states
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [selectedCity, setSelectedCity] = useState('HCM');
  const [selectedFormat, setSelectedFormat] = useState('2D');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({}); // foodId -> qty
  const [selectedFlavors, setSelectedFlavors] = useState({}); // foodId -> flavor
  const [paymentMethod, setPaymentMethod] = useState('MoMo');
  const [promoCode, setPromoCode] = useState('');

  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState('');


  // DB Data states
  const [dbShowtimes, setDbShowtimes] = useState([]);
  const [dbCinemas, setDbCinemas] = useState([]);
  const [dbRooms, setDbRooms] = useState([]);
  const [dbMovies, setDbMovies] = useState([]);
  
  // Booking progress states
  const [seatMap, setSeatMap] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setSelectedShowtime(initialShowtime);
      setSelectedSeats(initialSelectedSeats);
      setSelectedFoods({});
      setSelectedFlavors({});
      setSuccessInfo(initialSuccessInfo);
      setPromoCode('');
      setPromoApplied(false);
      setDiscountAmount(0);
      setPromoError('');
      fetchBookingData();
    }
  }, [isOpen, initialStep, initialSuccessInfo, initialShowtime, initialSelectedSeats]);




  const fetchBookingData = async () => {
    try {
      setLoading(true);
      const [showtimeData, cinemaData, roomData, movieData] = await Promise.all([
        axiosClient.get('/showtimes'),
        axiosClient.get('/cinemas'),
        axiosClient.get('/rooms'),
        axiosClient.get('/movies')
      ]);
      setDbShowtimes(Array.isArray(showtimeData) ? showtimeData : []);
      setDbCinemas(Array.isArray(cinemaData) ? cinemaData : []);
      setDbRooms(Array.isArray(roomData) ? roomData : []);
      setDbMovies(Array.isArray(movieData) ? movieData : []);
    } catch (e) {
      console.error("Error fetching booking data:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadSeatMap = async (showtimeId) => {
    try {
      setLoading(true);
      const data = await axiosClient.get(`/showtimes/${showtimeId}/seat-map`);
      setSeatMap(Array.isArray(data?.seats) ? data.seats : []);
    } catch (e) {
      console.error("Error loading seat map:", e);
      showToast("Không thể tải sơ đồ ghế cho suất chiếu này.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/food-drinks');
      setAllFoods(Array.isArray(data) ? data.filter(f => f.active !== false) : []);
    } catch (e) {
      console.error("Error loading foods:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const cities = [
    { id: 'HCM', name: 'Hồ Chí Minh' },
    { id: 'HN', name: 'Hà Nội' },
    { id: 'DN', name: 'Đà Nẵng' },
    { id: 'CT', name: 'Cần Thơ' }
  ];

  const formats = [
    { id: '2D', name: '2D Phụ Đề Việt' },
    { id: '2D-DUB', name: '2D Lồng Tiếng Việt' },
    { id: 'IMAX2D', name: 'IMAX2D Phụ Đề Việt' }
  ];

  // Helper to map DB cinemas to cities
  const getCinemaCityId = (cinema) => {
    const str = `${cinema.name} ${cinema.address}`.toLowerCase();
    if (str.includes('hà nội') || str.includes('hn')) return 'HN';
    if (str.includes('đà nẵng') || str.includes('dn')) return 'DN';
    if (str.includes('cần thơ') || str.includes('ct')) return 'CT';
    return 'HCM';
  };

  // Find the database movie matching the selected title
  const currentMovie = dbMovies.find(
    m => m.title && m.title.toLowerCase() === movieTitle.toLowerCase()
  );

  // Filter showtimes for this movie and selected date
  const filteredShowtimes = dbShowtimes.filter(s => 
    currentMovie && 
    Number(s.movieId) === Number(currentMovie.id) && 
    s.showDate === selectedDate
  );

  // Group showtimes by cinema
  const cinemaMap = {};
  filteredShowtimes.forEach(showtime => {
    const room = dbRooms.find(r => Number(r.id) === Number(showtime.roomId));
    if (room) {
      const cinema = dbCinemas.find(c => Number(c.id) === Number(room.cinemaId));
      if (cinema) {
        const cityId = getCinemaCityId(cinema);
        if (cityId === selectedCity) {
          if (!cinemaMap[cinema.id]) {
            cinemaMap[cinema.id] = {
              id: cinema.id,
              name: cinema.name,
              room: room.name,
              showtimes: []
            };
          }
          cinemaMap[cinema.id].showtimes.push(showtime);
        }
      }
    }
  });

  const cinemasToShow = Object.values(cinemaMap);
  cinemasToShow.forEach(c => c.showtimes.sort((a, b) => a.startTime.localeCompare(b.startTime)));

  // Format "HH:mm:ss" -> "HH:mm"
  const formatTimeStr = (time) => {
    return time && time.length >= 5 ? time.slice(0, 5) : time;
  };

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    loadSeatMap(showtime.id);
    setStep(2);
  };

  // Seat Grid formatting for Step 2
  const uniqueSeats = [];
  const uniqueKeys = new Set();
  seatMap.forEach(s => {
    const key = `${s.rowNumber}-${s.seatNumber}`;
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueSeats.push(s);
    }
  });

  const seatGrid = {};
  uniqueSeats.forEach(seat => {
    if (!seatGrid[seat.rowNumber]) seatGrid[seat.rowNumber] = [];
    seatGrid[seat.rowNumber].push(seat);
  });
  Object.keys(seatGrid).forEach(row => {
    seatGrid[row].sort((a, b) => a.seatNumber - b.seatNumber);
  });
  const sortedRows = Object.keys(seatGrid).sort();

  const handleSeatClick = (seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'DISABLED') return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const getSeatPrice = (seat) => {
    if (!selectedShowtime) return 0;
    let base = selectedShowtime.basePrice || 0;
    if (seat.type === 'VIP') base += 20000;
    if (seat.type === 'COUPLE') base += 40000;
    return base;
  };

  const getSeatsTotal = () => {
    return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  };

  const getFoodsTotal = () => {
    return Object.entries(selectedFoods).reduce((sum, [foodId, qty]) => {
      const fd = allFoods.find(f => String(f.id) === String(foodId));
      return sum + (fd ? fd.price * qty : 0);
    }, 0);
  };

  const getTotalPrice = () => {
    const total = getSeatsTotal() + getFoodsTotal() - discountAmount;
    return total > 0 ? total : 0;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      setPromoError('');
      const data = await axiosClient.get(`/vouchers/apply/${promoCode.trim()}`);
      setDiscountAmount(data.discountAmount || 0);
      setPromoApplied(true);
      showToast("Áp dụng mã khuyến mãi thành công!", "success");
    } catch (e) {
      console.error(e);
      const errMsg = e.response?.data?.message || "Mã khuyến mãi không hợp lệ hoặc đã hết hạn!";
      setPromoError(errMsg);
      setDiscountAmount(0);
      setPromoApplied(false);
      showToast(errMsg, "error");
    }
  };


  const handleFoodQtyChange = (foodId, delta) => {
    setSelectedFoods(prev => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [foodId]: next };
    });
  };

  const handleGoToFoods = () => {
    loadFoods();
    setStep(3);
  };

  const handleCheckout = async () => {
    setBookingLoading(true);
    try {
      // Map selected foods: filter only values > 0
      const foodDrinksMap = {};
      const foodFlavorsMap = {};
      Object.entries(selectedFoods).forEach(([id, qty]) => {
        if (qty > 0) {
          foodDrinksMap[id] = qty;
          
          // Check if this food item is popcorn/bắp
          const fd = allFoods.find(f => String(f.id) === String(id));
          const isPopcorn = fd?.name.toLowerCase().includes('bắp') || 
                            fd?.name.toLowerCase().includes('popcorn') || 
                            fd?.description.toLowerCase().includes('bắp');
          if (isPopcorn) {
            foodFlavorsMap[id] = selectedFlavors[id] || 'Ngọt';
          }
        }
      });

      const payload = {
        showtimeId: selectedShowtime.id,
        seatIds: selectedSeats.map(s => s.id),
        foodDrinks: foodDrinksMap,
        foodFlavors: foodFlavorsMap,
        paymentMethod: paymentMethod,
        voucherCode: promoApplied ? promoCode : null
      };


      const response = await axiosClient.post('/invoices', payload);
      if (response && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setSuccessInfo(response);
        setStep(5);
      }

    } catch (e) {
      console.error("Booking failed:", e);
      showToast(e.response?.data?.message || "Đặt vé thất bại. Vui lòng kiểm tra lại sơ đồ ghế!", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          <div className="toast-icon">
            {notification.type === 'success' ? '✓' : '✕'}
          </div>
          <div className="toast-message">{notification.message}</div>
        </div>
      )}
      <div className="modal-overlay">
        <div className="booking-modal" style={{ width: step === 2 ? '950px' : '850px' }}>
        <button className="close-btn" onClick={onClose} disabled={bookingLoading}>×</button>
        <h2 className="booking-movie-title">{movieTitle}</h2>
        
        {/* Step Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px', fontSize: '14px', fontWeight: 'bold' }}>
          <span style={{ color: step === 1 ? 'var(--cgv-red)' : 'var(--cgv-text-muted)' }}>1. Chọn Suất</span>
          <span>&gt;</span>
          <span style={{ color: step === 2 ? 'var(--cgv-red)' : 'var(--cgv-text-muted)' }}>2. Chọn Ghế</span>
          <span>&gt;</span>
          <span style={{ color: step === 3 ? 'var(--cgv-red)' : 'var(--cgv-text-muted)' }}>3. Bắp Nước</span>
          <span>&gt;</span>
          <span style={{ color: step === 4 ? 'var(--cgv-red)' : 'var(--cgv-text-muted)' }}>4. Thanh Toán</span>
        </div>

        {/* STEP 1: Select Showtime */}
        {step === 1 && (
          <>
            {/* Date Selector */}
            <div className="date-selector section-border">
              {dates.map((d) => (
                <div 
                  key={d.fullDate} 
                  className={`date-item ${selectedDate === d.fullDate ? 'active' : ''}`}
                  onClick={() => setSelectedDate(d.fullDate)}
                >
                  <div className="month">{d.month}</div>
                  <div className="day-info">
                    <span className="day-of-week">{d.dayOfWeek}</span>
                    <span className="date-num">{d.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* City Selector */}
            <div className="city-selector section-border">
              {cities.map((city) => (
                <div 
                  key={city.id} 
                  className={`city-item ${selectedCity === city.id ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city.id)}
                >
                  {city.name}
                </div>
              ))}
            </div>

            {/* Format Selector */}
            <div className="format-selector section-border">
              {formats.map((format) => (
                <div 
                  key={format.id} 
                  className={`format-item ${selectedFormat === format.id ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  {format.name}
                </div>
              ))}
            </div>

            {/* Cinemas & Showtimes */}
            <div className="cinema-list">
              {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--cgv-text-muted)', padding: '20px' }}>
                  Đang tải lịch chiếu từ hệ thống...
                </p>
              ) : cinemasToShow.length > 0 ? (
                cinemasToShow.map(cinema => (
                  <div key={cinema.id} className="cinema-item">
                    <h3>{cinema.name}</h3>
                    <p className="room-format">{cinema.room} (2D)</p>
                    <div className="showtimes">
                      {cinema.showtimes.map(st => (
                        <button 
                          key={st.id} 
                          className="time-btn"
                          onClick={() => handleSelectShowtime(st)}
                        >
                          {formatTimeStr(st.startTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--cgv-text-muted)', padding: '20px' }}>
                  Không có suất chiếu nào cho phim này vào ngày đã chọn.
                </p>
              )}
            </div>
          </>
        )}

        {/* STEP 2: Interactive Seat Selection */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--cgv-dark)' }}>Bước 2: Chọn ghế ngồi</h3>
            
            {loading ? (
              <p style={{ textAlign: 'center', padding: '30px' }}>Đang tải sơ đồ ghế...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0e1726', padding: '30px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Screen Indicator */}
                <div style={{ width: '80%', height: '8px', background: '#3b82f6', borderRadius: '4px', margin: '0 auto 8px auto', boxShadow: '0 4px 12px rgba(59,130,246,0.6)' }}></div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '3px' }}>MÀN HÌNH CHÍNH</div>
                
                {/* Seating Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
                  {sortedRows.map(row => (
                    <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '20px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{row}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {seatGrid[row].map(seat => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          
                          let bg = '#192b4a'; // AVAILABLE standard
                          let color = 'white';
                          let border = '1px solid rgba(255,255,255,0.1)';
                          
                          if (seat.type === 'VIP') bg = '#f59e0b';
                          if (seat.type === 'COUPLE') bg = '#ec4899';
                          if (isSelected) {
                            bg = '#10b981'; // Green for selected
                            border = '2px solid #ffffff';
                          }
                          if (seat.status === 'BOOKED') {
                            bg = '#374151'; // Dark gray
                            color = 'rgba(255,255,255,0.2)';
                            border = 'none';
                          }
                          if (seat.status === 'DISABLED') {
                            bg = '#1f2937';
                            color = 'rgba(255,255,255,0.1)';
                            border = 'none';
                          }

                          return (
                            <React.Fragment key={seat.id}>
                              <button
                                onClick={() => handleSeatClick(seat)}
                                disabled={seat.status === 'BOOKED' || seat.status === 'DISABLED'}
                                style={{
                                  width: seat.type === 'COUPLE' ? '76px' : '36px',
                                  height: '36px',
                                  borderRadius: '6px',
                                  background: bg,
                                  color: color,
                                  border: border,
                                  cursor: (seat.status === 'BOOKED' || seat.status === 'DISABLED') ? 'not-allowed' : 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title={`Ghế ${row}${seat.seatNumber} - ${seat.type}`}
                              >
                                {seat.seatNumber}
                              </button>
                              {/* Lối đi phân chia cụm ghế */}
                              {(seat.seatNumber === Math.floor(seatGrid[row].length / 4) || seat.seatNumber === seatGrid[row].length - Math.floor(seatGrid[row].length / 4)) && (
                                <div className="aisle-spacer" style={{ width: '24px' }}></div>
                              )}
                            </React.Fragment>
                          );

                        })}
                      </div>
                      <div style={{ width: '20px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'right' }}>{row}</div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '30px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#192b4a' }}></div> Standard</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#f59e0b' }}></div> VIP (+20k)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#ec4899' }}></div> Couple (+40k)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#10b981' }}></div> Đang chọn</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#374151' }}></div> Đã bán</div>
                </div>
              </div>
            )}

            {/* Footer Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Ghế đã chọn:</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                  {selectedSeats.length > 0 ? selectedSeats.map(s => `${s.rowNumber}${s.seatNumber}`).join(', ') : 'Chưa chọn'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>Tạm tính vé:</div>
                <div style={{ fontWeight: '900', fontSize: '20px', color: '#10b981', textAlign: 'right' }}>
                  {getSeatsTotal().toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="city-item" onClick={() => setStep(1)}>Quay lại</button>
              <button 
                className="city-item active" 
                disabled={selectedSeats.length === 0}
                onClick={handleGoToFoods}
                style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1, cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Food & Drinks */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--cgv-dark)' }}>Bước 3: Chọn bắp nước (Tuỳ chọn)</h3>
            
            {loading ? (
              <p style={{ textAlign: 'center', padding: '30px' }}>Đang tải danh sách bắp nước...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto', paddingRight: '6px' }}>
                {allFoods.map(food => {
                  const qty = selectedFoods[food.id] || 0;
                  return (
                    <div key={food.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {food.imageUrl ? (
                          <img src={food.imageUrl} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '20px' }}>🍿</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{food.name}</h4>
                        <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b' }}>{food.description || 'Không có mô tả'}</p>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>{food.price.toLocaleString('vi-VN')} ₫</span>
                        {qty > 0 && (food.name.toLowerCase().includes('bắp') || 
                                     food.name.toLowerCase().includes('popcorn') || 
                                     (food.description && food.description.toLowerCase().includes('bắp'))) && (
                          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Chọn vị bắp:</span>
                            <select
                              value={selectedFlavors[food.id] || 'Ngọt'}
                              onChange={(e) => setSelectedFlavors(prev => ({ ...prev, [food.id]: e.target.value }))}
                              style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', background: 'white', cursor: 'pointer' }}
                            >
                              <option value="Ngọt">Ngọt (Sweet)</option>
                              <option value="Mặn">Mặn (Salty)</option>
                              <option value="Phô mai">Phô mai (Cheese)</option>
                              <option value="Caramel">Caramel</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          onClick={() => handleFoodQtyChange(food.id, -1)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', minWidth: '16px', textAlign: 'center' }}>{qty}</span>
                        <button 
                          onClick={() => handleFoodQtyChange(food.id, 1)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Tổng bắp nước:</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                  {getFoodsTotal().toLocaleString('vi-VN')} ₫
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>Tổng cộng:</div>
                <div style={{ fontWeight: '900', fontSize: '20px', color: '#ef4444', textAlign: 'right' }}>
                  {getTotalPrice().toLocaleString('vi-VN')} ₫
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="city-item" onClick={() => setStep(2)}>Quay lại</button>
              <button className="city-item active" onClick={() => setStep(4)}>Tiếp tục</button>
            </div>
          </div>
        )}

        {/* STEP 4: Summary & Payment */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--cgv-dark)' }}>Bước 4: Xác nhận thanh toán</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Summary Sheet */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', fontWeight: 'bold' }}>THÔNG TIN ĐẶT VÉ</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <div><strong>Phim:</strong> {movieTitle}</div>
                  <div><strong>Suất chiếu:</strong> {selectedShowtime.showDate} | {formatTimeStr(selectedShowtime.startTime)}</div>
                  <div><strong>Ghế ngồi:</strong> {selectedSeats.map(s => `${s.rowNumber}${s.seatNumber}`).join(', ')}</div>
                  {Object.values(selectedFoods).some(q => q > 0) && (
                    <div>
                      <strong>Bắp nước:</strong>
                      <div style={{ paddingLeft: '10px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        {Object.entries(selectedFoods).map(([foodId, qty]) => {
                          if (qty <= 0) return null;
                          const fd = allFoods.find(f => String(f.id) === String(foodId));
                          return fd ? <div key={foodId}>- {fd.name} (x{qty})</div> : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Channel select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>TỔNG SỐ TIỀN THANH TOÁN</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#16a34a', marginTop: '8px' }}>
                    {getTotalPrice().toLocaleString('vi-VN')} ₫
                  </div>
                </div>

                 <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Phương thức thanh toán</label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
                  >
                    <option value="Thanh toán tại quày">💳 Thanh toán tại quầy (Nhân viên hỗ trợ)</option>
                    <option value="VNPay">🏦 Cổng VNPay</option>
                    <option value="Momo">📱 Ví Momo</option>
                  </select>
                </div>

                {/* Coupon Code section */}
                <div style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', background: '#f8fafc' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '13px' }}>Mã khuyến mãi / Quà tặng</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Mã voucher (e.g. CGV50K)" 
                      value={promoCode} 
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      disabled={promoApplied || bookingLoading}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: promoApplied ? '#e2e8f0' : 'white' }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode || bookingLoading}
                      style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'var(--cgv-red)', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: (promoApplied || !promoCode) ? 0.6 : 1, fontSize: '13px' }}
                    >
                      {promoApplied ? 'Đã áp dụng' : 'Áp dụng'}
                    </button>
                  </div>
                  {promoError && <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>{promoError}</p>}
                  {promoApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '13px', color: '#16a34a', fontWeight: 'bold' }}>
                      <span>Đã áp dụng giảm giá:</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="city-item" onClick={() => setStep(3)} disabled={bookingLoading}>Quay lại</button>
              <button 
                className="city-item active" 
                onClick={handleCheckout}
                disabled={bookingLoading}
                style={{ minWidth: '150px' }}
              >
                {bookingLoading ? 'Đang giao dịch...' : 'Thanh toán & Đặt vé'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Success Confirmation */}
        {step === 5 && successInfo && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <span style={{ fontSize: '36px', color: '#16a34a' }}>✓</span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginBottom: '8px' }}>ĐẶT VÉ THÀNH CÔNG!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Cảm ơn quý khách. Vé của bạn đã được xuất trên hệ thống.</p>
            
            {/* Ticket Slip */}
            <div style={{ maxWidth: '400px', margin: '0 auto', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'left', position: 'relative' }}>
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>
                MÃ HÓA ĐƠN: <strong>#TKT{successInfo.invoiceId || successInfo.id}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div><strong>Phim:</strong> {movieTitle}</div>
                <div><strong>Suất chiếu:</strong> {successInfo.showDate || (selectedShowtime && selectedShowtime.showDate)} | {formatTimeStr(successInfo.startTime || (selectedShowtime && selectedShowtime.startTime))}</div>
                <div><strong>Ghế ngồi:</strong> {successInfo.seats || selectedSeats.map(s => `${s.rowNumber}${s.seatNumber}`).join(', ')}</div>
                {((successInfo.foods && successInfo.foods.length > 0) || Object.values(selectedFoods).some(q => q > 0)) && (
                  <div>
                    <strong>Bắp nước kèm:</strong> {successInfo.foods ? successInfo.foods : Object.entries(selectedFoods).map(([id, qty]) => {
                      if (qty <= 0) return null;
                      const fd = allFoods.find(f => String(f.id) === String(id));
                      const isPopcorn = fd?.name.toLowerCase().includes('bắp') || 
                                        fd?.name.toLowerCase().includes('popcorn') || 
                                        fd?.description.toLowerCase().includes('bắp');
                      const flavorStr = isPopcorn ? ` (${selectedFlavors[id] || 'Ngọt'})` : '';
                      return fd ? `${fd.name}${flavorStr} (x${qty})` : null;
                    }).filter(Boolean).join(', ')}

                  </div>
                )}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Thanh toán:</strong>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>{successInfo.totalAmount.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}><strong>Phương thức:</strong> {successInfo.paymentMethod}</div>
              </div>
            </div>


            <button 
              className="city-item active" 
              onClick={onClose}
              style={{ marginTop: '30px', padding: '10px 40px', borderRadius: '20px' }}
            >
              Đóng
            </button>
          </div>
        )}

      </div>
    </div>
    </>
  );
};

export default BookingModal;
