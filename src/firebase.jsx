
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD6t8tvChszF5IMvimyICfCkfDNmkp_i_0",
    authDomain: "edu-connect-cedb9.firebaseapp.com",
    projectId: "edu-connect-cedb9",
    storageBucket: "edu-connect-cedb9.appspot.com",
    messagingSenderId: "35140204969",
    appId: "1:35140204969:web:a43ed3b9088120b4c2ecb8",
    measurementId: "G-V6EWS1S986",
    databaseURL: "https://edu-connect-cedb9-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Connect to emulators for local development if needed
const isLocalhost = window.location.hostname === "localhost";

if (isLocalhost) {
  // Uncomment these lines when using Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectDatabaseEmulator(database, "localhost", 9000);
  // connectStorageEmulator(storage, "localhost", 9199);
  
  console.log("Using Firebase local emulators");
} else {
  console.log("Using Firebase production services");
}
