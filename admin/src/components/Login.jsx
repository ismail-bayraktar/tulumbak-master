import {useState} from "react";
import axios from "axios";
import {backendUrl} from "../App.jsx";
import {toast} from "react-toastify";
import { useTheme } from "../context/ThemeContext.jsx";

const Login = ({setToken}) => {
    const { isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + "/api/user/admin", {email,password});
            if (response.data.success) {
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Giriş yapılırken hata oluştu');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="mb-3 min-w-72">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</p>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            className="rounded-md w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400" 
                            type="email" 
                            placeholder="you@email.com" 
                            required
                        />
                    </div>
                    <div className="mb-3 min-w-72">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</p>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className="rounded-md w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400" 
                            type="password" 
                            placeholder="Enter your password" 
                            required
                        />
                    </div>
                    <button className="mt-2 w-full py-2 px-4 rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors font-medium" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;