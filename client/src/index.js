import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter as Router } from 'react-router-dom';

import bootstrap from "bootstrap"; // eslint-disable-line no-unused-vars
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  
    <App />

);
