
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDdbGP_2TyvRFV_vvdBf4bwJTofwdnuOyM",
    authDomain: "bookbuddy-7a9dc.firebaseapp.com",
    projectId: "bookbuddy-7a9dc",
    storageBucket: "bookbuddy-7a9dc.firebasestorage.app",
    messagingSenderId: "558351224292",
    appId: "1:558351224292:web:6e16738fcd2e37bdf30bf1",
    measurementId: "G-KTV512CCPH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();

const submit = document.getElementById('sub');
submit.addEventListener("click",function(event){
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;
      if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("Account created Successfully");
    window.location.href="index.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
})