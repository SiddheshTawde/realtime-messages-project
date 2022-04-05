// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8hWJcK_eD1c0q5BKelmqAAavRlb_OElk",
  authDomain: "realtime-messages-project.firebaseapp.com",
  projectId: "realtime-messages-project",
  storageBucket: "realtime-messages-project.appspot.com",
  messagingSenderId: "1067105586371",
  appId: "1:1067105586371:web:ace0d2a1d8206ff72ce676",
  measurementId: "G-STG80422RQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);