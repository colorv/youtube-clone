import "../scss/styles.scss";

const videoTime = document.querySelectorAll(".video__meta__time");

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

videoTime.forEach(function (element) {
  const createdTime = new Date(element.innerHTML);
  const elapsedTime = Math.floor((Date.now() - createdTime) / 1000);
  element.innerHTML = timeFilter(elapsedTime);
});

// - 1시간 3600초
// - 1일 86400초
// - 1주 604800초
// - 1달 2592000초 : (28일,30일,31일 ???)
// - 1년 31536000초

// created Date
const createdDate = document.querySelector(".watch-video__meta__date");

const createdHandler = function (target) {
  const date = new Date(target.innerHTML);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  target.innerHTML = `${year}. ${month}. ${day}.`;
};

if (createdDate) {
  createdHandler(createdDate);
}

// Upload Video - Title
const videoTitle = document.querySelector(".upload-video__header__title");
const videoInputTitle = document.querySelector(
  ".video__input.video__input__title textarea"
);

const titleHandler = (element) => {
  videoTitle.innerHTML = element.target.value;
};

videoInputTitle.addEventListener("input", titleHandler);
