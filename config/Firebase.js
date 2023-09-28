// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB8nsrDiFiPADG9_eyRY3b2QOGECobl0w8",
    authDomain: "the-hidden-inn.firebaseapp.com",
    projectId: "the-hidden-inn",
    storageBucket: "the-hidden-inn.appspot.com",
    messagingSenderId: "103527580229",
    appId: "1:103527580229:web:4d5093b6a406d82f7b192c",
    measurementId: "G-K5QT7T0QNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// const auth = getAuth(app);
// const db = getFirestore(app);
const storage = getStorage(app);
// const deleteObject = getStorage(app);
// const refFromURL = getStorage(app);

export { storage };
// export { auth, db, storage, deleteObject, refFromURL };