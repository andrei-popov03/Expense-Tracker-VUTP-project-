import React, { useEffect, useState } from 'react';
// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     // Вземаме токена от localStorage
//     const token = localStorage.getItem('access_token');

//    fetch("http://localhost:5000/user", {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//   },
//   credentials: "include" 
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setUserData(data);
//       })
//       .catch((err) => {
//         console.error('Error loading user data:', err);
//       });
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="dashboard-h1">Dashboard</h1>
//       {userData ? (
//         <div className='dashboard-p'>
//           <p><strong>Username:</strong> {userData.username}</p>
//           <p><strong>Email:</strong> {userData.email}</p>
//         </div>
//       ) : (
//         <p>Loading user info...</p>
//       )}
//     </div>
//   );
// };

// import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // за пренасочване

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // изчистване на токена
    navigate('/login'); // пренасочване към login
  };

  return (  
    <div className="dashboard-container">
      <h2 className='dashboard-h2'>Dashboard</h2>
      {userData ? (
        <div className='dashboard-info'>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <button onClick={handleLogout} className="dashboard-button">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
