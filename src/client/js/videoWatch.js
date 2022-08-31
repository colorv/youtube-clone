const comment = document.querySelector(".watch-video__comment");
const relatedVideo = document.querySelector(".watch__related-video");
const watch = document.querySelector(".watch");
const main = document.querySelector(".main-watch");

const windowWidth = window.innerWidth;

const newComment = comment;
const newRelatedVideo = relatedVideo;

const replaceComment = (width) => {
  if (width < 1005) {
    comment.remove();
    relatedVideo.remove();
    watch.appendChild(newRelatedVideo);
    watch.appendChild(newComment);
  }
  if (width > 1004) {
    main.appendChild(newRelatedVideo);
    watch.removeChild(newRelatedVideo);
  }
};

const windowOnResize = (event) => {
  const targetWidth = event.target.innerWidth;
  replaceComment(targetWidth);
};

window.addEventListener("resize", windowOnResize);
replaceComment(windowWidth);
