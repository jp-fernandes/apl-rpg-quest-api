const firebase = require("../firebase/firebaseService");
const activitiesCollectionDB = firebase.firestore().collection("CompletedActivities");

async function checkSubjectCompletion(email) {
  try {
    const usersRef = activitiesCollectionDB;
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    const completed = user.completed || false; // Obtém o valor do campo "completed", ou assume false caso não exista

    return { completed };
  } catch (error) {
    console.error("Erro ao obter status de tarefa do usuário: ", error);
    throw error;
  }
}

module.exports = {
  checkSubjectCompletion,
};