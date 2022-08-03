import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// GET, POST - join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
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
    // To Do: 회원가입시 로그인 시켜서 홈으로보내기
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
  const user = await User.findOne({ username, socialOnly: false });
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
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: "",
        location: userData.location,
        socialOnly: true,
        avatarUrl: userData.avatar_url,
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
    //console.log("user : ", userData);
    let user = await User.findOne({
      email: userData.kakao_account.email,
    });
    console.log("user : ", user);
    if (!user) {
      const email = userData.kakao_account.email;
      const username = email.split("@");
      user = await User.create({
        name: userData.kakao_account.profile.nickname,
        email,
        username: username[0],
        password: "",
        socialOnly: true,
        avatarUrl: userData.kakao_account.profile.profile_image_url,
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
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

// GET, POST - Edit
export const getEdit = (req, res) => {
  return res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, email, username },
    },
    body: { newName, newEmail, newUsername, newLocation },
  } = req;

  const boolean = email !== newEmail || username !== newUsername;
  if (boolean) {
    const usernameCheck = await User.exists({ username: newUsername });
    const emailCheck = await User.exists({ email: newEmail });

    if (email === newEmail && usernameCheck) {
      return res.status(400).render("editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "This Username is alredy taken.",
      });
    }
    if (username === newUsername && emailCheck) {
      return res.status(400).render("editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "This Email is alredy taken.",
      });
    }
    if (emailCheck && usernameCheck) {
      return res.status(400).render("editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "This Username/Email is alredy taken.",
      });
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      name: newName,
      email: newEmail,
      username: newUsername,
      location: newLocation,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

// 기본적인 동작만 수행하므로 수정 해야함
export const see = (req, res) => res.send("see User");

// Profile Edit 정리
// 유저네임과 이메일은 유니크이기 때문에 중복 확인이 필요하다.
// 중복 확인시 유저네임이 같고 이메일이 같은데 다른곳을 수정하면
// 기존에 사용하던 유저네임과 이메일이 중복된다고 오류가 발생한다.

// 세션에 저장된 유저네임과 이메일이 다른지 체크해서 다른 값이 있으면 다른값만 중복확인을 진행한다.

// email !== newEmail, username !== newUsername
// 다름, 다름 1
// 다름, 같음 1
// 같음, 다름 1
// 같음, 같음 0
// true를 반환하는 경우에만 중복확인하기
// email은 기존 값과 같고 username만 변경했을때 중복된 username이 있을 경우 오류처리
// username은 기존 값과 같고 email만 변경했을때 중복된 email이 있을 경우 오류처리
// email과 username을 변경했을때 모두 중복된 경우 오류 처리
