import { useState, useEffect } from 'react';
import './GenericModal.css';

/**
 * GenericModal - Composant modal générique et réutilisable
 * @param {boolean} isOpen - Si la modal est ouverte
 * @param {Function} onClose - Callback pour fermer la modal
 * @param {string} title - Titre de la modal
 * @param {Function} onConfirm - Callback quand on valide
 * @param {Array} fields - Configuration des champs du formulaire
 * @param {Object} initialData - Données initiales du formulaire
 * @param {string} confirmText - Texte du bouton de confirmation
 * @param {string} cancelText - Texte du bouton d'annulation
 * @param {boolean} isLoading - Si le formulaire est en cours de traitement
 */
const GenericModal = ({
  isOpen,
  onClose,
  title,
  onConfirm,
  fields = [],
  initialData = {},
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isLoading = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Réinitialiser le formulaire quand initialData ou isOpen change
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.value
    }));
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} est requis`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onConfirm(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData(initialData);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            {fields.map(field => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleTextareaChange}
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    className={`form-textarea ${errors[field.name] ? 'error' : ''}`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleSelectChange(e, field.name)}
                    className={`form-select ${errors[field.name] ? 'error' : ''}`}
                  >
                    <option value="">{field.placeholder || 'Sélectionner...'}</option>
                    {field.options && field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <label htmlFor={field.name} className="checkbox-label">
                      {field.checkboxLabel || field.label}
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type || 'text'}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`form-input ${errors[field.name] ? 'error' : ''}`}
                  />
                )}

                {errors[field.name] && (
                  <span className="error-message">{errors[field.name]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'En cours...' : confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericModal;
