import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PharmacyProvider } from "./PharmacyContext";
import LoginPage from "./LoginPage";
import Home from "./pages/Home";



const App: React.FC = () => {
  return (
    <PharmacyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/form" element={<Home />} />
          
        </Routes>
      </Router>
    </PharmacyProvider>
  );
};

export default App;
