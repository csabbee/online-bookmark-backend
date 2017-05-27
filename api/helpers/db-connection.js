const ENVIRONMENT = {
    isTesting: process.argv.slice(2)[0] === 'test'
};

const MongoClient = require('mongodb').MongoClient;

const { user, password, port, ip } = ENVIRONMENT.isTesting ? {} : require('../../online-bookmark-config/mongo.json');

const url = `mongodb://${user}:${password}@${ip}:${port}/online-bookmark`;

module.exports = {
    connect
}

let connection;

function connect() {
    return new Promise((resolve, reject) => {
        if (connection === undefined) {
            MongoClient.connect(url, handleConnect);
        } else {
            resolve(connection);
        }

        function handleConnect(err, db) {
            if (err) {
                console.error(err.MongoError);
                reject('Couldn\'t connect to server');
            }
            connection = db;
            console.log('Successfully connected to server');

            resolve(db);
        }
    });
}
