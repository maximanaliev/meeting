const mongoose = require('mongoose');
const config = require('./config');
const nanoid = require("nanoid");

const User = require('./models/User');

const run = async () => {

    await mongoose.connect(config.database, config.databaseOptions);

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (let coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [user1, user2] = await User.create({
        email: 'admin@email.com',
        password: '123456',
        username: 'Admin',
        token: nanoid()
    }, {
        email: 'user@email.com',
        password: '123456',
        username: 'User',
        token: nanoid()
    });

    mongoose.connection.close();
};

run().catch(e => {
    mongoose.connection.close();
    throw e;
});