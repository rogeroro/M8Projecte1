let app = {
  init: function () {
    document.getElementById("loginButton").addEventListener("click", app.comprovarLogin);
    // window.location.replace("iniciOficina.html");
    console.log(document.getElementById("loginButton"));
    let usuaris = [
      {
        login: "Gestor",
        passworld: "Gestor",
      },
      {
        login: "Oficina",
        passworld: "Oficina",
      },
      {
        login: "Repartidor",
        passworld: "Repartidor",
      },
    ];
    localStorage.setItem("usuaris", JSON.stringify(usuaris));
  },

  comprovarLogin: function () {
    var log = document.getElementById("inputLogin").value;
    var pass = document.getElementById("inputPassword").value;
    var users = JSON.parse(localStorage.getItem("usuaris"));

    let obj = users.find((o) => o.login === log);
    if(obj){
      if(obj.passworld == pass){
        if(log == "Oficina"){
          window.location.replace("iniciOficina.html");
        }else if(log == "Repartidor"){
          window.location.replace("iniciRepartidor.html");
        }
      }
    }
  },
};

document.addEventListener('deviceready', app.init, false);
// document.addEventListener("DOMContentLoaded", app.init);
