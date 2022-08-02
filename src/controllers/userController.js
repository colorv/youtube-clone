import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

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
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

// get, post - Log in
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

// github login
export const githubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const githubLoginCallback = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      await existingUser.updateOne({ githubLogin: true });
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: "",
        githubLogin: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

// Kakao Login
export const kakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_KEY,
    redirect_uri: process.env.KAKAO_REDIRECT_URL,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};
export const kakaoLoginCallback = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_KEY,
    redirect_uri: process.env.KAKAO_REDIRECT_URL,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const token = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  ).json();
  //console.log("token : ", token);
  if ("access_token" in token) {
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
    ).json();
    //console.log("user : ", userData);
    const existingUser = await User.findOne({
      email: userData.kakao_account.email,
    });
    if (existingUser) {
      await existingUser.updateOne({ kakaoLogin: ture });
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const email = userData.kakao_account.email;
      const username = email.split("@");
      const user = await User.create({
        name: userData.kakao_account.profile.nickname,
        email,
        username: username[0],
        password: "",
        kakaoLogin: true,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

// 기본적인 동작만 수행하므로 수정 해야함
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("LogOut");
export const see = (req, res) => res.send("see User");
