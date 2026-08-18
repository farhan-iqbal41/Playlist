const playlistData = [
    {
        id: 1,
        title: "Laitani Fi Syurbil Hamami",
        artist: "Mohammad Abdul Jabbar",
        duration: 92,
        url: "nasheeds/Laitani Fi Syurbil Hamami.mp3",
        image: "https://dk2dv4ezy246u.cloudfront.net/widgets/sSlVJrGPNPt_large.jpg"
    },
    {
        id: 2,
        title: "Muhammad Nabina",
        artist: "Hamada Helal",
        duration: 285,
        url: "nasheeds/Muhammad Nabina.mp3",
        image: "https://skyryedesign.com/wp-content/uploads/2025/04/c6cbf3bea6df7a1caf758e7623cba866-503x1024.jpg"
    },
    {
        id: 3,
        title: "Sukran Laka Rabbi",
        artist: "Ahmed Bukhatir",
        duration: 273,
        url: "nasheeds/Sukran Laka Rabbi.mp3",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjnxbw0gaoXn2qwReWzDqtsEjriRzo6yzyzlyoo9X63WeLlf4sATSEILUe&s=10"
    },
    {
        id: 4,
        title: "The Beauty of Existence",
        artist: "Hamoud Al Qahtani",
        duration: 260,
        url: "nasheeds/The Beauty of Existence.mp3",
        image: "https://themoodguide.com/wp-content/uploads/2024/03/beach-shore-free-hd-aesthetic-wallpaper.jpg"
    },
    {
        id: 5,
        title: "Bika Moulhimi",
        artist: "Mahir Zain",
        duration: 281,
        url: "nasheeds/Bika Moulhimi.mp3",
        image: "https://i.pinimg.com/236x/82/10/e2/8210e2e0e547ef2bec0445be09f9c451.jpg"
    },
    {
        id: 6,
        title: "Asmoo",
        artist: "Abdul Raziq",
        duration: 267,
        url: "nasheeds/Asmoo.mp3",
        image: "https://images.unsplash.com/photo-1679062015409-46e928a0b1ab?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxfHx8ZW58MHx8fHx8"
    }
];

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumImage = document.getElementById('albumImage');
const albumArt = document.getElementById('albumArt');
const playlistEl = document.getElementById('playlist');
const playlistSidebar = document.getElementById('playlistSidebar');
const playlistToggleBtn = document.getElementById('playlistToggleBtn');
const closePlaylist = document.getElementById('closePlaylist');

let currentSongIndex = 0;
let isPlaying = false;
let repeatMode = 0; 
let isShuffleOn = false;
let originalPlaylist = [...playlistData];
let currentPlaylist = [...playlistData];

let lastVolumeBeforeMute = 100; 

function init() {
    loadSong(currentSongIndex);
    renderPlaylist();
    setupEventListeners();
    setVolume();
}

function loadSong(index) {
    if (index < 0) index = currentPlaylist.length - 1;
    if (index >= currentPlaylist.length) index = 0;
    
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    audioPlayer.src = song.url;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumImage.src = song.image;
    albumImage.alt = song.title;
    
    audioPlayer.onloadedmetadata = () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    };
    
    updatePlaylistUI();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function playSong() {
    audioPlayer.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add('active');
    albumArt.classList.add('playing');
}
function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove('active');
    albumArt.classList.remove('playing');
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= currentPlaylist.length) {
        if (repeatMode === 1) {
            currentSongIndex = 0;
        } else {
            currentSongIndex = currentPlaylist.length - 1;
            pauseSong();
            return;
        }
    }
    loadSong(currentSongIndex);
    playSong();
}

function previousSong() {
    if (currentSongIndex > 0) {
        // Agar pehlay se koi pichla song majood hai toh us par chala jaye
        currentSongIndex--;
        loadSong(currentSongIndex);
    } else {
        // Agar pehla hi song (index 0) hai toh wahi song shuru (0:00) se chal jaye
        audioPlayer.currentTime = 0;
    }
    playSong();
}

function updateProgress() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
    progress.style.width = percent + '%';
    if(progressBar) {
        progressBar.value = percent;
    }
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

