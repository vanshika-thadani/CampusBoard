
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken.js');

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
        return res.status(409).json({ message: "Passwords do not match!" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long!" });
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(password)) {
        return res.status(400).json({
            message: "Password must include uppercase, lowercase, number, and special character!"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await User.create({
        username,
        email,
        password: hashedPassword
    });

    newUser = await User.findById(newUser._id).select("-password");
    const token = generateToken(newUser._id);

    res.cookie("token", token, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "None"
    });

    return res.status(201).json(newUser);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "User does not exist!" });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }
        const loggedInUser = await User.findById(existingUser._id).select("-password");
        const token = generateToken(loggedInUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });

        return res.status(200).json(loggedInUser);

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/"
        });

        return res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const googleLogin = async (req, res) => {
  try {
    const { email, username, profilePhoto } = req.body;

    if (!email || !username || !profilePhoto) {
      return res.status(400).json({ message: "Missing required Google user info" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        username,
        profilephoto: profilePhoto, // ✅ match your schema
        password: null,
        authType: "google"
      });
    } else {
      user.username = username;
      user.profilephoto = profilePhoto; // ✅ match your schema
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // ✅ Set production-ready cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ Required on HTTPS (Render)
      sameSite: "None", // ✅ Required for cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilephoto: user.profilephoto
    });

  } catch (error) {
    console.error("Google Login Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { register, login, logout,googleLogin };
