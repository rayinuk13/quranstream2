let reciters = [], surahs = [], currentReciter = null;
let tracks = [], currentTrack = 0;

const reciterListDiv = document.getElementById("reciterList");
const surahListDiv = document.getElementById("surahList");
const trackTitle = document.getElementById("trackTitle");
const audio = document.getElementById("audioPlayer");
const playlistUL = document.getElementById("myPlaylist");
const progress = document.getElementById("progress");
const searchBar = document.getElementById("searchBar");
const quranPlayerBar = document.getElementById("quranPlayerBar");

// Fetch reciters and surahs
async function fetchData() {
  const reciterRes = await fetch("https://api.quran.com/api/v4/recitations");
  reciters = (await reciterRes.json()).data;
  reciters.forEach(r => {
    const div = document.createElement("div");
    div.className = "reciterCard";
    div.textContent = r.name;
    div.onclick = () => selectReciter(r);
    reciterListDiv.appendChild(div);
  });

  const surahRes = await fetch("https://api.quran.com/api/v4/chapters");
  surahs = (await surahRes.json()).data;
}

fetchData();

function selectReciter(reciter) {
  currentReciter = reciter;
  surahListDiv.innerHTML = "";
  surahs.forEach(s => {
    const div = document.createElement("div");
    div.className = "surahCard";
    div.textContent = `${s.id}. ${s.name_simple}`;
    div.onclick = () => addTrack(s);
    surahListDiv.appendChild(div);
  });
}

function addTrack(surah) {
  if(!currentReciter) return;
  const url = `${currentReciter.audio_url}/${surah.id}.mp3`;
  tracks.push({title:`${surah.name_simple} - ${currentReciter.name}`, url});
  updatePlaylist();
  playTrack(tracks.length - 1);
}

function updatePlaylist() {
  playlistUL.innerHTML = "";
  tracks.forEach((t, idx) => {
    const li = document.createElement("li");
    li.textContent = t.title;
    li.onclick = () => playTrack(idx);
    playlistUL.appendChild(li);
  });
}

function playTrack(idx) {
  currentTrack = idx;
  audio.src = tracks[idx].url;
  trackTitle.textContent = tracks[idx].title;
  audio.play();
}

// Controls
document.getElementById("playPause").onclick = () => {
  if(audio.paused){ audio.play(); document.getElementById("playPause").innerHTML = '<i class="fas fa-pause"></i>'; }
  else{ audio.pause(); document.getElementById("playPause").innerHTML = '<i class="fas fa-play"></i>'; }
};
document.getElementById("back10").onclick = () => audio.currentTime -=10;
document.getElementById("forward10").onclick = () => audio.currentTime +=10;
document.getElementById("nextTrack").onclick = () => nextTrack();
document.getElementById("prevTrack").onclick = () => prevTrack();

function nextTrack(){ currentTrack=(currentTrack+1)%tracks.length; playTrack(currentTrack); }
function prevTrack(){ currentTrack=(currentTrack-1+tracks.length)%tracks.length; playTrack(currentTrack); }

// Progress bar
audio.addEventListener("timeupdate",()=>{ progress.style.width=(audio.currentTime/audio.duration)*100+"%"; });
document.getElementById("progressContainer").addEventListener("click", e=>{ audio.currentTime=(e.offsetX/e.currentTarget.clientWidth)*audio.duration; });

// Expand player
document.getElementById("expandBtn").onclick = ()=>{ quranPlayerBar.classList.toggle("expanded"); quranPlayerBar.classList.toggle("collapsed"); };

// Search bar
searchBar.addEventListener("input", e=>{
  const query = e.target.value.toLowerCase();
  reciterListDiv.innerHTML=""; surahListDiv.innerHTML="";
  reciters.filter(r=>r.name.toLowerCase().includes(query)).forEach(r=>{
    const div=document.createElement("div"); div.className="reciterCard"; div.textContent=r.name; div.onclick=()=>selectReciter(r); reciterListDiv.appendChild(div);
  });
  surahs.filter(s=>s.name_simple.toLowerCase().includes(query)).forEach(s=>{
    const div=document.createElement("div"); div.className="surahCard"; div.textContent=`${s.id}. ${s.name_simple}`; div.onclick=()=>addTrack(s); surahListDiv.appendChild(div);
  });
});
