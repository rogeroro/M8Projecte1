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
        console.log('foto [^*]');
      }
      
    }
    
  }; 
  
  // document.addEventListener('deviceready', app.init, false);
  
document.addEventListener("DOMContentLoaded", app.init);
  