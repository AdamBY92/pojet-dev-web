import { useState, useEffect } from 'react';
import axios from 'axios';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/registrations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRegistrations();
      alert('Cancelled');
    } catch (error) {
      alert(error.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <h2>My Registrations</h2>
      <ul>
        {registrations.map(reg => (
          <li key={reg.id}>
            <h3>{reg.Event.title}</h3>
            <p>{reg.Event.description}</p>
            <button onClick={() => cancel(reg.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRegistrations;