const express = require("express");
const router = express.Router();
const examsService = require("../services/examsService");

// Get Exams by subject
router.get("/:subject", async (req, res) => {
  const subject = req.params.subject;
  try {
    const questions = await examsService.getQuestionsExamsFromFirebase(subject);
    res.json(questions);
  } catch (error) {
    const errorMessage = error.message || "Erro ao obter as questões";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

// Get Count Exams
router.get("/subjects/exams-count", async (req, res) => {
  try {
    const response = await examsService.countSubTopicsBySubject();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Erro ao contar os subtopics por subject" });
  }
});

router.post("/", async (req, res) => {
  try {
    const questionData = req.body;
    const result = await examsService.createExamQuestion(questionData);
    res.json(result);
  } catch (error) {
    const errorMessage = error.message || "Erro ao criar a questão";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

module.exports = router;
