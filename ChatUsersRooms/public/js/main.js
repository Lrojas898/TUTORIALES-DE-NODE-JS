//This elements exists in the html, and we are going to chenge their properties
//based on what we recieved of the server.

const chatForm = document.getElementById('chat-form'); //On this case, the chat-form is in the chat html
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL, we used an html library Qs, that has some methods that allow us to do this
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//this is defined in the backend

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room }); //this will emite the username and room retrieved from the url


//This socket will recieve all the information from the server, 
//the server is emitting and this will be recieving 

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server, it must has the same name as in the server
// you will 



socket.on('message', (message) => {
  console.log(message);
  outputMessage(message); //this function is defined in js

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight; //add a property that is from html, based on the element retrieved previously
  //it will just bring us to the buttom. 
});

// Message submit, based on the dom
chatForm.addEventListener('submit', (e) => { //the submit event was defined previously in a library 
  e.preventDefault(); //avois to submit to a file, so we can use the preventDefault behaviour

  // Get message text

 //In the chat html there is an input called msg, and when we recieved an submit event, 
 //then we will target the elment called msg and the value it has, as it is an input. 

  let msg = e.target.elements.msg.value;

  msg = msg.trim(); //we trim it to avoid errors 

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);  //we emit a message to the server

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) { //Message is an object whose format was defined in the server

    //we create a div in the dom
  const div = document.createElement('div');

  //we then create a classList called message
  div.classList.add('message');
  //we create a p element
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username; //the text will start by the username that comes in the mesage
  p.innerHTML += `<span>${message.time}</span>`; //we crate ina a little separate container the message name
  div.appendChild(p); //we put the username on the div 
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;  // we retireve the text form the message 
  div.appendChild(para); //we append the paramters in the div 
  document.querySelector('.chat-messages').appendChild(div);
    //and then we inlcude the message in the chat messages containers

}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});