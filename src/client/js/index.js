import "../scss/styles.scss";

const x = document.querySelectorAll(".video__meta__time");

const timeFilter = function (time) {
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

x.forEach(function (element) {
  const createdTime = new Date(element.innerHTML);
  const elapsedTime = Math.floor((Date.now() - createdTime) / 1000);
  element.innerHTML = timeFilter(elapsedTime);
});

// - 1시간 3600초
// - 1일 86400초
// - 1주 604800초
// - 1달 2592000초 : (28일,30일,31일 ???)
// - 1년 31536000초
