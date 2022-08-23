const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const formBtn = document.getElementById("formBtn");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");

// btn Disabled
const btnDisabled = (boolean) => {
  if (boolean === true) {
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

// btn Event

// cancel - Click Event
const cancelBtnOnClick = (event) => {
  event.preventDefault();
  formBtn.classList.add("hidden");
  commentInput.value = "";
  btnDisabled(true);
};

// submit - Submit Event
const submitBtnOnClick = (event) => {
  event.preventDefault();
  const text = commentInput.value;
  const video = videoContainer.dataset.id;
  // To DO : 댓글 DB에 저장
};
// *** Event Handle End. ***

// --- Comment EventListener ---
// input
commentInput.addEventListener("focus", inputOnFocus);
commentInput.addEventListener("input", inputOnChange);
// Btn
cancelBtn.addEventListener("click", cancelBtnOnClick);
commentForm.addEventListener("submit", submitBtnOnClick);
