var objPaq = {
  codi: "",
  nom: "",
  domicili: "",
  estat: "",
  onEsVaEntr: "",
  urlImg: "",
  coordenades:"" // fer un split de "/"
};

let inpCodi = document.getElementById("codi");
let inpNom = document.getElementById("nom");
let inpAdress = document.getElementById("adress");
let estatGestio;

let botoEliminar = document.getElementById("eliminarPaquet");

let app = {
  init: function () {
    app.retAltMagAdress();
    let boto = document.getElementById("gestioPaquet");
    let botoCamera = document.getElementById("basic-addon2");

    botoCamera.addEventListener("click", app.codiBarres);
    boto.addEventListener("click", app.gestioPaquet);

    document.getElementById("addPaq").addEventListener("click", function () {
      document.getElementById("effect").style.display = "block";
      boto.textContent = "Afegir paquet";
      botoEliminar.style.display = "none";
      estatGestio = "afegir";
      app.neteijarInp();

      botoEliminar.removeEventListener("click", app.eliminarPaq);
      inpCodi.removeEventListener("input", app.consultarPaq);
    });

    document.getElementById("editPaq").addEventListener("click", function () {
      document.getElementById("effect").style.display = "block";
      boto.textContent = "Editar paquet";
      estatGestio = "editar";
      botoEliminar.style.display = "inline-block";
      app.neteijarInp();

      // botoEliminar.addEventListener("click", app.eliminarPaq);
      inpCodi.addEventListener("input", app.consultarPaq);
    });
  },
  eliminarPaq: function () {
    console.log("asd");
    arrayPaq = JSON.parse(localStorage["paquets"]);
    objPaq = null;
    for (let i = 0; i < arrayPaq.length; i++) {
      if (JSON.parse(arrayPaq[i]).codi === inpCodi.value) {
        objPaq = JSON.parse(arrayPaq[i]);
        delete arrayPaq[i];
        break;
      }
    }
    arrayPaq = arrayPaq.filter((n) => n);
    localStorage.setItem("paquets", JSON.stringify(arrayPaq));
    app.neteijarInp();
  },

  consultarPaq: function () {
    arrayPaq = JSON.parse(localStorage["paquets"]);
    objPaq = null;
    for (let i = 0; i < arrayPaq.length; i++) {
      if (JSON.parse(arrayPaq[i]).codi === inpCodi.value) {
        objPaq = JSON.parse(arrayPaq[i]);
        inpNom.value = objPaq.nom;
        inpAdress.value = objPaq.domicili;
        botoEliminar.addEventListener("click", app.eliminarPaq);

        break;
      } else {
        inpNom.value = "";
        inpAdress.value = "";
      }
    }
  },

  gestioPaquet: function () {
    if (
      inpCodi.value.trim() === "" ||
      inpNom.value.trim() === "" ||
      inpAdress.value.trim() === ""
    ) {
      app.swalModal("Es obligatori ficar dades a tots els camps!");
      return;
    }

    let codi = inpCodi.value;
    let nom = inpNom.value;
    let adress = inpAdress.value;

    if (estatGestio == "editar") {
      arrayPaq = JSON.parse(localStorage["paquets"]);
      objPaq = null;
      for (let i = 0; i < arrayPaq.length; i++) {
        if (JSON.parse(arrayPaq[i]).codi === codi) {
          objPaq = JSON.parse(arrayPaq[i]);
          delete arrayPaq[i];
          break;
        }
      }
      arrayPaq = arrayPaq.filter((n) => n);

      if (objPaq !== null) {
        objPaq.nom = nom;
        objPaq.domicili = adress;
        const paqJSON = JSON.stringify(objPaq);
        arrayPaq.unshift(paqJSON);
        console.log(arrayPaq);
        localStorage.setItem("paquets", JSON.stringify(arrayPaq));
        app.neteijarInp();
        document.getElementById("effect").style.display = "none";
      } else {
        app.swalModal("El paquet no existeix!");
      }
    } else {
      objPaq.codi = codi;
      objPaq.nom = nom;
      objPaq.domicili = adress;

      const paqJSON = JSON.stringify(objPaq);

      if (localStorage.getItem("paquets") == null) {
        let arrayPaq = [];
        arrayPaq.push(paqJSON);
        localStorage.setItem("paquets", JSON.stringify(arrayPaq));
        document.getElementById("effect").style.display = "none";
      } else {
        if (app.comprDuplicPaq()) {
          let arrayPaq = JSON.parse(localStorage.getItem("paquets"));
          arrayPaq.unshift(paqJSON);
          localStorage.setItem("paquets", JSON.stringify(arrayPaq));
          app.neteijarInp();
          document.getElementById("effect").style.display = "none";
        }
      }
    }
  },
  comprDuplicPaq: function () {
    arrayPaq = JSON.parse(localStorage["paquets"]);
    console.log(arrayPaq);
    for (let i = 0; i < arrayPaq.length; i++) {
      if (JSON.parse(arrayPaq[i]).codi === inpCodi.value) {
        app.swalModal("El paquet ja existeix!");

        return false;
      }
    }
    return true;
  },

  neteijarInp: function () {
    inpCodi.value = "";
    inpNom.value = "";
    inpAdress.value = "";
  },

  swalModal: function (text) {
    Swal.fire({
      title: "Eppa!",
      text: text,
      icon: "error",
      position: "top",
      confirmButtonText: "Ok",
    });
  },

  codiBarres: function () {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        inpCodi.value = result.text;
        if (estatGestio == "editar") app.consultarPaq();
      },
      function (error) {
        alert("Scanning failed: " + error);
      }
    );
  },

  retAltMagAdress: async function () {
    let adresaBusc = "asd asd asd asd asd ";
    console.log(adresaBusc.replaceAll(" ", "%20"));

    await fetch(
      // afegir icona al input de check si retorna algo i si no retorna algo al guardar que surti que la direccio no existeix

      "https://nominatim.openstreetmap.org/search/?format=json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0]);
        if (data[0]) {
          console.log("Hi ha algo");
        } else {
          console.log("no hi ha res");
        }
      });
  },
};

document.addEventListener('deviceready', app.init, false);
// document.addEventListener("DOMContentLoaded", app.init());
