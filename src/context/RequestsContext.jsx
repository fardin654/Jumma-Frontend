import React, { createContext, useState } from 'react';
import axios from 'axios';

export const RequestsContext = createContext();

export const RequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Get requests for a specific member
  const fetchRequestsByMember = async (memberId) => {
    try {
      const res = await axios.get(`https://jumma-backend.onrender.com/api/requests/${memberId}`);
      setRequests(res.data.requests);
      return res.data.requests;
    } catch (err) {
      console.error(err);
      setLoading(false);
      throw err;
    }
  };

  // 🔹 Get all requests (Admin view) with AccessCode
  const fetchAllRequests = async (AccessCode) => {
    try {
      const res = await axios.get(`https://jumma-backend.onrender.com/api/requests`, {
        params: { AccessCode }
      });
      setRequests(res.data.requests);
      return res.data.requests;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 🔹 Create a new request
  const createRequest = async (requestData) => {
    try {
      setLoading
      console.log(requestData);
      const res = await axios.post(`https://jumma-backend.onrender.com/api/requests`, requestData);
      setRequests([res.data, ...requests]); 
      setLoading
      return res.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  // 🔹 Approve or reject request
  const updateRequestStatus = async (id, { isApproved, AccessCode }) => {
    try {
      setLoading(true);
      const res = await axios.patch(`https://jumma-backend.onrender.com/api/requests/${id}`, {
        isApproved,
        AccessCode,
      });
      setRequests(requests.map(r => r._id === id ? { ...r, ...res.data } : r));
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error(err);
      throw err;
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        loading,
        error,
        fetchRequestsByMember,
        fetchAllRequests,
        createRequest,
        updateRequestStatus
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};
