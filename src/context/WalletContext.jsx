// src/context/WalletContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get("https://jumma-backend.onrender.com/api/wallets");
      setBalance(res.data.Balance);
      console.log("Balance Fetched: ", balance);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      setLoading(false);
    }
  };

  const updateWalletBalance = async (newBalance) => {
    try {
      const res = await axios.patch("https://jumma-backend.onrender.com/api/wallets", { Balance: newBalance });
      setBalance(res.data.Balance);
      return res.data;
    } catch (err) {
      console.error("Error updating wallet balance:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        loading,
        fetchWalletBalance,
        updateWalletBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
