import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Tableau de Bord Admin</h2>
      <p>Utilisateurs: {stats.userCount}</p>
      <p>Événements: {stats.eventCount}</p>
      <p>Inscriptions: {stats.registrationCount}</p>
    </div>
  );
};

export default AdminDashboard;