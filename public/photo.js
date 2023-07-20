const capturePhotoButton = document.querySelector('.capturafoto');

capturePhotoButton.addEventListener('click', async (e) => {
  e.preventDefault();

  // Pedir permiso de cámara
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });

  // Mostrar la vista previa de la cámara en el elemento de video
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.play();

  // Obtener la pista de video para usar con la API ImageCapture
  const track = stream.getVideoTracks()[0];
  
  const imageCapture = new ImageCapture(track);
  

  // Capturar una foto fija del video utilizando ImageCapture
  const photoBlob = await imageCapture.takePhoto();

  let clientId = localStorage.getItem('clientId');

  const sendPhoto = (photo, owner, id) => {
    socket.emit('client:newphoto', {
      photo,
      owner,
      id
    })
  }
  sendPhoto(photoBlob,'elpepe',clientId)
  
  // Detener el video y liberar la cámara
  track.stop();
});


socket.on('server:newphoto', photo =>{
  // Convertir el blob de la foto en una URL de objeto
  const photoBlob = new Blob([photo.photo], { type: 'image/jpeg' });
  const photoURL = URL.createObjectURL(photoBlob);

  // Crear un elemento de imagen con la foto capturada
  const photoBox = document.createElement('img');
  photoBox.classList.add('photonote');
  photoBox.src = photoURL;

  // Crear un contenedor para la foto
  const photoContainer = document.createElement('div');
  photoContainer.classList.add('photo-container');
  photoContainer.appendChild(photoBox);

  appendPhoto(photoContainer,photo.owner,photo.id)

})

const appendPhoto = (photo,id,owner) => {
  let clientId = localStorage.getItem('clientId');
  const photomessage = document.createElement('div');
  const div = document.createElement('div');
  const ownername = document.createElement('div');
  div.classList.add('message');
 
  ownername.innerHTML = `${owner}`

  
  if (id !== clientId) {
    ownername.classList.add('messageowner');
    photomessage.appendChild(photo);
    photomessage.classList.add('aphotonote')
    div.appendChild(ownername)
    div.appendChild(photomessage)


  } else {

    ownername.classList.add('yourname');

    photomessage.classList.add('your')
    photomessage.appendChild(photo);
    div.appendChild(ownername)
    div.appendChild(photomessage)


  }
  recordingsList.appendChild(div);
};