import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDAz2lYUbv-LCoKSL9R5owcE4ebfbIRo5c",
  authDomain: "busybuy-cb489.firebaseapp.com",
  projectId: "busybuy-cb489",
  storageBucket: "busybuy-cb489.appspot.com",
  messagingSenderId: "999121362675",
  appId: "1:999121362675:web:902149faebadad3a8d2186"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
