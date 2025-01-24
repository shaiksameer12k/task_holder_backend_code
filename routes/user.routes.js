const express = require("express");
const userControllers = require("../controllers/user.controllers");
const verifyToken = require("../middlewares/verifyToken");

const userRouter = express.Router();

userRouter.get("/", userControllers.getRegisterUsers);

userRouter.post("/registerUser", userControllers.userRegisterController);
userRouter.delete(
  "/registerUser",
  userControllers.deleteRegisterUserController
);
userRouter.get("/getRegisterUsers", userControllers.getRegisterUsers);

userRouter.post("/login", userControllers.userLoginController);
userRouter.post("/logout", verifyToken, userControllers.userLogoutController);

userRouter.get("/profile", verifyToken, userControllers.userProfile);

userRouter.post("/task", verifyToken, userControllers.addTask);
userRouter.delete("/task", verifyToken, userControllers.deleteTask);
userRouter.put("/task", verifyToken, userControllers.updateTask);
userRouter.get("/task", verifyToken, userControllers.getTasks);

module.exports = userRouter;
