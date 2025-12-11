import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';

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
      alert('Annulé');
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur');
    }
  };

  const headers = ['Titre', 'Description'];
  const data = registrations.map(reg => ({
    titre: reg.Event.title,
    description: reg.Event.description
  }));

  const actions = (reg) => <button onClick={() => cancel(reg.id)}>Annuler</button>;

  return (
    <div>
      <h2>Mes Inscriptions</h2>
      <Table headers={headers} data={data} actions={actions} />
    </div>
  );
};

export default MyRegistrations;