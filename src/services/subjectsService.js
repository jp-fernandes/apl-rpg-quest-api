const firebase = require("../firebase/firebaseService");
const activitiesCollectionDB = firebase.firestore().collection("CompletedActivities");
const moment = require("moment-timezone");
const currentDate = moment().tz("America/Sao_Paulo");

async function saveStatusActivity(req) {
  const payload = req.body;

  try {
    const querySnapshot = await activitiesCollectionDB
      .where("email", "==", payload.email)
      .where("subject", "==", payload.subject)
      .get();

    if (querySnapshot.empty) {
      const obj = {
        email: payload.email,
        score: payload.score,
        subject: payload.subject,
        completionDate: currentDate,
        completed: true,
      };

      const docRef = await activitiesCollectionDB.add(obj);
      return { message: "Novo status criado com sucesso", statusId: docRef.id };
    } else {
      const docSnapshot = querySnapshot.docs[0];
      await docSnapshot.ref.update({
        score: payload.score,
        completionDate: currentDate,
        completed: true,
      });

      return { message: "Status atualizado com sucesso", statusId: docSnapshot.id };
    }
  } catch (error) {
    console.error("Erro ao salvar/atualizar o status do usuário: ", error);
    throw error;
  }
}

async function checkSubjectCompletion(email) {
  try {
    const usersRef = activitiesCollectionDB;
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const response = userDoc.data();

    if (response.completionDate) {
      const completionDate = new Date(
        response.completionDate._seconds * 1000 +
          response.completionDate._nanoseconds / 1000000
      );

      response.completionDate = completionDate.toISOString();
    }

    return response;
  } catch (error) {
    console.error("Erro ao obter status de tarefa do usuário: ", error);
    throw error;
  }
}

module.exports = {
  checkSubjectCompletion,
  saveStatusActivity
};