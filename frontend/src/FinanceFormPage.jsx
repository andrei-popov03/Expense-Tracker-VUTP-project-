import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinanceFormPage = () => {
  const token = localStorage.getItem('access_token');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('income');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const endpoint = type === 'income' ? 'income' : 'expense';

    fetch(`http://localhost:5000/${endpoint}`, {
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
      .then(res => res.json())
      .then(data => {
        alert(data.msg || 'Успешно добавено!');
        setAmount('');
        setCategory('');
      })
      .catch(err => console.error('Error:', err));
  };
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="FinanceFormPage-container">
      <h1 className="FinanceFormPage-h1">Add {type === 'income' ? 'Income' : 'Expense'}</h1>
      
      
      <select value={type} onChange={(e) => setType(e.target.value)} className="FinanceFormPage-select">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select> <br />
      <input
        type="number"
        placeholder="Value"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="FinanceFormPage-input-value"
      /><br />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="FinanceFormPage-input-Category"
      />
      <button
        onClick={handleSubmit}
        className="AddButton"
      >
        Add
      </button> <br />


      <button onClick={handleBack} className="BackButton">
        Back
      </button>
    </div>
  );
};

export default FinanceFormPage;
