import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginRegister from "../pages/LoginRegister.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import GoogleAuthCallback from "../components/auth/GoogleAuthCallback.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

