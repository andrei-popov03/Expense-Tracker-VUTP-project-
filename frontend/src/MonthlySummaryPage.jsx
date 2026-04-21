import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';

const CURRENCY_SYMBOLS = { BGN: 'лв', EUR: '€', USD: '$' };

const MonthlySummaryPage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [displayCurrency, setDisplayCurrency] = useState('BGN');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
    setSummary(null);
    authFetch(`/summary?month=${month}&year=${year}&currency=${displayCurrency}`)
      .then((res) => {
        if (!res || !res.ok) throw new Error();
        return res.json();
      })
      .then(setSummary)
      .catch(() => setError('Could not load summary.'));
  }, [month, year, displayCurrency]);

  const handleMonthChange = (e) => {
    const val = Math.min(12, Math.max(1, Number(e.target.value)));
    setMonth(val);
  };

  const handleYearChange = (e) => {
    const val = Number(e.target.value);
    if (val > 1900 && val <= now.getFullYear() + 1) setYear(val);
  };

  const sym = CURRENCY_SYMBOLS[displayCurrency];

  const fmt = (n) =>
    displayCurrency === 'BGN'
      ? `${n.toFixed(2)} ${sym}`
      : `${sym}${n.toFixed(2)}`;

  return (
    <div className="MonthlySummary-container">
      <h1 className="MonthlySummary-h1">Monthly Summary</h1>

      <div className="MonthlySummary-selectors">
        <div className="MonthlySummary-selector-group">
          <label className="MonthlySummary-label">Month</label>
          <input
            type="number"
            value={month}
            onChange={handleMonthChange}
            min="1"
            max="12"
            className="MonthlySummary-input"
          />
        </div>
        <div className="MonthlySummary-selector-group">
          <label className="MonthlySummary-label">Year</label>
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            className="MonthlySummary-input"
          />
        </div>
        <div className="MonthlySummary-selector-group">
          <label className="MonthlySummary-label">Currency</label>
          <select
            value={displayCurrency}
            onChange={(e) => setDisplayCurrency(e.target.value)}
            className="MonthlySummary-input MonthlySummary-currency-select"
          >
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
            <span className="MonthlySummary-value income-value">+{fmt(summary.total_income)}</span>
          </div>
          <div className="MonthlySummary-row">
            <span className="MonthlySummary-label">Expense</span>
            <span className="MonthlySummary-value expense-value">-{fmt(summary.total_expense)}</span>
          </div>
          <div className="MonthlySummary-divider" />
          <div className="MonthlySummary-row MonthlySummary-row--savings">
            <span className="MonthlySummary-label">Savings</span>
            <span className={`MonthlySummary-value ${summary.savings >= 0 ? 'income-value' : 'expense-value'}`}>
              {summary.savings >= 0 ? '+' : ''}{fmt(Math.abs(summary.savings))}
            </span>
          </div>
        </div>
      ) : (
        <p className="MonthlySummary-loading">Loading...</p>
      )}

      <div className="MonthlySummary-buttons">
        <button onClick={() => navigate('/history')} className="HistoryButton">History</button>
        <button onClick={() => navigate('/dashboard')} className="BackButton">Back</button>
      </div>
    </div>
  );
};

export default MonthlySummaryPage;
