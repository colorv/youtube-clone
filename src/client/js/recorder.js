import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordingStartBtn = document.getElementById("recordingStartBtn");
const recordingBtn = document.getElementById("recordingBtn");
const recordingBtnIcon = recordingBtn.querySelector("i");
const video = document.getElementById("preview");

const constraints = { video: { width: 300, height: 180 }, audio: false };
let stream;
let recorder;
let recordingFile;

const videoEncoding = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    log: true,
  });

  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(recordingFile));

  await ffmpeg.run("-i", "recording.webm", "output.mp4");
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4file = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4file.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const urlArray = [mp4Url, thumbUrl];
  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");
  return urlArray;
};

const fileDownload = async () => {
  const encodingFileUrl = await videoEncoding();

  const a = document.createElement("a");
  a.href = encodingFileUrl[0];
  a.download = "recording.mp4";
  document.body.appendChild(a);
  a.click();
  a.remove();

  const thumbA = document.createElement("a");
  thumbA.href = encodingFileUrl[1];
  thumbA.download = "thumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();
  thumbA.remove();

  URL.revokeObjectURL(recordingFile);
  URL.revokeObjectURL(encodingFileUrl);
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

recordingStartBtn.addEventListener("click", recordingPreview);
