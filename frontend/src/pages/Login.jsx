
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', formData);
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Redirect to dashboard
                window.location.href = '/dashboard'; // Direct refresh redirect
            }
            // localStorage.setItem('token', data.token);
            // navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed";
            alert(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <button type="submit">Login</button>
            <p>Don't have an account? <span onClick={() => navigate('/signup')} style={{color: 'blue', cursor: 'pointer'}}>Signup here</span></p>
        </form>
    );
};

export default Login;