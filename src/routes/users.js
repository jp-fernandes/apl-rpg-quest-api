const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// Get users
router.get("/", async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
});

// Get user by cpf
router.get("/:cpf", async (req, res) => {
  const cpf = req.params.cpf;

  try {
    const user = await userService.getUserByCpf(cpf);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao obter detalhes do usuário:", error);
    res.status(500).json({ error: "Erro ao obter detalhes do usuário" });
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req, res);
    res.json(user);
  } catch (error) {
    const errorMessage = error.message || "Erro ao criar o usuário";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

// Update user by Cpf
router.put("/", async (req, res) => {
  const user = req.body;
  const cpf = user.cpf;

  const updatedData = {
    name: user.name,
    surname: user.surname,
    age: user.age
  };

  try {
    const result = await userService.updateUserByCpf(cpf, updatedData);
    res.json(result);
  } catch (error) {
    const errorMessage = error.message || "Erro ao atualizar o usuário";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

module.exports = router;