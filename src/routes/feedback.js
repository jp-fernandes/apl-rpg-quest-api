const express = require("express");
const router = express.Router();
const feedbackService = require("../services/feedbackService");

router.get("/all", async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.json(feedbacks);
  } catch (error) {
    const errorMessage = error.message || "Erro ao obter os feedbacks";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

router.post("/", async (req, res) => {
  try {
    const feedback = await feedbackService.saveFeedback(req);
    res.json(feedback);
  } catch (error) {
    const errorMessage = error.message || "Erro ao salvar o feedback";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

module.exports = router;