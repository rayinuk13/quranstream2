// Tracks - Salah Bukhatir recitations
const tracks = [
  { title: "Surah Al-Fatihah", url: "https://verses.quran.com/1_4.mp3" },
  { title: "Surah Al-Baqarah", url: "https://verses.quran.com/2_4.mp3" },
  { title: "Surah Al-Ikhlas", url: "https://verses.quran.com/112_4.mp3" }
];

const playerBar = document.getElementById("quranPlayerBar");
const expandBtn = document.getElementById("expandBtn");
const audio = document.getElementById("audioPlayer");
const trackTitle = document.getElementById("trackTitle");
const playlistItems = document.querySelectorAll("#playlist li");
const progress = document.getElementById("progress");

let currentTrack = 0;

// Expand/collapse player
expandBtn.addEventListener("click", () => {
  playerBar.classList.toggle("expanded");
  playerBar.classList.toggle("collapsed");
});

// Load track
function loadTrack(index) {
  audio.src = tracks[index].url;
  trackTitle.textContent = tracks[index].title;
  playlistItems.forEach(li => li.classList.remove("active"));
  playlistItems[index].classList.add("active");
  audio.play();
}

// Initial load
loadTrack(currentTrack);

// Play/pause
document.getElementById("playPause").addEventListener("click", () => {
  if(audio.paused) {
    audio.play();
    document.getElementById("playPause").innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.pause();
    document.getElementById("playPause").innerHTML = '<i class="fas fa-play"></i>';
  }
});

// Skip 10s
document.getElementById("forward10").addEventListener("click", () => audio.currentTime += 10);
document.getElementById("back10").addEventListener("click", () => audio.currentTime -= 10);

// Next track
document.getElementById("nextTrack").addEventListener("click", nextTrack);

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
}

// Select track from playlist
function selectTrack(index) {
  currentTrack = index;
  loadTrack(currentTrack);
}

// Update progress bar
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
});

// Click progress bar to seek
document.getElementById("progressContainer").addEventListener("click", (event) => {
  const width = event.currentTarget.clientWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Auto next track
audio.addEventListener("ended", nextTrack);
