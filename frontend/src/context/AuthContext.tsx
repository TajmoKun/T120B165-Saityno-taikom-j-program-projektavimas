import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';

interface User{
    id: number;
    username: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    login: async() =>{},
    register: async() =>{},
    logout: () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children})=>{
    const [user,setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const loadUser = async ()=>{
            if(token) {
                try{
                    const res = await axios.get('http://localhost:5000/api/auth/user',{
                        headers:{
                            'x-auth-token': token
                        }
                    });

                    setUser(res.data as User);
                    setIsAuthenticated(true);
                }catch(error){
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            }
            } 
            setLoading(false);
        };
        loadUser();

    }, [token]
);
     const login = async (email: string, password: string) => {
    try {
      const res = await axios.post<User>('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (error) {
      throw error;
    }
  };
  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post<User>('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (error) {
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}