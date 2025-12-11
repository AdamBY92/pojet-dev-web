import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/Table';
import GenericModal from '../components/GenericModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
    selectedCategory: null
  });
  const [formLoading, setFormLoading] = useState(false);

  // Charger les données
  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de chargement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de chargement des catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setModalState({
      isOpen: true,
      isEdit: false,
      selectedCategory: null
    });
  };

  const handleEditCategory = (category) => {
    setModalState({
      isOpen: true,
      isEdit: true,
      selectedCategory: category
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter(c => c.id !== categoryId));
      alert('Catégorie supprimée');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur de suppression');
    }
  };

  const handleModalConfirm = async (formData) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (modalState.isEdit) {
        const { data } = await axios.put(
          `http://localhost:5000/api/categories/${modalState.selectedCategory.id}`,
          formData,
          config
        );
        setCategories(categories.map(c => c.id === data.id ? data : c));
        alert('Catégorie mise à jour');
      } else {
        const { data } = await axios.post(
          'http://localhost:5000/api/categories',
          formData,
          config
        );
        setCategories([...categories, data]);
        alert('Catégorie créée');
      }

      setModalState({ isOpen: false, isEdit: false, selectedCategory: null });
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur de sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const categoryFields = [
    { name: 'name', label: 'Nom', type: 'text', placeholder: 'Nom de la catégorie', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description', rows: 3 },
    { name: 'color', label: 'Couleur', type: 'color' }
  ];

  const categoryColumns = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'description', label: 'Description' },
    {
      key: 'color',
      label: 'Couleur',
      render: (value) => (
        <div style={{
          width: 30,
          height: 30,
          backgroundColor: value,
          borderRadius: 4,
          border: '1px solid #ddd'
        }} />
      )
    }
  ];

  const categoryActions = (category) => (
    <div className="action-buttons">
      <button
        className="btn-small btn-edit"
        onClick={() => handleEditCategory(category)}
        title="Éditer"
      >
        ✏️
      </button>
      <button
        className="btn-small btn-delete"
        onClick={() => handleDeleteCategory(category.id)}
        title="Supprimer"
      >
        🗑️
      </button>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Tableau de Bord Admin</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistiques
        </button>
        <button
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Catégories
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {activeTab === 'stats' && (
        <div className="stats-section">
          {loading ? (
            <div className="loading">Chargement des statistiques...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Utilisateurs</h3>
                <p className="stat-value">{stats.userCount || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Événements</h3>
                <p className="stat-value">{stats.eventCount || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Inscriptions</h3>
                <p className="stat-value">{stats.registrationCount || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Catégories</h3>
                <p className="stat-value">{stats.categoryCount || 0}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="categories-section">
          <div className="section-header">
            <h2>Gestion des Catégories</h2>
            <button
              className="btn btn-primary"
              onClick={handleCreateCategory}
            >
              + Nouvelle Catégorie
            </button>
          </div>

          {loading ? (
            <div className="loading">Chargement des catégories...</div>
          ) : (
            <DataTable
              columns={categoryColumns}
              data={categories}
              actions={categoryActions}
              itemsPerPage={10}
            />
          )}
        </div>
      )}

      <GenericModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, isEdit: false, selectedCategory: null })}
        title={modalState.isEdit ? 'Éditer la catégorie' : 'Créer une nouvelle catégorie'}
        fields={categoryFields}
        initialData={modalState.selectedCategory ? {
          name: modalState.selectedCategory.name,
          description: modalState.selectedCategory.description,
          color: modalState.selectedCategory.color || '#007bff'
        } : {}}
        onConfirm={handleModalConfirm}
        confirmText={modalState.isEdit ? 'Mettre à jour' : 'Créer'}
        isLoading={formLoading}
      />
    </div>
  );
};

export default AdminDashboard;