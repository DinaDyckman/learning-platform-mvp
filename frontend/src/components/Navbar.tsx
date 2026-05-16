import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1e1e2e', color: 'white' }}>
      <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
      <Link to="/history" style={{ color: 'white' }}>History</Link>
      <Link to="/admin" style={{ color: 'white' }}>Admin</Link>
      <Link to="/register" style={{ color: 'white', marginLeft: 'auto' }}>Register</Link>
    </nav>
  );
}
