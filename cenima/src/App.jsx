import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import MovieSelection from './components/MovieSelection';
import EventSection from './components/EventSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingPage from './components/BookingPage';
import TrailerModal from './components/TrailerModal';
import MovieDetailsModal from './components/MovieDetailsModal';
import UserProfile from './components/UserProfile';
import axiosClient from './api/axiosClient';
import PaymentResult from './pages/PaymentResult';


function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState('');
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [movieFilter, setMovieFilter] = useState(() => {
    return window.location.pathname === '/my-tickets' ? 'PROFILE' : 'ALL';
  });
  const [profileActiveTab, setProfileActiveTab] = useState(() => {
    return window.location.pathname === '/my-tickets' ? 'bookings' : 'profile';
  });
  const [vnpaySuccessInfo, setVnpaySuccessInfo] = useState(null);
  const [vnpayInitialStep, setVnpayInitialStep] = useState(1);

  const refreshSeatMapForShowtime = async (showtimeId) => {
    try {
      if (showtimeId) {
        await axiosClient.get(`/showtimes/${showtimeId}/seat-map`);
      }
    } catch (e) {
      console.error("Error refreshing seat map:", e);
    }
  };

  const fetchInvoiceDetail = async (invoiceId) => {
    try {
      const data = await axiosClient.get(`/invoices/${invoiceId}`);
      if (data) {
        // Transform tickets and foods format
        const transformedSuccessInfo = {
          id: data.id,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          createdDate: data.createdDate,
          showDate: data.tickets?.[0]?.showTime?.split(' ')?.[0] || '',
          startTime: data.tickets?.[0]?.showTime?.split(' ')?.[1] || '',
          seats: data.tickets?.map(t => t.seatName).join(', ') || '',
          foods: data.foods?.map(f => `${f.name} (x${f.quantity})`).join(', ') || ''
        };
        setSelectedMovie(data.tickets?.[0]?.movieTitle || '');
        setVnpaySuccessInfo(transformedSuccessInfo);
        setVnpayInitialStep(5);
        setMovieFilter('BOOKING');
        
        // Trigger seat map refresh after 500ms delay
        await new Promise(resolve => setTimeout(resolve, 500));
        await refreshSeatMapForShowtime(data.tickets?.[0]?.showtimeId);
      }
    } catch (e) {
      console.error("Error fetching payment return invoice details:", e);
      alert("Đã thanh toán thành công, nhưng không thể tải thông tin chi tiết đơn vé.");
    }
  };

  const handleFilterChange = (filterType) => {
    if (filterType === 'PROFILE_BOOKINGS') {
      setProfileActiveTab('bookings');
      setMovieFilter('PROFILE');
    } else if (filterType === 'PROFILE_PROMOTIONS') {
      setProfileActiveTab('promotions');
      setMovieFilter('PROFILE');
    } else if (filterType === 'PROFILE') {
      setProfileActiveTab('profile');
      setMovieFilter('PROFILE');
    } else {
      setMovieFilter(filterType);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).fullName);
    }

    // Parse VNPay return parameters
    const params = new URLSearchParams(window.location.search);
    const vnp_TxnRef = params.get('vnp_TxnRef');
    const vnp_ResponseCode = params.get('vnp_ResponseCode');
    
    if (vnp_TxnRef && vnp_ResponseCode) {
      // Extract invoiceId from vnp_TxnRef (format: invoiceId_timestamp)
      const invoiceId = vnp_TxnRef.split('_')[0];
      
      // Clear query parameters from URL without reloading page
      window.history.replaceState({}, document.title, window.location.pathname);
      
      if (vnp_ResponseCode === '00') {
        // Payment successful, poll for status update (IPN might be processing)
        let pollCount = 0;
        const pollStatus = async () => {
          try {
            const response = await axiosClient.get(`/invoices/check-payment-status/${invoiceId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response && response.paymentStatus === 'SUCCESS') {
              // Payment confirmed
              await fetchInvoiceDetail(invoiceId);
            } else if (pollCount < 15) {
              // Keep polling for up to 30 seconds
              pollCount++;
              setTimeout(pollStatus, 2000);
            } else {
              // Timeout - show manual check message
              alert("Giao dịch VNPay đã được xử lý. Vui lòng kiểm tra lại sau vài giây.");
            }
          } catch (e) {
            console.error("Error polling payment status:", e);
            if (pollCount < 15) {
              pollCount++;
              setTimeout(pollStatus, 2000);
            }
          }
        };
        
        // Start polling immediately
        pollStatus();
      } else {
        alert("Giao dịch thanh toán qua VNPay không thành công hoặc đã bị hủy. Mã lỗi: " + vnp_ResponseCode);
      }
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/my-tickets') {
      setMovieFilter('PROFILE');
      setProfileActiveTab('bookings');
    } else if (location.pathname === '/') {
      if (movieFilter === 'PROFILE') {
        setMovieFilter('ALL');
      }
    }
  }, [location.pathname]);


  const handleLoginSuccess = (fullName) => {
    setIsLoggedIn(true);
    setUserName(fullName);
    setIsAuthModalOpen(false);
    // If they were trying to book, open booking page
    if (selectedMovie) {
      setMovieFilter('BOOKING');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (movieFilter === 'PROFILE') {
      setMovieFilter('ALL');
    }
  };

  const handleProfileUpdate = (newName) => {
    setUserName(newName);
    // Update user in localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.fullName = newName;
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleBuyTicket = (movieTitle) => {
    setSelectedMovie(movieTitle);
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setMovieFilter('BOOKING');
    }
  };

  const handlePlayTrailer = (youtubeId) => {
    setSelectedTrailer(youtubeId);
    setIsTrailerModalOpen(true);
  };

  const handleViewDetails = (movie) => {
    setSelectedMovieDetails(movie);
    setIsDetailsModalOpen(true);
  };

  return (
    <Routes>
      <Route path="/payment-result" element={<PaymentResult />} />
      <Route path="*" element={
        <div className="app">
          <Header 
            isLoggedIn={isLoggedIn} 
            userName={userName} 
            onLoginClick={() => setIsAuthModalOpen(true)} 
            onLogout={handleLogout} 
            onFilterChange={handleFilterChange}
            currentFilter={movieFilter}
          />
          
          {movieFilter === 'ALL' && (
            <div className="bg-brick">
              <div className="container" style={{ padding: 0 }}>
                <HeroCarousel />
              </div>
            </div>
          )}

          {movieFilter === 'PROFILE' ? (
            <div style={{ backgroundColor: '#f5f6f9', minHeight: 'calc(100vh - 250px)' }}>
              <UserProfile 
                onProfileUpdate={handleProfileUpdate} 
                onFilterChange={handleFilterChange} 
                defaultTab={profileActiveTab}
              />
            </div>
          ) : movieFilter === 'BOOKING' ? (
            <div className="booking-page-wrapper">
              <div className="booking-container">
                <BookingPage 
                  movieTitle={selectedMovie} 
                  onClose={() => {
                    setMovieFilter('ALL');
                    setVnpaySuccessInfo(null);
                    setVnpayInitialStep(1);
                    setSelectedMovie('');
                  }} 
                  initialStep={vnpayInitialStep}
                  initialSuccessInfo={vnpaySuccessInfo}
                />
              </div>
            </div>
          ) : (
            <MovieSelection 
              onBuyTicket={handleBuyTicket} 
              onPlayTrailer={handlePlayTrailer} 
              onViewDetails={handleViewDetails} 
              filter={movieFilter}
              onFilterChange={handleFilterChange}
            />
          )}
          
          {movieFilter === 'ALL' && <EventSection />}
          
          <Footer />

          <MovieDetailsModal 
            isOpen={isDetailsModalOpen} 
            onClose={() => setIsDetailsModalOpen(false)} 
            movie={selectedMovieDetails} 
          />

          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => { setIsAuthModalOpen(false); setSelectedMovie(''); }} 
            onLoginSuccess={handleLoginSuccess} 
          />
          
          <TrailerModal 
            isOpen={isTrailerModalOpen} 
            onClose={() => setIsTrailerModalOpen(false)} 
            youtubeId={selectedTrailer} 
          />
        </div>
      } />
    </Routes>
  );
}

export default App;
