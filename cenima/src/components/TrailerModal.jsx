import React from 'react';
import '../styles/TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, youtubeId }) => {
  if (!isOpen || !youtubeId) return null;

  return (
    <div className="modal-overlay">
      <div className="trailer-modal">
        <button className="close-btn trailer-close" onClick={onClose}>×</button>
        <div className="video-container">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
