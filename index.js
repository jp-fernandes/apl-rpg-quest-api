const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const routes = require("./routes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(cors());

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocorreu um erro no servidor" });
});

// Rotas
app.use(routes);

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