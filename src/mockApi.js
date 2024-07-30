
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserController = require('./controllers/userController');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/exbanking', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

const app = express();
const port = 3000;

//To parse raw body as a buffer
app.use(bodyParser.raw({ type: 'application/octet-stream' }));

// Routes
app.post('/create_user', UserController.createUser);
app.post('/deposit', UserController.deposit);
app.post('/withdraw', UserController.withdraw);
app.post('/get_balance', UserController.getBalance);
app.post('/send', UserController.sendMoney);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
