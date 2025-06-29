const dicbtn = document.getElementById('dic-btn');
const readbtn = document.getElementById('upload-btn');
const notebtn = document.getElementById('note-btn');
const chatbtn = document.getElementById('chat-btn');
readbtn.addEventListener('click',()=>
{
    window.location.href = 'read.html';
});

dicbtn.addEventListener('click',()=>
{
    window.location.href = 'dictionary.html';
});
notebtn.addEventListener('click',()=>
{
    window.location.href = 'Notes.html';
});
chatbtn.addEventListener('click',()=>
{
    window.location.href = 'chatbot.html';
});

