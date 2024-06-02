const video = document.getElementById('custom-video');
const playButton = document.getElementById('play-button');
const seekBackwardButton = document.getElementById('seek-backward-btn');
const seekForwardButton = document.getElementById('seek-forward-btn');
const nextVideoButton = document.getElementById('next-video-btn');
const prevVideoButton = document.getElementById('prev-video-btn');
const speedDecreaseButton = document.getElementById('speed-decrease-btn');
const speedIncreaseButton = document.getElementById('speed-increase-btn');
const weatherButton = document.getElementById('weather-btn');
const volumeUpButton = document.getElementById('volume-up-btn');
const volumeDownButton = document.getElementById('volume-down-btn');
const volumeMeter = document.getElementById('volume-meter');
const commentSection = document.getElementById('comment-section');
const commentBox = document.getElementById('comment-box');
const addCommentButton = document.getElementById('add-comment-btn');
const commentsDiv = document.getElementById('comments');
const qualitySelect = document.getElementById('quality-select');

let lastTapTime = 0;
let tapCount = 0;
let currentVideoIndex = 0;
let holdTimeout;

const videoSources = ["video.mp4", "video1.mp4", "1080.mp4"];

function handleDoubleTapSeek(event) {
    const rect = video.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const videoWidth = video.offsetWidth;

    if (offsetX > videoWidth / 2) {
        video.currentTime += 10;
    } else {
        video.currentTime -= 10;
    }
}

function seekBackward() {
    video.currentTime -= 10;
}

function seekForward() {
    video.currentTime += 10;
}

function playNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
    playVideo();
}

function playPrevVideo() {
    currentVideoIndex = (currentVideoIndex - 1 + videoSources.length) % videoSources.length;
    playVideo();
}

function playVideo() {
    video.src = videoSources[currentVideoIndex];
    video.load();
    video.play();
}

function togglePlayButtonText() {
    if (video.paused) {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function toggleCommentSection() {
    commentSection.classList.toggle('hidden');
    commentSection.style.display = 'block'; // Ensure comment section is visible
}

function addComment() {
    const newComment = document.createElement('div');
    newComment.classList.add('comment');

    const userImg = document.createElement('img');
    userImg.src = "https://upload.wikimedia.org/wikipedia/en/3/3b/SpongeBob_SquarePants_character.svg"; // Add the URL of the user's photo
    userImg.alt = "User4"; // Add alt text for accessibility
    userImg.style.borderRadius = "50%";
    userImg.style.marginRight = "10px";
    userImg.style.width = "40px";
    userImg.style.height = "40px";
    newComment.appendChild(userImg);

    const commentText = document.createElement('p');
    commentText.textContent = `User4: ${commentBox.value}`;
    commentText.style.margin = '0';
    commentText.style.padding = '10px';
    commentText.style.backgroundColor = '#ecf0f1';
    commentText.style.borderRadius = '5px';
    newComment.appendChild(commentText);

    commentsDiv.appendChild(newComment);
    commentBox.value = '';
}

video.addEventListener('click', function(event) {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastTapTime;
    lastTapTime = currentTime;
    tapCount++;

    if (tapCount === 1) {
        setTimeout(() => {
            if (tapCount === 1) {
                const rect = video.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;
                const videoWidth = video.offsetWidth;
                const videoHeight = video.offsetHeight;

                if (offsetX > videoWidth / 3 && offsetX < (2 * videoWidth) / 3 && offsetY > videoHeight / 3 && offsetY < (2 * videoHeight) / 3) {
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
                if (offsetX < videoWidth / 3) {
                    if (timeDiff < 300 && tapCount === 3) {
                        toggleCommentSection();
                    }
                }
                if (offsetX > (2 * videoWidth) / 3 && offsetY < videoHeight / 3) {
                    showWeatherInfo();
                }
            } else if (tapCount === 2) {
                handleDoubleTapSeek(event);
            } else if (tapCount === 3) {
                const rect = video.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const videoWidth = video.offsetWidth;

                if (offsetX > videoWidth * 0.75) {
                    window.close();
                } else if (offsetX < videoWidth * 0.25) {
                    toggleCommentSection();
                } else {
                    playNextVideo();
                }
            }
            tapCount = 0;
        }, 300);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
});

playButton.addEventListener('click', function() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    togglePlayButtonText();
});

seekBackwardButton.addEventListener('click', seekBackward);
seekForwardButton.addEventListener('click', seekForward);
nextVideoButton.addEventListener('click', playNextVideo);
prevVideoButton.addEventListener('click', playPrevVideo);

video.addEventListener('ended', function() {
    tapCount = 0;
});

function increaseSpeed() {
    video.playbackRate = 2.0;
}

function decreaseSpeed() {
    video.playbackRate = 0.5;
}

speedIncreaseButton.addEventListener('click', increaseSpeed);
speedDecreaseButton.addEventListener('click', decreaseSpeed);

video.addEventListener('mousedown', function(event) {
    const rect = video.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const videoWidth = video.offsetWidth;

    if (offsetX > videoWidth / 2) {
        holdTimeout = setTimeout(increaseSpeed, 500);
    } else if (offsetX < videoWidth / 2) {
        holdTimeout = setTimeout(decreaseSpeed, 500);
    }
});

video.addEventListener('mouseup', function(event) {
    clearTimeout(holdTimeout);
    video.playbackRate = 1.0;
});

weatherButton.addEventListener('click', showWeatherInfo);

function showWeatherInfo() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const temp = data.main.temp;
                    const location = data.name;
                    alert(`Current location: ${location}\nTemperature: ${temp}°C`);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    const currentTime = new Date().toLocaleTimeString();
                    alert(`Unable to fetch weather data.\nCurrent time: ${currentTime}\nLatitude: ${lat}\nLongitude: ${lon}`);
                });
        }, error => {
            console.error('Error getting location:', error);
            const currentTime = new Date().toLocaleTimeString();
            alert(`Unable to get your location.\nCurrent time: ${currentTime}`);
        });
    } else {
        alert('Geolocation is not supported by this browser');
    }
}

volumeUpButton.addEventListener('click', increaseVolume);
volumeDownButton.addEventListener('click', decreaseVolume);

function updateVolumeMeter() {
    volumeMeter.value = video.volume * 100;
}

function increaseVolume() {
    if (video.volume < 1.0) {
        video.volume += 0.1;
        updateVolumeMeter();
    }
}

function decreaseVolume() {
    if (video.volume > 0.0) {
        video.volume -= 0.1;
        updateVolumeMeter();
    }
}

addCommentButton.addEventListener('click', addComment);

updateVolumeMeter();

function toggleCommentSection() {
    commentSection.classList.toggle('hidden');
    commentSection.style.display = 'block'; // Ensure comment section is visible
}

// Quality selection event listener
qualitySelect.addEventListener('change', function() {
    const currentTime = video.currentTime;
    const isPlaying = !video.paused;
    const selectedQuality = qualitySelect.value;

    const newSource = document.getElementById('video-source');
    newSource.src = selectedQuality;

    video.load();
    video.currentTime = currentTime;
    if (isPlaying) {
        video.play();
    }
});
qualitySelect.addEventListener('change', function() {
    const currentTime = video.currentTime;
    const isPlaying = !video.paused;
    const selectedQuality = qualitySelect.value;

    // Update the video source based on the selected quality
    const newSource = document.getElementById('video-source');
    newSource.src = selectedQuality;

    // Load the new video source and maintain playback position
    video.load();
    video.currentTime = currentTime;
    if (isPlaying) {
        video.play();
    }
});
