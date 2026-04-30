import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const CURRENCY_SYMBOLS = { BGN: 'лв', EUR: '€', USD: '$' };
const RATES_TO_BGN = { BGN: 1.0, EUR: 1.95583, USD: 1.6633 };

function convertCurrency(amount, from, to) {
  return (amount * RATES_TO_BGN[from]) / RATES_TO_BGN[to];
}

function fmt(amount, currency) {
  const val = amount.toFixed(2);
  return currency === 'BGN' ? `${val} лв` : `${CURRENCY_SYMBOLS[currency]}${val}`;
}

const MonthlySummaryPage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [displayCurrency, setDisplayCurrency] = useState('BGN');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const [budget, setBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetCurrency, setBudgetCurrency] = useState('BGN');
  const [editingBudget, setEditingBudget] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSummary(null);
    authFetch(`/summary?month=${month}&year=${year}&currency=${displayCurrency}`)
      .then((res) => { if (!res || !res.ok) throw new Error(); return res.json(); })
      .then(setSummary)
      .catch(() => setError('Could not load summary.'));
  }, [month, year, displayCurrency]);

  useEffect(() => {
    authFetch('/budget')
      .then((res) => { if (!res || !res.ok) throw new Error(); return res.json(); })
      .then((data) => setBudget(data.budget));
  }, []);

  const handleSaveBudget = async () => {
    const parsed = parseFloat(budgetInput);
    if (!budgetInput || isNaN(parsed) || parsed <= 0) return;
    const res = await authFetch('/budget', {
      method: 'POST',
      body: JSON.stringify({ amount: parsed, currency: budgetCurrency }),
    });
    if (!res) return;
    const data = await res.json();
    setBudget(data.budget);
    setEditingBudget(false);
    setBudgetInput('');
  };

  const handleDeleteBudget = async () => {
    const res = await authFetch('/budget', { method: 'DELETE' });
    if (!res) return;
    setBudget(null);
    setEditingBudget(false);
  };

  const startEdit = () => {
    setBudgetInput(budget ? String(budget.amount) : '');
    setBudgetCurrency(budget ? budget.currency : 'BGN');
    setEditingBudget(true);
  };

  // Convert budget to display currency so it's comparable to total_expense
  const budgetInDisplay = budget
    ? convertCurrency(budget.amount, budget.currency, displayCurrency)
    : null;
  const pct = budgetInDisplay && summary
    ? (summary.total_expense / budgetInDisplay) * 100
    : null;
  const isWarning = pct !== null && pct >= 80 && pct < 100;
  const isOver    = pct !== null && pct >= 100;

  const handleMonthChange = (e) => setMonth(Math.min(12, Math.max(1, Number(e.target.value))));
  const handleYearChange  = (e) => {
    const val = Number(e.target.value);
    if (val > 1900 && val <= now.getFullYear() + 1) setYear(val);
  };

  const sym = CURRENCY_SYMBOLS[displayCurrency];

  return (
    <div className="MonthlySummary-container">
      <h1 className="MonthlySummary-h1">Monthly Summary</h1>

      <div className="MonthlySummary-selectors">
        <div className="MonthlySummary-selector-group">
          <label className="MonthlySummary-label">Month</label>
          <input type="number" value={month} onChange={handleMonthChange} min="1" max="12" className="MonthlySummary-input" />
        </div>
        <div className="MonthlySummary-selector-group">
          <label className="MonthlySummary-label">Year</label>
          <input type="number" value={year} onChange={handleYearChange} className="MonthlySummary-input" />
        </div>
        <div className="MonthlySummary-selector-group">
          <label className="MonthlySummary-label">Currency</label>
          <select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value)} className="MonthlySummary-input MonthlySummary-currency-select">
            <option value="BGN">BGN лв</option>
            <option value="EUR">EUR €</option>
            <option value="USD">USD $</option>
          </select>
        </div>
      </div>

      {error ? (
        <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>
      ) : summary ? (
        <div className="MonthlySummary-results">
          <div className="MonthlySummary-row">
            <span className="MonthlySummary-label">Income</span>
            <span className="MonthlySummary-value income-value">+{fmt(summary.total_income, displayCurrency)}</span>
          </div>
          <div className="MonthlySummary-row">
            <span className="MonthlySummary-label">Expense</span>
            <span className="MonthlySummary-value expense-value">-{fmt(summary.total_expense, displayCurrency)}</span>
          </div>
          <div className="MonthlySummary-divider" />
          <div className="MonthlySummary-row MonthlySummary-row--savings">
            <span className="MonthlySummary-label">Savings</span>
            <span className={`MonthlySummary-value ${summary.savings >= 0 ? 'income-value' : 'expense-value'}`}>
              {summary.savings >= 0 ? '+' : ''}{fmt(Math.abs(summary.savings), displayCurrency)}
            </span>
          </div>
        </div>
      ) : (
        <p className="MonthlySummary-loading">Loading...</p>
      )}

      {/* ── Budget section ── */}
      <div className="Budget-section">
        <div className="Budget-header">
          <span className="Budget-title">Monthly Budget</span>
          {budget && !editingBudget && (
            <div className="Budget-header-actions">
              <button onClick={startEdit} className="Budget-btn-secondary">Edit</button>
              <button onClick={handleDeleteBudget} className="Budget-btn-remove">Remove</button>
            </div>
          )}
        </div>

        {!budget || editingBudget ? (
          <div className="Budget-form">
            <input
              type="number"
              placeholder="e.g. 1000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="Budget-input"
              min="0.01"
              step="0.01"
            />
            <select value={budgetCurrency} onChange={(e) => setBudgetCurrency(e.target.value)} className="Budget-currency-select">
              <option value="BGN">BGN лв</option>
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
            </select>
            <button onClick={handleSaveBudget} className="Budget-btn-save">Set</button>
            {editingBudget && (
              <button onClick={() => setEditingBudget(false)} className="Budget-btn-secondary">Cancel</button>
            )}
          </div>
        ) : (
          <div className="Budget-display">
            <div className="Budget-bar-track">
              <div
                className={`Budget-bar-fill${isOver ? ' over' : isWarning ? ' warning' : ''}`}
                style={{ width: `${Math.min(pct, 100).toFixed(1)}%` }}
              />
            </div>
            <div className="Budget-stats">
              <span>{fmt(summary ? summary.total_expense : 0, displayCurrency)}</span>
              <span className={isOver ? 'expense-value' : isWarning ? 'Budget-pct-warning' : 'income-value'}>
                {Math.round(pct)}%
              </span>
              <span>of {fmt(budgetInDisplay, displayCurrency)}</span>
            </div>
            {isOver && (
              <p className="Budget-alert Budget-alert--over">⚠ Over budget!</p>
            )}
            {isWarning && (
              <p className="Budget-alert Budget-alert--warning">⚠ Approaching limit — {Math.round(pct)}% used</p>
            )}
          </div>
        )}
      </div>

      <div className="MonthlySummary-buttons">
        <button onClick={() => navigate('/history')} className="HistoryButton">History</button>
        <button onClick={() => navigate('/dashboard')} className="BackButton">Back</button>
      </div>
    </div>
  );
};

export default MonthlySummaryPage;
