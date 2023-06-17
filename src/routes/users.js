const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// Get Metrics
router.get("/metrics", async (req, res) => {
  try {
    const metrics = await userService.getUserMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter métricas" });
  }
});

// Get users
router.get("/", async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
});

// Get user by email
router.get("/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await userService.getUserByEmail(email);

    if (user) {
      res.json(user);
    } else {
      res.status(200).json({ message: "Usuário não encontrado", code: 404 });
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

// Update user by Email
router.put("/", async (req, res) => {
  const user = req.body;
  const email = user.email;

  const updatedData = {
    name: user.name,
    surname: user.surname,
    age: user.age
  };

  try {
    const result = await userService.updateUserByEmail(email, updatedData);
    res.json(result);
  } catch (error) {
    const errorMessage = error.message || "Erro ao atualizar o usuário";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

module.exports = router;