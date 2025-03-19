import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxDdxu04GUsgrFuHF8nzi9Vn5W6w-UssQ",
  authDomain: "educonnect-66985.firebaseapp.com",
  projectId: "educonnect-66985",
  storageBucket: "educonnect-66985.appspot.com",
  messagingSenderId: "929385552633",
  appId: "1:929385552633:web:cae4b94e026a5a3a00a028",
  measurementId: "G-VHB69G4S4J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in the browser environment
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Connect to emulators for local development if needed
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

if (isLocalhost) {
  // Uncomment these lines when using Firebase emulators
  connectAuthEmulator(auth, "http://localhost:9099");
  connectDatabaseEmulator(database, "localhost", 9000);
  connectStorageEmulator(storage, "localhost", 9199);

  console.log("Using Firebase local emulators");
} else {
  console.log("Using Firebase production services");
}
