import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const RoundsContext = createContext();

export const RoundsProvider = ({ children }) => {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRounds = async (AccessCode) => {
    try {
      const res = await axios.get('https://jumma-backend-vercel.vercel.app/api/rounds',{params: {AccessCode: AccessCode}});
      const rounds = res.data;
      
      setRounds(rounds); 

      const mostRecentRound = rounds.length > 0
        ? rounds.reduce((prev, curr) => (curr.roundNumber > prev.roundNumber ? curr : prev))
        : null;

      setCurrentRound(mostRecentRound); 
      setLoading(false);

      return mostRecentRound; 
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
      const res = await axios.post('https://jumma-backend-vercel.vercel.app/api/rounds', fixedAmount);
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
      setLoading(true);
      const res = await axios.patch(`https://jumma-backend-vercel.vercel.app/api/rounds/${roundId}/complete`);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error("Error: ",err);
      throw err;
    }
  };

  const deleteRound = async (roundId) => {
    try {
      setLoading(true);
      const res = await axios.delete(`https://jumma-backend-vercel.vercel.app/api/rounds/${roundId}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error("Error: ",err);
      throw err;
    }
  };

  return (
    <RoundsContext.Provider value={{ 
      rounds, 
      currentRound, 
      loading, 
      fetchRounds, 
      fetchRoundById,
      createRound, 
      updatePayment, 
      completeRound,
      deleteRound
    }}>
      {children}
    </RoundsContext.Provider>
  );
};