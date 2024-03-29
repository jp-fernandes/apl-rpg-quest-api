const express = require("express");
const router = express.Router();
const performanceService = require("../services/performanceService");

// Get Performance
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const response = await performanceService.getPerformanceData(email);
    res.json(response);
  } catch (error) {
    const errorMessage = error.message || "Erro ao obter os dados de desempenho";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

// Save performance Data
router.post("/", async (req, res) => {
  try {
    const response = await performanceService.savePerformanceData(req, res);
    res.json(response);
  } catch (error) {
    const errorMessage = error.message || "Erro ao salvar os dados de desempenho";
    const errorCode = error.code || 500;
    res.status(errorCode).json({ error: errorMessage, code: errorCode });
  }
});

// Delete Performance by Email
router.delete("/performance-data/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const response = await performanceService.deletePerformanceData(email);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir registro por email" });
  }
});

module.exports = router;