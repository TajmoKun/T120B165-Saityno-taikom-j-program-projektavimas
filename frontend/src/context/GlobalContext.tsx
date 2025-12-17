import React, {createContext, useContext, useState, useEffect} from 'react';

type User={
    id: number;
    username: string;
    email: string;
    role?: string;
} | null;

type GlobalState = {
    host: string;
    setHost: (val: string) => void;
    user: User;
    setUser: (user: User)=> void;
    token: string | null;
    setToken: (token: string | null)=> void;
    refreshToken: string | null;
    isLoggedIn: boolean;
    setRefreshToken: (token: string | null)=> void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
    const [host, setHost] = useState('http://localhost:5000');
    const [user,setUser] = useState<User>(null);
    const[token,setToken] = useState<string | null>(null);
    const[refreshToken,setRefreshToken] = useState<string | null>(null);

    useEffect(()=>{
        const savedRefreshToken = localStorage.getItem('refreshToken');
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if(savedRefreshToken) setRefreshToken(savedRefreshToken);
        if(savedToken) setToken(savedToken);
        if(savedUser) setUser(JSON.parse(savedUser));
    },[]);

    useEffect(()=>{
        if(token){
            localStorage.setItem('token',token);
        }else{
            localStorage.removeItem('token');
        }
    },[token]);

    useEffect(()=>{
        if(user){
            localStorage.setItem('user',JSON.stringify(user));
        }else{
            localStorage.removeItem('user');
        }
    },[user]);

    useEffect(()=>{
        if(refreshToken){
            localStorage.setItem('refreshToken',refreshToken);
        }else{
            localStorage.removeItem('refreshToken');
        }
    },[refreshToken]);

    const isLoggedIn = !!token && !!user;

    return(
        <GlobalContext.Provider value ={{host,setHost,user,setUser,token,setToken,refreshToken,isLoggedIn,setRefreshToken}}>
            {children}
        </GlobalContext.Provider>
    );
};

export function  useGlobal(){
    const context = useContext(GlobalContext);
    if(!context) throw new Error('error with useGlobal');
    return context;
}