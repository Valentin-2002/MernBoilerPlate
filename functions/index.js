const functions = require('firebase-functions');
const express = require('express');

const app = express();

// exclusing dotenv config from production
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// middleware for handling sample api routes
app.use('/api/v1', require('./routes/api/crud'));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app);