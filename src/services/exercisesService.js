const firebase = require("../firebase/firebaseService");
const exercisesCollectionDB = firebase.firestore().collection("Exercises");

async function getQuestionsFromFirebase() {
  try {
    const collectionRef = exercisesCollectionDB;
    const snapshot = await collectionRef.get();

    const questions = [];

    snapshot.forEach((doc) => {
      const questionData = doc.data();
      const question = {
        subject: questionData.subject,
        text: questionData.text,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        selectedAnswer: null,
      };
      questions.push(question);
    });

    shuffleArray(questions);

    const uniqueSubjects = Array.from(new Set(questions.map((question) => question.subject)));

    const filteredQuestions = [];
    const selectedSubjects = [];

    for (const question of questions) {
      if (!selectedSubjects.includes(question.subject)) {
        filteredQuestions.push(question);
        selectedSubjects.push(question.subject);
      }

      if (filteredQuestions.length === 4) {
        break;
      }
    }

    return filteredQuestions;
  } catch (error) {
    throw error || new Error("Erro ao buscar os exercícios");
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function createQuestion(question) {
  try {
    const docRef = await exercisesCollectionDB.add(question);
    return { message: "Questão criada com sucesso", questionId: docRef.id };
  } catch (error) {
    throw error || new Error("Erro ao criar a questão");
  }
}

module.exports = {
  getQuestionsFromFirebase,
  createQuestion,
};
