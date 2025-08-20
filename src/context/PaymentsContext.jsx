// paymentsContext.js
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { RoundsContext } from './RoundsContext';
import { WalletContext } from './WalletContext';
import { MembersContext } from './MembersContext';

const PaymentsContext = createContext();

export const PaymentsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchRounds } = useContext(RoundsContext);
  const { fetchWalletBalance } = useContext(WalletContext);
  const { fetchMembers } = useContext(MembersContext);

  const addPayment = async ({ amount, paidBy, roundId, date }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`https://jumma-backend-vercel.vercel.app/api/rounds/${roundId}/payments`, {
        amount,
        paidBy,
        date
      });

      await fetchRounds();
      await fetchWalletBalance();
      await fetchMembers();

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <PaymentsContext.Provider value={{ addPayment, loading, error }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error('usePayments must be used within a PaymentsProvider');
  }
  return context;
};