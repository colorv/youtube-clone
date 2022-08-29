import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

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
  const video = await Video.findById(id).populate("owner").populate("comments");
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
    files: { video, thumb },
  } = req;

  const videoUrl = video[0].path;
  if (thumb) {
    const thumbnailUrl = thumb[0].path;
  }

  try {
    const video = new Video({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      videoUrl,
      thumbnailUrl: thumb ? thumbnailUrl : "",
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

// View increase
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

// Create Comment
export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { commentText },
    session: {
      user: { _id, name },
    },
  } = req;

  // User , Video
  const user = await User.findById(_id);
  const video = await Video.findById(id);
  if (!user && !video) {
    return res.sendStatus(404);
  }
  // Comment
  const comment = await Comment.create({
    text: commentText,
    owner: _id,
    video: id,
    name,
  });

  user.comments.push(comment._id);
  await user.save();

  video.comments.push(comment._id);
  await video.save();

  return res
    .status(201)
    .json({
      name: user.name,
      avatarUrl: user.avatarUrl,
      profileColor: user.profileColor,
      commetId: comment._id,
    });
};

// Delete Comment
export const deleteComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { commentId, videoId },
  } = req;

  const video = await Video.findById(videoId);
  const user = await User.findById(_id);
  const comment = await Comment.findById(commentId);
  if (!user && !video && !comment) {
    return res.sendStatus(404);
  }
  if (String(comment.owner) === String(_id)) {
    await video.updateOne({ $pull: { comments: commentId } });
    await user.updateOne({ $pull: { comments: commentId } });
    await comment.remove();
    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
};

// Comment Like and DisLike Counting handler
export const commentLikeAndDislike = async (req, res) => {
  const {
    body: { commentId, clicked, fetchTarget },
    session: {
      user: { _id },
    },
  } = req;

  const comment = await Comment.findById(commentId);
  const user = await User.findById(_id);

  if (fetchTarget === "likeBtn") {
    if (clicked === "true") {
      comment.like += 1;
      await comment.updateOne({ $push: { likeUser: _id } });
      await user.updateOne({ $push: { likeComments: _id } });
    }
    if (clicked === "false") {
      comment.like -= 1;
      await comment.updateOne({ $pull: { likeUser: _id } });
      await user.updateOne({ $pull: { likeComments: _id } });
    }
    comment.save();
    return res.status(200).json(comment.like);
  }
  if (fetchTarget === "disLikeBtn") {
    if (clicked === "true") {
      comment.disLike += 1;
      await comment.updateOne({ $push: { disLikeUser: _id } });
      await user.updateOne({ $push: { disLikeComments: _id } });
    }
    if (clicked === "false") {
      comment.disLike -= 1;
      await comment.updateOne({ $pull: { disLikeUser: _id } });
      await user.updateOne({ $pull: { disLikeComments: _id } });
    }
    comment.save();
    return res.status(200).json(comment.disLike);
  }
};
