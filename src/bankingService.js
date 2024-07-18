const axios = require('axios');
const protobuf = require('protobufjs');

const root = protobuf.loadSync('proto/banking.proto');
const CreateUserRequest = root.lookupType('exbanking.CreateUserRequest');
const CreateUserResponse = root.lookupType('exbanking.CreateUserResponse');
const TransactionRequest = root.lookupType('exbanking.TransactionRequest');
const TransactionResponse = root.lookupType('exbanking.TransactionResponse');
const BalanceRequest = root.lookupType('exbanking.BalanceRequest');
const BalanceResponse = root.lookupType('exbanking.BalanceResponse');
const SendRequest = root.lookupType('exbanking.SendRequest');
const SendResponse = root.lookupType('exbanking.SendResponse');

class BankingService {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            headers: { 'Content-Type': 'application/octet-stream' },
            responseType: 'arraybuffer'
        });
    }

    async createUser(username) {
        const payload = CreateUserRequest.encode({ username }).finish();
        const response = await this.api.post('/create_user', payload);
        return CreateUserResponse.decode(new Uint8Array(response.data));
    }

    async deposit(userId, amount) {
        const payload = TransactionRequest.encode({ userId, amount }).finish();
        const response = await this.api.post('/deposit', payload);
        return TransactionResponse.decode(new Uint8Array(response.data));
    }

    async withdraw(userId, amount) {
        const payload = TransactionRequest.encode({ userId, amount }).finish();
        const response = await this.api.post('/withdraw', payload);
        return TransactionResponse.decode(new Uint8Array(response.data));
    }

    async getBalance(userId) {
        const payload = BalanceRequest.encode({ userId }).finish();
        const response = await this.api.post('/get_balance', payload);
        return BalanceResponse.decode(new Uint8Array(response.data));
    }

    async send(from_userId, to_userId, amount) {
        const payload = SendRequest.encode({ from_userId, to_userId, amount }).finish();
        const response = await this.api.post('/send', payload);
        return SendResponse.decode(new Uint8Array(response.data));
    }
}

module.exports = BankingService;
