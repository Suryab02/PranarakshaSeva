import "./adminPage.css";
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminServices from "../AdminPage/AdminServices";

function AdminPage() {
  const navigate = useNavigate();
  const [bank,setbank] = useState('');
  const [loggedin,setlogin] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    let username = event.target.username.value;
    let password = event.target.password.value;
    console.log(username,password)
    const bankname = await axios.post('/validate',{username:username,password:password}) 
    console.log(bankname.data)
    if(bankname.data != false){
     setlogin(true)
     setbank(bankname)}
    else
      alert(`invalid login`)
  };

  return (
    <>
    {loggedin ? <AdminServices bankname={bank} /> : <div className="admin-container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-6 col-xs-6 order-md-2 order-sm-2 order-2">
          <div className="admin-drop">
            <div className="admin-content">
              <h1 className="text-white">Admin</h1>
              <form onSubmit={handleSubmit}>
                
                  <input
                    type="text"
                    className="admin-form-control form-group"
                    id="username"
                    name="username"
                    placeholder="Enter username"
                  />
            
               
                  <input
                    type="password"
                    className="admin-form-control form-group"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                  />
                
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
          <h1 className="text-right">PRANARAKSHA SEVA</h1>
        </div>
      </div>
    </div>}
    </>
  );
}

export default AdminPage;
