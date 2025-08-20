// context/PaymentsContext.js
import { createContext, useContext, useState, useEffect,useCallback } from 'react';
import axios from 'axios';

const PaymentsListContext = createContext();

export const PaymentsListProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentsByMember = useCallback(async (name) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jumma-backend-vercel.vercel.app/api/payments/member/${name}`);
      setPayments(response.data.payments);
      setMember(response.data.member);
      setLoading(false);
      console.log('Payments fetched successfully:', response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return (
    <PaymentsListContext.Provider value={{ 
      payments,
      member,
      loading,
      error,
      fetchPaymentsByMember
    }}>
      {children}
    </PaymentsListContext.Provider>
  );
};

export const usePaymentsList = () => {
  const context = useContext(PaymentsListContext);
  if (!context) {
    throw new Error('usePayments must be used within a PaymentsProvider');
  }
  return context;
};