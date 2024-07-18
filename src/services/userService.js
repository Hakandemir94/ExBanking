const User = require('../models/user');

class UserService {
    static async createUser(username) {
        if (!username || username.trim() === '') {
            throw new Error('Username cannot be empty');
        }
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            throw new Error('Invalid username');
        }
        if (username.length > 255) {
            throw new Error('Username exceeds maximum length');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({ username });
        await user.save();
        return user;
    }

    static async deposit(userId, amount) {
        const MAX_DEPOSIT_LIMIT = 1e9;
        if (amount <= 0) {
            throw new Error('Deposit amount must be greater than zero');
        }
        if (amount > MAX_DEPOSIT_LIMIT) {
            throw new Error('Deposit amount exceeds maximum limit');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        user.balance += amount;
        await user.save();
        return user.balance;
    }

    static async withdraw(userId, amount) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User does not exist');
        }
        if (user.balance < amount) {
            throw new Error('Insufficient funds');
        }

        user.balance -= amount;
        await user.save();
        return user.balance;
    }

    static async getBalance(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User does not exist');
        }

        return user.balance;
    }

    static async sendMoney(fromUserId, toUserId, amount) {
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);

        if (!fromUser || !toUser) {
            throw new Error('One or both users do not exist');
        }
        if (fromUser.balance < amount) {
            throw new Error('Insufficient funds');
        }

        fromUser.balance -= amount;
        toUser.balance += amount;

        await fromUser.save();
        await toUser.save();

        return { fromBalance: fromUser.balance, toBalance: toUser.balance };
    }
}

module.exports = UserService;
