const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Assuming you have a User model
// const sendEmail = require("../middleware/emailService"); 
const { Op } = require("sequelize");

// Register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Send a confirmation email (optional)
    const emailOptions = {
      to: newUser.email,
      subject: "Welcome to Our Service",
      text: `Hello ${newUser.username},\n\nWelcome to our platform! We're excited to have you onboard.`,
      html: `<p>Hello <b>${newUser.username}</b>,<br><br>Welcome to our platform! We're excited to have you onboard.</p>`,
    };
    // await sendEmail(emailOptions);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, "123456789_apple_banana", {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  const { username, email, password } = req.body; // Now destructure username and email

  // Ensure that at least one of username or email is provided
  if (!username && !email) {
    return res.status(400).json({ message: "Username or email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Use either username or email for authentication
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: username || null }, { email: email || null }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the JWT token
    const token = jwt.sign({ userId: user.id }, "123456789_apple_banana", {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout user
const logout = (req, res) => {
  // Simply clear the token on the client side to logout the user
  res.status(200).json({
    message: "Logout successful",
  });
};

// Request password reset (send reset link)
// const requestPasswordReset = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Generate a password reset token (this could be a JWT or a random string)
//     const resetToken = jwt.sign({ userId: user.id }, "123456789_apple_banana", {
//       expiresIn: "1h",
//     });

//     // Send email with the password reset link (you can create a reset URL with the token)
//     const resetUrl = `https://erp.hirinternational.com//reset-password/${resetToken}`;
//     const emailOptions = {
//       to: user.email,
//       subject: "Password Reset Request",
//       text: `Hello ${user.username},\n\nTo reset your password, click the following link: ${resetUrl}`,
//       html: `<p>Hello <b>${user.username}</b>,<br><br>To reset your password, click the following link: <a href="${resetUrl}">${resetUrl}</a></p>`,
//     };
//     await sendEmail(emailOptions);

//     res.status(200).json({
//       message: "Password reset link sent to your email",
//     });
//   } catch (error) {
//     
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Reset password
// const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Verify the reset token
//     const decoded = jwt.verify(token, "123456789_apple_banana");

//     // Find the user by ID
//     const user = await User.findByPk(decoded.userId);
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({
//       message: "Password successfully reset",
//     });
//   } catch (error) {
//     
//     res.status(500).json({ message: "Server error" });
//   }
// };

module.exports = {
  register,
  login,
  logout,
};
