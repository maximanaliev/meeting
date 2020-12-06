const User = require('../models/User');

const authorization = async (req, res, next) => {
    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
        return res.status(401).send({error: 'Unauthorized'});
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Token' || !token) {
        return res.status(401).send({error: 'Unauthorized'});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Unauthorized'});
    }

    req.user = user;

    next();
};

module.exports = authorization;