import React, { useState, useEffect } from 'react';
import '../styles/BookingModal.css';

const generateDates = () => {
  const result = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 14; i++) {
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

const BookingModal = ({ isOpen, onClose, movieTitle }) => {
  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const [selectedCity, setSelectedCity] = useState('HCM');
  const [selectedFormat, setSelectedFormat] = useState('2D');

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

  const allCinemas = [
    { id: 1, cityId: 'HCM', name: 'CGV Menas Mall (CGV CT Plaza)', room: 'Rạp 2D', times: ['18:30', '20:50', '22:15'] },
    { id: 2, cityId: 'HCM', name: 'CGV Hùng Vương Plaza', room: 'Rạp 2D', times: ['19:30', '21:00', '23:05'] },
    { id: 3, cityId: 'HCM', name: 'CGV Landmark 81', room: 'IMAX 2D', times: ['18:00', '20:30', '23:00'] },
    { id: 4, cityId: 'HN', name: 'CGV Vincom Center Bà Triệu', room: 'Rạp 2D', times: ['19:00', '21:15'] },
    { id: 5, cityId: 'HN', name: 'CGV Hồ Gươm Plaza', room: 'Rạp 2D', times: ['20:00', '22:30'] },
    { id: 6, cityId: 'DN', name: 'CGV Vincom Đà Nẵng', room: 'Rạp 2D', times: ['19:45', '22:00'] },
    { id: 7, cityId: 'CT', name: 'CGV Vincom Hùng Vương', room: 'Rạp 2D', times: ['20:15', '22:45'] }
  ];

  const filteredCinemas = allCinemas.filter(c => c.cityId === selectedCity);

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="booking-movie-title">{movieTitle || 'ĐẶT VÉ'}</h2>
        
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
          {filteredCinemas.length > 0 ? (
            filteredCinemas.map(cinema => (
              <div key={cinema.id} className="cinema-item">
                <h3>{cinema.name}</h3>
                <p className="room-format">{cinema.room}</p>
                <div className="showtimes">
                  {cinema.times.map(time => (
                    <div key={time} className="time-btn">{time}</div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--cgv-text-muted)', padding: '20px' }}>
              Không có suất chiếu nào tại khu vực này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
