import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// GET, POST - join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { firstName, name, email, username, password, password2, channelName } =
    req.body;
  const pageTitle = "Join";

  const colors = ["blue", "green", "purple", "orange", "brown"];
  const randomColor = Math.floor(Math.random() * colors.length);

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
    const user = await User.create({
      firstName,
      name,
      email,
      username,
      password,
      channelName,
      profileColor: colors[randomColor],
    });
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
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
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
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
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      const colors = ["blue", "green", "purple", "orange", "brown"];
      const randomColor = Math.floor(Math.random() * colors.length);
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: "",
        channelName: userData.name,
        socialOnly: true,
        profileColor: colors[randomColor],
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
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
    // console.log("user : ", userData);
    let user = await User.findOne({
      email: userData.kakao_account.email,
    });
    //console.log("user : ", user);

    if (!user) {
      const fullName = userData.kakao_account.profile.nickname;
      const firstName = fullName.match(/^([ㄱ-ㅎ|ㅏ-ㅣ|가-힣])/);
      const lastName = fullName
        .match(/(?!^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣])+([ㄱ-ㅎ|ㅏ-ㅣ|가-힣])/g)
        .join("");
      const email = userData.kakao_account.email;
      const username = email.split("@");
      const colors = ["blue", "green", "purple", "orange", "brown"];
      const randomColor = Math.floor(Math.random() * colors.length);
      user = await User.create({
        firstName: firstName[0],
        name: lastName,
        email,
        username: username[0],
        password: "",
        socialOnly: true,
        profileColor: colors[randomColor],
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    res.redirect("/");
  }
};

// Log Out
export const logout = async (req, res) => {
  await req.session.destroy();
  return res.status(200).redirect("/");
};

// GET, POST - Edit
export const getEdit = (req, res) => {
  return res.render("users/editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const path = "users/editProfile";
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id, email, username, avatarUrl },
    },
    body: { newName, newFirstName, newEmail, newUsername, newChannelName },
    file,
  } = req;
  const boolean = email !== newEmail || username !== newUsername;
  if (boolean) {
    const usernameCheck = await User.exists({ username: newUsername });
    const emailCheck = await User.exists({ email: newEmail });

    if (email === newEmail && usernameCheck) {
      return res.status(400).render(path, {
        pageTitle,
        errorMessage: "This Username is alredy taken.",
      });
    }
    if (username === newUsername && emailCheck) {
      return res.status(400).render(path, {
        pageTitle,
        errorMessage: "This Email is alredy taken.",
      });
    }
    if (emailCheck && usernameCheck) {
      return res.status(400).render(path, {
        pageTitle,
        errorMessage: "This Username/Email is alredy taken.",
      });
    }
  }

  const avatarPath = file.location ? file.location : file.path;

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      firstName: newFirstName,
      name: newName,
      email: newEmail,
      username: newUsername,
      channelName: newChannelName,
      avatarUrl: file ? avatarPath : avatarUrl,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.status(200).redirect(`/users/${_id}`);
};

// GET, POST - Change Password
export const getChangePassword = (req, res) => {
  return res.render("users/changePassword", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const path = "users/changePassword";
  const {
    body: { currentPassword, newPassword, newPassword2 },
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id);
  const passwordCheck = await bcrypt.compare(currentPassword, user.password);
  if (!passwordCheck) {
    return res.status(400).render(path, {
      pageTitle,
      errorMessage: "Current passwords do not match.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render(path, {
      pageTitle,
      errorMessage: "New passwords do not match.",
    });
  }
  if (currentPassword === newPassword) {
    return res.status(400).render(path, {
      pageTitle,
      errorMessage:
        "Your new password cannot be the same as your current password",
    });
  }

  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  return res.redirect("/users/edit");
};

// Profile See
export const see = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("videos");
    return res.render("users/profile", {
      pageTitle: user.name,
      user,
    });
  } catch (error) {
    return res.status(400).render("404");
  }
};
