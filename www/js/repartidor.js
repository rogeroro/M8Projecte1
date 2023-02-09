var app = {
  init: function () {
    app.obtenirPosicio();

    app.afegirMarkersPaquets();

    selectors = document.querySelectorAll('.selector-entrega');
    selectors.forEach(selector => {
      selector.addEventListener('change', app.activarImatge);
    });

    document.addEventListener('click', app.ferImatgeEntrega);
  },

  obtenirPosicio: function () {
    navigator.geolocation.watchPosition(
      (position) => {
        console.log(position);

        if (marker !== null) {
          map.removeLayer(marker);
        }
        map.setView([position.coords.latitude, position.coords.longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        marker = L.marker([position.coords.latitude, position.coords.longitude],{icon: iconRepartidor}).addTo(map);
        marker.bindPopup("<p>Estic aqui!</p>");
      },
      (error) => {
      },
      {enableHighAccuracy: true});
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
        Photos.photos( 
          function(imageURI) {
              console.log(imageURI);
          },
          function(error) {
              console.error("Error: " + error);
          });



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

  afegirMarkersPaquets: function() {

  }

};

var iconPaquet = L.icon({
  iconUrl: '../img/markerPaquet.png',

  iconSize:     [40, 40],
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76] 
});

var iconRepartidor = L.icon({
  iconUrl: '../img/markerRepartidor.png',

  iconSize:     [45, 55],
  iconAnchor:   [22, 94],
  popupAnchor:  [-3, -76]
});

var map = L.map('mapa');
var marker = null;

document.addEventListener('deviceready', app.init, false);

// document.addEventListener("DOMContentLoaded", app.init);


