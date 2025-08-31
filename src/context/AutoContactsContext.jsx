import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AutoContactsContext = createContext();

export const AutoContactsProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async (AccessCode) => {
    try {
      const res = await axios.get('https://jumma-backend-vercel.vercel.app/api/contacts',{params: {
          AccessCode: AccessCode
      }});
      setMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const addContact = async (member) => {
    try {
      const res = await axios.post('https://jumma-backend-vercel.vercel.app/api/contacts', member);
      setMembers([...members, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateContact = async (id, updates) => {
    try {
      const res = await axios.patch(`https://jumma-backend-vercel.vercel.app/api/contacts/${id}`, updates);
      setMembers(members.map(m => m._id === id ? res.data : m));
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteContact = async (id) => {
    try {
      const res = await axios.delete(`https://jumma-backend-vercel.vercel.app/api/contacts/${id}`);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AutoContactsContext.Provider value={{ members, loading, addContact, updateContact, fetchContacts, deleteContact }}>
      {children}
    </AutoContactsContext.Provider>
  );
};