const testUser = {
  username: "LimSuHyoek",
  loggedIn: true,
};

export const trending = (req, res) => {
  const testVideos = [
    {
      title: "First Video",
      rating: 4,
      comments: 12,
      createdAt: "5 minutes ago",
      views: 159,
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
  return res.render("home", { pageTitle: "Home", testUser, testVideos });
};

export const search = (req, res) => res.send("Search Videos");
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => {
  console.log(req.params);
  res.send("Edit Video");
};
export const upload = (req, res) => res.send("Upload Video");
export const removeVideo = (req, res) => {
  console.log(req.params);
  res.send("Remove Video");
};
