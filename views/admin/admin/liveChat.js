  
const chatForm =document.getElementById("chat-form")
const chatMessage =document.querySelector(".chat-messages")
const socket = io()
//massage form server
socket.on("user-conected",userID=>{
    console.log(userID)
})
socket.on('message',message=>{
  outputMessage(message)

  //scroll down 
  chatMessage.scrollTop = chatMessage.scrollHeight
})

//add massage
chatForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage",msg) 
  //clear massage field 
  e.target.elements.msg.value=""
  e.target.elements.msg.focus()
  
})
function outputMessage(message){
    console.log(x=+1)
    const div = document.createElement('div')
      div.classList.add('message')
      div.innerHTML = 
                  `<p class="meta"> ${message.username} <span> ${message.time}</span></p>
                 <p class="text">
                      ${message.text}
                </p>`
      document.querySelector(".chat-messages").appendChild(div)
