import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3DaXLs6rvHF0s1aYVzrrvejlFPCvihok",
  authDomain: "my-app-76f46.firebaseapp.com",
  projectId: "my-app-76f46",
  storageBucket: "my-app-76f46.appspot.com",
  messagingSenderId: "782655266501",
  appId: "1:782655266501:web:534cf33278c944eb839aac",
  measurementId: "G-39689HJ5T7"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
 
export { auth , storage};
 
export default db;//firebase.js