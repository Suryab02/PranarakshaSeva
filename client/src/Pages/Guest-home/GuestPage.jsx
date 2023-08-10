import "./guestPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function GuestPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
   
    navigate("/guest/info",{state:{city:event.target.city.value,blood:event.target.blood.value}});
  };

  return (
    <div className="guest-container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-6 col-xs-6 order-md-2 order-sm-2 order-2">
          <div className="guest-drop">
            <div className="guest-content">
              <h1 className="text-white">Guest</h1>
              <form onSubmit={handleSubmit}>
                <div className="dropdown">
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a valid 10-digit phone number.
                  </div>
                </div>
                <div className="dropdown">
                  <select name='city' className="dropdown">
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Pune">Pune</option>
                    <option value="Goa">Goa</option>
                    <option value="Vizag">Vizag</option>
                    
                  </select>
                  <select name="blood" className="dropdown">
                    <option value="">All Blood Types</option>
                    <option value="A+ve">A+ve</option>
                    <option value="A-ve">A-ve</option>
                    <option value="B+ve">B+ve</option>
                    <option value="B-ve">B-ve</option>
                    <option value="AB+ve">AB+ve</option>
                    <option value="AB-ve">AB-ve</option>
                    <option value="O+ve">O+ve</option>
                    <option value="O-ve">O-ve</option>
                  </select>


                  <div className="invalid-feedback">
                    Please enter a valid location (letters and spaces only).
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mr-2">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Back to home
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-6 order-md-1 order-sm-1 order-1 first">
          <img
            src="https://lh3.googleusercontent.com/mgfrFX4BTMQxAQBWDCnqC2BUGxThRuiu-_-JKrTe68nE4_gWarBEjl8SSseQgrVi_TProh51m6y7ZXez4RG6jkqsPoN07xHMOIp2RBAV2mRmJhjsBxdNcWlm63IfK4D7kQBlmLl48A=w2400"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default GuestPage;
