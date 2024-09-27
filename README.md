# ExBanking(Banking Service - Mock API and Client)

ExBanking API is a simple banking service that allows users to create accounts, deposit funds, withdraw funds, check their balance, and send money to other users. This service is implemented using Node.js, Express, MongoDB, and Protocol Buffers for structured data communication. The goal is to simulate essential banking operations such as creating users, depositing funds, withdrawing funds, transferring funds, and checking account balances. The client interacts with the API via Protocol Buffers, ensuring efficient and scalable communication between the client and the server.

## Problem Statement

Traditional banking systems often face challenges when handling real-time transactions across multiple services. This project aims to address the following challenges:

1. **Handling Financial Transactions**: Simulating a banking service that can handle deposits, withdrawals, and transfers securely and efficiently.
2. **Data Consistency**: Ensuring the balances are always accurate across multiple user accounts after each transaction.
3. **Communication Efficiency**: Utilizing Protocol Buffers to reduce the size of the messages exchanged between the client and the server, improving speed and scalability.
4. **User Data Persistence**: Using MongoDB for persistent user data storage and retrieval, allowing the mock service to simulate real-world banking scenarios.

By providing a simple interface for interacting with the banking service API, this project demonstrates how financial transactions can be handled in a scalable and efficient way.

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
- Clone the repository

cd ExBanking
- Install the dependencies:
npm install

Make sure MongoDB is running. You can use MongoDB Compass to manage the database if needed.

- Start the mock API server:
npm start
The server will be running at http://localhost:3000.

## Running Tests
- Run the Jest test suite:
npm test

- Run the load tests using Artillery:
npm run load-test

Load testing is performed using Artillery. The configuration is defined in the load-test.yml file. The test simulates multiple users creating accounts over a period of time.

## API Endpoints
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
