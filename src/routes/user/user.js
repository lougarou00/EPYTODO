const express = require('express');
const auth = require('../../middleware/auth');
const db = require('../../config/db');
const formatDate = require('../../../tools');

const router = express.Router();

router.get('/user', auth, (req, res) => {
    db.query(
        'SELECT id, email, name, firstname, created_at FROM user WHERE id = ?',
        [req.user.id],
        (error, results) => {
            if (error) throw error;
            const todo = results[0];
            todo.created_at = formatDate(todo.created_at);
            res.json(results[0]);
        }
    );
});

router.get('/user/todos', auth, (req, res) => {
    const userId = req.user.id;
    db.query('SELECT * FROM todo WHERE user_id = ?', [userId], (error, results) => {
        if (error) throw error;
        for (let i = 0; i < results.length; i++) {
            results[i].created_at = formatDate(results[i].created_at);
            results[i].due_time = formatDate(results[i].due_time);
        }
        res.json(results);
    });
});

router.get('/users/:id', auth, (req, res) => {
    const userId = req.params.id;
    if(!isNaN(userId)){
    db.query('SELECT id, email, name, firstname, created_at FROM user WHERE id = ?',
        [userId],
        (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({ msg: 'User not found' });
            }
            const todo = results[0];
            todo.created_at = formatDate(todo.created_at);
            res.json(results[0]);
        }
    );
} else {
    db.query(
        'SELECT id, email, name, firstname, created_at FROM user WHERE email = ?',
        [userId],
        (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({ msg: 'User not found' });
            }
            const todo = results[0];
            todo.created_at = formatDate(todo.created_at);
            res.json(results[0]);
        }
    );
}
});

router.put('/users/:id', auth, (req, res) => {
    const userId = req.params.id;
    const { email, name, firstname } = req.body;
    db.query(
        'UPDATE user SET email = ?, name = ?, firstname = ? WHERE id = ?',
        [email, name, firstname, userId],
        (error, results) => {
            if (error) throw error;
            res.json({ msg: 'User updated successfully' });
        }
    );
});

router.delete('/users/:id', auth, (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM user WHERE id = ?',
        [userId],
        (error, results) => {
            if (error) throw error;
            res.json({ msg: 'User deleted successfully' });
        }
    );
});

module.exports = router;
