const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth'); // Middleware to protect routes

// 1. CREATE TODO
router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new Todo({
            userId: req.user.id,
            title,
            description
        });
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. GET ALL TODOS (Only for logged in user)
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. UPDATE TODO
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 4. DELETE TODO
router.delete('/:id', auth, async (req, res) => {
    try {
        await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;