import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetch('http://localhost:5000/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error('Error loading profile:', err));
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="Profile-container">
      <h1 className="Profile-h1">Profile</h1>
      {userData ? (
        <div className='User-info'>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={handleBack} className="BackButton">
        Back
      </button>
    </div>
  );
};

export default ProfilePage;
