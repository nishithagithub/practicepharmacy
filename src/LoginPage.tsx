import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePharmacy } from "./PharmacyContext";

const LoginPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();
  const { setPharmacyName } = usePharmacy();

  const handleLogin = () => {
    if (name) {
      setPharmacyName(name);
      navigate("/form");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter pharmacy name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
