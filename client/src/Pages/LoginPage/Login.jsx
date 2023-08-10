import "./login.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="row text-center">
        <div className="col-md-6 col-sm-6 col-xs-6 order-md-2 order-sm-2 order-2">
          <div className="drop">
            <div className="content">
              <h2>Sign in</h2>
              <div className="buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate("/guest");
                  }}
                >
                  Guest
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6 col-xs-6 order-md-1 order-sm-1 order-1 title-name">
          <h1>PRANARAKSHA SEVA</h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
