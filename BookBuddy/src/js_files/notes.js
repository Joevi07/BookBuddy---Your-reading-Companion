

  //see more part
  
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import{getAuth,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { getDatabase,ref,push,onValue,remove,update} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

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
  const db = getDatabase(app);
  const auth = getAuth();

let currentNoteId = null;

  //firebase contents
 window.onload = function () {
  const wrapper = document.getElementById("wrapper");
  const addBox = wrapper.querySelector(".add-box");
  const popupBox = document.getElementById('popup-box');
  const updateContent = document.getElementById('update-content');
  const addContent = document.getElementById('add-content');
  const cross = document.getElementById('add-x');
  const cross_up = document.getElementById('update-x');
  const addTitleField = document.querySelector('#add-content .title textarea');
  const addDescField = document.querySelector('#add-content .Description textarea');

  console.log("Wrapper:", wrapper);

  // ✅ Firebase auth + note fetching
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const notesRef = ref(db, `notes/${uid}`);

      onValue(notesRef, (snapshot) => {
        try {
          wrapper.querySelectorAll(".note").forEach(el => el.remove());
          const notes = snapshot.val();
          console.log("📄 User's notes:", notes);

          if (notes) {
            Object.entries(notes).forEach(([id, note]) => {
              const createdDate = new Date(note.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              });

              const newNote = document.createElement("li");
              newNote.className = "note";
              newNote.setAttribute("data-id",id);
              newNote.innerHTML = `
                <div class="details">
                  <p>${note.title}</p>
                  <span>${note.description}</span>
                </div>
                <div class="bottom-content">
                  <span>${createdDate}</span>
                  <div class="settings">
                    <div class='see-more'><i class="fa-solid fa-ellipsis see-more"></i></div>
                    <ul class="menu">
                      <li class="edit"><i class="fa-solid fa-pen"></i>Edit</li>
                      <li class="delete"><i class="fa-solid fa-trash"></i>Delete</li>
                    </ul>
                  </div>
                </div>
              `;
              wrapper.insertBefore(newNote, addBox.nextSibling);
            });
          } else {
            console.warn("No notes found for this user.");
          }
        } catch (error) {
          console.error("Error loading notes:", error);
        }
      });
    } else {
      console.warn("🛑 User not logged in.");
    }
  });
  //update logic
  document.getElementById('update-note').addEventListener('click',()=>{
      const newTitle = document.querySelector('#update-content .title textarea').value.trim();
      const newDesc = document.querySelector('#update-content .Description textarea').value.trim();
      const user = auth.currentUser;
      if(!user||!currentNoteId)
      {
        alert("Missing user or note Id");
        return;
      }
      if(!newTitle || !newDesc)
      {
        alert("Both fields required");
        return;
      }
      const noteRef = ref(db,`notes/${user.uid}/${currentNoteId}`);
      update(noteRef,
        {
          title:newTitle,
          description:newDesc,

        }).then(()=>
        {
          alert("Note updated");
          popupBox.classList.remove('active');
          updateContent.classList.remove('active');
        }).catch((err)=>{
          console.error("Update faield",err);
        });

    });

  // ✅ Add note logic
  document.getElementById("add-note").addEventListener('click', () => {
    const addTitle = addTitleField.value.trim();
    const addDesc = addDescField.value.trim();

    if (addTitle && addDesc) {
      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }

      const notesRef = ref(db, `notes/${user.uid}`);
      push(notesRef, {
        title: addTitle,
        description: addDesc,
        createdAt: new Date().toISOString(),
      }).then(() => {
        alert("Note added!");
        addTitleField.value = "";
        addDescField.value = "";
        popupBox.classList.remove('active');
        addContent.classList.remove('active');
      }).catch((error) => {
        console.error("Error adding note:", error);
      });
    } else {
      alert("Fill both title and description");
    }
  });

  // ✅ UI button handling
  document.getElementById('plus').addEventListener('click', () => {
    popupBox.classList.add('active');
    addContent.classList.add('active');
    updateContent.classList.remove('active');
  });

  cross.addEventListener('click', () => {
    popupBox.classList.remove('active');
    addContent.classList.remove('active');
    updateContent.classList.remove('active');
  });

  cross_up.addEventListener('click', () => {
    popupBox.classList.remove('active');
    updateContent.classList.remove('active');
  });

  // ✅ Event delegation for dynamic elements
  wrapper.addEventListener('click', (e) => {
    const target = e.target;
    console.log("Clicked:", e.target);

    if (target.closest('.see-more')) {
      const settings = target.closest('.settings');
      document.querySelectorAll('.settings.active').forEach(active => {
        if (active !== settings) active.classList.remove('active');
      });
      settings.classList.toggle('active');
    }

    if (target.closest('.edit')) {
       const noteElement = target.closest('.note');
      currentNoteId = noteElement.getAttribute('data-id');
      const title = noteElement.querySelector('p').innerText;
      const desc = noteElement.querySelector('span').innerText;
      document.querySelector('#update-content .title textarea').value=title;
      document.querySelector('#update-content .Description textarea').value = desc;
      popupBox.classList.add('active');
      updateContent.classList.add('active');
      addContent.classList.remove('active');
      console.log('Edit clicked ✅');
    }

    if(target.closest('.delete'))
    {
      const noteElement = target.closest('.note');
      const noteId = noteElement.getAttribute('data-id');
      const user = auth.currentUser;
      if(user && noteId)
      {
        const noteRef = ref(db,`notes/${user.uid}/${noteId}`);
        remove(noteRef)
        .then(()=>{
          alert("Note deleted");
        })
        .catch(err=>{
          console.error("Failed to delete:",err);
        });
      }
    }

  });
};

  
