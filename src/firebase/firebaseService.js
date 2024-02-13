require('dotenv').config();
const admin = require("firebase-admin");

let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else {
  serviceAccount = require("../firebase/serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;