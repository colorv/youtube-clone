import Video from "../models/video";

// Home page
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("error");
  }
};

// Watch Video
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

// GET, POST-Edit Controller
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/editVideo", {
    pageTitle: `Edit : ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params; // req.params.id
  const { title, description, hashtags } = req.body; // req.body.(title, description, hashtags)
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

// GET, POST-Upload Controller
export const getUpload = (req, res) => {
  return res.render("videos/uploadVideo", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    const video = new Video({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    await video.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/uploadVideo", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

// Delete Video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

// Search Video
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        //$regex: keyword,
        //$options: "i",
      },
    });
  }
  res.render("search", { pageTitle: "Search", videos });
};
