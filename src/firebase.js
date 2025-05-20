
// import { initializeApp } from "firebase/app";

// import { getAuth, GoogleAuthProvider } from "firebase/auth";


// const firebaseConfig = {
//   apiKey: "AIzaSyD7a9Qv-lZfX6PcLw2sHC4Irp6nf2QGdck",
//   authDomain: "language-translation-86763.firebaseapp.com",
//   projectId: "language-translation-86763",
//   storageBucket: "language-translation-86763.firebasestorage.app",
//   messagingSenderId: "664121056372",
//   appId: "1:664121056372:web:245dfaf347ce86e5470521"
// };


// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🆕 Add this line

const firebaseConfig = {
  apiKey: "AIzaSyD7a9Qv-lZfX6PcLw2sHC4Irp6nf2QGdck",
  authDomain: "language-translation-86763.firebaseapp.com",
  projectId: "language-translation-86763",
  storageBucket: "language-translation-86763.firebasestorage.app",
  messagingSenderId: "664121056372",
  appId: "1:664121056372:web:245dfaf347ce86e5470521"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // 🆕 Add this export
