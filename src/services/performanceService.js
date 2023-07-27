const firebase = require("../firebase/firebaseService");
const performanceCollectionDB = firebase.firestore().collection("Performance");
const performanceHistoryCollectionDB = firebase.firestore().collection("PerformanceHistory");

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

  try {
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

      await performanceCollectionDB.doc(payload.email).set({ performance: performanceArray });

      try {
        await performanceHistoryCollectionDB.doc(payload.email).set({ performance: performanceArray });
      } catch (error) {
        console.error("Erro ao salvar os dados de desempenho no histórico: ", error);
        throw error;
      }
    } else {
      await performanceCollectionDB.doc(payload.email).set({ performance: [performanceData] });

      try {
        await performanceHistoryCollectionDB.doc(payload.email).set({ performance: [performanceData] });
      } catch (error) {
        console.error("Erro ao salvar os dados de desempenho no histórico: ", error);
        throw error;
      }
    }

    return {
      message: "Dados de desempenho salvos com sucesso",
      performanceId: payload.email,
    };
  } catch (error) {
    console.error("Erro ao salvar os dados de desempenho: ", error);
    throw error;
  }
}


async function deletePerformanceData(email) {
  try {
    await performanceCollectionDB.doc(email).delete();
    return {
      message: "Dados de desempenho excluídos com sucesso",
      performanceId: email,
      deleted: true
    };
  } catch (error) {
    console.error("Erro ao excluir os dados de desempenho: ", error);
    throw error;
  }
}

module.exports = {
  getPerformanceData,
  savePerformanceData,
  deletePerformanceData
};