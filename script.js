// Global variables
let reciters = [];
let surahs = [];
let currentReciter = null;
let tracks = [];
let currentTrack = 0;

const reciterListDiv = document.getElementById("reciterList");
const surahListDiv = document.getElementById("surahList");
const trackTitle = document.getElementById("trackTitle");
const audio = document.getElementById("audioPlayer");
const playlistUL = document.getElementById("myPlaylist");
const progress = document.getElementById("progress");
const searchBar = document.getElementById("searchBar");
const quranPlayerBar = document.getElementById("quranPlayerBar");

// Fetch reciters and surahs from Quran.com API
async function fetchData() {
  // Reciters
  const reciterRes = await fetch("https://api.quran.com/api/v4/recitations");
  const reciterData = await reciterRes.json();
  reciters = reciterData.data;

  reciters.forEach(reciter => {
    const div = document.createElement("div");
    div.className = "reciterCard";
    div.textContent = reciter.name;
    div.onclick = () => selectReciter(reciter);
    reciterListDiv.appendChild(div);
  });

  // Surahs
  const surahRes = await fetch("https://api.quran.com/api/v4/chapters");
  const surahData = await surahRes.json();
  surahs = surahData.data;
}

fetchData();

// Select reciter
function selectReciter(reciter) {
  currentReciter = reciter;
  surahListDiv.innerHTML = "";
  surahs.forEach(surah => {
    const div = document.createElement("div");
    div.className = "surahCard";
    div.textContent = `${surah.id}. ${surah.name_simple}`;
    div.onclick = () => addTrack(surah);
    surahListDiv.appendChild(div);
  });
}

// Add surah to playlist and play
function addTrack(surah) {
  if(!currentReciter) return;
  const url = `${currentReciter.audio_url}/${surah.id}.mp3`;
  tracks.push({title: `${surah.name_simple} - ${currentReciter.name}`, url});
  updatePlaylist();
  playTrack(tracks.length - 1);
}

// Update playlist display
function updatePlaylist() {
  playlistUL.innerHTML = "";
  tracks.forEach((track, idx) => {
    const li = document.createElement("li");
    li.textContent = track.title;
    li.onclick = () => playTrack(idx);
    playlistUL.appendChild(li);
  });
}

// Play selected track
function playTrack(idx) {
  currentTrack = idx;
  audio.src = tracks[idx].url;
  trackTitle.textContent = tracks[idx].title;
  audio.play();
}

// Controls
document.getElementById("playPause").onclick = () => {
  if(audio.paused){
    audio.play();
    document.getElementById("playPause").innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.pause();
    document.getElementById("playPause").innerHTML = '<i class="fas fa-play"></i>';
  }
};

document.getElementById("back10").onclick = () => audio.currentTime -= 10;
document.getElementById("forward10").onclick = () => audio.currentTime += 10;
document.getElementById("nextTrack").onclick = () => nextTrack();
document.getElementById("prevTrack").onclick = () => prevTrack();

// Next and previous track
function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  playTrack(currentTrack);
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playTrack(currentTrack);
}

// Progress bar
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
});

document.getElementById("progressContainer").addEventListener("click", (e) => {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

// Expand/collapse player
document.getElementById("expandBtn").onclick = () => {
  quranPlayerBar.classList.toggle("expanded");
  quranPlayerBar.classList.toggle("collapsed");
};

// Search functionality
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  reciterListDiv.innerHTML = "";
  surahListDiv.innerHTML = "";
  reciters.filter(r => r.name.toLowerCase().includes(query))
          .forEach(reciter => {
            const div = document.createElement("div");
            div.className = "reciterCard";
            div.textContent = reciter.name;
            div.onclick = () => selectReciter(reciter);
            reciterListDiv.appendChild(div);
          });

  surahs.filter(s => s.name_simple.toLowerCase().includes(query))
        .forEach(s => {
          const div = document.createElement("div");
          div.className = "surahCard";
          div.textContent = `${s.id}. ${s.name_simple}`;
          div.onclick = () => addTrack(s);
          surahListDiv.appendChild(div);
        });
});
