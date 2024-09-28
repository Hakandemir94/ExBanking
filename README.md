# ExBanking(Banking Service - Mock API and Client)

ExBanking API is a simple banking service that allows users to create accounts, deposit funds, withdraw funds, check their balance, and send money to other users. This service is implemented using Node.js, Express, MongoDB, and Protocol Buffers for structured data communication. The goal is to simulate essential banking operations such as creating users, depositing funds, withdrawing funds, transferring funds, and checking account balances. The client interacts with the API via Protocol Buffers, ensuring efficient and scalable communication between the client and the server.

This project is done according to TestPlan.pdf. The automated test framework partly covers the mock test plan for demonstration.

## Features

- **Create User**: Create a new user with an initial balance of 0.
- **Deposit Funds**: Add funds to a user's account.
- **Withdraw Funds**: Withdraw funds from a user's account (with balance checking).
- **Transfer Funds**: Transfer funds from one user to another.
- **Check Balance**: Retrieve the balance of a specific user.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building the mock API.
- **MongoDB**: Database for storing user data and balances.
- **Protocol Buffers**: For efficient binary serialization of structured data.
- **Axios**: Used in the client to interact with the mock API.
- **Jest**: Testing framework to ensure functionality of the API.

## Setup and Installation

Follow these steps to set up and run the project locally:

### Prerequisites

- **Node.js** and **npm** installed.
- **MongoDB** installed and running.

Ensure MongoDB is installed and running locally on your machine. You can start MongoDB with the following command:
net start MongoDB

## Installation
- Open terminal in project direrctory

- Command to install the dependencies:
"npm install"

Make sure MongoDB is running. You can use MongoDB Compass to manage the database if needed.

- Comman to start the mock API server:
"npm start"

The server will be running at http://localhost:3000.

## Running Tests
- Command to run the Jest test suite:
"npm test"

- Command to run the load tests using Artillery:
"artillery run load-test.yml"

Load testing is performed using Artillery. The configuration is defined in the load-test.yml file. The test simulates multiple users creating accounts over a period of time.

## API Endpoints
- POST /create_user: Creates a new user with a unique username.

Request: Protobuf-encoded CreateUserRequest

Response: Protobuf-encoded CreateUserResponse


- POST /deposit: Deposits an amount to the specified user's account.

Request: Protobuf-encoded TransactionRequest

Response: Protobuf-encoded TransactionResponse


- POST /withdraw: Withdraws an amount from the specified user's account.

Request: Protobuf-encoded TransactionRequest

Response: Protobuf-encoded TransactionResponse


- POST /get_balance: Retrieves the balance for the specified user.

Request: Protobuf-encoded BalanceRequest

Response: Protobuf-encoded BalanceResponse


- POST /send: Transfers an amount from one user to another.

Request: Protobuf-encoded SendRequest

Response: Protobuf-encoded SendResponse
