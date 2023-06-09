const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// Get users
router.get("/", async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o usuário" });
  }
});

// // Rota para obter detalhes de um usuário específico
// router.get("/:id", (req, res) => {
//   // Aqui você pode buscar o usuário pelo ID no banco de dados ou usar dados fictícios
//   const user = { id: req.params.id, name: "Usuário X" };

//   const collectionRef = db.collection("Users");

//   // Realiza a consulta para buscar o usuário
//   collectionRef
//     .where("cpf", "==", user.id)
//     .get()
//     .then((querySnapshot) => {
//       if (querySnapshot.empty) {
//         console.log("Usuário não encontrado");
//         return;
//       }

//       querySnapshot.forEach((documentSnapshot) => {
//         const userData = documentSnapshot.data();
//         console.log("Usuário encontrado:", userData);
//       });
//     })
//     .catch((error) => {
//       console.error("Erro ao buscar usuário:", error);
//     });

//   res.json(user);
// });

// // Rota para obter o perfil de um usuário específico
// router.get("/:userId/profile", (req, res) => {
//   const userId = req.params.userId;
//   // Implementação para obter o perfil do usuário com o ID fornecido
//   res.send(`Perfil do usuário ${userId}`);
// });

// // Rota para atualizar o perfil de um usuário específico
// router.put("/:userId/profile", (req, res) => {
//   const userId = req.params.userId;
//   const updatedProfile = req.body;
//   // Implementação para atualizar o perfil do usuário com o ID fornecido
//   res.send(`Perfil do usuário ${userId} atualizado`);
// });

module.exports = router;
