import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import './App.css'; // Assuming you have some global styles

import Header from './Header';
import ProfilePage from './ProfilePage';
import FinanceFormPage from './FinanceFormPage';
import MonthlySummaryPage from './MonthlySummaryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />
      <Route path="/financeFormPage" element={<FinanceFormPage />} />
      <Route path="/monthlySummaryPage" element={<MonthlySummaryPage />} />
      <Route path="/header" element={<Header />} />
    </Routes>
  );
}

export default App;