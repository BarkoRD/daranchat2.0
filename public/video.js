const startVideoButton = document.querySelector('.grabarvideo');
const stopVideoButton = document.querySelector('.detenervideo');
const videoElement = document.querySelector('.videopreview');


let recordedChunks = [];

// Evento clic del botón "Iniciar grabación de video"
startVideoButton.addEventListener('click', async (e) => {
  e.preventDefault();
  startVideoButton.disabled = true;
  stopVideoButton.disabled = false;

  // Pedir permiso de cámara y micrófono
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  // Mostrar la vista previa de la cámara en el elemento de video
  videoElement.srcObject = stream;
  videoElement.play();

  // Crear el objeto MediaRecorder para grabar el video
  mediaRecorder = new MediaRecorder(stream);

  // Escuchar el evento de "dataavailable" para guardar los fragmentos de video
  mediaRecorder.addEventListener('dataavailable', (e) => {
    recordedChunks.push(e.data);
  });

  // Escuchar el evento de detener la grabación
  mediaRecorder.addEventListener('stop', () => {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoURL = URL.createObjectURL(videoBlob);

    // Crea un elemento de video con los controles activados
    const videoBox = document.createElement('video');
    videoBox.classList.add('videonote', 'plyr');
    videoBox.src = videoURL;
    videoBox.controls = true;

    // Crea un contenedor para el video
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');
    videoContainer.appendChild(videoBox);

    // Agrega el contenedor de video al DOM
    const div = document.createElement('div');
    div.classList.add('message');
    div.appendChild(videoContainer);
    recordingsList.appendChild(div);

    recordedChunks = [];
    startVideoButton.disabled = false;
    stopVideoButton.disabled = true;
  });

  // Comienza la grabación de video
  mediaRecorder.start();
});

// Evento clic del botón "Detener grabación de video"
stopVideoButton.addEventListener('click', (e) => {
  e.preventDefault();
  startVideoButton.disabled = false;
  stopVideoButton.disabled = true;
  mediaRecorder.stop();
});
