import User from "../models/User";

// get,post - join
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  // password 확인
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Unmatched Password",
    });
  }
  // username, email 중복확인
  const validation = await User.exists({ $or: [{ username }, { email }] });
  if (validation) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is alredy taken.",
    });
  }
  await User.create({
    name,
    email,
    username,
    password,
    location,
  });
  return res.redirect("/login");
};

// 기본적인 동작만 수행하므로 수정 해야함
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("LogOut");
export const see = (req, res) => res.send("see User");
