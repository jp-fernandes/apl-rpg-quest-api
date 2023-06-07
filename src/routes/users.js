const express = require("express");

const router = express.Router();

const firebase = require('firebase/app');
require('firebase/firestore');
const firebaseConfig = require("./../../firebaseConfig");

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Obtém uma referência ao Firestore
const db = firebase.firestore();

// Rota para listar todos os usuários
router.get("/", (req, res) => {
  // Aqui você pode buscar os usuários do banco de dados ou usar dados fictícios
  const users = [
    { id: 1, name: "Usuário 1" },
    { id: 2, name: "Usuário 2" },
    { id: 3, name: "Usuário 3" },
  ];

  res.json(users);
});

// Rota para criar um novo usuário
router.post("/", (req, res) => {
  // Aqui você pode salvar o novo usuário no banco de dados ou fazer outras operações necessárias
  const newUser = req.body;

  res.status(201).json(newUser);
});

// Rota para obter detalhes de um usuário específico
router.get("/:id", (req, res) => {
  // Aqui você pode buscar o usuário pelo ID no banco de dados ou usar dados fictícios
  const user = { id: req.params.id, name: "Usuário X" };

  const collectionRef = db.collection("Users");

  // Realiza a consulta para buscar o usuário
  collectionRef
    .where("cpf", "==", user.id)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log("Usuário não encontrado");
        return;
      }

      querySnapshot.forEach((documentSnapshot) => {
        const userData = documentSnapshot.data();
        console.log("Usuário encontrado:", userData);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar usuário:", error);
    });

  res.json(user);
});

// Rota para obter o perfil de um usuário específico
router.get("/:userId/profile", (req, res) => {
  const userId = req.params.userId;
  // Implementação para obter o perfil do usuário com o ID fornecido
  res.send(`Perfil do usuário ${userId}`);
});

// Rota para atualizar o perfil de um usuário específico
router.put("/:userId/profile", (req, res) => {
  const userId = req.params.userId;
  const updatedProfile = req.body;
  // Implementação para atualizar o perfil do usuário com o ID fornecido
  res.send(`Perfil do usuário ${userId} atualizado`);
});

module.exports = router;
