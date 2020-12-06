const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });

    try {
        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/sessions', async (req, res) => {

    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return res.status(400).send({error: 'E-mail или пароль неверны!'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(400).send({error: 'E-mail или пароль неверны!'});
    }

    user.generateToken();
    await user.save();
    return res.send(user);
});

router.delete('/sessions', async (req, res) => {

    const success = {message: 'Success'};

    try {
        const token = req.get('Authorization').split(' ')[1];

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.generateToken();
        await user.save();

        return res.send(success);
    } catch (e) {
        return res.send(success);
    }
});

module.exports = router;