const express = require("express");
const router = express.Router();
const subjectsService = require("../services/subjectsService");

// Get CheckSubjectCompletion
router.get("/check-status/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const response = await subjectsService.checkSubjectCompletion(email);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "ao obter status de tarefa do usuário" });
  }
});

// Save Status Activity
router.post("/status", async (req, res) => {
  try {
    const response = await subjectsService.saveStatusActivity(req, res);
    res.json(response);
  } catch (error) {
    const errorMessage = error.message || "Erro ao salvar o status do usuário";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

module.exports = router;
