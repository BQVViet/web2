import React, { useState, useEffect } from 'react';
import '../styles/BookingModal.css';
import axiosClient from '../api/axiosClient';

const generateDates = () => {
  const result = [];
  const today = new Date();
  const dayNames = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
  for (let i = 0; i < 90; i++) {
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

const BookingPage = ({ movieTitle, onClose, initialStep = 1, initialSuccessInfo = null, initialShowtime = null, initialSelectedSeats }) => {
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

  // Fetch static data once on mount
  useEffect(() => {
    fetchBookingData();
  }, []);

  useEffect(() => {
    if (step !== 2 || !selectedShowtime?.id) return;

    const intervalId = window.setInterval(() => {
      loadSeatMap(selectedShowtime.id, true);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [step, selectedShowtime?.id]);

  // Sync state whenever key props change (prevents infinite loop from unstable reference defaults)
  useEffect(() => {
    setStep(initialStep);
    setSelectedShowtime(initialShowtime);
    setSelectedSeats(initialSelectedSeats || []);
    setSelectedFoods({});
    setSelectedFlavors({});
    setSuccessInfo(initialSuccessInfo);
    setPromoCode('');
    setPromoApplied(false);
    setDiscountAmount(0);
    setPromoError('');
  }, [movieTitle, initialStep, initialSuccessInfo]);

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

  const loadSeatMap = async (showtimeId, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await axiosClient.get(`/showtimes/${showtimeId}/seat-map`);
      setSeatMap(Array.isArray(data?.seats) ? data.seats : []);
    } catch (e) {
      console.error("Error loading seat map:", e);
      if (!silent) {
        showToast("Không thể tải sơ đồ ghế cho suất chiếu này.", "error");
      }
    } finally {
      if (!silent) setLoading(false);
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

  const getCinemaCityId = (cinema) => {
    if (!cinema) return 'HCM';
    const str = `${cinema.name || ''} ${cinema.address || ''}`.toLowerCase();
    if (str.includes('hà nội') || str.includes('hn')) return 'HN';
    if (str.includes('đà nẵng') || str.includes('dn')) return 'DN';
    if (str.includes('cần thơ') || str.includes('ct')) return 'CT';
    return 'HCM';
  };

  const getShowtimeDateStr = (showDate) => {
    if (!showDate) return '';
    if (Array.isArray(showDate)) {
      const [year, month, day] = showDate;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return String(showDate);
  };

  const getSelectedMonthYearStr = () => {
    if (!selectedDate) return '';
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      return `Tháng ${parts[1]} / ${parts[0]}`;
    }
    return '';
  };

  const formatTimeStr = (time) => {
    if (!time) return '';
    if (Array.isArray(time)) {
      const [hour, minute] = time;
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    const timeStr = String(time);
    return timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr;
  };

  const currentMovie = dbMovies.find(
    m => m.title && movieTitle && m.title.toLowerCase() === movieTitle.toLowerCase()
  );

  const filteredShowtimes = dbShowtimes.filter(s => 
    currentMovie && 
    Number(s.movieId) === Number(currentMovie.id) && 
    getShowtimeDateStr(s.showDate) === selectedDate
  );

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

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    loadSeatMap(showtime.id);
    setStep(2);
  };

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
      let finalVoucherCode = null;
      if (promoCode.trim()) {
        if (promoApplied) {
          finalVoucherCode = promoCode.trim();
        } else {
          // Auto-apply if filled but not clicked "Apply"
          try {
            const data = await axiosClient.get(`/vouchers/apply/${promoCode.trim()}`);
            finalVoucherCode = promoCode.trim();
            setDiscountAmount(data.discountAmount || 0);
            setPromoApplied(true);
            showToast("Tự động áp dụng mã khuyến mãi thành công!", "success");
          } catch (err) {
            const errMsg = err.response?.data?.message || "Mã khuyến mãi không hợp lệ hoặc đã hết hạn!";
            setPromoError(errMsg);
            showToast(errMsg, "error");
            setBookingLoading(false);
            return;
          }
        }
      }

      const foodDrinksMap = {};
      const foodFlavorsMap = {};
      Object.entries(selectedFoods).forEach(([id, qty]) => {
        if (qty > 0) {
          foodDrinksMap[id] = qty;
          const fd = allFoods.find(f => String(f.id) === String(id));
          const isPopcorn = fd?.name?.toLowerCase().includes('bắp') || 
                            fd?.name?.toLowerCase().includes('popcorn') || 
                            fd?.description?.toLowerCase().includes('bắp');
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
        voucherCode: finalVoucherCode
      };

      const response = await axiosClient.post('/invoices', payload);
      if (response && response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setSuccessInfo(response);
        setStep(5);
        if (selectedShowtime?.id) {
          await loadSeatMap(selectedShowtime.id, true);
        }
      }
    } catch (e) {
      console.error("Booking failed:", e);
      showToast(e.response?.data?.message || "Đặt vé thất bại. Vui lòng kiểm tra lại sơ đồ ghế!", "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSidebarNext = () => {
    if (step === 1 && selectedShowtime) setStep(2);
    else if (step === 2 && selectedSeats.length > 0) handleGoToFoods();
    else if (step === 3) setStep(4);
    else if (step === 4) handleCheckout();
  };

  const isNextDisabled = () => {
    if (step === 1) return !selectedShowtime;
    if (step === 2) return selectedSeats.length === 0;
    if (step === 4) return bookingLoading;
    return false;
  };

  const getNextButtonLabel = () => {
    if (step === 1) return "Chọn Suất Chiếu";
    if (step === 2) return "Chọn Bắp Nước";
    if (step === 3) return "Xác Nhận Đơn Vé";
    if (step === 4) return bookingLoading ? "Đang giao dịch..." : "Thanh Toán & Xuất Vé";
    return "Tiếp tục";
  };

  // STEP 5 is rendered fullscreen separately
  if (step === 5 && successInfo) {
    return (
      <div style={{ backgroundColor: 'var(--cinema-dark-bg)', minHeight: 'calc(100vh - 250px)', padding: '50px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="booking-main-panel" style={{ maxWidth: '550px', width: '100%', margin: '0 auto', textAlign: 'center', background: 'var(--cinema-surface)', borderColor: 'var(--cinema-border)' }}>
          <div style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '2px solid var(--cinema-success)' }}>
            <span style={{ fontSize: '38px', color: 'var(--cinema-success)', fontWeight: 'bold' }}>✓</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--cinema-success)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ĐẶT VÉ THÀNH CÔNG!</h3>
          <p style={{ color: 'var(--cinema-text-muted)', fontSize: '14.5px', marginBottom: '25px' }}>Cảm ơn quý khách. Vé của bạn đã được lưu vào hệ thống CGV.</p>
          
          <div style={{ background: '#f8fafc', border: '1px dashed var(--cinema-border)', borderRadius: '14px', padding: '24px', textAlign: 'left', marginBottom: '30px', position: 'relative' }}>
            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--cinema-text-muted)', borderBottom: '1px dashed var(--cinema-border)', paddingBottom: '12px', marginBottom: '16px', fontWeight: '700' }}>
              MÃ HÓA ĐƠN: <strong style={{ color: 'var(--cinema-text)' }}>#TKT{successInfo.invoiceId || successInfo.id}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14.5px', color: 'var(--cinema-text)' }}>
              <div><strong style={{ color: 'var(--cinema-text-muted)' }}>Phim:</strong> {movieTitle}</div>
              <div><strong style={{ color: 'var(--cinema-text-muted)' }}>Suất chiếu:</strong> {getShowtimeDateStr(successInfo.showDate || selectedShowtime?.showDate)} | {formatTimeStr(successInfo.startTime || selectedShowtime?.startTime)}</div>
              <div><strong style={{ color: 'var(--cinema-text-muted)' }}>Ghế ngồi:</strong> <span style={{ color: 'var(--cinema-success)', fontWeight: '700' }}>{successInfo.seats || selectedSeats.map(s => `${s.rowNumber}${s.seatNumber}`).join(', ')}</span></div>
              {((successInfo.foods && successInfo.foods.length > 0) || Object.values(selectedFoods).some(q => q > 0)) && (
                <div>
                  <strong style={{ color: 'var(--cinema-text-muted)' }}>Bắp nước kèm:</strong> {successInfo.foods ? successInfo.foods : Object.entries(selectedFoods).map(([id, qty]) => {
                    if (qty <= 0) return null;
                    const fd = allFoods.find(f => String(f.id) === String(id));
                    const isPopcorn = fd?.name?.toLowerCase().includes('bắp') || 
                                      fd?.name?.toLowerCase().includes('popcorn') || 
                                      fd?.description?.toLowerCase().includes('bắp');
                    const flavorStr = isPopcorn ? ` (${selectedFlavors[id] || 'Ngọt'})` : '';
                    return fd ? `${fd.name}${flavorStr} (x${qty})` : null;
                  }).filter(Boolean).join(', ')}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--cinema-border)', paddingTop: '15px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Tổng thanh toán:</strong>
                <span style={{ fontWeight: '900', color: 'var(--cinema-success)', fontSize: '22px', textShadow: '0 0 10px var(--cinema-success-glow)' }}>{successInfo.totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--cinema-text-muted)' }}><strong style={{ color: 'var(--cinema-text-muted)' }}>Phương thức:</strong> {successInfo.paymentMethod}</div>
            </div>
          </div>

          <button 
            className="sidebar-action-btn" 
            onClick={onClose}
            style={{ width: 'auto', padding: '14px 50px', borderRadius: '30px', margin: '0 auto' }}
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

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

      {/* Steps bar */}
      <div className="booking-steps-bar">
        <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span>Chọn Suất</span>
        </div>
        <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span>Chọn Ghế</span>
        </div>
        <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span>Bắp Nước</span>
        </div>
        <div className={`step-indicator ${step >= 4 ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span>Thanh Toán</span>
        </div>
      </div>

      <div className="booking-page-layout">
        {/* Left main interactive panel */}
        <div className="booking-main-panel">
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={onClose} 
              className="tab-pill"
              style={{ fontSize: '12.5px', padding: '6px 16px' }}
              disabled={bookingLoading}
            >
              ← HỦY GIAO DỊCH
            </button>
          </div>

          {/* STEP 1: Showtime Selection */}
          {step === 1 && (
            <div>
              {/* Movie Info Header */}
              {currentMovie && (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--cinema-border)' }}>
                  <img 
                    src={currentMovie.posterUrl} 
                    alt={movieTitle} 
                    style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--cinema-text)', textTransform: 'uppercase', margin: 0 }}>
                      {currentMovie.title}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        background: currentMovie.ageRating === 'P' ? '#10b981' : '#e71a0f', 
                        color: 'white', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        padding: '3px 8px', 
                        borderRadius: '4px' 
                      }}>
                        {currentMovie.ageRating}
                      </span>
                      <span style={{ color: 'var(--cinema-text-muted)', fontSize: '13.5px', fontWeight: '600' }}>
                        {currentMovie.durationMinutes} phút
                      </span>
                      <span style={{ color: 'var(--cinema-text-muted)', fontSize: '13.5px' }}>|</span>
                      <span style={{ color: 'var(--cinema-text-muted)', fontSize: '13.5px', fontWeight: '500' }}>
                        {currentMovie.genre}
                      </span>
                      <span style={{ color: 'var(--cinema-text-muted)', fontSize: '13.5px' }}>|</span>
                      <span style={{ color: 'var(--cinema-text-muted)', fontSize: '13.5px', fontWeight: '500' }}>
                        {currentMovie.language}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: 'var(--cinema-text)' }}>1. Chọn Ngày Chiếu & Suất</h3>
              
              {/* Calendar Date Picker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', marginBottom: '25px', marginTop: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                      }
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '14px 20px 14px 48px',
                      borderRadius: '12px',
                      border: '1px solid var(--cinema-border)',
                      background: 'var(--cinema-surface)',
                      color: 'var(--cinema-text)',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {/* Calendar Icon on Left */}
                  <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '18px' }}>
                    📅
                  </div>
                </div>
              </div>

              {/* City Filter */}
              <div className="selection-tabs-row">
                {cities.map((city) => (
                  <button 
                    key={city.id} 
                    className={`tab-pill ${selectedCity === city.id ? 'active' : ''}`}
                    onClick={() => setSelectedCity(city.id)}
                  >
                    {city.name}
                  </button>
                ))}
              </div>

              {/* Format Filter */}
              <div className="selection-tabs-row" style={{ borderBottom: 'none', marginBottom: '10px' }}>
                {formats.map((format) => (
                  <button 
                    key={format.id} 
                    className={`tab-pill ${selectedFormat === format.id ? 'active' : ''}`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    {format.name}
                  </button>
                ))}
              </div>

              {/* Cinema block lists */}
              <div className="cinema-list" style={{ paddingTop: '10px' }}>
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                    Đang tải lịch chiếu từ máy chủ CGV...
                  </p>
                ) : cinemasToShow.length > 0 ? (
                  cinemasToShow.map(cinema => (
                    <div key={cinema.id} className="cinema-schedule-card">
                      <h3>{cinema.name}</h3>
                      <div className="room-label">{cinema.room} ({selectedFormat})</div>
                      <div className="showtimes-grid">
                        {cinema.showtimes.map(st => (
                          <button 
                            key={st.id} 
                            className={`showtime-btn ${selectedShowtime?.id === st.id ? 'active' : ''}`}
                            onClick={() => handleSelectShowtime(st)}
                          >
                            {formatTimeStr(st.startTime)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                    Không có suất chiếu nào phù hợp vào ngày đã chọn.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Interactive seat map */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>2. Chọn vị trí ghế ngồi</h3>
              
              {loading ? (
                <p style={{ textAlign: 'center', padding: '30px' }}>Đang tải sơ đồ phòng chiếu...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff', padding: '30px 20px', borderRadius: '16px', border: '1px solid var(--cinema-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div className="screen-skew"></div>
                  <div className="screen-label">MÀN HÌNH CHÍNH</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center', overflowX: 'auto', paddingBottom: '10px' }}>
                    {sortedRows.map(row => (
                      <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '20px', fontWeight: 'bold', color: 'var(--cinema-text-muted)', fontSize: '13px' }}>{row}</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {seatGrid[row].map(seat => {
                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                            
                            let bg = '#60a5fa';
                            let color = 'white';
                            let border = 'none';
                            
                            if (seat.type === 'VIP') {
                              bg = '#f59e0b';
                              color = 'white';
                              border = 'none';
                            }
                            if (seat.type === 'COUPLE') {
                              bg = '#ec4899';
                              color = 'white';
                              border = 'none';
                            }
                            if (isSelected) {
                              bg = '#10b981';
                              color = 'white';
                              border = '2px solid var(--cinema-primary)';
                            }
                            if (seat.status === 'BOOKED') {
                              bg = '#cbd5e1';
                              color = 'rgba(0,0,0,0.25)';
                              border = 'none';
                            }
                            if (seat.status === 'DISABLED') {
                              bg = '#f1f5f9';
                              color = 'rgba(0,0,0,0.1)';
                              border = 'none';
                            }

                            return (
                              <React.Fragment key={seat.id}>
                                <button
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={seat.status === 'BOOKED' || seat.status === 'DISABLED'}
                                  style={{
                                    width: seat.type === 'COUPLE' ? '76px' : '34px',
                                    height: '34px',
                                    borderRadius: '6px',
                                    background: bg,
                                    color: color,
                                    border: border,
                                    cursor: (seat.status === 'BOOKED' || seat.status === 'DISABLED') ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s'
                                  }}
                                  title={`Ghế ${row}${seat.seatNumber} - ${seat.type}`}
                                >
                                  {seat.seatNumber}
                                </button>
                                {(seat.seatNumber === Math.floor(seatGrid[row].length / 4) || seat.seatNumber === seatGrid[row].length - Math.floor(seatGrid[row].length / 4)) && (
                                  <div style={{ width: '20px' }}></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <div style={{ width: '20px', fontWeight: 'bold', color: 'var(--cinema-text-muted)', fontSize: '13px', textAlign: 'right' }}>{row}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '25px', fontSize: '12.5px', color: 'var(--cinema-text-muted)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#60a5fa' }}></div> Standard</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#f59e0b' }}></div> VIP (+20k)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#ec4899' }}></div> Couple (+40k)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#10b981' }}></div> Đang chọn</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#cbd5e1' }}></div> Đã bán</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', marginTop: '24px' }}>
                <button className="tab-pill" onClick={() => setStep(1)}>Quay lại bước 1</button>
              </div>
            </div>
          )}

          {/* STEP 3: Popcorn combos */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>3. Chọn bắp nước ưu đãi</h3>
              
              {loading ? (
                <p style={{ textAlign: 'center', padding: '30px' }}>Đang tải danh sách combo bắp nước...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '5px' }}>
                  {allFoods.map(food => {
                    const qty = selectedFoods[food.id] || 0;
                    return (
                      <div key={food.id} className="food-item-row">
                        <div className="food-img-wrapper">
                          {food.imageUrl ? (
                            <img src={food.imageUrl} alt={food.name} />
                          ) : (
                            <span style={{ fontSize: '22px' }}>🍿</span>
                          )}
                        </div>
                        <div className="food-details">
                          <h4 className="food-name">{food.name}</h4>
                          <p className="food-desc">{food.description}</p>
                          <span className="food-price">{food.price.toLocaleString('vi-VN')} ₫</span>
                          
                          {qty > 0 && (food.name.toLowerCase().includes('bắp') || 
                                       food.name.toLowerCase().includes('popcorn') || 
                                       (food.description && food.description.toLowerCase().includes('bắp'))) && (
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700' }}>VỊ BẮP:</span>
                              <select
                                value={selectedFlavors[food.id] || 'Ngọt'}
                                onChange={(e) => setSelectedFlavors(prev => ({ ...prev, [food.id]: e.target.value }))}
                                style={{ padding: '3px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px', background: 'white' }}
                              >
                                <option value="Ngọt">Ngọt (Sweet)</option>
                                <option value="Mặn">Mặn (Salty)</option>
                                <option value="Phô mai">Phô mai (Cheese)</option>
                                <option value="Caramel">Caramel</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="food-counter">
                          <button className="food-counter-btn" onClick={() => handleFoodQtyChange(food.id, -1)}>-</button>
                          <span className="food-qty">{qty}</span>
                          <button className="food-counter-btn" onClick={() => handleFoodQtyChange(food.id, 1)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', marginTop: '24px' }}>
                <button className="tab-pill" onClick={() => setStep(2)}>Quay lại chọn ghế</button>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Gateway */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>4. Phương thức thanh toán</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14.5px', color: '#0f172a' }}>
                    Chọn Cổng Thanh Toán
                  </label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14.5px', background: 'white', fontWeight: '600' }}
                  >
                    <option value="MoMo">Ví điện tử MoMo (Sandbox)</option>
                    <option value="VNPay">Cổng thanh toán VNPay trực tuyến</option>
                    <option value="ZaloPay">Ví điện tử ZaloPay (Sandbox)</option>
                  </select>
                </div>

                {/* Promo application */}
                <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', background: '#f8fafc' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13.5px', color: '#475569' }}>
                    Mã Khuyến Mãi / Voucher
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Nhập mã voucher giảm giá (e.g. CGV50K)" 
                      value={promoCode} 
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      disabled={promoApplied || bookingLoading}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: promoApplied ? '#e2e8f0' : 'white' }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode || bookingLoading}
                      className="tab-pill active"
                      style={{ borderRadius: '8px', padding: '0 20px', fontSize: '13.5px' }}
                    >
                      {promoApplied ? 'Đã Áp Dụng' : 'Áp Dụng'}
                    </button>
                  </div>
                  {promoError && <p style={{ color: 'var(--cgv-booking-accent)', fontSize: '12.5px', margin: '6px 0 0 0', fontWeight: '600' }}>{promoError}</p>}
                  {promoApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: '#16a34a', fontWeight: '700' }}>
                      <span>Mức giảm trừ giá vé:</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button className="tab-pill" onClick={() => setStep(3)} disabled={bookingLoading}>Quay lại chọn bắp nước</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar (Invoice breakdown) */}
        <div className="booking-summary-sidebar">
          {/* Movie Header info */}
          <div className="sidebar-movie-header">
            <img 
              src={currentMovie?.posterUrl || '/images/movie_poster_1_1781694599129.png'} 
              alt={movieTitle} 
              className="sidebar-movie-poster" 
            />
            <div className="sidebar-movie-info">
              <h4 className="sidebar-movie-title">{movieTitle}</h4>
              {currentMovie?.ageRating && (
                <span style={{ background: '#e71a0f', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                  {currentMovie.ageRating}
                </span>
              )}
            </div>
          </div>

          {/* Ticket Information Row detail */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Rạp</span>
              <span className="sidebar-info-val">
                {selectedShowtime ? dbCinemas.find(c => Number(c.id) === Number(dbRooms.find(r => Number(r.id) === Number(selectedShowtime.roomId))?.cinemaId))?.name : "Chưa chọn"}
              </span>
            </div>

            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Phòng chiếu</span>
              <span className="sidebar-info-val">
                {selectedShowtime ? dbRooms.find(r => Number(r.id) === Number(selectedShowtime.roomId))?.name : "Chưa chọn"}
              </span>
            </div>

            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Suất chiếu</span>
              <span className="sidebar-info-val">
                {selectedShowtime ? `${getShowtimeDateStr(selectedShowtime.showDate)} - ${formatTimeStr(selectedShowtime.startTime)}` : "Chưa chọn"}
              </span>
            </div>

            <div className="sidebar-info-row">
              <span className="sidebar-info-label">Ghế đã chọn</span>
              <span className="sidebar-info-val" style={{ color: '#10b981' }}>
                {selectedSeats.length > 0 ? selectedSeats.map(s => `${s.rowNumber}${s.seatNumber}`).join(', ') : "Chưa chọn"}
              </span>
            </div>

            {Object.values(selectedFoods).some(q => q > 0) && (
              <div className="sidebar-info-row">
                <span className="sidebar-info-label">Bắp nước</span>
                <span className="sidebar-info-val" style={{ fontSize: '12px' }}>
                  {Object.entries(selectedFoods).map(([foodId, qty]) => {
                    if (qty <= 0) return null;
                    const fd = allFoods.find(f => String(f.id) === String(foodId));
                    return fd ? <div key={foodId}>{fd.name} (x{qty})</div> : null;
                  }).filter(Boolean)}
                </span>
              </div>
            )}

            {promoApplied && (
              <div className="sidebar-info-row">
                <span className="sidebar-info-label">Khuyến mãi</span>
                <span className="sidebar-info-val" style={{ color: '#ef4444' }}>
                  -{discountAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            )}
          </div>

          {/* Pricing Row breakdown */}
          <div className="sidebar-total-row">
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#a3a3a3' }}>TỔNG CỘNG</span>
            <span className="sidebar-total-price">
              {getTotalPrice().toLocaleString('vi-VN')} ₫
            </span>
          </div>

          {/* Action button */}
          <button 
            className="sidebar-action-btn"
            onClick={handleSidebarNext}
            disabled={isNextDisabled()}
          >
            {getNextButtonLabel()}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingPage;
