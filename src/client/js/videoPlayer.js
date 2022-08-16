const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const volumeController = document.querySelector(".volumeController");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoController = document.getElementById("videoController");

let controllerTimeOut = null;
let currentVolume = 0.5;
video.volume = currentVolume;

// --- Event Handle ---
// Play
const playOnClick = () => {
  if (video.paused === true) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused
    ? "fa-solid fa-play"
    : "fa-solid fa-pause";
};

// Volume
const volumeIconChange = () => {
  if (video.volume === 0 || video.muted) {
    muteBtnIcon.classList = "fa-solid fa-volume-off";
  } else if (video.volume <= 0.5) {
    muteBtnIcon.classList = "fa-solid fa-volume-low";
  } else if (video.volume > 0.5) {
    muteBtnIcon.classList = "fa-solid fa-volume-high";
  }
};
const muteOnClick = () => {
  if (video.muted === false) {
    video.muted = true;
  } else {
    video.muted = false;
  }
  volumeRange.value = video.muted ? 0 : currentVolume;
  volumeIconChange();
};
const volumeOnChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted === true) {
    video.muted = false;
  }
  currentVolume = Number(value);
  video.volume = currentVolume;
  volumeIconChange();
};
const volumeOnMouseEnter = () => volumeRange.classList.remove("none");
const volumeOnMouseLeave = () => volumeRange.classList.add("none");

// FullScreen
const fullScreenOnClick = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen === null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
const fullScreenOnChange = () => {
  const fullScreen = document.fullscreenElement;
  fullScreenBtnIcon.classList =
    fullScreen === null ? "fa-solid fa-expand" : "fa-solid fa-compress";
};

// Video Time
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
const videoOnLoadedMetaData = () => {
  duration.innerText = timeFormat(video.duration);
  timeLine.max = Math.floor(video.duration);
};
const videoOnTimeUpdate = () => {
  currentTime.innerText = timeFormat(video.currentTime);
  timeLine.value = video.currentTime;
};
const timeLineOnChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

// Video Controller - visible or hidden
const hideController = () => {
  videoController.classList.add("hidden");
  video.classList.add("cursorHidden");
};
const visibleController = () => {
  if (controllerTimeOut) {
    clearTimeout(controllerTimeOut);
    controllerTimeOut = null;
  }
  videoController.classList.remove("hidden");
  video.classList.remove("cursorHidden");
  controllerTimeOut = setTimeout(hideController, 3000);
};
const videoOnMouseLeave = () => {
  hideController();
};
const videoOnPlay = () => {
  videoContainer.addEventListener("mouseleave", videoOnMouseLeave);
  videoContainer.addEventListener("mousemove", visibleController);
  controllerTimeOut = setTimeout(hideController, 3000);
};
const videoOnPause = () => {
  videoContainer.removeEventListener("mouseleave", videoOnMouseLeave);
  videoContainer.removeEventListener("mousemove", visibleController);
  clearTimeout(controllerTimeOut);
  videoController.classList.remove("hidden");
};

// Key Event
const keyEvent = (event) => {
  const { key } = event;
  if (key === " " || key === "k" || key === "ㅏ") {
    event.preventDefault();
    playOnClick();
  }
  if (key === "m" || key === "ㅡ") {
    visibleController();
    muteOnClick();
  }
  if (key === "f" || key === "ㄹ") {
    fullScreenOnClick();
  }
  if (key === "ArrowRight") {
    visibleController();
    video.currentTime += 1;
    videoOnTimeUpdate();
  }
  if (key === "ArrowLeft") {
    visibleController();
    video.currentTime -= 1;
    videoOnTimeUpdate();
  }
};

const volumeUpAndDown = (operator) => {
  const volumeStep = 0.05;
  if (operator === "+") {
    currentVolume = +(currentVolume + volumeStep).toFixed(12);
  }
  if (operator === "-") {
    currentVolume = +(currentVolume - volumeStep).toFixed(12);
  }
  video.volume = currentVolume;
  volumeIconChange();
};

const volumeKeyEvent = (event) => {
  const { key } = event;
  if (key === "ArrowUp") {
    event.preventDefault();
    if (currentVolume < 1) {
      visibleController();
      volumeUpAndDown("+");
    }
  }
  if (key === "ArrowDown") {
    event.preventDefault();
    const add = "add";
    if (currentVolume > 0) {
      visibleController();
      volumeUpAndDown("-");
    }
  }
};

const volumeKeyRemove = () => {
  document.removeEventListener("keydown", volumeKeyEvent);
};

const videoOnClick = () => {
  document.addEventListener("keydown", volumeKeyEvent);
};

// View Event
const videoOnEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};
// *** Event Handle End. ***

// --- Video EventListener ---
// Play
playBtn.addEventListener("click", playOnClick);
video.addEventListener("click", playOnClick);
// volume
muteBtn.addEventListener("click", muteOnClick);
volumeRange.addEventListener("input", volumeOnChange);
volumeController.addEventListener("mouseenter", volumeOnMouseEnter);
volumeController.addEventListener("mouseleave", volumeOnMouseLeave);
// Full Screen
fullScreenBtn.addEventListener("click", fullScreenOnClick);
videoContainer.addEventListener("fullscreenchange", fullScreenOnChange);
// Video Time
video.addEventListener("loadedmetadata", videoOnLoadedMetaData);
video.addEventListener("timeupdate", videoOnTimeUpdate);
timeLine.addEventListener("input", timeLineOnChange);
// Video Controller Show or Hide
video.addEventListener("play", videoOnPlay);
video.addEventListener("pause", videoOnPause);
// keyboard
document.addEventListener("keydown", keyEvent);
document.addEventListener("selectionchange", volumeKeyRemove);
videoContainer.addEventListener("click", videoOnClick);
// View increase
video.addEventListener("ended", videoOnEnded);