function seekSong(e) {
    const percent = (e.target.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = percent;
}

function setVolume() {
    const volumeValue = volumeBar.value;
    const volume = volumeValue / 100;
    audioPlayer.volume = volume;
    
    const volumeIcon = document.querySelector('.volume-container i');
    
    if (volumeIcon) {
        if (volumeValue == 0) {
            volumeIcon.className = 'fas fa-volume-mute'; // Mute slash
        } else if (volumeValue < 10) {
            volumeIcon.className = 'fas fa-volume-off';  // No wave
        } else if (volumeValue < 45) {
            volumeIcon.className = 'fas fa-volume-down'; // 1 Wave
        } else if (volumeValue < 80) {
            volumeIcon.className = 'fas fa-volume-down'; // 2 Waves
        } else {
            volumeIcon.className = 'fas fa-volume-up';   // Full 3 Waves
        }
    }
}

function toggleMute() {
    if (volumeBar.value > 0) {
        lastVolumeBeforeMute = volumeBar.value;
        volumeBar.value = 0;
    } else {
        volumeBar.value = lastVolumeBeforeMute > 0 ? lastVolumeBeforeMute : 50;
    }
    setVolume();
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    repeatBtn.classList.remove('active');
    if (repeatMode > 0) {
        repeatBtn.classList.add('active');
    }
    
    if (repeatMode === 2) {
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i><span style="font-size:10px;position:absolute;top:-5px;right:-5px;">1</span>';
        audioPlayer.currentTime = 0;
        playSong();
    } else {
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    }
}

function toggleShuffle() {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.classList.toggle('active');
    
    if (isShuffleOn) {
        currentPlaylist = [...originalPlaylist];
        for (let i = currentPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentPlaylist[i], currentPlaylist[j]] = [currentPlaylist[j], currentPlaylist[i]];
        }
        currentSongIndex = 0;
        loadSong(currentSongIndex);
    } else {
        currentPlaylist = [...originalPlaylist];
        currentSongIndex = currentPlaylist.findIndex(song => song.id === originalPlaylist[currentSongIndex].id);
        if(currentSongIndex === -1) currentSongIndex = 0;
        loadSong(currentSongIndex);
    }
    renderPlaylist();
}

function renderPlaylist() {
    if (!playlistEl) return;
    playlistEl.innerHTML = '';
    currentPlaylist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        if (index === currentSongIndex) {
            li.classList.add('active');
        }
        li.innerHTML = `
            <span class="playlist-item-title">${song.title}</span>
            <span class="playlist-item-artist">${song.artist} - ${formatTime(song.duration)}</span>
        `;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
            closePlaylistSidebar();
        });
        playlistEl.appendChild(li);
    });
}

function updatePlaylistUI() {
    if (!playlistEl) return;
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentSongIndex) {
            item.classList.add('active');
        }
    });
}

function togglePlaylistSidebar() {
    playlistSidebar.classList.toggle('active');
}

function closePlaylistSidebar() {
    playlistSidebar.classList.remove('active');
}

function setupEventListeners() {
    if(playBtn) playBtn.addEventListener('click', togglePlayPause);
    if(prevBtn) prevBtn.addEventListener('click', previousSong);
    if(nextBtn) nextBtn.addEventListener('click', nextSong);
    if(repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);
    if(shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    
    if(progressBar) progressBar.addEventListener('input', seekSong);
    if(volumeBar) volumeBar.addEventListener('input', setVolume);
    
    const volumeIcon = document.querySelector('.volume-container i');
    if (volumeIcon) {
        volumeIcon.style.cursor = 'pointer';
        volumeIcon.addEventListener('click', toggleMute);
    }
    
    if(playlistToggleBtn) playlistToggleBtn.addEventListener('click', togglePlaylistSidebar);
    if(closePlaylist) closePlaylist.addEventListener('click', closePlaylistSidebar);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 2) {
            audioPlayer.currentTime = 0;
            playSong();
        } else {
            pauseSong();
            audioPlayer.currentTime = 0;
            updateProgress();
        }
    }); 
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        }
        if (e.code === 'ArrowRight') nextSong();
        if (e.code === 'ArrowLeft') previousSong();
    });
}

window.addEventListener('DOMContentLoaded', init);