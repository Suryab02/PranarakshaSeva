import React from "react";
import { useLocation } from "react-router-dom";
import "./clientblood.css";

function ClientBlood() {
  const { availabilities } = useLocation().state;

  return (
    <div className="blood-container">
      <h1 className="blood-title">Blood Availability</h1>
      <div className="blood-cards">
        {availabilities.map((availability, index) => (
          <div className="blood-card" key={index}>
            <h5 className="blood-type">Blood type: {availability.name}</h5>
            <p className="blood-availability">Packets available: {availability.quantity}</p>
            <p className="blood-bank">Blood bank name: {availability.bankname}</p>
            <p className="blood-city">City: {availability.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientBlood;
