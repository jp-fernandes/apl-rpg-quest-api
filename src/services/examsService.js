const firebase = require("../firebase/firebaseService");
const examsCollectionDB = firebase.firestore().collection("Exams");

async function getQuestionsExamsFromFirebase(subject) {
  try {
    const collectionRef = examsCollectionDB;
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

    const filteredQuestions = questions.filter((question) => uniqueSubTopics.includes(question.subTopic));

    const remainingQuestions = questions.filter((question) => !uniqueSubTopics.includes(question.subTopic));

    const remainingCount = Math.min(2, remainingQuestions.length);

    const randomQuestions = remainingQuestions.sort(() => 0.5 - Math.random()).slice(0, remainingCount);

    const result = [...filteredQuestions, ...randomQuestions];

    if (result.length < 6) {
      const neededCount = 6 - result.length;
      const remainingSubTopics = new Set(questions.map((question) => question.subTopic));
      remainingSubTopics.delete(...uniqueSubTopics);
      const randomRemaining = questions.filter((question) => remainingSubTopics.has(question.subTopic)).sort(() => 0.5 - Math.random()).slice(0, neededCount);
      result.push(...randomRemaining);
    }

    return result.slice(0, 6);
  } catch (error) {
    throw error || new Error("Erro ao buscar as questões");
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
    const collectionRef = examsCollectionDB;
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

async function createExamQuestion(question) {
  try {
    const docRef = await examsCollectionDB.add(question);
    return { message: "Questão criada com sucesso", questionId: docRef.id };
  } catch (error) {
    throw error || new Error("Erro ao criar a questão");
  }
}

async function deleteQuestionsBySubTopic(subTopic) {
  try {
    const collectionRef = examsCollectionDB;
    const snapshot = await collectionRef.where("subTopic", "==", subTopic).get();

    const batch = firebase.firestore().batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return { message: `All documents with subTopic '${subTopic}' have been deleted` };
  } catch (error) {
    throw error || new Error("Error deleting documents");
  }
}

module.exports = {
  getQuestionsExamsFromFirebase,
  countSubTopicsBySubject,
  createExamQuestion,
  deleteQuestionsBySubTopic
};
