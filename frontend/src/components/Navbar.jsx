import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📅 EventApp
        </Link>

        <ul className="navbar-menu">
          {/* Liens accessibles à tous */}
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Événements
            </Link>
          </li>

          {/* Liens pour utilisateurs authentifiés */}
          {isAuthenticated() && (
            <>
              <li className="navbar-item">
                <Link to="/my-registrations" className="navbar-link">
                  Mes Inscriptions
                </Link>
              </li>

              {/* Lien Admin - visible uniquement pour les administrateurs */}
              {isAdmin() && (
                <li className="navbar-item">
                  <Link to="/admin" className="navbar-link navbar-link-admin">
                    🔐 Admin
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {isAuthenticated() ? (
            <>
              <span className="navbar-user">
                👤 {user?.email}
                {isAdmin() && <span className="badge-admin">Admin</span>}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-button">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
