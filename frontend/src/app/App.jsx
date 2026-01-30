import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginRegister from "../pages/LoginRegister.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

