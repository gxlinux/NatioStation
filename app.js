let musicList = [];
let publiList = [];
let musicIndex = 0;
let publiIndex = 0;

const player = document.getElementById("player");
const publiPlayer = document.getElementById("publiPlayer");

const playBtn = document.getElementById("playBtn");
const titleEl = document.getElementById("songTitle");
const genreEl = document.getElementById("songGenre");

let isPlaying = false;
let lastPlayTime = Date.now();

// Cargar JSON
async function loadData() {
    musicList = await fetch("musica.json").then(r => r.json());
    publiList = await fetch("publicidad.json").then(r => r.json());
}

function playRandomMusic() {
    let r = Math.floor(Math.random() * musicList.length);
    let song = musicList[r];

    player.src = song.song;
    titleEl.textContent = song.title;
    genreEl.textContent = song.genre;

    player.play();
    isPlaying = true;
}

function playPublicidad() {
    if (publiIndex >= publiList.length) publiIndex = 0;

    publiPlayer.src = publiList[publiIndex].song;
    publiIndex++;

    titleEl.textContent = "Publicidad";
    genreEl.textContent = "---";

    publiPlayer.play();
}

// cada 10 minutos → anuncio
setInterval(() => {
    playPublicidad();
}, 600000);

// al terminar publicidad vuelve música
publiPlayer.addEventListener("ended", () => {
    playRandomMusic();
});

// botón
playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        playRandomMusic();
    }
});

// iniciar
loadData();
