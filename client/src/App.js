import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/LoginPage/Login";
import GuestPage from "./Pages/Guest-home/GuestPage";
import AdminPage from "./Pages/Admin-home/AdminPage";
import AdminService from "./Pages/AdminPage/AdminServices";
import EventRegistrationForm from "./EventRegistrationForm";
import GuestServices from "./Pages/GuestPage/GuestServices";
import ClientAmbulance from "./Pages/Client-Pages/Client-ambulance/ClientAmbulance";
import ClientDoctor from "./Pages/Client-Pages/Client-doctor/ClientDoctor";
import ClientBlood from "./Pages/Client-Pages/Client-blood/ClientBlood";


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/guest/info" element={<GuestServices />} />
        <Route path="/admin/info" element={<AdminService />} />
        <Route path="/guest/blood" element={<ClientBlood />} />
        <Route path="/guest/doctor" element={<ClientDoctor />} />
        <Route path="/guest/ambulance" element={<ClientAmbulance />} />
      </Routes>
    </Router>
  );
}
export default App;
