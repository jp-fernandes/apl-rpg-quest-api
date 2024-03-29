const express = require("express");
const router = express.Router();
const exercisesService = require("../services/exercisesService");

// Get Exercises by subject
router.get("/:subject", async (req, res) => {
  const subject = req.params.subject;
  try {
    const questions = await exercisesService.getQuestionsFromFirebase(subject);
    res.json(questions);
  } catch (error) {
    const errorMessage = error.message || "Erro ao obter as questões";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

// Get Count Exercises
router.get("/subjects/count", async (req, res) => {
  try {
    const response = await exercisesService.countSubTopicsBySubject();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Erro ao contar os subtopics por subject" });
  }
});

router.post("/", async (req, res) => {
  try {
    const questionData = req.body;
    const result = await exercisesService.createQuestion(questionData);
    res.json(result);
  } catch (error) {
    const errorMessage = error.message || "Erro ao criar a questão";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

module.exports = router;
