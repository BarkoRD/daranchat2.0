const socket = io()

const startButton = document.querySelector('.grabarnota');
const stopButton = document.querySelector('.cortarnota');
const recordingsList = document.querySelector('.chatmessages');

let mediaRecorder;
let chunks = [];



socket.on('server:newaudio',audio =>{
  const audioBlob = new Blob([audio.audio], { type: 'audio/mpeg' });
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
    appendAudio(audiobox,audio.id,audio.owner)
      
  
})

const appendAudio = (audio,id,owner) => {
  console.log(audio)
  let clientId = localStorage.getItem('clientId');

  const voicenote = document.createElement('div');
  const div = document.createElement('div');
  const ownername = document.createElement('div');
  div.classList.add('message');
 
  ownername.innerHTML = `${owner}`

  
  if (id !== clientId) {
    ownername.classList.add('messageowner');
    voicenote.appendChild(audio);
    voicenote.classList.add('avoicenote')
    div.appendChild(ownername)
    div.appendChild(voicenote)

    const player = new Plyr(audio, {
      speed: {
        selected: 1,
        options: [1, 1.5, 2]
      },
      controls: [ 'play', 'progress','duration','settings']
    });

  } else {
    ownername.classList.add('yourname');

    voicenote.classList.add('your')
    voicenote.appendChild(audio);
    div.appendChild(ownername)
    div.appendChild(voicenote)
    const player = new Plyr(audio, {
      speed: {
        selected: 1,
        options: [1, 1.5, 2]
      },
       controls: [ 'play', 'progress','duration','settings']
    });
  }
  recordingsList.appendChild(div);
};

// Evento clic del botón "Detener grabación"

stopButton.addEventListener('click', (e) => {
  e.preventDefault()
  startButton.classList.remove('desactivado')
  stopButton.classList.add('desactivado')
  mediaRecorder.stop();
});

//Evento clic del botón "Iniciar grabación"

startButton.addEventListener('click', async (e) => {
  e.preventDefault()
  startButton.classList.add('desactivado')
  stopButton.classList.remove('desactivado')
  startButton.disabled = true;
  stopButton.disabled = false;
  chunks = [];

  // pedir permiso de microfono
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // se establece que se recibira audio microfono o video o etc
  mediaRecorder = new MediaRecorder(stream);

  // escucha el evento de "grabando" de media recorder y comienza
  // a guardar el audio en chunks(el array)

  mediaRecorder.addEventListener('dataavailable', e => {
    chunks.push(e.data);
  });

  // escucha el evento de detener la grabacion aqui dentro se convierte el
  // contenido de chunks a un "blob" un blob es un conjunto de datos binarios
  // que se puede transformar en algo en este caso este blob se transformara en audio
  // el blob transformado se metera dentro de un link
  mediaRecorder.addEventListener('stop', () => {
    const blob = new Blob(chunks, { type: 'audio/mpeg' });
    let clientId = localStorage.getItem('clientId');
    const sendAudio = (audio, owner, id) => {
      socket.emit('client:newaudio', {
        audio,
        owner,
        id
      })
    }
    sendAudio(blob,'elpepe',clientId)


  

  // Limpia los datos y restablece los botones
  chunks = [];
  startButton.disabled = false;
  stopButton.disabled = true;

  })

  // Comienza la grabación
  mediaRecorder.start();

});



// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK     


//   Si deseas que se muestre la duración del audio sin tener que reproducirlo, puedes utilizar el evento 'loadedmetadata' del reproductor Plyr para obtener la duración y actualizar el elemento correspondiente en la interfaz.

// Aquí tienes un ejemplo de cómo hacerlo:

  // const player = new Plyr(audio, {
  //   speed: {
  //     selected: 1,
  //     options: [1, 1.5, 2]
  //   },
  //   controls: ['play', 'progress', 'duration', 'settings']
  // });
  
  // player.on('loadedmetadata', () => {
  //   const durationElement = document.querySelector('.plyr__time--duration');
  //   const duration = player.duration;
  //   if (durationElement && duration) {
  //     durationElement.textContent = formatTime(duration);
  //   }
  // });
  
  // // Función para formatear el tiempo en formato hh:mm:ss
  // function formatTime(time) {
  //   const hours = Math.floor(time / 3600);
  //   const minutes = Math.floor((time % 3600) / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  // }
  
//   En este ejemplo, estamos escuchando el evento 'loadedmetadata' del reproductor Plyr, que se dispara cuando se obtienen los metadatos del audio, incluida la duración. En el controlador de eventos, obtenemos el elemento correspondiente a la duración ('.plyr__time--duration') y actualizamos su contenido con el valor formateado de la duración.

// Asegúrate de tener un elemento en tu HTML con la clase 'plyr__time--duration' para mostrar la duración del audio.

// Con esta solución, la duración del audio se mostrará sin necesidad de reproducirlo previamente.

// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK
// AAAAAAARRRRRREEEEEGGGGGLLLAAAAARRRR BUG DE QUE NO SE VE LA DURACION SI NO DOY CLICK


