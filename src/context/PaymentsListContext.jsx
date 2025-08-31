// context/PaymentsContext.js
import { createContext, useContext, useState, useEffect,useCallback } from 'react';
import axios from 'axios';

const PaymentsListContext = createContext();

export const PaymentsListProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoundPayments = useCallback(async ({roundNumber, AccessCode}) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://jumma-backend.onrender.com/api/payments/round/${roundNumber}`,({params:{AccessCode: AccessCode}}));
      if (!res.status === 200) throw new Error('Failed to fetch payments');
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const fetchPaymentsByMember = useCallback(async ({id, AccessCode}) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jumma-backend.onrender.com/api/payments/member/${id}`,({params:{AccessCode: AccessCode}}));
      setPayments(response.data.payments);
      setMember(response.data.member);
      setLoading(false);
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
      fetchPaymentsByMember,
      fetchRoundPayments
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