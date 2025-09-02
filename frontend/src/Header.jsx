import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Финансов Тракер</h1>

      <nav className="space-x-4">
        <Link to="/ProfilePage.jsx" className="hover:underline">Profile</Link>
        <Link to="/financeFormPage" className="hover:underline">Income / Expense</Link>
        <Link to="/monthlySummaryPage" className="hover:underline">Monthly Summary</Link>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
