import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ProfilePage from './ProfilePage';
import FinanceFormPage from './FinanceFormPage';
import MonthlySummaryPage from './MonthlySummaryPage';
import HistoryPage from "./HistoryPage";
import RecurringPage from "./RecurringPage";
import './App.css';

// Guards any route that requires login — redirects to /login if no token is stored
function ProtectedRoute({ children }) {
  return localStorage.getItem('access_token') ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/financeFormPage" element={<ProtectedRoute><FinanceFormPage /></ProtectedRoute>} />
      <Route path="/monthlySummaryPage" element={<ProtectedRoute><MonthlySummaryPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/recurringPage" element={<ProtectedRoute><RecurringPage /></ProtectedRoute>} />
      {/* Catch-all: any unknown URL falls back to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
