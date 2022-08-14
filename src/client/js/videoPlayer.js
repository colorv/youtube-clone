const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

let currentVolume = 0.5;
video.volume = currentVolume;

const playOnClick = () => {
  if (video.paused === true) {
    video.play();
  } else {
    video.pause();
  }
  play.textContent = video.paused ? "play" : "pause";
};

const muteOnClick = () => {
  if (video.muted === false) {
    video.muted = true;
  } else {
    video.muted = false;
  }
  muteBtn.textContent = video.muted ? "unmute" : "mute";
  volumeRange.value = video.muted ? 0 : currentVolume;
};

const volumeOnChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted === true) {
    video.muted = false;
    muteBtn.textContent = "mute";
  }
  currentVolume = value;
  video.volume = currentVolume;
};

const timeFormat = (value) => {
  const hour = String(Math.floor(value / 3600));
  const minutes = String(Math.floor((value % 3600) / 60));
  const second = String(Math.floor((value % 3600) % 60));
  let formattedText = "";
  if (value < 60) {
    formattedText = `0:${second.padStart(2, "0")}`;
  }
  if (value >= 60 && value < 3600) {
    formattedText = `${minutes}:${second.padStart(2, "0")}`;
  }
  if (value >= 3600) {
    formattedText = `${hour}:${minutes.padStart(2, "0")}:${second.padStart(
      2,
      "0"
    )}`;
  }
  return formattedText;
};

const durationHandle = () => {
  duration.textContent = timeFormat(video.duration);
};

const currentTimeHandle = () => {
  currentTime.textContent = timeFormat(video.currentTime);
};

playBtn.addEventListener("click", playOnClick);
muteBtn.addEventListener("click", muteOnClick);
volumeRange.addEventListener("input", volumeOnChange);
video.addEventListener("loadedmetadata", durationHandle);
video.addEventListener("timeupdate", currentTimeHandle);
