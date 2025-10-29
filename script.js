// Playlist array
const tracks = [
  {src: 'audio/song1.mp3', title: 'River Walk', artist: 'Instrumental'},
  {src: 'audio/song2.mp3', title: 'Morning Ride', artist: 'Lo-Fi Beats'},
  {src: 'audio/song3.mp3', title: 'City Lights', artist: 'Electronica'}
];

const audio = document.getElementById('audio');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const seek = document.getElementById('seek');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const rewBtn = document.getElementById('rew');
const fwdBtn = document.getElementById('fwd');
const volume = document.getElementById('volume');
const plList = document.getElementById('pl-list');
const countEl = document.getElementById('count');
const autoplayToggle = document.getElementById('autoplay');

let currentIndex = 0;
let isPlaying = false;
let autoplay = false;

// Build playlist
function buildPlaylist() {
  plList.innerHTML = '';
  tracks.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'pl-item';
    item.dataset.index = i;
    item.textContent = `${t.title} - ${t.artist}`;
    item.addEventListener('click', () => {
      loadTrack(i);
      playAudio();
    });
    plList.appendChild(item);
  });
  countEl.textContent = tracks.length;
  highlightPlaying();
}
function highlightPlaying() {
  document.querySelectorAll('.pl-item').forEach(el => el.classList.remove('active'));
  const cur = document.querySelector(`.pl-item[data-index="${currentIndex}"]`);
  if (cur) cur.classList.add('active');
}

// Load track
function loadTrack(index) {
  if (index < 0) index = tracks.length - 1;
  if (index >= tracks.length) index = 0;
  currentIndex = index;
  const t = tracks[currentIndex];
  audio.src = t.src;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  coverEl.textContent = '♪';
  audio.load();
  highlightPlaying();
}

// Format time
function fmt(s) {
  if (isNaN(s)) return '0:00';
  s = Math.floor(s);
  const m = Math.floor(s / 60);
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// Controls
function playAudio() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = '❚❚';
}
function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶';
}

playBtn.addEventListener('click', () => {
  isPlaying ? pauseAudio() : playAudio();
});
prevBtn.addEventListener('click', () => { loadTrack(currentIndex - 1); playAudio(); });
nextBtn.addEventListener('click', () => { loadTrack(currentIndex + 1); playAudio(); });
rewBtn.addEventListener('click', () => { audio.currentTime -= 10; });
fwdBtn.addEventListener('click', () => { audio.currentTime += 10; });

seek.addEventListener('input', () => { audio.currentTime = seek.value; });
audio.addEventListener('timeupdate', () => {
  seek.max = audio.duration || 0;
  seek.value = audio.currentTime || 0;
  currentEl.textContent = fmt(audio.currentTime);
  durationEl.textContent = fmt(audio.duration);
});
audio.addEventListener('ended', () => {
  if (autoplay) { loadTrack(currentIndex + 1); playAudio(); }
  else pauseAudio();
});

volume.addEventListener('input', () => { audio.volume = volume.value; });

autoplayToggle.addEventListener('click', () => {
  autoplay = !autoplay;
  autoplayToggle.classList.toggle('on', autoplay);
});

// Init
buildPlaylist();
loadTrack(0);
audio.volume = volume.value;
