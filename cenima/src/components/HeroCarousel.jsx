import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bannerApi } from '../api/bannerApi';
import '../styles/HeroCarousel.css';

const HeroCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerApi.getActiveBanners();
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback static banners if API returns empty or fails
          setBanners([
            { id: 1, imageUrl: '/images/cgv_visa_banner_1781694585276.png', title: 'Banner 1' },
            { id: 2, imageUrl: '/images/media__1781694318215.png', title: 'Banner 2' },
            { id: 3, imageUrl: '/images/media__1781694331166.png', title: 'Banner 3' },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch banners", error);
        setBanners([
          { id: 1, imageUrl: '/images/cgv_visa_banner_1781694585276.png', title: 'Banner 1' },
          { id: 2, imageUrl: '/images/media__1781694318215.png', title: 'Banner 2' },
          { id: 3, imageUrl: '/images/media__1781694331166.png', title: 'Banner 3' },
        ]);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) return null;

  return (
    <div className="hero-carousel-container">
      <div className="hero-carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img 
              src={banner.imageUrl} 
              alt={banner.title || `Banner ${index + 1}`} 
              className="carousel-img"
            />
            {/* Optional gradient overlay for a premium look */}
            <div className="carousel-overlay"></div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button className="carousel-control prev" onClick={handlePrev} aria-label="Previous Banner">
            <ChevronLeft size={36} />
          </button>
          <button className="carousel-control next" onClick={handleNext} aria-label="Next Banner">
            <ChevronRight size={36} />
          </button>

          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
