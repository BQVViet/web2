import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import MovieSelection from './components/MovieSelection';
import EventSection from './components/EventSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import TrailerModal from './components/TrailerModal';
import MovieDetailsModal from './components/MovieDetailsModal';
import UserProfile from './components/UserProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState('');
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [movieFilter, setMovieFilter] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).fullName);
    }
  }, []);

  const handleLoginSuccess = (fullName) => {
    setIsLoggedIn(true);
    setUserName(fullName);
    setIsAuthModalOpen(false);
    // If they were trying to book, open booking modal
    if (selectedMovie) {
      setIsBookingModalOpen(true);
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
      setIsBookingModalOpen(true);
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
    <div className="app">
      <Header 
        isLoggedIn={isLoggedIn} 
        userName={userName} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
        onFilterChange={setMovieFilter}
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
        <div className="bg-brick" style={{ backgroundColor: '#fdfcf0' }}>
          <UserProfile 
            onProfileUpdate={handleProfileUpdate} 
            onFilterChange={setMovieFilter} 
          />
        </div>
      ) : (
        <MovieSelection 
          onBuyTicket={handleBuyTicket} 
          onPlayTrailer={handlePlayTrailer} 
          onViewDetails={handleViewDetails} 
          filter={movieFilter}
          onFilterChange={setMovieFilter}
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
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        movieTitle={selectedMovie} 
      />

      <TrailerModal 
        isOpen={isTrailerModalOpen} 
        onClose={() => setIsTrailerModalOpen(false)} 
        youtubeId={selectedTrailer} 
      />
    </div>
  );
}

export default App;
