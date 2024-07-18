// src/controllers/userController.js

const mongoose = require('mongoose');
const protobuf = require('protobufjs');
const User = require('../models/user');

// Load protobuf definitions
const root = protobuf.loadSync('proto/banking.proto');
const CreateUserRequest = root.lookupType('exbanking.CreateUserRequest');
const CreateUserResponse = root.lookupType('exbanking.CreateUserResponse');
const TransactionRequest = root.lookupType('exbanking.TransactionRequest');
const TransactionResponse = root.lookupType('exbanking.TransactionResponse');
const BalanceRequest = root.lookupType('exbanking.BalanceRequest');
const BalanceResponse = root.lookupType('exbanking.BalanceResponse');
const SendRequest = root.lookupType('exbanking.SendRequest');
const SendResponse = root.lookupType('exbanking.SendResponse');

function sendProtobufResponse(res, messageType, payload) {
    const buffer = messageType.encode(payload).finish();
    res.set('Content-Type', 'application/octet-stream');
    res.send(buffer);
}

function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

const createUser = async (req, res) => {
    const request = CreateUserRequest.decode(new Uint8Array(req.body));
    const { username } = request;

    if (!username || username.trim() === '') {
        return sendProtobufResponse(res, CreateUserResponse, { success: false, message: 'Username cannot be empty' });
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return sendProtobufResponse(res, CreateUserResponse, { success: false, message: 'Invalid username' });
    }

    if (username.length > 255) {
        return sendProtobufResponse(res, CreateUserResponse, { success: false, message: 'Username exceeds maximum length' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return sendProtobufResponse(res, CreateUserResponse, { success: false, message: 'User already exists' });
        }

        const user = new User({ username });
        const savedUser = await user.save();
        console.log('Created user:', savedUser);
        sendProtobufResponse(res, CreateUserResponse, { success: true, message: 'User created', userId: savedUser._id.toString() });
    } catch (error) {
        console.error('Error creating user:', error);
        sendProtobufResponse(res, CreateUserResponse, { success: false, message: 'An error occurred' });
    }
};

const deposit = async (req, res) => {
    const request = TransactionRequest.decode(new Uint8Array(req.body));
    const { userId, amount } = request;

    console.log('Received deposit request for userId:', userId, 'amount:', amount);

    const MAX_DEPOSIT_LIMIT = 1e9;

    if (amount <= 0) {
        return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'Deposit amount must be greater than zero', balance: 0 });
    }

    if (amount > MAX_DEPOSIT_LIMIT) {
        return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'Deposit amount exceeds maximum limit', balance: 0 });
    }

    if (!isValidObjectId(userId)) {
        return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'User does not exist', balance: 0 });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'User does not exist', balance: 0 });
        }
        user.balance += amount;
        await user.save();
        console.log('Updated user after deposit:', user);
        sendProtobufResponse(res, TransactionResponse, { success: true, message: 'Deposit successful', balance: user.balance });
    } catch (error) {
        console.error('Error during deposit:', error);
        sendProtobufResponse(res, TransactionResponse, { success: false, message: 'An error occurred', balance: 0 });
    }
};

const withdraw = async (req, res) => {
    const request = TransactionRequest.decode(new Uint8Array(req.body));
    const { userId, amount } = request;

    console.log('Received withdraw request for userId:', userId, 'amount:', amount);

    if (amount <= 0) {
        return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'Withdrawal amount must be greater than zero', balance: 0 });
    }

    if (!isValidObjectId(userId)) {
        return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'Invalid user ID', balance: 0 });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'User does not exist', balance: 0 });
        }
        if (user.balance < amount) {
            return sendProtobufResponse(res, TransactionResponse, { success: false, message: 'Insufficient funds', balance: user.balance });
        }
        user.balance -= amount;
        await user.save();
        console.log('Updated user after withdrawal:', user);
        sendProtobufResponse(res, TransactionResponse, { success: true, message: 'Withdrawal successful', balance: user.balance });
    } catch (error) {
        console.error('Error during withdrawal:', error);
        sendProtobufResponse(res, TransactionResponse, { success: false, message: 'An error occurred', balance: 0 });
    }
};

const getBalance = async (req, res) => {
    const request = BalanceRequest.decode(new Uint8Array(req.body));
    const { userId } = request;

    console.log('Received get_balance request for userId:', userId);

    if (!isValidObjectId(userId)) {
        return sendProtobufResponse(res, BalanceResponse, { success: false, message: 'Invalid user ID', balance: 0 });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return sendProtobufResponse(res, BalanceResponse, { success: false, message: 'User does not exist', balance: 0 });
        }
        sendProtobufResponse(res, BalanceResponse, { success: true, message: 'Balance retrieved', balance: user.balance });
    } catch (error) {
        console.error('Error getting balance:', error);
        sendProtobufResponse(res, BalanceResponse, { success: false, message: 'An error occurred', balance: 0 });
    }
};

const sendMoney = async (req, res) => {
    const request = SendRequest.decode(new Uint8Array(req.body));
    const { from_userId, to_userId, amount } = request;

    console.log('Received send request from:', from_userId, 'to:', to_userId, 'amount:', amount);

    if (amount <= 0) {
        return sendProtobufResponse(res, SendResponse, { success: false, message: 'Transfer amount must be greater than zero', from_balance: 0, to_balance: 0 });
    }

    if (!isValidObjectId(from_userId) || !isValidObjectId(to_userId)) {
        return sendProtobufResponse(res, SendResponse, { success: false, message: 'Invalid user ID', from_balance: 0, to_balance: 0 });
    }

    try {
        const fromUser = await User.findById(from_userId);
        const toUser = await User.findById(to_userId);

        if (!fromUser || !toUser) {
            return sendProtobufResponse(res, SendResponse, { success: false, message: 'One or both users do not exist', from_balance: 0, to_balance: 0 });
        }
        if (fromUser.balance < amount) {
            return sendProtobufResponse(res, SendResponse, { success: false, message: 'Insufficient funds', from_balance: fromUser.balance, to_balance: toUser.balance });
        }

        fromUser.balance -= amount;
        toUser.balance += amount;
        await fromUser.save();
        await toUser.save();

        console.log('Updated fromUser after transfer:', fromUser);
        console.log('Updated toUser after transfer:', toUser);
        sendProtobufResponse(res, SendResponse, { success: true, message: 'Transfer successful', from_balance: fromUser.balance, to_balance: toUser.balance });
    } catch (error) {
        console.error('Error during transfer:', error);
        sendProtobufResponse(res, SendResponse, { success: false, message: 'An error occurred', from_balance: 0, to_balance: 0 });
    }
};

module.exports = {
    createUser,
    deposit,
    withdraw,
    getBalance,
    sendMoney
};
