let musica = [];
let publicidad = [];
let player = document.getElementById("player");
let publiPlayer = document.getElementById("publiPlayer");

let playBtn = document.getElementById("playBtn");
let titleEl = document.getElementById("songTitle");
let genreEl = document.getElementById("songGenre");

let currentMusic = null;
let currentPubli = 0;
let modoPublicidad = false;

async function cargarDatos() {
    musica = await fetch("musica.json").then(r => r.json());
    publicidad = await fetch("publicidad.json").then(r => r.json());
    cargarMusicaAleatoria();
}

function cargarMusicaAleatoria() {
    modoPublicidad = false;

    currentMusic = musica[Math.floor(Math.random() * musica.length)];

    player.src = currentMusic.song;
    titleEl.textContent = obtenerNombre(currentMusic.song);
    genreEl.textContent = currentMusic.genero;

    player.play();
}

function reproducirPublicidad() {
    modoPublicidad = true;

    let item = publicidad[currentPubli];
    publiPlayer.src = item.song;

    currentPubli++;
    if (currentPubli >= publicidad.length) currentPubli = 0;

    publiPlayer.play();
}

function obtenerNombre(ruta) {
    return ruta.split("/").pop().replace(".mp3", "");
}

playBtn.onclick = () => player.paused ? player.play() : player.pause();

player.onended = () => reproducirPublicidad();
publiPlayer.onended = () => cargarMusicaAleatoria();

cargarDatos();
