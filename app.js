// APP.JS - Natio Station (corregido)
// Requisitos: musica.json y publicidad.json sin modificar.

const player = document.getElementById("player");
const publiPlayer = document.getElementById("publiPlayer");
const playBtn = document.getElementById("playBtn");

let canciones = [];      // lista de canciones (mezclada)
let publicidad = [];     // lista de anuncios (en orden)
let indiceMusica = 0;    // índice actual en canciones (tras shuffle)
let indicePubli = 0;     // índice actual en publicidad (secuencial)
let reproduciendo = false;

// Util: leer ruta desde distintos nombres de campo
function rutaDesde(obj) {
  return obj.song || obj.file || obj.archivo || obj.path || "";
}

// Util: leer genero (multilenguaje)
function generoDesde(obj) {
  return obj.genero || obj.genre || obj.tipo || "";
}

// Fisher-Yates shuffle (seguro)
function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Cargar música (shuffle)
fetch("musica.json")
  .then(res => {
    if (!res.ok) throw new Error("Error cargando musica.json: " + res.status);
    return res.json();
  })
  .then(data => {
    // mantén el objeto tal cual y mezcla el orden
    canciones = shuffleArray(data);
    indiceMusica = 0;
    if (canciones.length > 0) cargarCancion(indiceMusica);
  })
  .catch(err => {
    console.error(err);
    document.getElementById("songTitle").textContent = "Error cargando musica.json";
  });

// Cargar publicidad (SECUENCIAL, NO mezclada)
fetch("publicidad.json")
  .then(res => {
    if (!res.ok) throw new Error("Error cargando publicidad.json: " + res.status);
    return res.json();
  })
  .then(data => {
    publicidad = data.slice(); // conservar orden
    indicePubli = 0;
  })
  .catch(err => {
    console.error(err);
  });

// Cargar canción desde el objeto en canciones[i]
function cargarCancion(i) {
  const c = canciones[i];
  if (!c) return;
  const ruta = rutaDesde(c);
  // usar la ruta tal como viene en JSON (no anteponer)
  player.src = ruta;
  document.getElementById("songTitle").textContent = c.titulo || c.title || "Untitled";
  document.getElementById("songGenre").textContent = generoDesde(c) || "---";
}

// Play / Pause
playBtn.addEventListener("click", () => {
  if (!canciones.length) return;
  if (!reproduciendo) {
    player.play().catch(e => console.warn("Play fallo:", e));
    reproduciendo = true;
    playBtn.textContent = "⏸";
  } else {
    player.pause();
    reproduciendo = false;
    playBtn.textContent = "▶";
  }
});

// Cuando termina la canción -> siguiente pista (aleatoria ya que lista está mezclada)
player.addEventListener("ended", () => {
  if (!canciones.length) return;
  indiceMusica = (indiceMusica + 1) % canciones.length;
  cargarCancion(indiceMusica);
  // reanudar reproducción automáticamente
  player.play().catch(e => console.warn("No se pudo reanudar:", e));
});

// Publicidad cada 10 minutos (600000 ms) — en orden secuencial
// Pausa la canción principal, reproduce el anuncio, y luego reanuda si estaba en reproducción.
const AD_INTERVAL_MS = 10 * 60 * 1000;
let adInterval = null;

function playNextAd() {
  if (!publicidad.length) return;
  const ad = publicidad[indicePubli];
  const adRuta = rutaDesde(ad);
  if (!adRuta) {
    // avanzar índice en caso de falta de ruta
    indicePubli = (indicePubli + 1) % publicidad.length;
    return;
  }

  const wasPlaying = !player.paused && !player.ended;
  const previousTime = player.currentTime;
  const prevSrc = player.src;

  // pause main
  try { player.pause(); } catch(e){}

  publiPlayer.src = adRuta;
  publiPlayer.play().catch(e => {
    console.warn("No se pudo reproducir publicidad:", e);
    // si falla, intentar reanudar la música
    if (wasPlaying) {
      // reanudar la canción actual en su posición
      if (prevSrc) {
        player.src = prevSrc;
      }
      player.currentTime = previousTime || 0;
      player.play().catch(()=>{});
    }
  });

  // al terminar el anuncio, reanudar música si estaba reproduciéndose antes
  publiPlayer.onended = () => {
    // restaurar el estado del player
    if (prevSrc) {
      // si el player.src fue reemplazado por otra cosa, volvemos a la canción actual
      // Nota: normalmente player.src no se cambia aquí porque usamos publiPlayer separado
      // pero dejamos esto por seguridad
      player.src = prevSrc;
    }
    player.currentTime = previousTime || 0;
    if (wasPlaying) {
      setTimeout(()=> player.play().catch(()=>{}), 150);
      reproduciendo = true;
      playBtn.textContent = "⏸";
    } else {
      reproduciendo = false;
      playBtn.textContent = "▶";
    }
    // limpiar handler
    publiPlayer.onended = null;
  };

  // avanzar índice secuencial
  indicePubli++;
  if (indicePubli >= publicityLength()) indicePubli = 0;
}

function publicityLength() {
  return publicidad ? publicity.length : 0;
}

// iniciar intervalo de publicidad (si hay anuncios)
function startAdLoop() {
  if (adInterval) clearInterval(adInterval);
  // iniciar la primera publicidad tras AD_INTERVAL_MS (no inmediata)
  adInterval = setInterval(() => {
    playNextAd();
  }, AD_INTERVAL_MS);
}

// si publicidad ya cargada y música también, empezar loop
// pero startAdLoop puede llamarse aunque publicidad se cargue después; así que arrancamos siempre
startAdLoop();

// Si quieres reproducir un anuncio de inmediato para prueba, descomenta:
// setTimeout(playNextAd, 2000);

