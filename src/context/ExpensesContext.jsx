import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { RoundsContext } from './RoundsContext';
import { WalletContext } from './WalletContext';
import { MembersContext } from './MembersContext';

const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchRounds } = useContext(RoundsContext);
  const {fetchWalletBalance} = useContext(WalletContext);
  const { fetchMembers } = useContext(MembersContext);

  const addExpense = async ({description,amount,date,balanceLeft,roundId}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`https://jumma-backend-vercel.vercel.app/api/rounds/${roundId}/expenses`, 
              {description,amount,date,balanceLeft});
      
      setLoading(false);
      await fetchWalletBalance();
      await fetchRounds();
      await fetchMembers();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <ExpensesContext.Provider value={{ addExpense, loading, error }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};