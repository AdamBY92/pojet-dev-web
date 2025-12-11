import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isRegister 
        ? await register(email, password) 
        : await login(email, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isRegister ? '📝 Inscription' : '🔐 Connexion'}</h2>
          <p>{isRegister ? 'Créez votre compte' : 'Connectez-vous à votre compte'}</p>
        </div>

        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '⏳ Chargement...' : isRegister ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </form>

        <div className="login-switch">
          <p>
            {isRegister ? 'Vous avez déjà un compte ?' : 'Vous n\'avez pas de compte ?'}
          </p>
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }} 
            className="switch-button"
            disabled={loading}
          >
            {isRegister ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </div>

        <div className="login-info">
          <p>📌 Comptes de test :</p>
          <ul>
            <li><strong>Admin:</strong> admin@app.com / Admin123!</li>
            <li><strong>User:</strong> user@app.com / User123!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;