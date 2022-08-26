const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const formBtn = document.getElementById("formBtn");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");
const removeBtn = document.querySelectorAll("#removeBtn");
const commentContainer = document.getElementById("commentContainer");

// --- Web Component ---
class Comment extends HTMLElement {
  connectedCallback() {
    const user = document.createElement("div");
    user.classList.add("comment-user");
    const userIcon = document.createElement("i");
    userIcon.classList.add("fa-solid", "fa-circle-user");
    user.appendChild(userIcon);

    const commentText = document.createElement("div");
    commentText.className = "comment-text";

    const commentInfo = document.createElement("div");
    commentInfo.className = "comment-info";
    const userName = document.createElement("span");
    userName.className = ".comment-info__user";
    userName.innerText = this.getAttribute("name");
    const commentTime = document.createElement("span");
    commentTime.className = "comment-info__createdAt";
    commentTime.innerText = "0분 전";

    const settingBtn = document.createElement("div");
    settingBtn.id = "settingBtn";
    const changeBtn = document.createElement("button");
    changeBtn.classList.add("fa-solid", "fa-pen");
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("fa-solid", "fa-trash-can");
    settingBtn.appendChild(changeBtn);
    settingBtn.appendChild(removeBtn);

    commentInfo.appendChild(userName);
    commentInfo.appendChild(commentTime);
    commentInfo.appendChild(settingBtn);

    const textArea = document.createElement("div");
    textArea.className = "comment-textarea";
    const span = document.createElement("span");
    span.innerText = this.getAttribute("input");
    textArea.appendChild(span);

    const commentBtn = document.createElement("div");
    commentBtn.className = "comment-btn";
    const likeBtn = document.createElement("div");
    likeBtn.className = "comment-btn__like";
    const likeBtnIcon = document.createElement("i");
    likeBtnIcon.classList.add("fa-regular", "fa-thumbs-up");
    likeBtn.appendChild(likeBtnIcon);
    const disLikeBtn = document.createElement("div");
    disLikeBtn.className = "comment-btn__dislike";
    const disLikeBtnIcon = document.createElement("i");
    disLikeBtnIcon.classList.add("fa-regular", "fa-thumbs-down");
    disLikeBtn.appendChild(disLikeBtnIcon);
    const replyBtn = document.createElement("button");
    replyBtn.classList.add("comment-btn__reply");
    replyBtn.innerText = "답글";
    commentBtn.appendChild(likeBtn);
    commentBtn.appendChild(disLikeBtn);
    commentBtn.appendChild(replyBtn);
    commentText.appendChild(commentInfo);
    commentText.appendChild(textArea);
    commentText.appendChild(commentBtn);
    this.appendChild(user);
    this.appendChild(commentText);
  }
}

// --- function ---
// Btn Disabled
const btnDisabled = (boolean) => {
  if (boolean === true) {
    commentInput.value = "";
    submitBtn.classList.remove("available");
    submitBtn.disabled = true;
  } else if (boolean === false) {
    submitBtn.classList.add("available");
    submitBtn.disabled = false;
  }
};

// --- Event Handle ---
// input - Focus Event
const inputOnFocus = () => {
  formBtn.classList.remove("hidden");
};

// input - Change Event
const inputOnChange = (event) => {
  if (event.target.value) {
    btnDisabled(false);
  } else {
    btnDisabled(true);
  }
};

// cancel - Click Event
const cancelBtnOnClick = (event) => {
  event.preventDefault();
  formBtn.classList.add("hidden");
  btnDisabled(true);
};

// submit - Submit Event
const submitBtnOnClick = async (event) => {
  event.preventDefault();
  const commentText = commentInput.value;
  const videoId = videoContainer.dataset.id;
  if (commentText === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentText }),
  });

  if (response.status === 201) {
    const name = await response.json();
    const newComment = document.createElement("custom-comment");
    newComment.setAttribute("input", commentText);
    newComment.setAttribute("name", name);
    commentContainer.prepend(newComment);
  }

  btnDisabled(true);
};

// DeleteBtn - Comment Delete Event
const deleteBtnOnClick = async (event) => {
  const comment = event.path[4];
  const commentId = comment.dataset.id;
  const videoId = videoContainer.dataset.id;
  await fetch(`/api/videos/${videoId}/comment-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId, videoId }),
  });
  comment.remove();
};
// *** Event Handle End. ***

// --- Comment EventListener ---
// input
commentInput.addEventListener("focus", inputOnFocus);
commentInput.addEventListener("input", inputOnChange);
// Btn
cancelBtn.addEventListener("click", cancelBtnOnClick);
commentForm.addEventListener("submit", submitBtnOnClick);
// DeleteBtn
if (removeBtn.length > 0) {
  removeBtn.forEach((element) => {
    element.addEventListener("click", deleteBtnOnClick);
  });
}
// Web Component
customElements.define("custom-comment", Comment);
