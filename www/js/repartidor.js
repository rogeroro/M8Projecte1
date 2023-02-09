var app = {
  init: function () {
    app.llistarPaquets();
    app.obtenirPosicio();

    selectors = document.querySelectorAll('.selector-entrega');
    selectors.forEach(selector => {
      selector.addEventListener('change', app.activarImatge);
    });

    document.addEventListener('click', app.ferImatgeEntrega);
  },

  obtenirPosicio: function () {
    navigator.geolocation.watchPosition(
      (position) => {
        if (marker !== null) {
          map.removeLayer(marker);
        }
        map.setView([position.coords.latitude, position.coords.longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        marker = L.marker([position.coords.latitude, position.coords.longitude], { icon: iconRepartidor }).addTo(map);
        marker.bindPopup("<h3>Estic aqui!</h3>");
      },
      (error) => {
      },
      { enableHighAccuracy: true });
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
          function (imageURI) {
            console.log(imageURI);
          },
          function (error) {
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

  llistarPaquets: function () {
    let divPaquets = document.querySelector('.llista-paquets-div');

    paquets.forEach(p => {
      let paquet = JSON.parse(p);
      let selected = "";
      let hidden = "";
      if (paquet.estat == "") selected = "selected"; 
      if (paquet.estat != "") hidden = "hidden"; 

      divPaquets.innerHTML += `<div class="row">
                                <p class="col">${paquet.nom}</p>
                                <select class="form-select col selector-entrega">
                                    <option value="1">No entregat</option>
                                    <option value="2" ${selected}>Entregat</option>
                                </select>
                                <span class="icon-camera col-2 ${hidden}"></span>
                            </div>`;
      app.afegirMarkerPaquet(paquet);
    });
  },

  afegirMarkerPaquet: function (paquet) {
    markerPaquet = L.marker(["41.639565", "1.139697"], { icon: iconPaquet }).addTo(map);
    markerPaquet.bindPopup(`<h3>${paquet.codi}</h3><p>${paquet.nom}</p>`);
  },

};

var iconPaquet = L.icon({
  iconUrl: '../img/markerPaquet.png',

  iconSize: [40, 40],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

var iconRepartidor = L.icon({
  iconUrl: '../img/markerRepartidor.png',

  iconSize: [45, 55],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

var map = L.map('mapa');
var marker = null;

var paquets = JSON.parse(localStorage.getItem("paquets"));

// document.addEventListener('deviceready', app.init, false);

document.addEventListener("DOMContentLoaded", app.init);


