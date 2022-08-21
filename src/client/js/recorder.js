const recordingStartBtn = document.getElementById("recordingStartBtn");
const recordingBtn = document.getElementById("recordingBtn");
const recordingBtnIcon = recordingBtn.querySelector("i");
const video = document.getElementById("preview");

const constraints = { video: { width: 300, height: 150 }, audio: false };
let stream;
let recorder;
let recordingFile;

const fileDownload = () => {
  const a = document.createElement("a");
  a.href = recordingFile;
  a.download = "recording-video.webm";
  document.body.appendChild(a);
  a.click();
};

const recordingStart = () => {
  // icon 변경 , Event 반전
  recordingBtnIcon.classList = "fa-solid fa-square";
  recordingBtn.removeEventListener("click", recordingStart);
  recordingBtn.addEventListener("click", recordingStop);
  // 녹화 시작
  recorder = new MediaRecorder(stream);
  recorder.start();

  recorder.ondataavailable = (event) => {
    recordingFile = URL.createObjectURL(event.data);
    fileDownload();
  };
};

const recordingStop = () => {
  // icon 변경 및 숨기기 , Event 반전
  recordingBtnIcon.classList = "fa-solid fa-circle";
  recordingBtnIcon.classList.add("hide");
  recordingBtn.removeEventListener("click", recordingStop);
  recordingBtn.addEventListener("click", recordingStart);
  // 녹화 종료
  recorder.stop();
  video.pause();
  video.src = "";
  // 카메라 끄기
  stream.getTracks().forEach((track) => track.stop());
};

const recordingPreview = async (event) => {
  // submit 막기
  event.preventDefault();
  recordingBtnIcon.classList.remove("hide");
  // getUserMedia를 통해 stream을 받아 프리뷰 화면 띄우기
  stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  video.play();
};

recordingStartBtn.addEventListener("click", recordingPreview);
recordingBtn.addEventListener("click", recordingStart);
