const admin = require('firebase-admin');
const path = require('path');

try {
  let credential;
  
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Production (Render): Load from environment variables
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines from env var
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } else {
    // Local: Load from JSON file
    const serviceAccount = require('./serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  }

  admin.initializeApp({ credential });
  console.log('Firebase Admin SDK initialized.');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
}

const db = admin.firestore();

module.exports = { admin, db };
