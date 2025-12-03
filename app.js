const player = document.getElementById("player");
const btnPlay = document.getElementById("btnPlay");
const titleEl = document.getElementById("title");
const generoEl = document.getElementById("genero");

let musica = [];
let publicidad = [];
let currentSong = null;
let isPlaying = false;

// ---------------------------
// Cargar música
// ---------------------------
fetch("musica.json")
  .then(res => res.json())
  .then(data => {
    musica = data;
    loadRandomSong();
  })
  .catch(err => console.error("Error cargando musica.json:", err));

// ---------------------------
// Cargar publicidad
// ---------------------------
fetch("publicidad.json")
  .then(res => res.json())
  .then(data => {
    publicidad = data;
  })
  .catch(err => console.error("Error cargando publicidad.json:", err));


// ---------------------------
// Reproducir canción aleatoria
// ---------------------------
function loadRandomSong() {
    if (musica.length === 0) return;

    const randomIndex = Math.floor(Math.random() * musica.length);
    currentSong = musica[randomIndex];

    // 🚨 RUTA CORRECTA para GitHub / Neocities
    player.src = "musica/" + currentSong.song;

    titleEl.textContent = currentSong.titulo;
    generoEl.textContent = currentSong.genero ? currentSong.genero : "Sin género";

    playAudio();
}

// ---------------------------
// Reproducir publicidad en orden
// ---------------------------
let pubIndex = 0;

function reproducirPublicidad() {
    if (publicidad.length === 0) return;

    const anuncio = publicidad[pubIndex];
    pubIndex = (pubIndex + 1) % publicidad.length;

    player.src = "publicidad/" + anuncio.song;
    titleEl.textContent = anuncio.titulo;
    generoEl.textContent = "Publicidad";

    playAudio();
    player.onended = () => loadRandomSong();  // vuelve a la música
}

// ---------------------------
// Reproducción
// ---------------------------
function playAudio() {
    player.play()
        .then(() => {
            btnPlay.textContent = "⏸";
            isPlaying = true;
        })
        .catch(err => {
            console.error("No se pudo reproducir:", err);
        });
}

function pauseAudio() {
    player.pause();
    btnPlay.textContent = "▶";
    isPlaying = false;
}


// ---------------------------
// Botón Play/Pause
// ---------------------------
btnPlay.addEventListener("click", () => {
    if (isPlaying) pauseAudio();
    else playAudio();
});

// ---------------------------
// Cada 10 minutos → Publicidad
// ---------------------------
setInterval(() => {
    reproducirPublicidad();
}, 10 * 60 * 1000);
