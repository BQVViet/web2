import React from 'react';
import '../styles/EventSection.css';

const EventSection = () => {
  return (
    <div className="event-section container">
      <div className="section-title">
        <h2>EVENT</h2>
      </div>
      
      <div className="event-grid">
        <div className="event-card">
          <img src="/images/cgv_visa_banner_1781694585276.png" alt="Event 1" />
        </div>
        <div className="event-card">
          <img src="/images/cgv_visa_banner_1781694585276.png" alt="Event 2" />
        </div>
        <div className="event-card">
          <img src="/images/cgv_visa_banner_1781694585276.png" alt="Event 3" />
        </div>
      </div>
    </div>
  );
};

export default EventSection;
