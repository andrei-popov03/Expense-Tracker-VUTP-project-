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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
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

  const handleSubmitIncome = () => {
    fetch('http://localhost:5000/income', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        category: category || 'General',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.msg || 'Успешно добавен доход!');
        setAmount('');
        setCategory('');
        setDropdownOpen(false);
      })
      .catch((err) => {
        console.error('Error submitting income:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">Финансов Dashboard</h1>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="income-button"
          >
            Добави
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-4 z-10">
              <input
                type="number"
                placeholder="Сума"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="text"
                placeholder="Категория (по избор)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 mb-2 rounded"
              />
              <button
                onClick={handleSubmitIncome}
                className="bg-blue-700 text-white px-4 py-2 w-full rounded hover:bg-blue-800"
              >
                Изпрати
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        {userData ? (
          <div className="bg-white p-4 rounded shadow">
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        ) : (
          <p>Зареждане на данни...</p>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Изход
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
