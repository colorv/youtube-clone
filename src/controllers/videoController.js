import Video from "../models/video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("watch", { pageTitle: video.title, video });
};

// GET, POST EditController
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("editVideo", { pageTitle: `Editing`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params; // req.params.id
  const { title } = req.body; // req.body.title
  return res.redirect(`/videos/${id}`);
};

// GET, POST Upload Controller
export const getUpload = (req, res) => {
  return res.render("uploadVideo", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    const video = new Video({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    await video.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("uploadVideo", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

// 기본적인 동작만 수행하므로 수정 해야함
export const search = (req, res) => res.send("Search Videos");
export const removeVideo = (req, res) => res.send("Remove Video");
