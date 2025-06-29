document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send-btn');
  const pdfInput = document.getElementById('pdf-upload');
  const chatInput = document.getElementById('chat-input');
  const chatWindow = document.getElementById('chat-window');

  sendBtn.addEventListener('click', async () => {
    const file = pdfInput.files[0];
    const question = chatInput.value;

    if (!file || !question) {
      alert('Please upload a PDF and type your question.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('question', question);

    appendMessage(question, 'user');

    try {
      const response = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      appendMessage(data.answer, 'bot');
    } catch (err) {
      console.error('Error:', err);
      appendMessage('Error connecting to server. Try again.', 'bot');
    }

    chatInput.value = '';
  });

  function appendMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender);
  msgDiv.innerHTML = message.replace(/\n/g, '<br>');
      chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
