class BankingServiceRepository {
    constructor(bankingService) {
        this.bankingService = bankingService;
    }

    async createUser(username) {
        return await this.bankingService.createUser(username);
    }

    async deposit(userId, amount) {
        return await this.bankingService.deposit(userId, amount);
    }

    async withdraw(userId, amount) {
        return await this.bankingService.withdraw(userId, amount);
    }

    async getBalance(userId) {
        return await this.bankingService.getBalance(userId);
    }

    async send(fromUserId, toUserId, amount) {
        return await this.bankingService.send(fromUserId, toUserId, amount);
    }
}

module.exports = BankingServiceRepository;
