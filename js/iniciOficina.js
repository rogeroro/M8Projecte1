var objPaq = {
  codi: "",
  nom: "",
  domicili: "",
  estat: "",
  onEsVaEntr: "",
  urlImg: "",
};

let inpCodi = document.getElementById("codi");
let inpNom = document.getElementById("nom");
let inpAdress = document.getElementById("adress");

let estatGestio;

let app = {
  init: function () {
    document
      .getElementById("gestioPaquet")
      .addEventListener("click", app.gestioPaquet);

    document.getElementById("addPaq").addEventListener("click", function () {
      document.getElementById("effect").classList.add("effect-active");

      estatGestio = "afegir";
    });

    document.getElementById("editPaq").addEventListener("click", function () {
      document.getElementById("effect").classList.add("effect-active");
      estatGestio = "editar";
    });
  },

  gestioPaquet: function () {
    let codi = inpCodi.value;
    let nom = inpNom.value;
    let adress = inpAdress.value;

    if (estatGestio == "editar") {
      arrayPaq = JSON.parse(localStorage["paquets"]);
      console.log(arrayPaq);
      objPaq = null;
      for (let i = 0; i < arrayPaq.length; i++) {
        if (JSON.parse(arrayPaq[i]).codi == codi) {
          objPaq = JSON.parse(arrayPaq[i]);
          delete arrayPaq[i]
          console.log(arrayPaq)
          break
        }
      }

      if (objPaq !== null) {
        console.log("Guardar");
        

      }

    } else {
      objPaq.codi = codi;
      objPaq.nom = nom;
      objPaq.adress = adress;

      const paqJSON = JSON.stringify(objPaq);

      if (localStorage.getItem("paquets") == null) {
        arrayPaq.push(paqJSON);
        localStorage.setItem("paquets", JSON.stringify(arrayPaq));
      } else {
        let arrayPaq = JSON.parse(localStorage.getItem("paquets"));
        arrayPaq.unshift(paqJSON);
        localStorage.setItem("paquets", JSON.stringify(arrayPaq));
      }
    }
  },
};
document.addEventListener("DOMContentLoaded", app.init());
