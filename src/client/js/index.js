import "../scss/styles.scss";
import regeneratorRuntime from "regenerator-runtime";

// Upload Video - Title
const videoTitle = document.querySelector(".upload-video__header__title");
const videoInputTitle = document.querySelector(
  ".video__input.video__input__title textarea"
);

const titleHandler = (element) => {
  videoTitle.innerHTML = element.target.value;
};
if (videoTitle) {
  videoInputTitle.addEventListener("input", titleHandler);
}
