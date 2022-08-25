const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const formBtn = document.getElementById("formBtn");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");

// new
const removeBtn = document.querySelectorAll("#removeBtn");

// btn Disabled
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
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentText }),
  });
  btnDisabled(true);
  window.location.reload();
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
