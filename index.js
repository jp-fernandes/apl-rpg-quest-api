const express = require("express");
const app = express();
const port = 3000;

const healthCheckRouter = require("./health-check");
const usersRouter = require('./src/routes/users');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());

//Endpoints
app.use("/health-check", healthCheckRouter);
app.use("/users", usersRouter);

// Inicie o servidor
app.listen(port, () => {
  console.log(`A API está rodando em http://localhost:${port}`);
});