import { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { authFetch } from './api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const RATES_TO_BGN = { BGN: 1.0, EUR: 1.95583, USD: 1.6633 };
const CURRENCY_SYMBOLS = { BGN: 'лв', EUR: '€', USD: '$' };

function convert(amount, fromCurrency, toCurrency) {
  const bgn = amount * (RATES_TO_BGN[fromCurrency] ?? 1.0);
  return bgn / RATES_TO_BGN[toCurrency];
}

function fmt(amount, currency) {
  const val = amount.toFixed(2);
  return currency === 'BGN' ? `${val} лв` : `${CURRENCY_SYMBOLS[currency]}${val}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const HistoryPage = () => {
  const [finances, setFinances] = useState({ incomes: [], expenses: [] });
  const [displayCurrency, setDisplayCurrency] = useState('BGN');
  const [error, setError] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    authFetch('/transactions')
      .then((res) => { if (!res || !res.ok) throw new Error(); return res.json(); })
      .then((data) => setFinances({ incomes: data.incomes || [], expenses: data.expenses || [] }))
      .catch(() => setError('Could not load transactions.'));
  }, []);

  const allTransactions = useMemo(() => {
    const inc = finances.incomes.map(t => ({ ...t, type: 'income' }));
    const exp = finances.expenses.map(t => ({ ...t, type: 'expense' }));
    return [...inc, ...exp].sort((a, b) => b.date.localeCompare(a.date));
  }, [finances]);

  const categories = useMemo(() => {
    const cats = new Set(allTransactions.map(t => t.category).filter(Boolean));
    return ['all', ...Array.from(cats).sort()];
  }, [allTransactions]);

  const filtered = useMemo(() => {
    return allTransactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterDateFrom && t.date < filterDateFrom) return false;
      if (filterDateTo && t.date > filterDateTo) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      const converted = convert(t.amount, t.currency || 'BGN', displayCurrency);
      if (filterAmountMin !== '' && converted < parseFloat(filterAmountMin)) return false;
      if (filterAmountMax !== '' && converted > parseFloat(filterAmountMax)) return false;
      return true;
    });
  }, [allTransactions, filterType, filterDateFrom, filterDateTo, filterCategory, filterAmountMin, filterAmountMax, displayCurrency]);

  const hasActiveFilters = filterType !== 'all' || filterDateFrom || filterDateTo
    || filterCategory !== 'all' || filterAmountMin !== '' || filterAmountMax !== '';

  // Rows to export: filtered list when filters are active, otherwise all transactions
  const exportRows = hasActiveFilters ? filtered : allTransactions;

  const clearFilters = () => {
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterCategory('all');
    setFilterAmountMin('');
    setFilterAmountMax('');
  };

  const exportCSV = () => {
    const header = ['Type', 'Date', 'Category', 'Amount', 'Currency', 'Info'];
    const rows = exportRows.map(t => [
      t.type,
      t.date,
      t.category || '',
      t.amount.toFixed(2),
      t.currency || 'BGN',
      t.add_info || '',
    ]);
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map(r => r.map(escape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${todayStr()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Transaction History', 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Exported on ${todayStr()}  |  Amounts in original currency`, 14, 25);

    autoTable(doc, {
      startY: 30,
      head: [['Type', 'Date', 'Category', 'Amount', 'Currency', 'Info']],
      body: exportRows.map(t => [
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        t.date,
        t.category || '-',
        t.amount.toFixed(2),
        t.currency || 'BGN',
        t.add_info || '-',
      ]),
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 250, 245] },
      didParseCell(data) {
        if (data.section === 'body' && data.column.index === 0) {
          data.cell.styles.textColor = data.cell.raw === 'Income' ? [22, 163, 74] : [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    doc.save(`transactions_${todayStr()}.pdf`);
  };

  const sym = CURRENCY_SYMBOLS[displayCurrency];

  return (
    <div className="FinanceHistoryPage-container">
      <h1 className="FinanceHistoryPage-h1">Transaction History</h1>

      <div className="FinanceHistoryPage-controls">
        <label className="FinanceHistoryPage-controls-label">Currency</label>
        <select
          value={displayCurrency}
          onChange={(e) => setDisplayCurrency(e.target.value)}
          className="FinanceHistoryPage-currency-select"
        >
          <option value="BGN">BGN лв</option>
          <option value="EUR">EUR €</option>
          <option value="USD">USD $</option>
        </select>

        <button
          onClick={() => setShowFilters(f => !f)}
          className={`Filter-toggle-btn${hasActiveFilters ? ' active' : ''}`}
        >
          {showFilters ? 'Hide Filters' : 'Filters'}{hasActiveFilters ? ' ●' : ''}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="Filter-clear-btn">Clear</button>
        )}

        <div className="Export-buttons">
          <button onClick={exportCSV} className="Export-btn Export-btn--csv" disabled={exportRows.length === 0}>
            CSV
          </button>
          <button onClick={exportPDF} className="Export-btn Export-btn--pdf" disabled={exportRows.length === 0}>
            PDF
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="Filter-panel">
          <div className="Filter-row">
            <div className="Filter-group">
              <label className="Filter-label">Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="Filter-select">
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="Filter-group">
              <label className="Filter-label">Category</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="Filter-select">
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="Filter-row">
            <div className="Filter-group">
              <label className="Filter-label">Date from</label>
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} className="Filter-input" />
            </div>
            <div className="Filter-group">
              <label className="Filter-label">Date to</label>
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} className="Filter-input" />
            </div>
          </div>
          <div className="Filter-row">
            <div className="Filter-group">
              <label className="Filter-label">Min amount ({sym})</label>
              <input type="number" value={filterAmountMin} onChange={e => setFilterAmountMin(e.target.value)} className="Filter-input" min="0" step="0.01" placeholder="0.00" />
            </div>
            <div className="Filter-group">
              <label className="Filter-label">Max amount ({sym})</label>
              <input type="number" value={filterAmountMax} onChange={e => setFilterAmountMax(e.target.value)} className="Filter-input" min="0" step="0.01" placeholder="any" />
            </div>
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {hasActiveFilters ? (
        <>
          <p className="Filter-results-count">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.length === 0 ? (
            <p className="FinanceHistoryPage-empty">No transactions match the filters.</p>
          ) : (
            filtered.map((t) => {
              const converted = convert(t.amount, t.currency || 'BGN', displayCurrency);
              const isIncome = t.type === 'income';
              return (
                <div key={`${t.type}-${t.id}`} className={`transaction-card ${isIncome ? 'income-card' : 'expense-card'}`}>
                  <span className={`transaction-amount ${isIncome ? 'income-amount' : 'expense-amount'}`}>
                    {isIncome ? '+' : '-'}{fmt(converted, displayCurrency)}
                  </span>
                  <span className="transaction-date">{t.date}</span>
                  <p className="transaction-meta">Category: {t.category}</p>
                  <p className="transaction-meta">Info: {t.add_info}</p>
                </div>
              );
            })
          )}
        </>
      ) : (
        <>
          <h2 className="FinanceHistoryPage-h2 income">Income</h2>
          {finances.incomes.length === 0 ? (
            <p className="FinanceHistoryPage-empty">No incomes added.</p>
          ) : (
            finances.incomes.map((inc) => (
              <div key={inc.id} className="transaction-card income-card">
                <span className="transaction-amount income-amount">
                  +{fmt(convert(inc.amount, inc.currency || 'BGN', displayCurrency), displayCurrency)}
                </span>
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
            finances.expenses.map((exp) => (
              <div key={exp.id} className="transaction-card expense-card">
                <span className="transaction-amount expense-amount">
                  -{fmt(convert(exp.amount, exp.currency || 'BGN', displayCurrency), displayCurrency)}
                </span>
                <span className="transaction-date">{exp.date}</span>
                <p className="transaction-meta">Category: {exp.category}</p>
                <p className="transaction-meta">Info: {exp.add_info}</p>
              </div>
            ))
          )}
        </>
      )}

      <button onClick={() => navigate(-1)} className="BackButton">Back</button>
    </div>
  );
};

export default HistoryPage;
