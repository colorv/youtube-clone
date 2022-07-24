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

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = testVideos[id - 1];
  res.render("editVideo", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params; // req.params.id
  const { title } = req.body; // req.body.title
  testVideos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};

// 기본적인 동작만 수행하므로 수정 해야함
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Video");
export const removeVideo = (req, res) => res.send("Remove Video");
