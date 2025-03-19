
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD6t8tvChszF5IMvimyICfCkfDNmkp_i_0",
    authDomain: "edu-connect-cedb9.firebaseapp.com",
    projectId: "edu-connect-cedb9",
    storageBucket: "edu-connect-cedb9.firebasestorage.app",
    messagingSenderId: "35140204969",
    appId: "1:35140204969:web:a43ed3b9088120b4c2ecb8",
    measurementId: "G-V6EWS1S986",
    databaseURL: "https://edu-connect-cedb9-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
