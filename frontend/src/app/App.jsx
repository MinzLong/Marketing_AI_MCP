import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import LoginRegister from "../pages/LoginRegister.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/services" element={<div>Services Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
