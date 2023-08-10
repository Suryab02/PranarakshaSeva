import React, { useState } from "react";
import "./guestServices.css";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useLocation, useNavigate} from 'react-router-dom';
import {
  faDroplet,
  faUserDoctor,
  faTruckMedical
} from "@fortawesome/free-solid-svg-icons";
function GuestServices() {
  const [availabilites, setavails] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state.city)
  console.log(location.state.blood)
  async function getinfo(e) {
    e.preventDefault();
    let city = location.state.city;
    let blood = location.state.blood;
  
    let avails = await axios.post(`/getblood?city=${city}&blood=${blood}`,{ blood: blood });
    console.log(avails.data);
  
    setavails(avails.data);
    navigate("/guest/blood", { state: { availabilities: avails.data } });
  }
  

  async function getdocinfo(e){
    e.preventDefault();
    let city = location.state.city
    let avails = await axios.get(`/doctor?city=${city}`)
    console.log(avails.data)
    setavails(avails.data);
    navigate("/guest/doctor", { state: { availabilities: avails.data } });

 }

  async function getambinfo(e){
    e.preventDefault();
    let city = location.state.city
    let avails = await axios.get(`/ambulance?city=${city}`)
    console.log(avails.data)
    setavails(avails.data);
    navigate("/guest/ambulance", { state: { availabilities: avails.data } });

 }

  return (
    <>
    {availabilites!=''?
    availabilites.map(name => (  
      <div className="card-body col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">  
      <h5 className="card-title">Blood type:</h5> 
      <p className="card-text availability">
            packets available : 
          </p> 
          <p className="card-text availability">
            Blood bank name : 
          </p>
          <p className="card-text availability">
            city: {name.city}
          </p> 
      </div>  
    )):
    <div className="guest-container">
      <h1>Available Services</h1>
      <div className="cards row">
        <form onSubmit={async (e)=> await getinfo(e)} className="card-body col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <FontAwesomeIcon icon={faDroplet} size="8x" className="blood-icon" />

          <h5 className="card-title">Availability of Blood</h5>
          <p className="card-text">
            Check the locations, the area, and the type of blood you want
          </p>
          <button className="btn btn-danger" type="submit" >Check On Availability</button>
        </form>
        <div className="card-body col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <FontAwesomeIcon
            icon={faUserDoctor}
            size="8x"
            className="blood-icon"
          />
          <h5 className="card-title">Doctor Information</h5>
          <p className="card-text">
            Ensure timely medical care with updated emergency contact.
          </p>
          <button className="btn btn-danger" onClick={async (e)=> await getdocinfo(e)}>Verify Particulars</button>
        </div>

        <div className="card-body col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <FontAwesomeIcon
            icon={faTruckMedical}
            size="8x"
            className="blood-icon"
          />
          <h5 className="card-title">Ambulance Service</h5>
          <p className="card-text">
            Get immediate medical assistance with 24/7 ambulance helpline.
          </p>
          <button className="btn btn-danger" onClick={async (e)=> await getambinfo(e)}> Call Ambulance</button>
        </div>
      </div>
    </div>
    }
    </>
  );
}

export default GuestServices;
