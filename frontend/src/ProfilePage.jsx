import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const ProfilePage = () => {
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
      .catch(() => setError('Could not load profile.'));
  }, [navigate]);

  return (
    <div className="Profile-container">
      <h1 className="Profile-h1">Profile</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : userData ? (
        <div className="User-info">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={() => navigate('/dashboard')} className="BackButton">Back</button>
    </div>
  );
};

export default ProfilePage;
