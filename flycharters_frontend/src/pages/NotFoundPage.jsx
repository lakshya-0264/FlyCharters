import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "404 Not Found | Flight Charters";
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#0066cc',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;