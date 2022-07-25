const testUser = {
  username: "LimSuHyoek",
  loggedIn: true,
};

let testVideos = [
  {
    title: "First Video",
    rating: 4,
    comments: 12,
    createdAt: "5 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 2,
    comments: 22,
    createdAt: "10 minutes ago",
    views: 542,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 3,
    comments: 0,
    createdAt: "1 minutes ago",
    views: 2,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", testVideos });
};

export const watch = (req, res) => {
  const { id } = req.params;
  const video = testVideos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

// GET, POST EditController
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = testVideos[id - 1];
  return res.render("editVideo", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};
export const postEdit = (req, res) => {
  const { id } = req.params; // req.params.id
  const { title } = req.body; // req.body.title
  testVideos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

// GET, POST Upload Controller
export const getUpload = (req, res) => {
  return res.render("uploadVideo", { pageTitle: "Upload" });
};
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "0 minutes ago",
    views: 0,
    id: testVideos.length + 1,
  };
  testVideos.push(newVideo);
  return res.redirect("/");
};

// 기본적인 동작만 수행하므로 수정 해야함
export const search = (req, res) => res.send("Search Videos");
export const removeVideo = (req, res) => res.send("Remove Video");
