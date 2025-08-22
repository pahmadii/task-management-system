const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;

      
        const existingUser = await User.findOne({ where: { username } });
        if(existingUser) return res.status(400).json({ message: 'Username already exists' });

      
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, phone, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if(!user) return res.status(400).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        next(err);
    }
};
