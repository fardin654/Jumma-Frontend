// src/context/WalletContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWalletBalance = async (AccessCode) => {
    try {
      if(AccessCode == null) return;
      const res = await axios.get("https://jumma-backend-vercel.vercel.app/api/wallets", {params: {AccessCode: AccessCode}});
      setBalance(res.data.Balance);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        loading,
        fetchWalletBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
