
const ReactivateModal = ({ isOpen, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "8px",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%"
      }}>
        <h3 style={{ marginBottom: "1rem" }}>Compte désactivé</h3>
        <p style={{ marginBottom: "2rem" }}>Voulez-vous réactiver votre compte ?</p>
        
        <div style={{ 
          display: "flex",
          gap: "1rem",
          justifyContent: "center"
        }}>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#FC20E1",
              border: "none",
              borderRadius: "20px",
              color: "white",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Traitement..." : "Oui, réactiver"}
          </button>
          
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#e2e8f0",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactivateModal;