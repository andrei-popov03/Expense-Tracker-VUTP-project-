import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const NAV_LINKS = [
  { to: '/dashboard/profile',    label: 'Profile' },
  { to: '/financeFormPage',      label: 'Add Income / Expense' },
  { to: '/monthlySummaryPage',   label: 'Monthly Summary' },
  { to: '/history',              label: 'Transaction History' },
];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      navigate('/login');
      return;
    }
    authFetch('/user')
      .then((res) => {
        if (!res || !res.ok) throw new Error();
        return res.json();
      })
      .then(setUserData)
      .catch(() => setError('Could not load user data.'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="Dashboard-container">
      <div className="Dashboard-header">
        <h1 className="Dashboard-h1">Expense Tracker</h1>
        {userData
          ? <p className="Dashboard-welcome">Welcome back, <strong>{userData.username}</strong></p>
          : !error && <p className="Dashboard-welcome">Loading...</p>
        }
        {error && <p className="Dashboard-error">{error}</p>}
      </div>

      <nav className="Dashboard-nav">
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} className="Dashboard-nav-link">{label}</Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="LogoutButton">Logout</button>
    </div>
  );
};

export default Dashboard;
