import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('https://jumma-backend-vercel.vercel.app/api/members');
      setMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const addMember = async (member) => {
    try {
      const res = await axios.post('https://jumma-backend-vercel.vercel.app/api/members', member);
      setMembers([...members, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateMember = async (id, updates) => {
    try {
      const res = await axios.patch(`https://jumma-backend-vercel.vercel.app/api/members/${id}`, updates);
      setMembers(members.map(m => m._id === id ? res.data : m));
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getMemberById = async (id) => {
    try {
      const response = await axios.get(`/api/members/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };


  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <MembersContext.Provider value={{ members, loading, addMember, updateMember, fetchMembers, getMemberById }}>
      {children}
    </MembersContext.Provider>
  );
};