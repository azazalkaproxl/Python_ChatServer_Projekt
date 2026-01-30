const ws = new WebSocket('ws://127.0.0.1:8000');

let username = '';

document.querySelector('.container form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('username');
  username = input.value.trim();
  if (!username) return;

  e.target.closest('.container').style.display = 'none';
});

ws.onmessage = (event) => {
  addMessage(event.data);
};

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  const input = document.getElementById('msg');
  if (!input.value.trim() || !username) return;

  ws.send(`${username}|${input.value}`);
  input.value = '';
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
