const ws = new WebSocket('ws://127.0.0.1:8000');

let username = localStorage.getItem('username') || '';

const loginBox = document.getElementById('login-box');
const chatArea = document.getElementById('chat-area');
const msgInput = document.getElementById('msg');

if (username) {
  loginBox.style.display = 'none';
  chatArea.classList.remove('hidden');
  msgInput.disabled = false;
  msgInput.focus();
} else {
  msgInput.disabled = true;
}

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('username');
  username = input.value.trim();
  if (!username) return;

  localStorage.setItem('username', username);

  loginBox.style.display = 'none';
  chatArea.classList.remove('hidden');
  msgInput.disabled = false;
  msgInput.focus();
});

ws.onmessage = (event) => {
  addMessage(event.data);
};

msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  if (!msgInput.value.trim() || !username) return;
  ws.send(`${username}|${msgInput.value}`);
  msgInput.value = '';
}

function addMessage(data) {
  const [sender, text, timeValue] = data.split('|');

  const messages = document.getElementById('messages');
  const chatBox = document.getElementById('chat-box');

  const li = document.createElement('li');
  li.classList.add('message', sender === username ? 'me' : 'other');

  const user = document.createElement('div');
  user.className = 'username';
  user.textContent = sender;

  const msg = document.createElement('p');
  msg.textContent = text;

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = timeValue;

  li.appendChild(user);
  li.appendChild(msg);
  li.appendChild(time);

  messages.appendChild(li);
  chatBox.scrollTop = chatBox.scrollHeight;
}
