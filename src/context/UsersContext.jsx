import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create User Context
const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Load users from localStorage on initial render
  useEffect(() => {
    const savedUsers = localStorage.getItem('appUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

 const registerUser = async (username, email, password, accessCode) => {
  try {
    setLoading(true);
    const response = await axios.post(`https://jumma-backend-vercel.vercel.app/api/user/register`, {
      username, email, password, AccessCode: accessCode
    });

    const userData = {
      AccessCode: accessCode,
      Admin: "YES",
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    setLoading(false);
    return { success: true, data: userData };
    
  } catch (err) {
    setLoading(false);
    const errorMsg = err.response?.data?.message || err.message;
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }
};


  const loginUser = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`https://jumma-backend-vercel.vercel.app/api/user/login`,{email:username, password})
        if(response.status === 200){
            const userData = {
              AccessCode: response.data.AccessCode,
              Admin: "YES",
            };

            localStorage.setItem("userData", JSON.stringify(userData));
            setLoading(false);
            return userData;
        }
        setLoading(false);    

    } catch (err) {
        setLoading(false);
        setError(err.response?.data?.message || err.message);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const EnterByAccessCode = async (accessCode) => {
    try{
        setLoading(true);
        const response = await axios.post(`https://jumma-backend-vercel.vercel.app/api/user/authenticate`,{AccessCode: accessCode})
        if(response.status === 200){
            localStorage.setItem("userData", JSON.stringify({
                AccessCode: accessCode,
                Admin: "NO"
            }));
            setLoading(false);
            navigate("/");
        }
        setLoading(false);
    }catch (err) {
        setLoading(false);
        setError(err.response?.data?.message || err.message);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <UsersContext.Provider value={{
      users,
      currentUser,
      loading,
      error,
      registerUser,
      loginUser,
      logoutUser,
      EnterByAccessCode,
      clearError
    }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};