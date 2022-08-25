const videoTime = document.querySelectorAll("#videoTime");
const videoDate = document.querySelector("#videoDate");
const commentTime = document.querySelectorAll("#commentTime");

const timeFormat = function (time) {
  let stringTime = "";
  if (time > 31536000) {
    stringTime = `${Math.floor(time / 31536000)}년 전`;
  } else if (time >= 2592000 && time < 3153600) {
    stringTime = `${Math.floor(time / 2592000)}달 전`;
  } else if (time >= 604800 && time < 2592000) {
    stringTime = `${Math.floor(time / 604800)}주 전`;
  } else if (time >= 86400 && time < 604800) {
    stringTime = `${Math.floor(time / 86400)}일 전`;
  } else if (time > 3600 && time < 86400) {
    stringTime = `${Math.floor(time / 3600)}시간 전`;
  } else {
    stringTime = `${Math.floor(time / 60)}분 전`;
  }
  return stringTime;
};
// - 1시간 3600초
// - 1일 86400초
// - 1주 604800초
// - 1달 2592000초 : (28일,30일,31일 ???)
// - 1년 31536000초

const repaintTime = (element) => {
  // 생성 시간
  const createdTime = new Date(element.innerHTML);
  // 경과 시간
  const elapsedTime = Math.floor((Date.now() - createdTime) / 1000);
  // repaint Time
  element.innerHTML = timeFormat(elapsedTime);
};

// Date Format
const dateFormat = function (target) {
  const date = new Date(target.innerHTML);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  target.innerHTML = `${year}. ${month}. ${day}.`;
};

if (videoDate) {
  dateFormat(videoDate);
}

if (videoTime.length > 0) {
  videoTime.forEach(repaintTime);
}
if (commentTime.length > 0) {
  commentTime.forEach(repaintTime);
}
