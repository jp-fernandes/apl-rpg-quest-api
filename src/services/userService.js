const firebase = require("../firebase/firebaseService");
const usersCollectionDB = firebase.firestore().collection("Users");
const moment = require("moment-timezone");
const currentDate = moment().tz("America/Sao_Paulo");
const { getOperatingSystem, formatDate } = require("../utils/utils");

async function getUsers() {
  try {
    const snapshot = await usersCollectionDB.get();
    const users = snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    }));
    return users;
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const usersRef = usersCollectionDB;
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    const numberOfVisits = user.numberOfVisits || 0;

    const updatedNumberOfVisits = numberOfVisits + 1;

    await userDoc.ref.update({ numberOfVisits: updatedNumberOfVisits });

    user.numberOfVisits = updatedNumberOfVisits;

    return user;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    throw error;
  }
}

async function createUser(req) {
  const userAgent = req.headers["user-agent"];
  const operatingSystem = getOperatingSystem(userAgent);
  const currentHour = currentDate.format("HH:mm");

  const newUser = req.body;

  const user = {
    email: newUser.email,
    age: newUser.age,
    name: newUser.name,
    surname: newUser.surname,
    gender: newUser.gender,
    city: newUser.city,
    state: newUser.state,
    createdDate: currentDate,
    createdHour: currentHour,
    operatingSystem: operatingSystem,
    numberOfVisits: 1,
  };

  try {
    const usersRef = usersCollectionDB;
    const querySnapshot = await usersRef.where("email", "==", user.email).get();

    if (!querySnapshot.empty) {
      const error = {
        message: "Usuário já existe",
        code: 409,
      };
      throw error;
    }

    const docRef = await usersRef.add(user);

    return { message: "Novo usuário criado com sucesso", userId: docRef.id };
  } catch (error) {
    throw error || new Error("Erro ao criar novo usuário");
  }
}

async function updateUserByEmail(email, updatedData) {
  try {
    const usersRef = usersCollectionDB;
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      const error = {
        message: "Usuário não encontrado",
        code: 404,
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

async function getUserMetrics(req, res) {
  try {
    const snapshot = await usersCollectionDB.get();
    const users = snapshot.docs.map((doc) => doc.data());

    let iosCount = 0;
    let androidCount = 0;
    let windowsCount = 0;
    let macCount = 0;
    let linuxCount = 0;
    let unknownCount = 0;

    let totalAge = 0;
    let oldestAge = 0;
    let youngestAge = Infinity;

    let totalVisits = 0;
    let lastCreatedDate = null;

    users.forEach((user) => {
      switch (user.operatingSystem) {
        case "iOS":
          iosCount++;
          break;
        case "Android":
          androidCount++;
          break;
        case "Windows":
          windowsCount++;
          break;
        case "Mac OS":
          macCount++;
          break;
        case "Linux":
          linuxCount++;
          break;
        default:
          unknownCount++;
          break;
      }

      if (user.age) {
        totalAge += user.age;

        if (user.age > oldestAge) {
          oldestAge = user.age;
        }

        if (user.age < youngestAge) {
          youngestAge = user.age;
        }
      }

      if (user.numberOfVisits) {
        totalVisits += user.numberOfVisits;
      }

      if (user.createdDate && (!lastCreatedDate || user.createdDate.toDate() > lastCreatedDate)) {
        lastCreatedDate = user.createdDate.toDate();
      }
    });

    const operatingSystemMetrics = {
      iOS: iosCount,
      android: androidCount,
      windows: windowsCount,
      macOS: macCount,
      linux: linuxCount,
      unknown: unknownCount,
    };

    const totalUsers = users.length;
    const averageAge = totalAge / totalUsers;

    const metrics = {
      totalUsers,
      totalVisits,
      oldestAge,
      youngestAge,
      averageAge,
      lastRegistration: lastCreatedDate ? formatDate(lastCreatedDate) : null,
      operatingSystemMetrics,
    };

    return metrics;
  } catch (error) {
    console.error("Erro ao obter métricas:", error);
    res.status(500).json({ error: "Erro ao obter métricas" });
  }
}

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  updateUserByEmail,
  getUserMetrics,
};
