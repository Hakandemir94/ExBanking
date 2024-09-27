# ExBanking

ExBanking API is a simple banking service that allows users to create accounts, deposit funds, withdraw funds, check their balance, and send money to other users. This service is implemented using Node.js, Express, MongoDB, and Protocol Buffers for structured data communication.

## Project Structure

ExBanking/
├── src/
│   ├── models/
│   │   └── user.js              # Mongoose schema for User
│   ├── services/
│   │   └── bankingService.js    # Service to interact with the mock API
│   ├── server/
│   │   └── mockApi.js           # Express server with banking endpoints
│   └── proto/
│       └── banking.proto        # Proto file defining request/response messages
├── test/
│   ├── backend/
│   │   └── bankingService.test.js  # Jest tests for banking service
│   └── utils/
│       └── utils.js            # Utilities for managing MongoDB during tests
├── config/
│   └── load-test.yml            # Artillery configuration for load testing
├── package.json                 # Node.js dependencies and scripts
├── README.md                    # Documentation for the project

### Prerequisites

- Node.js (v14.x or later)
- MongoDB (v4.x or later)
- npm (v6.x or later)

Ensure MongoDB is installed and running locally on your machine. You can start MongoDB with the following command:
net start MongoDB

#### Installation
- Clone the repository

cd ExBanking
- Install the dependencies:
npm install

Make sure MongoDB is running. You can use MongoDB Compass to manage the database if needed.

- Start the mock API server:
npm start
The server will be running at http://localhost:3000.

##### Running Tests
- Run the Jest test suite:
npm test

- Run the load tests using Artillery:
npm run load-test

Load testing is performed using Artillery. The configuration is defined in the load-test.yml file. The test simulates multiple users creating accounts over a period of time.

###### API Endpoints
- POST /create_user
Creates a new user with a unique username.

Request: Protobuf-encoded CreateUserRequest
Response: Protobuf-encoded CreateUserResponse


- POST /deposit
Deposits an amount to the specified user's account.

Request: Protobuf-encoded TransactionRequest
Response: Protobuf-encoded TransactionResponse


- POST /withdraw
Withdraws an amount from the specified user's account.

Request: Protobuf-encoded TransactionRequest
Response: Protobuf-encoded TransactionResponse


- POST /get_balance
Retrieves the balance for the specified user.

Request: Protobuf-encoded BalanceRequest
Response: Protobuf-encoded BalanceResponse


- POST /send
Transfers an amount from one user to another.

Request: Protobuf-encoded SendRequest
Response: Protobuf-encoded SendResponse
