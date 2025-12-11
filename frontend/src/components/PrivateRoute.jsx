import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Attendre que le contexte soit chargé
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        ⏳ Chargement...
      </div>
    );
  }

  // Vérifier l'authentification
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Vérifier les droits admin si nécessaire
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;