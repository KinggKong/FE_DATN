
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0rGUYRt8meKie8YG686uIOLsWMMcdwhA",
  authDomain: "up-image-product.firebaseapp.com",
  databaseURL: "https://up-image-product-default-rtdb.firebaseio.com",
  projectId: "up-image-product",
  storageBucket: "up-image-product.appspot.com",
  messagingSenderId: "309220167655",
  appId: "1:309220167655:web:57da706940b409c3267742",
  measurementId: "G-644NZM5E4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
;
const analytics = getAnalytics(app);

export  const storage = getStorage(app);