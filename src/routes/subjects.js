const express = require("express");
const router = express.Router();
const subjectsServices = require("../services/subjectsServices");

// Get CheckSubjectCompletion
router.get("/check-status/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const completed = await subjectsServices.checkSubjectCompletion(email);
    res.json(completed);
  } catch (error) {
    res.status(500).json({ error: "ao obter status de tarefa do usuário" });
  }
});

module.exports = router;
