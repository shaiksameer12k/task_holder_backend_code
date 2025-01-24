function setCookie(res, key, value) {
  res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  return "Cookie Set Successfully";
}

module.exports = setCookie;
