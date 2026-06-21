import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import GuestSearch from './pages/GuestSearch'
import GuestServices from './pages/GuestServices'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import BloodResults from './pages/BloodResults'
import DoctorResults from './pages/DoctorResults'
import AmbulanceResults from './pages/AmbulanceResults'
import DonorRegister from './pages/DonorRegister'
import MapView from './pages/MapView'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/guest" element={<GuestSearch />} />
        <Route path="/guest/info" element={<GuestServices />} />
        <Route path="/guest/blood" element={<BloodResults />} />
        <Route path="/guest/doctor" element={<DoctorResults />} />
        <Route path="/guest/ambulance" element={<AmbulanceResults />} />
        <Route path="/guest/map" element={<MapView />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/donor/register" element={<DonorRegister />} />
      </Routes>
    </Router>
  )
}

export default App
