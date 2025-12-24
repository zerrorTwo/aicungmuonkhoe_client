import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toast.css';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import HealthTracking from '@/pages/HealthTracking';
import Profile from './pages/Profile';
import HealthDocumentGuard from '@/components/auth/HealthDocumentGuard';
import './App.css';
import AuthGuard from './components/auth/AuthGuard';
import About from './pages/About';
import HealthConsultingPage from './pages/HealthConsulting/HealthConsulting';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <HealthDocumentGuard excludePaths={['/login', '/register', '/']}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/health-tracking" element={<AuthGuard><HealthTracking /></AuthGuard>} />
            <Route path="/health-tracking/:id" element={<AuthGuard><HealthTracking /></AuthGuard>} />
            <Route path="/health-consulting" element={<AuthGuard><HealthConsultingPage /></AuthGuard>} />
            {/* Add more routes as needed */}
          </Routes>
        </HealthDocumentGuard>

        {/* Toast Container for beautiful notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="custom-toast-container"
        />
      </div>
    </Router>
  );
}

export default App;
