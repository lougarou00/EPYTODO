const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, name, firstname } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, firstname],
            (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ msg: 'Account already exists' });
                    }
                    throw error;
                }
                const token = jwt.sign({ user: { id: results.insertId } }, process.env.SECRET, {
                    expiresIn: '1h'
                });
                res.json({ token });
            }
        );
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM user WHERE email = ?', [email], async (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            const token = jwt.sign({ user: { id: user.id } }, process.env.SECRET, {
                expiresIn: '1h'
            });
            res.json({ token });
        }
    );
});

module.exports = router;
