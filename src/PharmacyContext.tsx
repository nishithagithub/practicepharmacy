import React, { createContext, useContext, useState, ReactNode } from "react";

interface PharmacyContextProps {
  pharmacyName: string;
  setPharmacyName: (name: string) => void;
}

const PharmacyContext = createContext<PharmacyContextProps | undefined>(undefined);

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error("usePharmacy must be used within a PharmacyProvider");
  }
  return context;
};

interface PharmacyProviderProps {
  children: ReactNode;
}

export const PharmacyProvider: React.FC<PharmacyProviderProps> = ({ children }) => {
  const [pharmacyName, setPharmacyName] = useState<string>("");

  return (
    <PharmacyContext.Provider value={{ pharmacyName, setPharmacyName }}>
      {children}
    </PharmacyContext.Provider>
  );
};
