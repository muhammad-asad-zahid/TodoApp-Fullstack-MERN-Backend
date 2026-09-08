const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cookie configuration for Next.js compatibility
const COOKIE_OPTIONS = {
 httpOnly: true,
  secure: false, // Must be FALSE on localhost (HTTP), TRUE only in production (HTTPS)
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const userSignup = async (req, res) => {
  try {
    const { email, username, password } = req.body || {};

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existedUser = await User.findOne({ email: normalizedEmail });
    if (existedUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie so Next.js Middleware can read it automatically
    res.cookie("auth_token", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Select password explicitly if your schema has select: false
    const existedUser = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!existedUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validatePassword = await bcrypt.compare(password, existedUser.password);
    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: existedUser._id, email: existedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie for Next.js
    res.cookie("auth_token", token, COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existedUser._id,
        username: existedUser.username,
        email: existedUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the cookie with the identical options used when setting it
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS)
      sameSite: 'lax',
      path: '/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = { userSignup, userlogin  , logout};