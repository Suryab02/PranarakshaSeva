import React from 'react';
import { useLocation } from 'react-router-dom';
import './clientdoc.css';

function ClientDoctor() {
  const { availabilities } = useLocation().state;

  return (
    <div className="doctor-container">
      <h1 className="doctor-title">Doctor Details</h1>
      <div className="doctor-list">
        {availabilities.map((availability, index) => (
          <div className="doctor-card" key={index}>
            <h2 className="doctor-name">{availability.name}</h2>
            <p className="doctor-hospital">Hospital: {availability.hospital}</p>
            <p className="doctor-contact">Contact: {availability.contact}</p>
            <p className="doctor-qualification">Qualification: {availability.qualification}</p>
            <p className="doctor-city">City: {availability.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientDoctor;
