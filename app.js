let player = document.getElementById("player");
let publiPlayer = document.getElementById("publiPlayer");
let playBtn = document.getElementById("playBtn");

// Datos cargados
let canciones = [];
let publicidad = [];

let indiceMusica = 0;
let indicePubli = 0;

let reproduciendo = false;

// Cargar música y publicidad
fetch("musica.json")
    .then(res => res.json())
    .then(data => {
        // mezclar aleatorio (shuffle)
        canciones = data.sort(() => Math.random() - 0.5);
        cargarCancion(0);
    });

fetch("publicidad.json")
    .then(res => res.json())
    .then(data => {
        publicidad = data; // esta SI va en orden
    });

// Cargar canción
function cargarCancion(i) {
    let c = canciones[i];
    player.src = "musica/" + c.song;
    document.getElementById("songTitle").textContent = c.titulo;
    document.getElementById("songGenre").textContent = c.genero;
}

// Botón Play/Pause
playBtn.addEventListener("click", () => {
    if (!reproduciendo) {
        player.play();
        reproduciendo = true;
        playBtn.textContent = "⏸";
    } else {
        player.pause();
        reproduciendo = false;
        playBtn.textContent = "▶";
    }
});

// Cuando termina una canción → pasar a otra aleatoria
player.addEventListener("ended", () => {
    indiceMusica++;
    if (indiceMusica >= canciones.length) {
        indiceMusica = 0;
    }
    cargarCancion(indiceMusica);
    player.play();
});

// Publicidad cada 10 minutos
setInterval(() => {
    let ad = publicidad[indicePubli];
    publiPlayer.src = "publicidad/" + ad.archivo;
    publiPlayer.play();

    indicePubli++;
    if (indicePubli >= publicidad.length) {
        indicePubli = 0;
    }
}, 600000); // 10 minutos
