import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/Table';
import GenericModal from '../components/GenericModal';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtres
  const [filters, setFilters] = useState({
    categoryId: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  // Modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
    selectedEvent: null
  });
  const [formLoading, setFormLoading] = useState(false);

  // Récupérer l'utilisateur actuel
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Récupérer les événements et catégories
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        categoryId: filters.categoryId || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
      };

      const { data } = await axios.get('http://localhost:5000/api/events', { params });
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = () => {
    setModalState({
      isOpen: true,
      isEdit: false,
      selectedEvent: null
    });
  };

  const handleEditEvent = (event) => {
    setModalState({
      isOpen: true,
      isEdit: true,
      selectedEvent: event
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(e => e.id !== eventId));
      alert('Événement supprimé');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur de suppression');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/registrations', { eventId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
      alert('Inscription réussie');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur d\'inscription');
    }
  };

  const handleModalConfirm = async (formData) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (modalState.isEdit) {
        const { data } = await axios.put(
          `http://localhost:5000/api/events/${modalState.selectedEvent.id}`,
          formData,
          config
        );
        setEvents(events.map(e => e.id === data.id ? data : e));
        alert('Événement mis à jour');
      } else {
        const { data } = await axios.post(
          'http://localhost:5000/api/events',
          formData,
          config
        );
        setEvents([...events, data]);
        alert('Événement créé');
      }

      setModalState({ isOpen: false, isEdit: false, selectedEvent: null });
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur de sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const modalFields = [
    { name: 'title', label: 'Titre', type: 'text', placeholder: 'Titre de l\'événement', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description de l\'événement', rows: 4 },
    { name: 'date', label: 'Date', type: 'datetime-local', required: true },
    { name: 'location', label: 'Lieu', type: 'text', placeholder: 'Lieu de l\'événement', required: true },
    { name: 'maxParticipants', label: 'Participants max', type: 'number', required: true },
    {
      name: 'categoryId',
      label: 'Catégorie',
      type: 'select',
      options: categories.map(c => ({ value: c.id, label: c.name }))
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { value: 'scheduled', label: 'Programmé' },
        { value: 'ongoing', label: 'En cours' },
        { value: 'completed', label: 'Terminé' },
        { value: 'cancelled', label: 'Annulé' }
      ]
    },
    {
      name: 'isPublic',
      label: 'Événement public',
      type: 'checkbox',
      checkboxLabel: 'Rendre cet événement public'
    }
  ];

  const tableColumns = [
    {
      key: 'title',
      label: 'Titre',
      sortable: true
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    {
      key: 'location',
      label: 'Lieu',
      sortable: true
    },
    {
      key: 'currentParticipants',
      label: 'Participants',
      sortable: true,
      render: (value, row) => `${value}/${row.maxParticipants}`
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (value) => {
        const statusLabels = {
          'scheduled': 'Programmé',
          'ongoing': 'En cours',
          'completed': 'Terminé',
          'cancelled': 'Annulé'
        };
        return statusLabels[value] || value;
      }
    }
  ];

  const actionButtons = (event) => {
    const isOwner = currentUser && event.createdBy === currentUser.id;
    const isAdmin = currentUser && currentUser.role === 'admin';
    const canEdit = isOwner || isAdmin;
    const isFull = event.currentParticipants >= event.maxParticipants;

    return (
      <div className="action-buttons">
        {canEdit && (
          <>
            <button
              className="btn-small btn-edit"
              onClick={() => handleEditEvent(event)}
              title="Éditer"
            >
              ✏️
            </button>
            <button
              className="btn-small btn-delete"
              onClick={() => handleDeleteEvent(event.id)}
              title="Supprimer"
            >
              🗑️
            </button>
          </>
        )}
        {!canEdit && !isFull && (
          <button
            className="btn-small btn-register"
            onClick={() => handleRegister(event.id)}
          >
            S'inscrire
          </button>
        )}
        {isFull && (
          <span className="full-badge">Complet</span>
        )}
      </div>
    );
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Gestion des Événements</h1>
        {currentUser && currentUser.role === 'admin' && (
          <button className="btn btn-primary" onClick={handleCreateEvent}>
            + Créer un événement
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="filters-section">
        <div className="filter-group">
          <label>Rechercher</label>
          <input
            type="text"
            name="search"
            placeholder="Titre, description..."
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Catégorie</label>
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">Toutes</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Statut</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">Tous</option>
            <option value="scheduled">Programmé</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <div className="filter-group">
          <label>De</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>À</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement des événements...</div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={events}
          actions={actionButtons}
          searchableColumns={['title', 'description']}
          itemsPerPage={10}
        />
      )}

      <GenericModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, isEdit: false, selectedEvent: null })}
        title={modalState.isEdit ? 'Éditer l\'événement' : 'Créer un nouvel événement'}
        fields={modalFields}
        initialData={modalState.selectedEvent ? {
          title: modalState.selectedEvent.title,
          description: modalState.selectedEvent.description,
          date: new Date(modalState.selectedEvent.date).toISOString().slice(0, 16),
          location: modalState.selectedEvent.location,
          maxParticipants: modalState.selectedEvent.maxParticipants,
          categoryId: modalState.selectedEvent.categoryId || '',
          status: modalState.selectedEvent.status || 'scheduled',
          isPublic: modalState.selectedEvent.isPublic || true
        } : {}}
        onConfirm={handleModalConfirm}
        confirmText={modalState.isEdit ? 'Mettre à jour' : 'Créer'}
        isLoading={formLoading}
      />
    </div>
  );
};

export default Events;