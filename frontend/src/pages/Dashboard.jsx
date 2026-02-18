

import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const navigate = useNavigate();

    const fetchTodos = async () => {
        try {
            const { data } = await API.get('/todos');
            setTodos(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchTodos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/todos/${editingId}`, { title: editTitle });
                setEditingId(null);
            } else {
                await API.post('/todos', { title });
                setTitle('');
            }
            fetchTodos();
        } catch (err) { alert("Action failed"); }
    };

    const toggleComplete = async (id, status) => {
        try {
            await API.put(`/todos/${id}`, { isCompleted: !status });
            fetchTodos();
        } catch (err) { alert("Update failed"); }
    };

    const deleteTodo = async (id) => {
        try {
            await API.delete(`/todos/${id}`);
            fetchTodos();
        } catch (err) { alert("Delete failed"); }
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditTitle(todo.title);
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Filter Logic for Search
    const filteredTodos = todos.filter(t => 
        t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>📝 Todo App</h1>
                <button onClick={logout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </div>

            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="🔍 Search tasks..." 
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Add / Edit Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    value={editingId ? editTitle : title} 
                    onChange={(e) => editingId ? setEditTitle(e.target.value) : setTitle(e.target.value)} 
                    placeholder={editingId ? "Update task..." : "Add a new task..."} 
                    style={{ width: '70%', padding: '10px' }}
                    required 
                />
                <button type="submit" style={{ width: '25%', padding: '10px', marginLeft: '5px' }}>
                    {editingId ? "Update" : "Add"}
                </button>
                {editingId && <button onClick={() => setEditingId(null)} type="button" style={{ marginLeft: '5px' }}>Cancel</button>}
            </form>

            {/* Todo List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredTodos.map((todo) => (
                    <li key={todo._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="checkbox" checked={todo.isCompleted} onChange={() => toggleComplete(todo._id, todo.isCompleted)} />
                            <span style={{ marginLeft: '10px', textDecoration: todo.isCompleted ? 'line-through' : 'none', color: todo.isCompleted ? 'gray' : 'black' }}>
                                {todo.title}
                            </span>
                        </div>
                        <div>
                            <button onClick={() => startEdit(todo)} style={{ marginRight: '5px' }}>Edit</button>
                            <button onClick={() => deleteTodo(todo._id)} style={{ color: 'red' }}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;