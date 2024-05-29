const express = require('express');
const auth = require('../../middleware/auth');
const db = require('../../config/db');
const formatDate = require('../../../tools');

const router = express.Router();

router.get('/', auth, (req, res) => {
    db.query(
        'SELECT * FROM todo WHERE user_id = ?',
        [req.user.id],
        (error, results) => {
            if (error) throw error;
            for (let i = 0; i < results.length; i++) {
                results[i].created_at = formatDate(results[i].created_at);
                results[i].due_time = formatDate(results[i].due_time);
            }
            res.json(results);
        }
    );
});

router.post('/', auth, (req, res) => {
    const { title, description, due_time, status } = req.body;
    db.query(
        'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, due_time, status, req.user.id],
        (error, results) => {
            if (error) {
                console.error("Error inserting todo:", error);
                return res.status(500).json({ msg: 'Internal server error' });
            }
            res.json({ msg: 'Todo created successfully', id: results.insertId });
        }
    );
});

router.get('/:id', auth, (req, res) => {
    const todoId = req.params.id;
    if(!isNaN(todoId))
    db.query('SELECT * FROM todo WHERE id = ? AND user_id = ?', [todoId, req.user.id],
        (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({ msg: 'Todo not found' });
            }
            const todo = results[0];
            todo.created_at = formatDate(todo.created_at);
            todo.due_time = formatDate(todo.created_due);
            res.json(todo);
        }
    );
});

router.put('/:id', auth, (req, res) => {
    const todoId = req.params.id;
    const { title, description, due_time, status } = req.body;
    if(!isNaN(todoId))
    db.query(
        'UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ? AND user_id = ?',
        [title, description, due_time, status, todoId, req.user.id],
        (error, results) => {
            if (error) throw error;
            res.json({ msg: 'Todo updated successfully' });
        }
    );
});

router.delete('/:id', auth, (req, res) => {
    const todoId = req.params.id;
    if(!isNaN(todoId))
    db.query(
        'DELETE FROM todo WHERE id = ? AND user_id = ?',
        [todoId, req.user.id],
        (error, results) => {
            if (error) {
                console.error("Error deleting todo:", error);
                return res.status(500).json({ msg: 'Internal server error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Todo not found' });
            }
            res.json({ msg: `Successfully deleted record number: ${todoId}` });
        }
    );
});

module.exports = router;
