const fs = require('fs');
const path = require('path');
const BankingService = require('../../src/bankingService');
const { startDatabase, clearDatabase, stopDatabase } = require('../utils/utils');
const BankingServiceRepository = require('../repositories/BankingServiceRepository');

const usersLogPath = path.join(__dirname, 'createdUsers.log');

describe('BankingService', () => {
    let bankingServiceRepo;

    beforeAll(async () => {
        await startDatabase();
        const bankingService = new BankingService('http://localhost:3000');
        bankingServiceRepo = new BankingServiceRepository(bankingService);
        fs.writeFileSync(usersLogPath, 'Created Users:\n', { flag: 'w' });
    });

    afterAll(async () => {
        await clearDatabase();
        await stopDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    const logUserDetails = (username, response) => {
        const userDetails = `Username: ${username}, Response: ${JSON.stringify(response)}\n`;
        fs.appendFileSync(usersLogPath, userDetails, { flag: 'a' });
    };

    describe('create_user Endpoint', () => {
        test('TC001: Valid User Creation', async () => {
            const username = 'validUser';
            try {
                const response = await bankingServiceRepo.createUser(username);
                expect(response.success).toBe(true);
                expect(response.message).toBe('User created');
                logUserDetails(username, response);
            } catch (error) {
                console.error('Error in TC001:', error);
                throw error;
            }
        });

        test('TC002: Duplicate User Creation', async () => {
            const username = 'duplicateUser';
            try {
                await bankingServiceRepo.createUser(username);
                const response = await bankingServiceRepo.createUser(username);
                expect(response.success).toBe(false);
                expect(response.message).toBe('User already exists');
                logUserDetails(username, response);
            } catch (error) {
                console.error('Error in TC002:', error);
                throw error;
            }
        });

        test('TC003: Empty Username', async () => {
            const username = '';
            try {
                const response = await bankingServiceRepo.createUser(username);
                expect(response.success).toBe(false);
                expect(response.message).toBe('Username cannot be empty');
                logUserDetails(username, response);
            } catch (error) {
                console.error('Error in TC003:', error);
                throw error;
            }
        });

        test('TC004: Username with Special Characters', async () => {
            const username = '@user';
            try {
                const response = await bankingServiceRepo.createUser(username);
                expect(response.success).toBe(false);
                expect(response.message).toBe('Invalid username');
                logUserDetails(username, response);
            } catch (error) {
                console.error('Error in TC004:', error);
                throw error;
            }
        });

        test('TC005: Long Username (Boundary Testing)', async () => {
            const username = 'a'.repeat(256);
            try {
                const response = await bankingServiceRepo.createUser(username);
                expect(response.success).toBe(false);
                expect(response.message).toBe('Username exceeds maximum length');
                logUserDetails(username, response);
            } catch (error) {
                console.error('Error in TC005:', error);
                throw error;
            }
        });
    });

    describe('deposit Endpoint', () => {
        test('TC008: Valid Deposit', async () => {
            const username = 'depositUser';
            try {
                const userResponse = await bankingServiceRepo.createUser(username);
                const { userId } = userResponse;
                const depositResponse = await bankingServiceRepo.deposit(userId, 100);
                expect(depositResponse.success).toBe(true);
                expect(depositResponse.balance).toBe(100);
                logUserDetails(username, userResponse);
            } catch (error) {
                console.error('Error in TC008:', error);
                throw error;
            }
        });

        test('TC009: Invalid User for Deposit', async () => {
            const username = 'invalidUserId';
            try {
                const response = await bankingServiceRepo.deposit(username, 100);
                expect(response.success).toBe(false);
                expect(response.message).toBe('User does not exist');
                logUserDetails(username, response);
            } catch (error) {
                console.error('Error in TC009:', error);
                throw error;
            }
        });

        test('TC011: Zero Deposit Amount', async () => {
            const username = 'zeroDepositUser';
            try {
                const userResponse = await bankingServiceRepo.createUser(username);
                const { userId } = userResponse;
                const depositResponse = await bankingServiceRepo.deposit(userId, 0);
                expect(depositResponse.success).toBe(false);
                expect(depositResponse.message).toBe('Deposit amount must be greater than zero');
                logUserDetails(username, userResponse);
            } catch (error) {
                console.error('Error in TC011:', error);
                throw error;
            }
        });

        test('TC012: Large Deposit Amount (Boundary Testing)', async () => {
            const username = 'largeDepositUser';
            try {
                const userResponse = await bankingServiceRepo.createUser(username);
                const { userId } = userResponse;
                const largeAmount = 1e10;
                const depositResponse = await bankingServiceRepo.deposit(userId, largeAmount);
                expect(depositResponse.success).toBe(false);
                expect(depositResponse.message).toBe('Deposit amount exceeds maximum limit');
                logUserDetails(username, userResponse);
            } catch (error) {
                console.error('Error in TC012:', error);
                throw error;
            }
        });
    });
});
