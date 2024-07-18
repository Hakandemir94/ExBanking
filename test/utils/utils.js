// C:\Users\demir\Desktop\SWDev\ExBanking\test\utils\utils.js

const mongoose = require('mongoose');
const User = require('../../src/models/user');

async function startDatabase() {
    const mongoUri = 'mongodb://localhost:27017/exbanking';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB started at ${mongoUri}`);
}

async function clearDatabase() {
    await User.deleteMany({});
    console.log('Database cleared');
}

async function printUsers() {
    try {
        const users = await User.find();
        console.log('Users in the database:');
        users.forEach(user => {
            console.log(user);
        });
    } catch (error) {
        console.error('Error printing users:', error);
    }
}

async function stopDatabase() {
    await mongoose.disconnect();
    console.log('MongoDB stopped');
}

module.exports = {
    startDatabase,
    clearDatabase,
    stopDatabase,
    printUsers
};
