import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Events from './pages/Events';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="App">
      <nav>
        <Link to="/">Events</Link>
        {user && <Link to="/my-registrations">My Registrations</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Events />} />
        <Route path="/my-registrations" element={<PrivateRoute><MyRegistrations /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
