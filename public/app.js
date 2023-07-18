
// DECLARACIONES DE ELEMENTOS

const input = document.querySelector('.input')
const form = document.querySelector('.form')
const chatbox = document.querySelector('.chatmessages')
const formsubmit = document.querySelector('.formsubmit')
const online = document.querySelector('.online')
const textarea = document.querySelector('.forminput')
const previewcamera = document.querySelector('.previewofcamera')

camera.addEventListener('click',(e)=>{
 
    previewcamera.classList.remove('animacionadio')
    previewcamera.classList.remove('desactivado2')
    previewcamera.classList.add('animacion')
})

camera2.addEventListener('click',(e)=>{
 
    previewcamera.classList.remove('animacion')

    previewcamera.classList.add('animacionadio')
})


// BEAUTIFUL URLS

history.pushState({}, '', '/');

// MANEJA EL EVENTO DE SALIDA Y ENTRA DE USUARIOS

socket.on('updateOnlineUsers', (onlineUsers) => {
  online.innerHTML = onlineUsers;
});



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


socket.on('server:reload', () => {
    window.location.reload(); // Actualizar la página en el cliente
  });


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
                    appendAudio(audiobox,e.id,e.owner)
                    
                
              
        } else if (e.type === 'message') {
            appendMessage(e);

        } else if (e.type === 'video') {
            const videoBlob = new Blob([e.video], { type: 'video/webm' });
            const videoURL = URL.createObjectURL(videoBlob);
          
                // Crea un elemento "video vacio con los controles activados"
                const videoBox = document.createElement('video');
                videoBox.classList.add('videonote', 'plyr');
                videoBox.src = videoURL;
                videoBox.controls = true;
                videoBox.id= 'player'
              
               // Crea un contenedor para el video
                const videoContainer = document.createElement('div');
                videoContainer.classList.add('video-container');
                videoContainer.appendChild(videoBox);
            
                // Agrega el elemento de audio al DOM
                appendVideo(videoContainer,e.id,e.owner)
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


