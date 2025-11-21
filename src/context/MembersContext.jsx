import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../config';

export const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async (AccessCode) => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/members`, {
        params: {
          AccessCode: AccessCode
        }
      });
      setMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const addMember = async (member) => {
    try {
      const res = await axios.post(`${URL}/members`, (member));
      setMembers([...members, res.data]);
      console.log("Added Member", res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateMember = async (id, updates) => {
    try {
      const res = await axios.patch(`${URL}/members/${id}`, ({updates, AccessCode}));
      setMembers(members.map(m => m._id === id ? res.data : m));
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteMember = async (id) => {
    try {
      const res = await axios.delete(`${URL}/members/${id}`);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getMemberById = async (id) => {
    try {
      const response = await axios.get(`${URL}/members/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  return (
    <MembersContext.Provider value={{ members, loading, addMember, updateMember, fetchMembers, getMemberById, deleteMember }}>
      {children}
    </MembersContext.Provider>
  );
};