const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("serviceAccountKey.json")
});

const db = admin.firestore();

async function getUsers() {
  try {
    const snapshot = await db.collection("Users").get();
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

async function createUser(req) {
  const newUser = req.body;
  console.log("Request ", newUser);
  // const user = {
  //   cpf: newUser.cpf,
  //   name: newUser.name,
  //   surname: newUser.surname,
  //   age: newUser.age
  // };

  const user = {
    cpf: "12345678902",
    name: "Paulo teste",
    surname: "Souza",
    age: 29
  };

  const usersRef = admin.firestore().collection("Users");

  const querySnapshot = await usersRef.where("cpf", "==", user.cpf).get();

  if (!querySnapshot.empty) {
    res.status(409).json({ error: "Usuário já existe" });
    return;
    //To-DO - Fazer retornar o erro correto.
  }

  usersRef
    .add(user)
    .then((docRef) => {
      res.status(201).json({ message: "Novo usuário criado com sucesso", userId: docRef.id });
    })
    .catch((error) => {
      console.error("Erro ao criar novo usuário:", error);
      res.status(500).json({ error: "Erro ao criar novo usuário" });
    });
}

module.exports = {
  getUsers,
  createUser
};