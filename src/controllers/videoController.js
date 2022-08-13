import User from "../models/User";
import Video from "../models/video";

// Home page
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate("owner")
      .sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("error");
  }
};

// Watch Video
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  const allVideos = await Video.find({})
    .populate("owner")
    .sort({ createdAt: "desc" });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", {
    pageTitle: video.title,
    video,
    allVideos,
  });
};

// GET, POST-Edit Controller
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(_id) !== String(video.owner)) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/editVideo", {
    pageTitle: `Edit : ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(_id) !== String(video.owner)) {
    return res.status(403).redirect("/");
  }
  await video.update({
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
  const {
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
    file,
  } = req;

  try {
    const video = new Video({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      videoUrl: file ? file.path : "",
      owner: _id,
    });
    await video.save();

    const user = await User.findById({ _id: video.owner });
    user.videos.push(video._id);
    await user.save();

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("videos/uploadVideo", {
      pageTitle: "Upload",
      errorMessage: error._message,
    });
  }
};

// Delete Video
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(_id) !== String(video.owner)) {
    return res.status(403).redirect("/");
  }
  await video.remove();
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
    }).populate("owner");
  }
  res.render("search", { pageTitle: "Search", videos });
};
