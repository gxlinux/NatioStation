let musicList = [];
let adsList = [];
let currentSong = 0;

const player = document.getElementById("audioPlayer");
const title = document.getElementById("song-title");
const author = document.getElementById("song-author");
const statusMsg = document.getElementById("statusMsg");

// Cargar JSON de música
async function loadMusic() {
    const res = await fetch("musica.json");
    musicList = await res.json();
}

// Cargar JSON de publicidad
async function loadAds() {
    const res = await fetch("publicidad.json");
    adsList = await res.json();
}

// Reproducir canción
function playSong(index) {
    const song = musicList[index];
    title.textContent = song.titulo;
    author.textContent = song.autor;
    player.src = song.song;
    player.play();
    statusMsg.textContent = "Reproduciendo música...";
}

// Reproducir publicidad aleatoria
function playRandomAd() {
    const ad = adsList[Math.floor(Math.random() * adsList.length)];
    statusMsg.textContent = "Publicidad...";
    player.src = ad.song;
    player.play();
}

// Ciclo de música → publicidad cada 10 minutos
function scheduleAds() {
    setInterval(() => {
        playRandomAd();

        player.onended = () => {
            playSong(currentSong);
        };

    }, 10 * 60 * 1000);
}

// Continuar con la siguiente canción
player.onended = () => {
    currentSong = (currentSong + 1) % musicList.length;
    playSong(currentSong);
};

// Iniciar todo
(async () => {
    await loadMusic();
    await loadAds();
    playSong(0);
    scheduleAds();
})();
