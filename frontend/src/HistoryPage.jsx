import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const token = localStorage.getItem('access_token');
  const [finances, setFinances] = useState({ incomes: [], expenses: [] });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/monthlySummaryPage');
  };

  useEffect(() => {
    fetch("http://localhost:5000/transactions", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setFinances({
          incomes: data.incomes || [],
          expenses: data.expenses || []
        });
      })
      .catch(err => console.error("Error loading transactions:", err));
  }, []);

  return (
    <div className="FinanceHistoryPage-container">
      <h1>Transaction History</h1>

      {/* INCOMES */}
      <h2>Income</h2>
      {finances.incomes.length === 0 ? (
        <p>No incomes added.</p>
      ) : (
        finances.incomes.map((inc) => (
          <div key={inc.id} className="transaction-card">
            <p><strong>{inc.date}</strong></p>
            <p>Category: {inc.category}</p>
            <p>Info: {inc.add_info}</p>
            <p>Amount: +{inc.amount}</p>
          </div>
        ))
      )}

      {/* EXPENSES */}
      <h2>Expenses</h2>
      {finances.expenses.length === 0 ? (
        <p>No expenses added.</p>
      ) : (
        finances.expenses.map((expense) => (
          <div key={expense.id} className="FinanceHistory-entry">
            <strong>{expense.date}</strong>
            <p>Category: {expense.category}</p>
            <p>Amount: -{expense.amount}</p>
            <p>Info: {expense.add_info}</p>
            <hr />
          </div>
        ))
      )};
      <button onClick={handleBack} className="BackButton">
        Back
      </button>

    </div>
  );
};

export default HistoryPage;

