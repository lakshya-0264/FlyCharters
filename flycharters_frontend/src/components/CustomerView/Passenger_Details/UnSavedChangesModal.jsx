const UnsavedChangesModal = ({ onSave, onDiscard }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#061953', fontSize: '1.25rem', marginBottom: '15px' }}>
          Unsaved Changes
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#333' }}>
          Do you want to save changes or discard them?
        </p>
        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
          <button
            onClick={onSave}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#198754',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            Save & Close
          </button>
          <button
            onClick={onDiscard}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;