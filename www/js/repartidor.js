var app = {
  tempURL: null,
  permFolder: null,
  permFolderNativeURL: null,
  oldFile: null,
  permFile: null,

  init: function () {
    app.llistarPaquets();
    //app.obtenirPosicio();

    //app.getPermFolder();

    selectors = document.querySelectorAll('.selector-entrega');
    selectors.forEach(selector => {
      selector.addEventListener('change', app.activarImatge);
    });

    document.getElementById('btnGuardar').addEventListener('click', app.guardarCanvis);

    document.addEventListener('click', app.ferImatgeEntrega);
  },
  guardarCanvis: function () {
    localStorage.setItem('paquets', JSON.stringify(paquets));
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
  getPaquetById: async function (codiPaquet) {
    return new Promise((resolve) => {
      paquets.forEach(p => {
        p = JSON.parse(p);
        if (p.codi == codiPaquet) {
          resolve(p)
        }
      });
    })
  },

  activarImatge: async function (e) {
    let paquetSeleccionat = e.target.closest('div').id;
    console.log(await app.getPaquetById(paquetSeleccionat));
    if (e.target.value == 2) {
      e.target.nextElementSibling.classList.remove('hidden');
    } else {
      e.target.nextElementSibling.classList.add('hidden');
    }
  },
  ferImatgeEntrega: function (e) {
    if (e.target.classList.contains('icon-camera')) {
      codiPaquet = e.target.closest("div").id;
      paquets.forEach(p => {
        p = JSON.parse(p);
        if (p.codi == codiPaquet) {
          paquet = p;
        }
      });

      cameraOptions = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true
      };

      navigator.camera.getPicture((imageURI) => {
        app.tempURL = imageURI;
        app.guardarImatge(paquet);

      }, (message) => {
        console.log('Error: ' + message);
      }, cameraOptions);
    }
  },
  guardarImatge: function (paquet) {
    let fileName = paquet.codi + ".jpg";

    resolveLocalFileSystemURL(
      app.tempURL,
      entry => {
        console.log("copy" + entry.name + "to" + app.permFolderNativeURL + fileName);
        entry.copyTo(
          app.permFolder,
          fileName,
          permFile => {
            let path = permFile.nativeURL;
            paquet.urlImg = path;

            let i = 0;
            paquets.forEach(p => {
              p = JSON.parse(p);
              if (p.codi === paquet.codi) {
                paquets[i] = JSON.stringify(paquet);
              }
              i++;
            });
            localStorage.setItem("paquets", JSON.stringify(paquets));

            app.permFile = permFile;
          },
          fileErr => {
            console.warn("Copy error", fileErr);
          }
        );
      },
      err => {
        console.error(err);
      }
    );
  },

  llistarPaquets: function () {
    let divPaquets = document.querySelector('.llista-paquets-div');

    paquets.forEach(p => {
      let paquet = JSON.parse(p);

      let selected = "";
      let hidden = "hidden";
      if (paquet.estat == "entregat") selected = "selected";
      if (paquet.estat == "entregat") hidden = "";

      divPaquets.innerHTML += `<div class="row" id=${paquet.codi}>
                                <p class="col">${paquet.nom}</p>
                                <select class="form-select col selector-entrega">
                                    <option value="1">No entregat</option>
                                    <option value="2" ${selected}>Entregat</option>
                                </select>
                                <span class="icon-camera col-2 ${hidden}"></span>
                            </div>`;
      //app.afegirMarkerPaquet(paquet);
    });
  },

  afegirMarkerPaquet: function (paquet) {
    let coordenades = paquet.coordenades.split('/');
    markerPaquet = L.marker([coordenades[0], coordenades[1]], { icon: iconPaquet }).addTo(map);
    markerPaquet.bindPopup(`<h3>${paquet.codi}</h3><p>${paquet.nom}</p>`);
  },
  getPermFolder: function () {
    let path = cordova.file.dataDirectory;
    resolveLocalFileSystemURL(
      path,
      dirEntry => {
        dirEntry.getDirectory(
          "images",
          { create: true },
          permDir => {
            app.permFolder = permDir;
            app.permFolderNativeURL = permDir.nativeURL;
          },
          err => {
            console.warn("failed to create or open permanent image dir");
          }
        );
      },
      err => {
        console.warn("We should not be getting an error yet");
      }
    );
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

/*img = document.getElementById('imatge');
urlImatge = JSON.parse(paquets[0]).urlImg;
console.log(urlImatge);
img.src = urlImatge;*/

// document.addEventListener('deviceready', app.init, false);

document.addEventListener("DOMContentLoaded", app.init);
