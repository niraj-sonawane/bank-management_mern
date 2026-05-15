const {
  generateToken,
  registerUser,
  loginUser,
  getUserById,
} = require("../services/authService");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const token = generateToken(user._id);

    res
      .cookie("token", token, cookieOptions())
      .status(201)
      .json({
        user: {
          id: user._id,
          $id: user._id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        token
      });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const token = generateToken(user._id);

    res
      .cookie("token", token, cookieOptions())
      .status(200)
      .json({
        user: {
          id: user._id,
          $id: user._id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
  } catch (error) {
    return res.status(401).json({ message: error.message || "Login failed" });
  }
};

const me = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        $id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load user" });
  }
};

const logout = async (_req, res) => {
  res
    .clearCookie("token", cookieOptions())
    .status(200)
    .json({ message: "Logged out" });
};

module.exports = {
  register,
  login,
  me,
  logout,
};

