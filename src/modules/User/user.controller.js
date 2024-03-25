import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../../DB/Models/user.model.js";
import sendEmailService from "../../services/send-email.service.js";

//!============================= assignment ================================//

//?============================= get user data ================================//

export const getUserData = async (req, res, next) => {
  const { accesstoken } = req.headers;

  const authUser = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);

  const user = await User.findById(authUser.id).select("-password"); //-password to exclude password from fetched data

  const { username, email, age, addresses, phoneNumbers } = user;

  res.status(200).json({
    success: true,
    message: "User data fetched successfully",
    username,
    email,
    age,
    phoneNumbers,
    addresses,
  });
};

//?============================= update user data ================================//
export const updateAccount = async (req, res, next) => {
  const { username, age, phoneNumbers, addresses } = req.body;

  const { accesstoken } = req.headers;

  const authUser = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);

  const user = await User.findById(authUser.id);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const updatedUser = await User.findByIdAndUpdate(user, {
    username: username || user.username,
    age: age || user.age,
    phoneNumbers: phoneNumbers || user.phoneNumbers,
    addresses: addresses || user.addresses,
  });

  res.status(200).json({
    success: true,
    message: "User account updated successfully",
    username,
    age,
    phoneNumbers,
    addresses,
  });
};

//?============================= delete user account ================================//
export const deleteAccount = async (req, res, next) => {
  const { accesstoken } = req.headers;

  const authUser = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);

  const user = await User.findById(authUser.id);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  await User.findByIdAndUpdate(user, {
    isDeleted: true,
    deletedAt: Date.now(),
  });

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
};
//?============================= change password ================================//
export const changePassword = async (req, res, next) => {
  const { accesstoken } = req.headers;
  const { oldPassword, newPassword } = req.body;

  const authUser = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);

  const user = await User.findById(authUser.id);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  // Compare the old password provided by the user with the hashed password in the database
  const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: "Incorrect old password" });
  }

  // Hash the new password
  const hashedNewPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

  // Update the user's password with the new hashed password
  user.password = hashedNewPassword;
  await user.save();

  // Return success response
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
}

//?============================= forget password ================================//
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Generate a unique token for password reset
  const resetToken = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "1h",
  });

  // Send reset password email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Reset Password",
    message: `
            <h2>Please click on the following link to reset your password:</h2>
            <a href="${req.protocol}://${req.headers.host}/auth/reset-password?token=${resetToken}">Reset Password</a>
        `,
  });

  if (!isEmailSent) {
    return next(
      new Error("Failed to send reset password email", { cause: 500 })
    );
  }

  res.status(200).json({
    success: true,
    message: "Reset password instructions sent to your email",
    token: resetToken,
  });
};

//?============================= reset password ================================//

export const resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const { token } = req.params; // Receive token from params

  // Verify the token
  const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
  const targetedEmail = decoded?.email;

  // Find user by email
  const user = await User.findOne({ email: targetedEmail });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Update user's password
  const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};
