const express = require("express");
const app = express();
const port = 3000;

const healthCheckRouter = require("./health-check");
const usersRouter = require('./src/routes/users');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());

// Endpoints
app.use("/health-check", healthCheckRouter);
app.use("/users", usersRouter);

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