// firebase.js
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBZeTMfsjoJ3Uo0UAb6MWSGyeUDhgf_3BA",
    authDomain: "communitydata-647bd.firebaseapp.com",
    projectId: "communitydata-647bd",
    storageBucket: "communitydata-647bd.firebasestorage.app",
    messagingSenderId: "594142794300",
    appId: "1:594142794300:web:ea6ef5b6529cb70130e939"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export { db };
