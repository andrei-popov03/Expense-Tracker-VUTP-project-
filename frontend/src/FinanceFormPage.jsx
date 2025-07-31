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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add {type === 'income' ? 'Income' : 'Expense'}</h2>
      <select value={type} onChange={(e) => setType(e.target.value)} className="border mb-2 p-2 rounded">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        type="number"
        placeholder="Сума"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full border p-2 mb-2 rounded"
      />
      <input
        type="text"
        placeholder="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block w-full border p-2 mb-4 rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
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
