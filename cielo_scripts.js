const cielo = document.getElementById("cielo");

const btnUbi = document.getElementById("btnUbi");
const btnActualizar = document.getElementById("btnActualizar");

let ubi = document.getElementById("ubi");

const sun = document.getElementById("sun");

const moon = document.getElementById("moon");

const datosSol = document.getElementById("datosSol");
const datosLuna = document.getElementById("datosLuna");

const fotoTaiga = document.querySelector("#sun .fotoGata");
const fotoSora = document.querySelector("#moon .fotoGata");

const Taiga = `<img src="img/taiga.jpg" alt="foto de Taiga, la gata más bonita del universo"`;

const Sora = `<img src="img/sora.jpg" alt="foto de Sora, la gata más loca del universo">`;

function obtenerUbicacion() {
  navigator.geolocation.getCurrentPosition((posicion) => {
    // console.log("Tengo la ubicación");

    const lat = posicion.coords.latitude;
    const lon = posicion.coords.longitude;

    let aqui = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    fetch(aqui)
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((datos) => {
        ubi.innerHTML = `Estás en: ${datos.address.city}`;
      });

    const dia = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&hourly=temperature_2m&current=is_day,weather_code,temperature_2m,cloud_cover`;

    fetch(dia)
      .then((respuestaDia) => {
        return respuestaDia.json();
      })

      .then((datosDia) => {
        let temp = Math.round(datosDia.current.temperature_2m);
        let nub = datosDia.current.cloud_cover;
        let dn = datosDia.current.is_day;
        console.log(dn);
        let dianoche;
        if (dn === 1) {
          dianoche = "día";
        } else {
          dianoche = "noche";
        }
        const templateDia = `
           <p>Temperatura: ${temp}ºC</p>
           <p>Nubosidad: ${nub}%</p>
           <p>Es de ${dianoche}</p>
        `;
        datosSol.innerHTML = templateDia;
        cielo.classList.add("cieloActivo");
      });

    const noche = `https://www.cyclecalcs.com/v2/moon?at=2026-07-27T21:00:00Z&lat=${lat}&lon=${lon}&tz=Europe/London`;
    fetch(noche)
      .then((respuestaNoche) => {
        return respuestaNoche.json();
      })

      .then((datosNoche) => {
        let ico = datosNoche.data.phase.emoji;
        let fase = datosNoche.data.phase.name;
        let ilu = datosNoche.data.phase.illumination_percent;
        switch (fase) {
          case "New Moon":
            fase = "Luna Nueva";
            break;

          case "Waxing Crescent":
            fase = "Luna Creciente";
            break;

          case "First Quarter":
            fase = "Cuarto Creciente";
            break;

          case "Waxing Gibbous":
            fase = "Gibosa Creciente";
            break;

          case "Full Moon":
            fase = "Luna Llena";
            break;

          case "Waning Gibbous":
            fase = "Gibosa Menguante";
            break;

          case "Third Quarter":
            fase = "Cuarto Menguante";
            break;

          case "Waning Crescent":
            fase = "Luna Menguante";
            break;
        }

        const templateNoche = `
          <p>Fase Lunar: ${fase}</p>
          <p>Iluminación: ${ilu}%</p>
          <p>${ico}</p>
        `;
        datosLuna.innerHTML = templateNoche;
        cielo.classList.add("cieloActivo");
      });
  });
}

btnUbi.addEventListener("click", () => {
  // console.log("He pulsado el botón");
  btnUbi.style.display = "none";
  btnActualizar.style.display = "block";
  datosSol.style.display = "block";
  datosLuna.style.display = "block";

  fotoTaiga.style.display = "none";
  fotoSora.style.display = "none";
  
  obtenerUbicacion();
});

btnActualizar.addEventListener("click", () => {
  datosSol.style.display = "none";
  datosLuna.style.display = "none";

  fotoTaiga.style.display = "block";
  fotoSora.style.display = "block";

  ubi.innerHTML = `¡MIAU!`;

  btnActualizar.style.display = "none";
  btnUbi.style.display = "block";
});
