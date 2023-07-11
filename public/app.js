
const input = document.querySelector('.input')
const form = document.querySelector('.form')
const chatbox = document.querySelector('.chatmessages')
const formsubmit = document.querySelector('.formsubmit')

const textarea = document.querySelector('.forminput')



const tourl = (text) => {
    const link = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(?!www\.\S+\.\S{2,})((\b\w+\b\.\S{2,})\b)/g;
    return text.replace(link, (url) => {
      if (!url.startsWith('http')) {
        url = 'http://' + url;
      }
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  };



document.addEventListener('DOMContentLoaded', () => {
 
 const input = document.querySelector('.input')
    input.focus()
    socket.emit('client:requestusername')
})

textarea.addEventListener('keydown', (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        chatbox.scrollTop = chatbox.scrollHeight;
        if (input.value.length <= 0) {

            chatbox.scrollTop = chatbox.scrollHeight;
        } else {
 
            sendMessage(input.value,undefined)


        }
    }
});

form.addEventListener('submit', (e) => {

    e.preventDefault()

    if (input.value.length <= 0) {
        e.preventDefault()

    } else {
        sendMessage(input.value,undefined)


    }



})



const sendMessage = (message, owner) => {
    let id = localStorage.getItem('clientId');
        input.value = ''
        input.focus();
        chatbox.scrollTop = chatbox.scrollHeight;
    socket.emit('client:newmessage', {
        message,
        owner,
        id,
    })
}





const appendMessage = message => {
    if(message.type == 'message'){

    mensaje = tourl(message.message)
    let clientId = localStorage.getItem('clientId');
    const div = document.createElement('div');

    div.classList.add('message')
    if (message.id !== clientId) {
        div.innerHTML = `
        <p class="messageowner" >${message.owner}</p>
        <p class="messagemessage" >${mensaje}</p>
    `;
        
    } else {
        div.innerHTML = `
        <p class="yourname" >${message.owner}</p>
        <p class="yourmessage" >${mensaje}</p>
    `;
    }
    chatbox.appendChild(div);

}else{
    console.log('audio')
}

};


socket.on('server:newmessage', message => {

    if(message.type == 'message'){
        appendMessage(message);
        textarea.value = ''
    }else{
        console.log('audio')
    }

});

socket.on('loadMessages', messages => {
    loadMessages(messages)
    console.log(messages)
})

// const loadMessages = (messages) => {
//     messages.forEach((message) => {
//       if (message.type === "message") {
//         // Mensaje de texto
//         appendMessage({
//           id: message.id,
//           message: message.message,
//           owner: message.owner,
//         });
//       } else if (message.type === "audio") {
//         // Mensaje de audio
//         appendAudio({
//           id: message.id,
//           audio: message.audio,
//           owner: message.owner,
//         });
//       }
//     });
//   };

const loadMessages = message => {
    message.forEach(e => {
        if (e.type === 'audio') {
                const audioBlob = new Blob([e.audio], { type: 'audio/mpeg' });
                const audioURL = URL.createObjectURL(audioBlob);
                    // Crea un elemento "audio vacio con los controles activados"
                    const audiobox = document.createElement('audio');
                    audiobox.classList.add('voicenote', 'plyr');
                    audiobox.controls = true;
                    audiobox.id = 'player';
                    // Crea un "source" que dentro tendra el link del blob ya transformado a audio
                    const source = document.createElement('source');
                    source.src = audioURL;
                    source.type = 'audio/mpeg';
                
                    // une el source del audio con el elemento audio
                    audiobox.appendChild(source);
                
                    // Agrega el elemento de audio al DOM
                  appendAudio(audiobox,e.id)
                    
                
              
        } else if (e.type === 'message') {
            appendMessage(e);
        }
    });
}

//

const ipRegAccescode = document.querySelector('.ip-reg-accescode')
const ipRegName = document.querySelector('.ip-reg-name')
const ipRegSubmit = document.querySelector('.ip-reg-submit')
const errorbox = document.querySelector('.error-message')


ipRegSubmit.addEventListener('click', (e) => {

    if (ipRegAccescode.value.length <= 0 || ipRegName.value.length <= 0) {
        e.preventDefault()
        console.log('asd')
        errorbox.innerHTML = 'Verifique no haya dejado ningun campo vacio por favor'
    }
})


