let app = {
  init: function () {
    document.getElementById("loginButton").addEventListener("click", app.comprovarLogin);

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
        if(log == "Gestor"){
          window.location.replace("iniciOficina.html");
        }
      }
    }
  },
};

document.addEventListener("DOMContentLoaded", app.init());
