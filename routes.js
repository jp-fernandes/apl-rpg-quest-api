const express = require('express');
const router = express.Router();

const healthCheckRouter = require('./health-check');
const usersRouter = require('./src/routes/users');
const subjectsRouter = require('./src/routes/subjects');
const feedbackRouter = require('./src/routes/feedback');
const exercisesRouter = require('./src/routes/exercises');
const performanceRouter = require('./src/routes/performance');

router.use("/health-check", healthCheckRouter);
router.use("/users", usersRouter);
router.use("/subjects", subjectsRouter);
router.use("/feedback", feedbackRouter);
router.use("/exercises", exercisesRouter);
router.use("/performance", performanceRouter);

module.exports = router;