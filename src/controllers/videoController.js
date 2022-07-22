export const trending = (req, res) => res.send("Home page Videos");
export const search = (req, res) => res.send("Search Videos");
export const see = (req, res) => {
  console.log(req.params);
  return res.send(`Watch Video #${req.params.id}`);
};
export const edit = (req, res) => {
  console.log(req.params);
  res.send("Edit Video");
};
export const upload = (req, res) => res.send("Upload Video");
export const removeVideo = (req, res) => {
  console.log(req.params);
  res.send("Remove Video");
};
