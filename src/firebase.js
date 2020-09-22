
import firebase from "firebase"


const firebaseApp = firebase.initializeApp({
                apiKey: "AIzaSyDk9sFhnNVr1ZrEavns5zcxpBDWKt-ghdw",
                authDomain: "instagramclone-57da9.firebaseapp.com",
                databaseURL: "https://instagramclone-57da9.firebaseio.com",
                projectId: "instagramclone-57da9",
                storageBucket: "instagramclone-57da9.appspot.com",
                messagingSenderId: "379172285670",
                appId: "1:379172285670:web:79ff68eb3c01a2e76d5f27",
                measurementId: "G-61H43PWPL1"
         
    
});

const db = firebaseApp.firestore();
const auth= firebase.auth();
const storage= firebase.storage();

export {db, auth,storage};
  