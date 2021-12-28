const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(409).json({ msg: "E-mail has been used" });
    
    user = await User.findOne({ username: { $regex: new RegExp(`${req.body.username}$`, "i") } });
    if (user) return res.status(409).json({ msg: "Username has been used" });

    const newUser = new User({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });
    user = await newUser.save();
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;

    return res.status(201).json({ ...info, accessToken });
  } catch (err) {
    return res.status(500).json({msg: err})
  }
})
function checkEmail(email) {
  return (String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) ? true: false
}
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const isEmail = checkEmail(req.body.email)
    const user = isEmail ? await User.findOne({ email: req.body.email.toLowerCase() }) : await User.findOne({ username: { $regex: new RegExp(`${req.body.email}$`, "i") } })
    if(!user) return res.status(401).json({ msg: `${isEmail? "Wrong E-mail": "Wrong Username"}`});

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

    if(originalPassword !== req.body.password) return res.status(401).json({ msg: "Wrong password!" })

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc

    return res.status(200).json({ ...info, accessToken })
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router;
