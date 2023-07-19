const firebase = require("../firebase/firebaseService");
const performanceCollectionDB = firebase.firestore().collection("Performance");

async function getPerformanceData(email) {
  try {
    const docSnapshot = await performanceCollectionDB.doc(email).get();
    if (!docSnapshot.exists) {
      return {
        message: "Dados de desempenho não encontrados",
        performanceData: null,
      };
    }
    const performanceData = docSnapshot.data();
    return {
      message: "Dados de desempenho obtidos com sucesso",
      performanceData,
    };
  } catch (error) {
    console.error("Erro ao obter os dados de desempenho: ", error);
    throw error;
  }
}

async function savePerformanceData(req) {
  const payload = req.body;

  const existingDocSnapshot = await performanceCollectionDB
    .doc(payload.email)
    .get();

  const exam = payload.exam || 0;
  const scoreTotal = payload.exercises + exam;

  const performanceData = {
    subject: payload.subject,
    progress: payload.progress,
    exercises: payload.exercises,
    exam: exam,
    examDone: payload.examDone || false,
    scoreTotal: scoreTotal,
  };

  if (existingDocSnapshot.exists) {
    const existingData = existingDocSnapshot.data();
    let performanceArray = existingData.performance || [];

    const existingSubjectIndex = performanceArray.findIndex(
      (item) => item.subject === payload.subject
    );
    if (existingSubjectIndex !== -1) {
      performanceArray[existingSubjectIndex] = performanceData;
    } else {
      performanceArray.push(performanceData);
    }

    try {
      await performanceCollectionDB
        .doc(payload.email)
        .set({ performance: performanceArray });
      return {
        message: "Dados de desempenho atualizados com sucesso",
        performanceId: payload.email,
      };
    } catch (error) {
      console.error("Erro ao atualizar os dados de desempenho: ", error);
      throw error;
    }
  } else {
    try {
      await performanceCollectionDB
        .doc(payload.email)
        .set({ performance: [performanceData] });
      return {
        message: "Novos dados de desempenho criados com sucesso",
        performanceId: payload.email,
      };
    } catch (error) {
      console.error("Erro ao salvar os dados de desempenho: ", error);
      throw error;
    }
  }
}

module.exports = {
  getPerformanceData,
  savePerformanceData,
};