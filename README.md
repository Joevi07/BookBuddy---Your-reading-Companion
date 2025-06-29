# BookBuddy--Your-reading-Companion
**BookBuddy** is a smart, AI-powered book assistant that enhances your reading experience by letting you upload PDFs and interact with them through a chat interface. It leverages Google's **Genkit + Gemini**, integrates **Firebase** for user authentication and storage, uses **PDF.js** for smooth PDF rendering, and features a responsive frontend built with **HTML, CSS, JavaScript**, and backend with **Node.js,Express.js with typescript**.
___
## 📌 TABLE OF CONTENTS

1. [AIM](#aim)
2. [FEATURES OFFERED](#features-offered)
3. [TECHNOLOGIES & APIS USED](#technologies--apis-used)
4. [INTEGRATION / EXECUTION SEQUENCE](#integration--execution-sequence)
5. [TOOLS / FRAMEWORKS USED](#tools--frameworks-used)
6. [AI CAPABILITIES](#ai-capabilities)
7. [LIMITATIONS](#limitations)
8. [DEMO SCREENSHOTS](#demo-screenshots)
___
## AIM
To build a responsive, real-time AI-powered assistant that allows users to upload PDFs and ask contextual questions, with personalized interactions and features such as searching meanings, jotting down notes for their future reference.
___
## FEATURES OFFERED

+ 🔐 User Authentication (Signup/Login) via Firebase.
+ 📥 Upload and render PDFs with PDF.js.
+ 💬 Ask questions from uploaded books (PDF QA).
+ 🤖 Smart conversational assistant powered by Gemini AI.
+ 📌 Take notes with real-time Firebase database sync.
+ 📊 Responsive UI with styled panels and icons.
+ 🔁 Frontend and Backend connected via Express.js.
+ 🖼️ FontAwesome icons and Google Fonts for a polished design.

___
## TECHNOLOGIES & APIs USED

| Category         | Tools / APIs / Libraries                                   |
|------------------|------------------------------------------------------------|
| Frontend         | `HTML`, `CSS`, `JavaScript`, `FontAwesome`, `Google Fonts` |
| PDF Rendering    | `PDF.js` – for rendering PDF pages on the web              |
| Backend          | `Node.js`, `Express.js`, `Genkit (Gemini)`                 |
| Authentication   | `Firebase Authentication`                                  |
| Database         | `Firebase Realtime Database`                               |
| AI/ML Model      | `Gemini 2.0 Flash` via Genkit SDK                          |
| Hosting/Serving  | `Live Server`, optionally deployable via Firebase Hosting  |

___
## INTEGRATION / EXECUTION SEQUENCE

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/BookBuddy.git
   cd BookBuddy
2. **Install Backend Dependencies**
    ```cd backend
    npm install
    npm install - D -> For Dev Dependencies
    
    for initializing node.js project
     npm init -y

    to use express with type script
    npm install express
    npm install --save-dev typescript ts-node @types/node @types/express```
3. **Start Frontend**
   Open index.html in public/html/ using Live Server.
4. **Run Backend (Genkit + Express)**
    ```npx tsx src/server.ts```
   ⚠️NOTE: Get your gemini api key. For more details refer Chat with a PDF file documentation in Firebase.
5. **Firebase Configuration**
     + Set up Firebase project.
     + Use your firebase authentication for login and signup module.
     + Use your real time database credentials in firebase for notes module.
6. Navigate through the navbar at top to enjoy various features.

___
## TOOLS / FRAMEWORKS USED
  + VS Code – Development IDE
  + Firebase Console – Project setup and authentication, Real time database
  + Genkit CLI – Gemini API integration
  + Google Fonts – UI typography
  + Live Server – Frontend preview
  + Postman – API testing
  + PDF.js – PDF parsing and rendering on frontend
  + FontAwesome - For various icons
___
## AI CAPABILITIES
  + PDF Context Extraction – Splits and parses large PDF files for page-wise question answering.
  + Natural Language Understanding – Answers user queries with context-aware responses.
  + Real-Time Chat Interface – Seamless chat UI integrated with Gemini model via Genkit.

___
## LIMITATIONS:
  + 📄 Asynchronous PDF Rendering:
      For large PDFs, rendering happens one page at a time using PDF.js, making smooth scrolling difficult or inconsistent.
  +  🕐 Slow Chatbot Response:
Due to using Gemini 1.5 Flash via Genkit, there can be slight delays in generating AI responses depending on context size and PDF complexity.
  + 🌐 Limited Offline Usage:
Relies on Firebase and Google APIs, requiring an active internet connection.

___
## DEMO SCREENSHOTS:
![Login-page](demo-ss/login.png)
![Signup-page](demo-ss/signup.png)
![welcome-page](demo-ss/welcome.png)
![Readpdf-page](demo-ss/upload.png)
![Dictionary-page](demo-ss/dic.png)
![Notes-page](demo-ss/notes.png)
![Chatbot-page](demo-ss/chatbot.png)




