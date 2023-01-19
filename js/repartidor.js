var app = {
    init: function () {
        app.obtenirPosicio();
    },
  
    obtenirPosicio: function () {
      var dades = document.getElementById("dades");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dades.innerHTML =
            `<p>Latitud: ${position.coords.latitude}</p>
                            <p>Longitud: ${position.coords.longitude}</p>
                            <p>Altitud: ${position.coords.altitude}</p>`;
  
          var map = L.map('mapa').setView([position.coords.latitude, position.coords.longitude], 18);
  
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);
          var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        },
        (error) => {
          dades.innerHTML =
            `<p>Codi: ${error.code}</p>
                          <p>Error: ${error.message}</p>`;
        },
        { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  
  
    },
  };
  
  
  // document.addEventListener('deviceready', app.init, false);
  
  document.addEventListener("DOMContentLoaded", app.init);
  