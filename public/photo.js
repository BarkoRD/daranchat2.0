 // Tu código JavaScript aquí
 const capturePhotoButton = document.querySelector('.capturafoto');
 const photoElement = document.querySelector('.fotopreview');


 // Evento clic del botón "Capturar foto"
 capturePhotoButton.addEventListener('click', async (e) => {
   e.preventDefault();

   // Pedir permiso de cámara
   const stream = await navigator.mediaDevices.getUserMedia({ video: true });

   // Mostrar la vista previa de la cámara en el elemento de imagen
   const videoElement = document.createElement('video');
   videoElement.srcObject = stream;
   videoElement.play();
   videoElement.addEventListener('loadedmetadata', () => {
     const canvas = document.createElement('canvas');
     canvas.width = videoElement.videoWidth;
     canvas.height = videoElement.videoHeight;

     // Capturar una imagen fija del video en el canvas
     const context = canvas.getContext('2d');
     context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

     // Convertir el canvas en una imagen
     const photoURL = canvas.toDataURL();

     // Crear un elemento de imagen con la foto capturada
     const photoBox = document.createElement('img');
     photoBox.classList.add('photonote');
     photoBox.src = photoURL;

     // Crear un contenedor para la foto
     const photoContainer = document.createElement('div');
     photoContainer.classList.add('photo-container');
     photoContainer.appendChild(photoBox);

     // Agregar el contenedor de la foto al DOM
     const div = document.createElement('div');
     div.classList.add('message');
     div.appendChild(photoContainer);
     recordingsList.appendChild(div);

     // Detener el video y liberar la cámara
     videoElement.srcObject.getTracks().forEach(track => track.stop());
   });
 });