import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
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
  


  return (
    
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      {userData ? (
        <div>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <button>
            <a href="/Dashboard" className="BackButton">
              Back
            </a>
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
