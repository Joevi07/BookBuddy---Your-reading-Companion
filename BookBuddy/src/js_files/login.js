
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain:  "your_auth domain",
    projectId: "your_proj id",
    storageBucket: "your_storage_bucket", 
    messagingSenderId:  "your_sender_id",
    appId: "your_app_id",
    measurementId:  "your_measurement_id"
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
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("Signed in Successfully");
    window.location.href="welcome.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
  
     if (errorCode === 'auth/user-not-found') {
        alert("Account does not exist. Please sign up.");
      } else if (errorCode === 'auth/wrong-password') {
        alert("Incorrect password. Please try again.");
      } else if (errorCode === 'auth/invalid-email') {
        alert("Invalid email format.");
      } else {
        alert(error.message); // fallback generic message
      }
  });
})
