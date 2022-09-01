const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const formBtn = document.getElementById("formBtn");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");
const removeBtn = document.querySelectorAll("#removeBtn");
const commentContainer = document.getElementById("commentContainer");
const likeBtn = document.querySelectorAll("#likeBtn");
const disLikeBtn = document.querySelectorAll("#disLikeBtn");

// --- Web Component ---
class Comment extends HTMLElement {
  connectedCallback() {
    const user = document.createElement("div");
    user.classList.add("comment-user");
    const avatarUrl = this.getAttribute("avatarurl");
    const profileColor = this.getAttribute("profilecolor");

    if (avatarUrl) {
      const imageUrl = document.createElement("img");
      imageUrl.className = "profile__avatar--m";
      imageUrl.src = this.getAttribute("avatarurl");
      user.appendChild(imageUrl);
    }
    if (!avatarUrl) {
      const defaultImage = document.createElement("span");

      if (profileColor === "blue") {
        defaultImage.className = "profile__avatar__default--m profile--blue";
        defaultImage.innerText = `${this.getAttribute("name").match(
          /^[a-zA-Z]|[ㄱ-ㅎ가-힣]{2}/
        )}`;
      }
      if (profileColor === "green") {
        defaultImage.className = "profile__avatar__default--m profile--green";
        defaultImage.innerText = `${this.getAttribute("name").match(
          /^[a-zA-Z]|[ㄱ-ㅎ가-힣]{2}/
        )}`;
      }
      if (profileColor === "purple") {
        defaultImage.className = "profile__avatar__default--m profile--purple";
        defaultImage.innerText = `${this.getAttribute("name").match(
          /^[a-zA-Z]|[ㄱ-ㅎ가-힣]{2}/
        )}`;
      }
      if (profileColor === "orange") {
        defaultImage.className = "profile__avatar__default--m profile--orange";
        defaultImage.innerText = `${this.getAttribute("name").match(
          /^[a-zA-Z]|[ㄱ-ㅎ가-힣]{2}/
        )}`;
      }
      if (profileColor === "brown") {
        defaultImage.className = "profile__avatar__default--m profile--brown";
        defaultImage.innerText = `${this.getAttribute("name").match(
          /^[a-zA-Z]|[ㄱ-ㅎ가-힣]{2}/
        )}`;
      }
      user.appendChild(defaultImage);
    }

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
    removeBtn.addEventListener("click", deleteBtnOnClick);
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
    const likeBtnIcon = document.createElement("button");
    likeBtnIcon.classList.add("fa-regular", "fa-thumbs-up");
    likeBtnIcon.id = "likeBtn";
    likeBtnIcon.dataset.clicked = "false";
    likeBtnIcon.addEventListener("click", likeAndDisLikeHandle);
    likeBtn.appendChild(likeBtnIcon);
    const disLikeBtn = document.createElement("div");
    disLikeBtn.className = "comment-btn__dislike";
    const disLikeBtnIcon = document.createElement("button");
    disLikeBtnIcon.classList.add("fa-regular", "fa-thumbs-down");
    disLikeBtnIcon.id = "disLikeBtn";
    disLikeBtnIcon.dataset.clicked = "false";
    disLikeBtnIcon.addEventListener("click", likeAndDisLikeHandle);
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
    const jsonInfo = await response.json();
    const newComment = document.createElement("custom-comment");
    newComment.setAttribute("input", commentText);
    newComment.setAttribute("name", jsonInfo.name);
    newComment.setAttribute("data-id", jsonInfo.commetId);
    newComment.setAttribute("avatarurl", jsonInfo.avatarUrl);
    newComment.setAttribute("profilecolor", jsonInfo.profileColor);
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

// Comment Like and DisLike event
const likeAndDisLikeHandle = async (event) => {
  const comment = event.path[4];
  const commentId = comment.dataset.id;
  const btn = event.target;
  const btnContainer = event.path[1];
  const fetchTarget = btn.id;

  let clicked = btn.dataset.clicked;
  btn.classList.toggle("clickBtn");

  if (clicked === "false") {
    btn.dataset.clicked = "true";
    btn.classList.toggle("fa-regular");
    btn.classList.toggle("fa-solid");
  }
  if (clicked === "true") {
    btn.dataset.clicked = "false";
    btn.classList.toggle("fa-regular");
    btn.classList.toggle("fa-solid");
  }
  clicked = btn.dataset.clicked;

  const response = await fetch("/api/comment-disLike", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentId, clicked, fetchTarget }),
  });
  const count = await response.json();

  if (count > 1) {
    btnContainer.childNodes[1].innerText = count;
  }
  if (count === 1) {
    if (clicked === "true") {
      const countNumber = document.createElement("span");
      countNumber.innerText = count;
      btnContainer.appendChild(countNumber);
    }
    if (clicked === "false") {
      btnContainer.childNodes[1].innerText = count;
    }
  }
  if (count === 0) {
    btnContainer.childNodes[1].remove();
  }
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
// likeBtn and disLikeBtn
if (likeBtn.length > 0) {
  likeBtn.forEach((element) => {
    element.addEventListener("click", likeAndDisLikeHandle);
  });
}
if (disLikeBtn.length > 0) {
  disLikeBtn.forEach((element) => {
    element.addEventListener("click", likeAndDisLikeHandle);
  });
}

// --- Web Component ---
customElements.define("custom-comment", Comment);
