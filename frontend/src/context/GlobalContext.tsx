import React, {createContext, useContext, useState} from 'react';

type GlobalState = {
    host: string;
    setHost: (val: string) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{
    const [host, setHost] = useState('http://localhost:5000');
    return(
        <GlobalContext.Provider value ={{host,setHost}}>
            {children}
        </GlobalContext.Provider>
    );
};

export function  useGlobal(){
    const context = useContext(GlobalContext);
    if(!context) throw new Error('error with useGlobal');
    return context;
}