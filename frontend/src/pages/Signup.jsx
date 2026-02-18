
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const isPasswordStrong = (pw) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pw);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordStrong(formData.password)) {
            alert("Password must be 8+ chars, include Uppercase, Lowercase, Number and Special Character (@$!%*?&)");
            return;
        }

        try {
            await API.post('/auth/signup', formData);
            alert('Signup Successful! Now Login.');
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || "Signup failed";
            alert(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <button type="submit">Register</button>
            <p>Already have an account? <span onClick={() => navigate('/login')} style={{color: 'blue', cursor: 'pointer'}}>Login here</span></p>
        </form>
    );
};

export default Signup;