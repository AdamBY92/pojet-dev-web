import { useState, useEffect } from 'react';
import axios from 'axios';

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
      fetchEvents(); // Refresh to update counts
      alert('Registered successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Error');
    }
  };

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Participants: {event.currentParticipants}/{event.maxParticipants}</p>
            {event.currentParticipants < event.maxParticipants && (
              <button onClick={() => register(event.id)}>Register</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;