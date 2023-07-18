const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const healthCheckRouter = require("./health-check");
const usersRouter = require('./src/routes/users');
const subjectsRouter = require('./src/routes/subjects');
const feedbackRouter = require('./src/routes/feedback');
const exercisesRouter = require('./src/routes/exercises');
const performanceRouter = require('./src/routes/performance');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());
app.use(cors());

// Endpoints
app.use("/health-check", healthCheckRouter);
app.use("/users", usersRouter);
app.use("/subjects", subjectsRouter);
app.use("/feedback", feedbackRouter);
app.use("/exercises", exercisesRouter);
app.use("/performance", performanceRouter);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocorreu um erro no servidor" });
});

const server = app.listen(port, () => {
  console.log(`A API está rodando em http://localhost:${port}`);
});

// Interceptador de erros não tratados
process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado: ", err);
  server.close(() => {
    process.exit(1);
  });
});