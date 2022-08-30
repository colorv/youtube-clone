import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// Video Upload - Title
const videoTitle = document.querySelector(".upload-video__header__title");
const videoInputTitle = document.querySelector(
  ".video__input.video__input__title textarea"
);
// Recorder
const recordingStartBtn = document.getElementById("recordingStartBtn");
const recordingBtn = document.getElementById("recordingBtn");
const recordingBtnIcon = recordingBtn.querySelector("i");
const video = document.getElementById("preview");

let stream;
let recorder;
let recordingFile;

const constraints = { video: { width: 1920, height: 1080 }, audio: false };
const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

// --- Event ---
// Title Event
const titleHandler = (element) => {
  videoTitle.innerHTML = element.target.value;
};

// Recorder Event
const videoEncoding = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    log: true,
  });
  const loadingText = document.createElement("span");
  loadingText.innerText = "인코딩중...";
  recordingBtn.removeChild(recordingBtnIcon);
  recordingBtn.appendChild(loadingText);

  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(recordingFile));

  await ffmpeg.run("-i", files.input, files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  recordingBtn.removeChild(loadingText);
  recordingBtn.appendChild(recordingBtnIcon);
  loadingText.remove();

  const mp4file = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4file.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  fileDownload(mp4Url, "recording.mp4");
  fileDownload(thumbUrl, "thumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(recordingFile);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
};

const fileDownload = async (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
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
    videoEncoding();
  };
};

const recordingStop = () => {
  // icon 변경 및 숨기기 , Event 반전
  recordingBtnIcon.classList = "fa-solid fa-circle";
  recordingBtnIcon.classList.add("hide");
  recordingBtn.removeEventListener("click", recordingStop);
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
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play();
    recordingBtnIcon.classList.remove("hide");
    recordingBtn.addEventListener("click", recordingStart);
  } catch (error) {
    console.log(error);
  }
};

// --- Video EventListener ---
// Title
if (videoTitle) {
  videoInputTitle.addEventListener("input", titleHandler);
}
// Recorder
recordingStartBtn.addEventListener("click", recordingPreview);
