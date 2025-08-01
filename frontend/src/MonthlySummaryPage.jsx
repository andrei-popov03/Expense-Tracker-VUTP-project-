import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlySummaryPage = () => {
  const token = localStorage.getItem('access_token');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/summary?month=${month}&year=${year}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error('Error fetching summary:', err));
  }, [month, year]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="MonthlySummary-comtainer">
      <h1 className="MonthlySummary-h1">Monthly Summary</h1>

      <div className="MonthlySummary-month-year-selector">
        <label className="MonthlySummary-month">Month:</label>
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="MonthlySummary-month-input"
        /> <br />
        <label className="MonthlySummary-year">Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="MonthlySummary-year-input"
        />
      

        {summary ? (
          <div className="MonthlySummary-summary">
            <p><strong>Income:</strong> {summary.total_income} лв</p>
            <p><strong>Expense:</strong> {summary.total_expense} лв</p>
            <p><strong>Overall:</strong> {summary.savings} лв</p>
          </div>
        ) : (
        <p>Loading...</p>
        )}
      </div>

      <button onClick={handleBack} className="BackButton">
        Back
      </button>
    </div>
  );
};

export default MonthlySummaryPage;
