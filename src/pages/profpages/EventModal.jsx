import PropTypes from 'prop-types';
import './Calendar.css';

const EventModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  form, 
  setForm,
  isEdit,
  error
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? 'Modifier événement' : 'Nouvel événement'}</h3>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-message">⚠️ {error}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Titre *</label>
              <input
                type="text"
                name="summary"
                className="form-input"
                value={form.summary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                value={form.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Début *</label>
              <input
                type="datetime-local"
                name="start"
                className="form-input"
                value={form.start}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fin *</label>
              <input
                type="datetime-local"
                name="end"
                className="form-input"
                value={form.end}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          {onDelete && (
            <button
              type="button"
              className="google-button delete-button"
              onClick={onDelete}
            >
              Supprimer
            </button>
          )}
          <button
            type="button"
            className="google-button secondary-button"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="google-button primary-button"
            onClick={onSubmit}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  error: PropTypes.string
};

export default EventModal;