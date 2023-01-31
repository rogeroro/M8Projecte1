var app = {
  init: function () {
    app.obtenirPosicio();

    selectors = document.querySelectorAll('.selector-entrega');
    selectors.forEach(selector => {
      selector.addEventListener('change', app.activarImatge);
    });

    document.addEventListener('click', app.ferImatgeEntrega);
  },

  obtenirPosicio: function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        var map = L.map('mapa').setView([position.coords.latitude, position.coords.longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
      },
      (error) => {
      },
      { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  },

  activarImatge: function (e) {
    if (e.target.value == 2) {
      e.target.nextElementSibling.classList.remove('hidden');
    } else {
      e.target.nextElementSibling.classList.add('hidden');
    }
  },
  ferImatgeEntrega: function (e) {
    if (e.target.classList.contains('icon-camera')) {
      cameraOptions = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true
      };

      navigator.camera.getPicture((imageURI) => {
        var thisResult = JSON.parse(imageURI); 
        var metadata = JSON.parse(thisResult.json_metadata);

        var image = document.getElementById('imatge');
        image.src = thisResult.filename;
        console.log(metadata);
        console.log('Lat: ' + metadata.gpsLatitude + ' Lon: ' + metadata.gpsLongitude);

        /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
 
           console.log('file system open: ' + fs.name); 
           fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
       
               console.log("fileEntry is file?" + fileEntry.isFile.toString());
               // fileEntry.name == 'someFile.txt'
               // fileEntry.fullPath == '/someFile.txt'
               // writeFile(fileEntry, null);
       
           }, (onErrorCreateFile)=> {
             console.log('error: ' + onErrorCreateFile);
           });
       
       }, (onErrorLoadFs)=> {
         console.log('ERROR: ' + onErrorLoadFs);
       });*/

      }, (message) => {
        console.log('Error: ' + message);
      }, cameraOptions);
    }
  },

};

document.addEventListener('deviceready', app.init, false);

// document.addEventListener("DOMContentLoaded", app.init);


