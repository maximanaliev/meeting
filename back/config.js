const rootPath = __dirname;

module.exports = {
    rootPath,
    database: 'mongodb://localhost/meeting',
    databaseOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
};