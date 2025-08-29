const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const { userSubmission, runCode } = require('../Controllers/userSubmission');

const submitRouter = express.Router();

submitRouter.post('/submit/:id', userMiddleware, userSubmission);
submitRouter.get('/run/:id', userMiddleware, runCode);

module.exports = submitRouter;

