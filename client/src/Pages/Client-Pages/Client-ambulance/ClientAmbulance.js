import React from 'react';
import { useLocation } from 'react-router-dom';
import './ClientAmb.css';

function ClientAmbulance() {
  const { availabilities } = useLocation().state;

  return (
    <div className="ClientAmbulance">
      <div className="container">
        <div className="inside">
          <h1 className="ambulance-title">Ambulance Numbers</h1>
          <div className="ambulance-info-container">
            {availabilities.map((availability, index) => (
              <div key={index} className="ambulance-info-card">
                <h5 className="ambulance-city">City: {availability.city}</h5>
                <p className="ambulance-contact">Contact: {availability.contact}</p>
                <p className="ambulance-hospital">Hospital: {availability.hospital}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAmbulance;
