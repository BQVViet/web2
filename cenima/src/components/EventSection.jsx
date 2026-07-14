import React, { useRef, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import '../styles/EventSection.css';

const EventSection = () => {
  const eventSliderRef = useRef(null);
  const [eventItems, setEventItems] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await axiosClient.get('/promotions');
        if (data && data.length > 0) {
          setEventItems(data);
        } else {
          setEventItems(getFallbackEvents());
        }
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
        setEventItems(getFallbackEvents());
      }
    };
    fetchPromotions();
  }, []);

  const getFallbackEvents = () => [
    {
      id: 1,
      title: "ĐỒNG GIÁ 79.000 ĐỒNG",
      description: "Áp dụng cho tất cả khách hàng thành viên CGV trên toàn quốc khi đặt vé trực tuyến.",
      imageUrl: "/images/media__1781694318215.png"
    },
    {
      id: 2,
      title: "NEW FUNCTION ONLINE PACKAGE",
      description: "Trọn gói tiện lợi, trọn vẹn trải nghiệm dịch vụ bắp nước và vé xem phim trực tuyến.",
      imageUrl: "/images/media__1781694331166.png"
    },
    {
      id: 3,
      title: "GIA NHẬP NGAY - QUÀ TẶNG ĐẦY TAY",
      description: "Đăng ký thành viên CGV hôm nay nhận ngay những phần quà hấp dẫn từ CGV Cinemas.",
      imageUrl: "/images/media__1781694342202.png"
    },
    {
      id: 4,
      title: "HAPPY BIRTHDAY TO CGV MEMBERS!",
      description: "Quà tặng sinh nhật đặc biệt dành riêng cho các thành viên thân thiết của CGV.",
      imageUrl: "/images/media__1781694364694.png"
    }
  ];

  const scroll = (direction) => {
    if (eventSliderRef.current) {
      const scrollAmount = 300;
      eventSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="event-section container" style={{ borderTop: '2px solid #ddd', marginTop: '40px', paddingTop: '40px' }}>
      {/* Events & Promotions Section */}
      <div className="section-title">
        <h2>EVENT</h2>
      </div>

      {/* Red Ribbon Banner */}
      <div className="event-ribbon">
        <span className="ribbon-text">Thành Viên CGV | Tin Mới & Ưu Đãi</span>
      </div>

      {/* Event Slider Grid */}
      <div className="event-slider-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        <button className="slider-btn prev" onClick={() => scroll('left')} style={{ left: '-25px' }}>&lt;</button>
        
        <div className="event-grid-new slider-mode" ref={eventSliderRef}>
          {eventItems.map((p) => (
            <div key={p.id} className="event-card-new" style={{ border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: 0, width: '275px', minWidth: '275px' }}>
              <img 
                src={p.imageUrl} 
                alt={p.title} 
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 0 }} 
              />
            </div>
          ))}
        </div>

        <button className="slider-btn next" onClick={() => scroll('right')} style={{ right: '-25px' }}>&gt;</button>
      </div>
    </div>
  );
};

export default EventSection;

