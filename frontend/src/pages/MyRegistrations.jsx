import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/Table';
import './MyRegistrations.css';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de chargement des inscriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette inscription?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/registrations/${registrationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(registrations.filter(r => r.id !== registrationId));
      alert('Inscription annulée');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur d\'annulation');
    }
  };

  const tableColumns = [
    {
      key: 'Event.title',
      label: 'Événement',
      sortable: true,
      render: (_, row) => row.Event.title
    },
    {
      key: 'Event.date',
      label: 'Date',
      sortable: true,
      render: (_, row) => new Date(row.Event.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    {
      key: 'Event.location',
      label: 'Lieu',
      sortable: true,
      render: (_, row) => row.Event.location
    },
    {
      key: 'Event.status',
      label: 'Statut événement',
      sortable: true,
      render: (_, row) => {
        const statusLabels = {
          'scheduled': '📅 Programmé',
          'ongoing': '🔴 En cours',
          'completed': '✅ Terminé',
          'cancelled': '❌ Annulé'
        };
        return statusLabels[row.Event.status] || row.Event.status;
      }
    },
    {
      key: 'createdAt',
      label: 'Inscrit le',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
    }
  ];

  const actionButtons = (registration) => (
    <div className="action-buttons">
      <button
        className="btn-small btn-cancel"
        onClick={() => handleCancel(registration.id)}
        title="Annuler l'inscription"
      >
        ✖️ Annuler
      </button>
    </div>
  );

  return (
    <div className="registrations-container">
      <div className="registrations-header">
        <h1>Mes Inscriptions aux Événements</h1>
        <p className="subtitle">Gérez vos inscriptions et annulez si nécessaire</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">Chargement de vos inscriptions...</div>
      ) : registrations.length > 0 ? (
        <div className="registrations-info">
          <p className="info-text">
            Vous êtes inscrit à <strong>{registrations.length}</strong> événement{registrations.length > 1 ? 's' : ''}
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={registrations}
          actions={actionButtons}
          searchableColumns={['Event.title', 'Event.location']}
          itemsPerPage={10}
        />
      )}

      {!loading && registrations.length === 0 && !error && (
        <div className="empty-state">
          <p>Vous n'êtes inscrit à aucun événement pour le moment.</p>
          <a href="/events" className="btn btn-primary">
            Découvrir les événements
          </a>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;