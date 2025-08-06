import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Access Denied | Flight Charters";
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
      <h1>Access Denied</h1>
      <p>You don't have permission to view this page.</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '0.5rem 1rem' }}>
          Go Back
        </button>
        <Link 
          to="/" 
          style={{
            padding: '0.5rem 1rem',
            background: '#0066cc',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          Home Page
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;