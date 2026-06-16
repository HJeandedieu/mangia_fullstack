import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res
      .status(200)
      .json({ success: true, message: "Login successful", data: result });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
