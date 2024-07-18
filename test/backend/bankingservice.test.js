// C:\Users\demir\Desktop\SWDev\ExBanking\test\backend\bankingservice.test.js

const BankingService = require('../../src/bankingService');
const { startDatabase, clearDatabase, stopDatabase, printUsers } = require('../utils/utils');
const BankingServiceRepository = require('../repositories/BankingServiceRepository');

describe('BankingService', () => {
    let bankingServiceRepo;

    beforeAll(async () => {
        await startDatabase();
        const bankingService = new BankingService('http://localhost:3000');
        bankingServiceRepo = new BankingServiceRepository(bankingService);
    });

    afterAll(async () => {
        await clearDatabase(); // Ensure the database is cleared after all tests
        await stopDatabase();
    });

    beforeEach(async () => {
        await clearDatabase(); // Clear the database before each test
    });

    describe('create_user Endpoint', () => {
        test('TC001: Valid User Creation', async () => {
            const response = await bankingServiceRepo.createUser('validUser');
            expect(response.success).toBe(true);
            expect(response.message).toBe('User created');
        });

        test('TC002: Duplicate User Creation', async () => {
            await bankingServiceRepo.createUser('duplicateUser');
            const response = await bankingServiceRepo.createUser('duplicateUser');
            expect(response.success).toBe(false);
            expect(response.message).toBe('User already exists');
        });

        test('TC003: Empty Username', async () => {
            const response = await bankingServiceRepo.createUser('');
            expect(response.success).toBe(false);
            expect(response.message).toBe('Username cannot be empty');
        });

        test('TC004: Username with Special Characters', async () => {
            const response = await bankingServiceRepo.createUser('@user');
            expect(response.success).toBe(false);
            expect(response.message).toBe('Invalid username');
        });

        test('TC005: Long Username (Boundary Testing)', async () => {
            const longUsername = 'a'.repeat(256);
            const response = await bankingServiceRepo.createUser(longUsername);
            expect(response.success).toBe(false);
            expect(response.message).toBe('Username exceeds maximum length');
        });
    });

    describe('deposit Endpoint', () => {
        test('TC008: Valid Deposit', async () => {
            const userResponse = await bankingServiceRepo.createUser('depositUser');
            const { userId } = userResponse;
            const depositResponse = await bankingServiceRepo.deposit(userId, 100);
            expect(depositResponse.success).toBe(true);
            expect(depositResponse.balance).toBe(100);
        });

        /*test('TC009: Invalid User for Deposit', async () => {
            const response = await bankingServiceRepo.deposit('invalidUserId', 100);
            expect(response.success).toBe(false);
            expect(response.message).toBe('User does not exist');
        });*/

        test('TC011: Zero Deposit Amount', async () => {
            const userResponse = await bankingServiceRepo.createUser('zeroDepositUser');
            const { userId } = userResponse;
            const depositResponse = await bankingServiceRepo.deposit(userId, 0);
            expect(depositResponse.success).toBe(false);
            expect(depositResponse.message).toBe('Deposit amount must be greater than zero');
        });

        test('TC012: Large Deposit Amount (Boundary Testing)', async () => {
            const userResponse = await bankingServiceRepo.createUser('largeDepositUser');
            const { userId } = userResponse;
            const largeAmount = 1e10;
            const depositResponse = await bankingServiceRepo.deposit(userId, largeAmount);
            expect(depositResponse.success).toBe(false);
            expect(depositResponse.message).toBe('Deposit amount exceeds maximum limit');
        });
    });
});
