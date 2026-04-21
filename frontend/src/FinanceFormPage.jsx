import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const CATEGORIES = {
  income:  ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Rental Income', 'Other'],
  expense: ['Food & Groceries', 'Transport', 'Rent', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'],
};

const CURRENCIES = ['BGN', 'EUR', 'USD'];

const FinanceFormPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BGN');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [add_info, setAddInfo] = useState('');
  const [type, setType] = useState('income');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setType(e.target.value);
    // Reset category when switching type so stale income/expense options don't carry over
    setCategory('');
    setCustomCategory('');
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCustomCategory('');
  };

  const handleSubmit = async () => {
    setMessage({ text: '', isError: false });

    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setMessage({ text: 'Please enter a valid amount greater than zero.', isError: true });
      return;
    }

    // Use the custom text input value when "Other" is selected
    const resolvedCategory = category === 'Other' ? customCategory : category;

    setLoading(true);
    try {
      const res = await authFetch(`/${type}`, {
        method: 'POST',
        body: JSON.stringify({
          amount: parsed,
          currency,
          category: resolvedCategory || 'General',
          add_info: add_info || 'General',
        }),
      });
      if (!res) return;
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.msg || 'Something went wrong.', isError: true });
        return;
      }
      setMessage({ text: 'Added successfully!', isError: false });
      // Clear form on success so the user can immediately add another entry
      setAmount('');
      setCurrency('BGN');
      setCategory('');
      setCustomCategory('');
      setAddInfo('');
    } catch {
      setMessage({ text: 'Could not connect to server.', isError: true });
    } finally {
      // Always re-enable the button, even if the request failed
      setLoading(false);
    }
  };

  return (
    <div className="FinanceFormPage-container">
      <h1 className="FinanceFormPage-h1">
        Add {type === 'income' ? 'Income' : 'Expense'}
      </h1>

      <div className="FFP-field">
        <label className="FFP-label">Type</label>
        <select value={type} onChange={handleTypeChange} className="FFP-select">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="FFP-field">
        <label className="FFP-label">Amount</label>
        <div className="FFP-amount-row">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="FFP-input"
            min="0.01"
            step="0.01"
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="FFP-select FFP-currency-select">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="FFP-field">
        <label className="FFP-label">Category</label>
        <select value={category} onChange={handleCategoryChange} className="FFP-select">
          <option value="">— Select a category —</option>
          {CATEGORIES[type].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {/* Text box appears only when Other is chosen */}
        {category === 'Other' && (
          <input
            type="text"
            placeholder="Enter your category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="FFP-input FFP-input--custom"
            autoFocus
          />
        )}
      </div>

      <div className="FFP-field">
        <label className="FFP-label">Additional Information</label>
        <input
          type="text"
          placeholder="Optional notes"
          value={add_info}
          onChange={(e) => setAddInfo(e.target.value)}
          className="FFP-input"
        />
      </div>

      {/* Same element handles both error (red) and success (green) feedback */}
      {message.text && (
        <p className={`FFP-message ${message.isError ? 'FFP-message--error' : 'FFP-message--success'}`}>
          {message.text}
        </p>
      )}

      <div className="FFP-buttons">
        {/* disabled while loading prevents double-submission */}
        <button onClick={handleSubmit} className="AddButton" disabled={loading}>
          {loading ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
        </button>
        <button onClick={() => navigate('/dashboard')} className="BackButton">
          Back
        </button>
      </div>
    </div>
  );
};

export default FinanceFormPage;
