var app = {
  tempURL: null,
  permFolder: null,
  permFolderNativeURL: null,
  oldFile: null,
  permFile: null,

  init: function () {
    app.obtenirPosicio();
    app.llistarPaquets();

    app.getPermFolder();

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
    console.log("OBTENIR");
    map = L.map('mapa', {zoomControl: false});
    marker = null;
    navigator.geolocation.watchPosition(
      (position) => {
        app.borrarMarker(marker, map);
        map.setView([position.coords.latitude, position.coords.longitude], 18);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        marker = L.marker([position.coords.latitude, position.coords.longitude], { icon: iconRepartidor }).addTo(map);
        marker.bindPopup("<h3>Estic aqui!</h3>");
      },
      (error) => {
        console.log(error);
      });
  },

  borrarMarker: function(marker, map) {
    console.log(marker);
    if (marker != null) {
      map.removeLayer(marker);
      console.log("borrar");
    }
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
    let paquet = await app.getPaquetById(paquetSeleccionat);
    let estat = "";
    console.log(e.target.value);
    if (e.target.value == 2) {
      e.target.nextElementSibling.classList.remove('hidden');
      estat = "entregat";
      
    } else {
      e.target.nextElementSibling.classList.add('hidden');
      estat = "no entregat";
    }

    let i = 0;
    paquets.forEach(p => {
      p = JSON.parse(p);
      if (p.codi === paquet.codi) {
        paquet.estat = estat;
        paquets[i] = JSON.stringify(paquet);
      }
      i++;
    });

    
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        paquet.onEsVaEntr = position.coords.latitude + "/" + position.coords.longitude;
        console.log(paquet.onEsVaEntr);
        let i = 0;
        paquets.forEach(p => {
          p = JSON.parse(p);
          if (p.codi === paquet.codi) {
            paquets[i] = JSON.stringify(paquet);
          }
          i++;
        });
        app.guardarCanvis;
        
      },
      (error) => {
      },
      { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

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
    if (paquets != null) {
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
      app.afegirMarkerPaquet(paquet);
    });
    }
  },

  afegirMarkerPaquet: function (paquet) {
    let coordenades = paquet.coordenades.split('/');
    markerPaquet = L.marker(["41", "1"], { icon: iconPaquet }).addTo(map);
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
            console.warn("Error al crear el directori");
          }
        );
      },
      err => {
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

var paquets = JSON.parse(localStorage.getItem("paquets"));

document.addEventListener('deviceready', app.init, false);

// document.addEventListener("DOMContentLoaded", app.init);
