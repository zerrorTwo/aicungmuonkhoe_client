import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import HealthTracking from '@/pages/HealthTracking';
import Profile from './pages/Profile';
import HealthDocumentGuard from '@/components/auth/HealthDocumentGuard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <HealthDocumentGuard excludePaths={['/login', '/register', '/']}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/health-tracking" element={<HealthTracking />} />
            {/* Add more routes as needed */}
          </Routes>
        </HealthDocumentGuard>
      </div>
    </Router>
  );
}

export default App;
