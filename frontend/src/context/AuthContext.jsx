import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('authToken');
        return storedToken? jwtDecode(storedToken) : null;
    });

    const navigate = useNavigate();

    const login = async(username, password) => {
        try{
            const url = `${import.meta.env.VITE_API_BASE_URL}/api/token/`
            const response = await axios.post(url, {username, password});
            const accessToken = response.data.access;
            const refereshToken = response.data.refresh;

            setToken(accessToken);
            setUser(jwtDecode(accessToken));
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('refreshToken', refereshToken);

            navigate('/');
        }catch(error){
            console.error("Login Error: ", error);
            throw error;
        }
    };

    

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const contextData = {
        token,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext
