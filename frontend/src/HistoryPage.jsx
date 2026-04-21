import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const HistoryPage = () => {
  const [finances, setFinances] = useState({ incomes: [], expenses: [] });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    authFetch('/transactions')
      .then((res) => {
        if (!res || !res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setFinances({ incomes: data.incomes || [], expenses: data.expenses || [] }))
      .catch(() => setError('Could not load transactions.'));
  }, []);

  return (
    <div className="FinanceHistoryPage-container">
      <h1 className="FinanceHistoryPage-h1">Transaction History</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2 className="FinanceHistoryPage-h2 income">Income</h2>
      {finances.incomes.length === 0 ? (
        <p className="FinanceHistoryPage-empty">No incomes added.</p>
      ) : (
        finances.incomes.map((inc) => (
          <div key={inc.id} className="transaction-card income-card">
            <span className="transaction-amount income-amount">+{inc.amount.toFixed(2)} лв</span>
            <span className="transaction-date">{inc.date}</span>
            <p className="transaction-meta">Category: {inc.category}</p>
            <p className="transaction-meta">Info: {inc.add_info}</p>
          </div>
        ))
      )}

      <h2 className="FinanceHistoryPage-h2 expense">Expenses</h2>
      {finances.expenses.length === 0 ? (
        <p className="FinanceHistoryPage-empty">No expenses added.</p>
      ) : (
        finances.expenses.map((expense) => (
          <div key={expense.id} className="transaction-card expense-card">
            <span className="transaction-amount expense-amount">-{expense.amount.toFixed(2)} лв</span>
            <span className="transaction-date">{expense.date}</span>
            <p className="transaction-meta">Category: {expense.category}</p>
            <p className="transaction-meta">Info: {expense.add_info}</p>
          </div>
        ))
      )}

      <button onClick={() => navigate(-1)} className="BackButton">Back</button>
    </div>
  );
};

export default HistoryPage;
