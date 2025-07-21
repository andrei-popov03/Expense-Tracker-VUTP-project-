import React, { useEffect, useState } from 'react';
// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Вземаме токена от localStorage
    const token = localStorage.getItem('access_token');

    fetch('http://localhost:5000/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error('Error loading user data:', err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {userData ? (
        <div>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Dashboard;
