import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const RoundsContext = createContext();

export const RoundsProvider = ({ children }) => {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRounds = async () => {
    try {
      const res = await axios.get('https://jumma-backend-vercel.vercel.app/api/rounds');
      setRounds(res.data);
      console.log("Response data:", res.data, Array.isArray(res.data));
      
      // Find the most recent incomplete round
      const incompleteRound = res.data.find(r => !r.isCompleted);
      if (incompleteRound) {
        setCurrentRound(incompleteRound);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchRoundById = async (id) => {
    try {
      const res = await axios.get(`https://jumma-backend-vercel.vercel.app/api/rounds/${id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const createRound = async (fixedAmount) => {
    try {
      const rounds = await axios.get('https://jumma-backend-vercel.vercel.app/rounds');
      const nextRoundNumber = rounds.data.length > 0 
        ? Math.max(...rounds.data.map(r => r.roundNumber)) + 1 
        : 1;
      
      const roundData = {
        roundNumber: nextRoundNumber,
        fixed: fixedAmount
      };

      const res = await axios.post('https://jumma-backend-vercel.vercel.app/rounds', roundData);
      setRounds(prevRounds => [...prevRounds, res.data]);
      setCurrentRound(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updatePayment = async (roundId, paymentId, updates) => {
    try {
      const res = await axios.patch(`https://jumma-backend-vercel.vercel.app/rounds/${roundId}/payments/${paymentId}`, updates);
      
      setRounds(rounds.map(r => 
        r._id === roundId ? res.data : r
      ));
      
      if (currentRound && currentRound._id === roundId) {
        setCurrentRound(res.data);
      }
      
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const completeRound = async (roundId) => {
    try {
      const res = await axios.patch(`https://jumma-backend-vercel.vercel.app/rounds/${roundId}/complete`);
      
      setRounds(rounds.map(r => 
        r._id === roundId ? res.data : r
      ));
      
      if (currentRound && currentRound._id === roundId) {
        setCurrentRound(null);
      }
      
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  return (
    <RoundsContext.Provider value={{ 
      rounds, 
      currentRound, 
      loading, 
      fetchRounds, 
      fetchRoundById,
      createRound, 
      updatePayment, 
      completeRound 
    }}>
      {children}
    </RoundsContext.Provider>
  );
};