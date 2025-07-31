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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Обобщение за месеца</h2>

      <div className="mb-4">
        <label className="mr-2">Месец:</label>
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-1 rounded w-20 mr-4"
        />
        <label className="mr-2">Година:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-1 rounded w-28"
        />
      </div>

      {summary ? (
        <div className="bg-white shadow p-4 rounded">
          <p><strong>Общо приходи:</strong> {summary.total_income} лв</p>
          <p><strong>Общо разходи:</strong> {summary.total_expense} лв</p>
          <p><strong>Спестявания:</strong> {summary.savings} лв</p>
        </div>
      ) : (
        <p>Зареждане...</p>
      )}

      <button onClick={handleBack} className="BackButton">
        Back
      </button>
    </div>
  );
};

export default MonthlySummaryPage;
