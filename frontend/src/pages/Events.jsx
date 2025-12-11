import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/registrations', { eventId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
      alert('Registered successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Error');
    }
  };

  const headers = ['Title', 'Description', 'Date', 'Participants'];
  const data = events.map(event => ({
    title: event.title,
    description: event.description,
    date: new Date(event.date).toLocaleDateString(),
    participants: `${event.currentParticipants}/${event.maxParticipants}`
  }));

  const actions = (event) => (
    event.currentParticipants < event.maxParticipants ? <button onClick={() => register(event.id)}>Register</button> : 'Full'
  );

  return (
    <div>
      <h2>Events</h2>
      <Table headers={headers} data={data} actions={actions} />
    </div>
  );
};

export default Events;