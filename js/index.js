let app = {
  init: function () {
    let usuaris = [
      {
        login: "Gestor",
        passworld: "Gestor",
      },
      {
        login: "Oficina",
        passworld: "Oficina",
      }
    ];

    localStorage.setItem("usuaris", JSON.stringify(usuaris));

    var storedNames = JSON.parse(localStorage.getItem("names"));

    console.log(storedNames)

    let obj = storedNames.find(o => o.login === 'Gestor');
    console.log(obj)

},
};

document.addEventListener("DOMContentLoaded", app.init());
