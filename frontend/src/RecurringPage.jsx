import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const CATEGORIES = {
  income:  ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Rental Income', 'Other'],
  expense: ['Food & Groceries', 'Transport', 'Rent', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Other'],
};
const CURRENCIES  = ['BGN', 'EUR', 'USD'];
const FREQUENCIES = ['monthly', 'weekly', 'yearly'];

const RecurringPage = () => {
  const [items, setItems]               = useState([]);
  const [loadingList, setLoadingList]   = useState(true);
  const [applyingId, setApplyingId]     = useState(null);
  const [deletingId, setDeletingId]     = useState(null);
  const [formOpen, setFormOpen]         = useState(false);
  const [message, setMessage]           = useState({ text: '', isError: false });

  // form state
  const [type, setType]                 = useState('expense');
  const [amount, setAmount]             = useState('');
  const [currency, setCurrency]         = useState('BGN');
  const [category, setCategory]         = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [addInfo, setAddInfo]           = useState('');
  const [frequency, setFrequency]       = useState('monthly');
  const [submitting, setSubmitting]     = useState(false);

  const navigate = useNavigate();

  const fetchItems = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await authFetch('/recurring');
      if (!res || !res.ok) return;
      const data = await res.json();
      setItems(data);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setCategory('');
    setCustomCategory('');
  };

  const handleSubmit = async () => {
    setMessage({ text: '', isError: false });
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setMessage({ text: 'Please enter a valid amount greater than zero.', isError: true });
      return;
    }
    const resolvedCategory = category === 'Other' ? customCategory : category;

    setSubmitting(true);
    try {
      const res = await authFetch('/recurring', {
        method: 'POST',
        body: JSON.stringify({
          type,
          amount: parsed,
          currency,
          category: resolvedCategory || 'General',
          add_info: addInfo || '',
          frequency,
        }),
      });
      if (!res) return;
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.msg || 'Something went wrong.', isError: true });
        return;
      }
      setMessage({ text: 'Recurring transaction saved!', isError: false });
      setAmount(''); setCurrency('BGN'); setCategory('');
      setCustomCategory(''); setAddInfo(''); setFrequency('monthly');
      setFormOpen(false);
      fetchItems();
    } catch {
      setMessage({ text: 'Could not connect to server.', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApply = async (id) => {
    setApplyingId(id);
    try {
      const res = await authFetch(`/recurring/${id}/apply`, { method: 'POST' });
      if (!res) return;
      const data = await res.json();
      setMessage({ text: data.msg || 'Applied!', isError: !res.ok });
    } catch {
      setMessage({ text: 'Could not connect to server.', isError: true });
    } finally {
      setApplyingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await authFetch(`/recurring/${id}`, { method: 'DELETE' });
      if (!res) return;
      if (res.ok) {
        setItems((prev) => prev.filter((r) => r.id !== id));
        setMessage({ text: 'Deleted.', isError: false });
      }
    } catch {
      setMessage({ text: 'Could not connect to server.', isError: true });
    } finally {
      setDeletingId(null);
    }
  };

  const incomes  = items.filter((r) => r.type === 'income');
  const expenses = items.filter((r) => r.type === 'expense');

  return (
    <div className="RecurringPage-container">
      <h1 className="RecurringPage-h1">Recurring Transactions</h1>

      {message.text && (
        <p className={`FFP-message ${message.isError ? 'FFP-message--error' : 'FFP-message--success'}`}>
          {message.text}
        </p>
      )}

      <button
        className="AddButton"
        onClick={() => { setFormOpen((o) => !o); setMessage({ text: '', isError: false }); }}
      >
        {formOpen ? 'Cancel' : '+ Add Recurring'}
      </button>

      {formOpen && (
        <div className="Recurring-form">
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
            <select value={category} onChange={(e) => { setCategory(e.target.value); setCustomCategory(''); }} className="FFP-select">
              <option value="">— Select a category —</option>
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            <label className="FFP-label">Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="FFP-select">
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="FFP-field">
            <label className="FFP-label">Notes</label>
            <input
              type="text"
              placeholder="Optional notes"
              value={addInfo}
              onChange={(e) => setAddInfo(e.target.value)}
              className="FFP-input"
            />
          </div>

          <button onClick={handleSubmit} className="AddButton" disabled={submitting} style={{ marginTop: '8px' }}>
            {submitting ? 'Saving...' : 'Save Recurring'}
          </button>
        </div>
      )}

      {loadingList ? (
        <p className="MonthlySummary-loading">Loading...</p>
      ) : (
        <>
          <RecurringGroup
            title="Income"
            colorClass="income"
            items={incomes}
            applyingId={applyingId}
            deletingId={deletingId}
            onApply={handleApply}
            onDelete={handleDelete}
          />
          <RecurringGroup
            title="Expenses"
            colorClass="expense"
            items={expenses}
            applyingId={applyingId}
            deletingId={deletingId}
            onApply={handleApply}
            onDelete={handleDelete}
          />
          {items.length === 0 && (
            <p className="FinanceHistoryPage-empty">No recurring transactions yet. Add one above.</p>
          )}
        </>
      )}

      <button onClick={() => navigate('/dashboard')} className="BackButton" style={{ marginTop: '24px' }}>
        Back
      </button>
    </div>
  );
};

const RecurringGroup = ({ title, colorClass, items, applyingId, deletingId, onApply, onDelete }) => {
  if (items.length === 0) return null;
  return (
    <>
      <h2 className={`FinanceHistoryPage-h2 ${colorClass}`}>{title}</h2>
      {items.map((r) => (
        <div key={r.id} className={`transaction-card ${colorClass}-card`}>
          <span className={`transaction-amount ${colorClass}-amount`}>
            {r.amount.toFixed(2)} {r.currency}
          </span>
          <span className="Recurring-frequency-badge">{r.frequency}</span>
          <span className="transaction-date">{r.category}</span>
          {r.add_info && <p className="transaction-meta">{r.add_info}</p>}
          <div className="Recurring-card-actions">
            <button
              className="Recurring-apply-btn"
              onClick={() => onApply(r.id)}
              disabled={applyingId === r.id || deletingId === r.id}
            >
              {applyingId === r.id ? 'Applying...' : 'Apply Now'}
            </button>
            <button
              className="Recurring-delete-btn"
              onClick={() => onDelete(r.id)}
              disabled={applyingId === r.id || deletingId === r.id}
            >
              {deletingId === r.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default RecurringPage;
