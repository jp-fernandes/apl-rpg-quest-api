const firebase = require("../firebase/firebaseService");
const feedbackCollectionDB = firebase.firestore().collection("Feedbacks");
const moment = require("moment-timezone");
const currentDate = moment().tz("America/Sao_Paulo");
const { getOperatingSystem } = require("../utils/utils");

async function getAllFeedbacks() {
  try {
    const snapshot = await feedbackCollectionDB.get();

    const feedbacks = [];

    snapshot.forEach((doc) => {
      const feedbackData = doc.data();
      const feedback = {
        feedbackId: doc.id,
        rating: feedbackData.rating,
        suggestion: feedbackData.suggestion,
        name: feedbackData.name,
        surname: feedbackData.surname,
        email: feedbackData.email,
        createdDate: feedbackData.createdDate.toDate().toISOString(),
        createdHour: feedbackData.createdHour,
        operatingSystem: feedbackData.operatingSystem,
      };
      feedbacks.push(feedback);
    });

    return feedbacks;
  } catch (error) {
    throw error || new Error("Erro ao obter os feedbacks");
  }
}

async function saveFeedback(req) {
  const userAgent = req.headers["user-agent"];
  const operatingSystem = getOperatingSystem(userAgent);
  const currentHour = currentDate.format("HH:mm");

  const payload = req.body;

  const feedbackData = {
    rating: payload.rating,
    suggestion: payload.suggestion,
    name: payload.name,
    surname: payload.surname,
    email: payload.email,
    createdDate: currentDate,
    createdHour: currentHour,
    operatingSystem: operatingSystem
  };

  try {
    const feedbackRef = feedbackCollectionDB;
    const docRef = await feedbackRef.add(feedbackData);

    return { message: "Feedback salvo com sucesso", feedbackId: docRef.id };
  } catch (error) {
    throw error || new Error("Erro ao salvar o feedback");
  }
}

module.exports = {
  getAllFeedbacks,
  saveFeedback,
};