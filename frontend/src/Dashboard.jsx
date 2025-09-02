import React, { useEffect, useState } from 'react';
// import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
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
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error('Error loading user data:', err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="Dashboard-container">
      {/* Навигация в Dashboard */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow">

        <h1 className="Dashboard-h1">Expense Tracker Dashboard</h1>

        <div className="space-x-4">

          <Link to="/dashboard/profile" className="ProfileLink">Profile</Link> <br />
          <br />
          <Link to="/financeFormPage" className="Income_ExpenseLink">Add Income/Expense</Link><br />
          <br />
          <Link to="/monthlySummaryPage" className="SummaryLink">Monthly Summary</Link><br />
    
        </div>
      </nav>

      {/* Информация */}
      <main className="p-6">
        {userData ? (
          <div className="DivWelcomeDashboard">

            <p> Welcome to the Expense Tracker<strong> {userData.username}</strong></p>

            <button onClick={handleLogout} className="LogoutButton">
            Logout
          </button>

          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
