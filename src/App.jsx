import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './toast'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import GuestSearch from './pages/GuestSearch'
import GuestServices from './pages/GuestServices'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import BloodResults from './pages/BloodResults'
import DoctorResults from './pages/DoctorResults'
import AmbulanceResults from './pages/AmbulanceResults'
import DonorResults from './pages/DonorResults'
import DonorRegister from './pages/DonorRegister'
import MapView from './pages/MapView'
import BloodRequests from './pages/BloodRequests'
import AdminRegister from './pages/AdminRegister'

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/guest" element={<GuestSearch />} />
            <Route path="/guest/info" element={<GuestServices />} />
            <Route path="/guest/blood" element={<BloodResults />} />
            <Route path="/guest/doctor" element={<DoctorResults />} />
            <Route path="/guest/ambulance" element={<AmbulanceResults />} />
            <Route path="/guest/donor" element={<DonorResults />} />
            <Route path="/guest/map" element={<MapView />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/donor/register" element={<DonorRegister />} />
            <Route path="/guest/requests" element={<BloodRequests />} />
            <Route path="/admin/register" element={<AdminRegister />} />
          </Routes>
        </AppShell>
      </Router>
    </ToastProvider>
  )
}

export default App
