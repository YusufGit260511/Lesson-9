const playPauseButton = document.getElementById('playButton');
const audio = document.getElementById('audio1');

let isPlaying = false;

const musicSelect = document.getElementById('music-select');
const li = document.querySelectorAll('.li');

musicSelect.addEventListener('click', () => {
  musicSelect.classList.toggle('open');
});

let musics = [
  {
    name: 'Die With A Smile',
    author: 'Lady Gaga & Bruno Mars',
    img: 'https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45',
    audio: 'audio/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video).mp3'
  },
  {
    name: 'Beautiful Things',
    author: 'Benson Boone',
    img: 'https://i1.sndcdn.com/artworks-yozHWjWpjaFSXbvH-JVqSbg-t500x500.jpg',
    audio: 'audio/Benson Boone - Beautiful Things (Official Music Video).mp3'
  },
  {
    name: 'Flowers',
    author: 'Miley Cyrus',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdEyOIBUWEVhkeDWGdTSArUsDkNLxWAd-yBw&s',
    audio: 'audio/Miley Cyrus - Flowers (Lyrics).mp3'
  }
]

let i = 0

playPauseButton.addEventListener('click', () => {
  audio.src = musics[i].audio
  if (!isPlaying) {
    audio.play();
    playPauseButton.textContent = '⏸️';
  } else {
    audio.pause();
    playPauseButton.textContent = '▶️';
  }
  isPlaying = !isPlaying;
  findDuration()
});

function showInfo() {
	const track = musics[i];

	document.getElementById('track-name').textContent = track.name;
	document.getElementById('track-author').textContent = track.author;
	document.getElementById('container_img').src = track.img;
	document.getElementById('nowPlayingMusic_p').textContent = track.name;

	musics.forEach((music) => {
		const li = document.createElement('li');
		li.className = 'li';

		// Создаём временный <audio> для получения длительности
		const tempAudio = new Audio(music.audio);
		tempAudio.addEventListener('loadedmetadata', () => {
		const duration = formatTime(tempAudio.duration);
		li.innerHTML = `
			<div class="music">
				<div class="img-name">
					<img src="${music.img}" alt="" class="musicphoto">
					<div class="music-info">
						<h3 class="music-info_h3">${music.name}</h3>
						<h5 class="music-info_h5">${music.author}</h5>
					</div>
				</div>
				<p class="music-time">${duration}</p>
			</div>
		`;
		});

		musicSelect.appendChild(li);
	});
}

// Вспомогательная функция для форматирования времени
function formatTime(sec) {
	const minutes = Math.floor(sec / 60);
	const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
}

showInfo()  

const next = document.getElementById('next');
next.addEventListener('click', () => {
	i++
	audio.src = musics[i].audio
	if(isPlaying) {
		audio.pause()
		audio.play()
	}
	showInfo()
	findDuration()
})

const preview = document.getElementById('preview');
preview.addEventListener('click', () => {
	i--
	audio.src = musics[i].audio
	if(isPlaying) {
		audio.pause()
		audio.play()
	}	
	showInfo()
	findDuration()
})


const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 200;

const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = (canvas.width / bufferLength) * 1.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 0.9;
    const r = 50 + barHeight;
    const g = 100 + i * 4;
    const b = 200;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

audio.onplay = () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  draw();
};

const nowtime = document.getElementById('nowtime');
const duration = document.getElementById('duration');

function findTime() {
	setInterval(() => {
		nowtime.textContent = formatTime(audio.currentTime+1);
	}, 1000);
}
findTime()
function findDuration() {
	duration.textContent = audio.duration;
}
findDuration()