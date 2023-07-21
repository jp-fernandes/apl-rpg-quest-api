const firebase = require("../firebase/firebaseService");
const exercisesCollectionDB = firebase.firestore().collection("Exercises");

async function getQuestionsFromFirebase(subject) {
  try {
    const collectionRef = exercisesCollectionDB;
    const snapshot = await collectionRef.where("subject", "==", subject).get();

    const questions = [];

    snapshot.forEach((doc) => {
      const questionData = doc.data();
      const question = {
        subject: questionData.subject,
        subTopic: questionData.subTopic,
        text: questionData.text,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        selectedAnswer: null,
      };
      questions.push(question);
    });

    shuffleArray(questions);

    const uniqueSubTopics = Array.from(new Set(questions.map((question) => question.subTopic)));

    const filteredQuestions = [];
    const selectedSubTopics = [];

    for (const question of questions) {
      if (!selectedSubTopics.includes(question.subTopic)) {
        filteredQuestions.push(question);
        selectedSubTopics.push(question.subTopic);
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

async function countSubTopicsBySubject() {
  try {
    const collectionRef = exercisesCollectionDB;
    const snapshot = await collectionRef.get();

    const countMap = new Map();

    snapshot.forEach((doc) => {
      const questionData = doc.data();
      const subject = questionData.subject;
      const subTopic = questionData.subTopic;

      if (countMap.has(subject)) {
        countMap.get(subject).totalSubTopics++;
        countMap.get(subject).subTopics.push(subTopic);
      } else {
        countMap.set(subject, {
          totalSubTopics: 1,
          subTopics: [subTopic],
        });
      }
    });

    const result = {};
    for (const [subject, subTopicData] of countMap.entries()) {
      const subTopics = subTopicData.subTopics.reduce((acc, subTopic) => {
        acc[subTopic] = (acc[subTopic] || 0) + 1;
        return acc;
      }, {});

      result[subject] = {
        totalSubTopics: subTopicData.totalSubTopics,
        subTopics,
      };
    }

    return result;
  } catch (error) {
    throw error || new Error("Erro ao contar os subTopics por subject");
  }
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
  countSubTopicsBySubject,
  createQuestion,
};
