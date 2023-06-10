const firebase = require("../firebase/firebaseService");

const usersCollectionDB = firebase.firestore().collection("Users");

async function getUsers() {
  try {
    const snapshot = await usersCollectionDB.get();
    const users = snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    }));
    return users;
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    throw error;
  }
}

async function getUserByCpf(cpf) {
  try {
    const usersRef = usersCollectionDB;
    const querySnapshot = await usersRef.where("cpf", "==", cpf).get();

    if (querySnapshot.empty) {
      return null;
    }

    const user = querySnapshot.docs[0].data();
    return user;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    throw error;
  }
}

async function createUser(req) {
  const newUser = req.body;

  const user = {
    cpf: newUser.cpf,
    name: newUser.name,
    surname: newUser.surname,
    age: newUser.age
  };

  try {
    const usersRef = usersCollectionDB;
    const querySnapshot = await usersRef.where("cpf", "==", user.cpf).get();

    if (!querySnapshot.empty) {
      const error = {
        message: "Usuário já existe",
        code: 409
      };
      throw error;
    }

    const docRef = await usersRef.add(user);

    return { message: "Novo usuário criado com sucesso", userId: docRef.id };
  } catch (error) {
    throw error || new Error("Erro ao criar novo usuário");
  }
}

async function updateUserByCpf(cpf, updatedData) {
  try {
    const usersRef = usersCollectionDB;
    const querySnapshot = await usersRef.where("cpf", "==", cpf).get();

    if (querySnapshot.empty) {
      const error = {
        message: "Usuário não encontrado",
        code: 404
      };
      throw error;
    }

    const docId = querySnapshot.docs[0].id;
    const userRef = usersRef.doc(docId);

    await userRef.update(updatedData);

    return { message: "Dados do usuário atualizados com sucesso" };
  } catch (error) {
    throw error || new Error("Erro ao atualizar dados do usuário");
  }
}


module.exports = {
  getUsers,
  getUserByCpf,
  createUser,
  updateUserByCpf
};