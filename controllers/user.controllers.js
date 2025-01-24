const { users, userprofiles } = require("../models/user.model");
const Success = require("../common/Success");
const GlobalErrorHandler = require("../common/Error");
const generateJwtToken = require("../common/generateToken");
const { default: mongoose, trusted } = require("mongoose");
const { encrypt, dycrypt } = require("../common/cryptoHashing");

async function userRegisterController(req, res) {
  let { email } = req?.body;

  try {
    const userData = await users.findOne({ email: email });

    if (userData) {
      const globalError = new GlobalErrorHandler(
        409,
        "Given Email is Already Existed !",
        true
      );
      const errorResponse = globalError.formatErrorResponse();
      return res.status(200).json(errorResponse);
    }

    let passwordHashData = {
      ...req?.body,
      password: encrypt(req?.body?.password),
      orgPassword: req?.body?.password,
    };

    const newuserData = new users(passwordHashData);

    const newuserProfileData = new userprofiles({
      registeredUserId: newuserData?._id,
      userName: newuserData?.userName,
    });

    await newuserData.save();
    await newuserProfileData.save();

    let succesRes = new Success(
      200,
      "Success",
      "Successfully Account Created",
      true,
      []
    );

    res.status(succesRes?.statusCode).json(succesRes);
  } catch (err) {
    let error = new GlobalErrorHandler(500, "error", true, err);
    return res.status(error?.statusCode).json(error);
  }
}

async function deleteRegisterUserController(req, res) {
  let { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new GlobalErrorHandler(
      400,
      "Invalid ObjectId format",
      true,
      "The provided userId is not valid."
    );
    return res.status(error.statusCode).json(error.formatErrorResponse());
  }

  try {
    await users.deleteOne({ _id: userId });
    await userprofiles.deleteOne({
      registeredUserId: userId,
    });

    const successRes = new Success(
      200,
      "success",
      "Successfully Account Deleted",
      true,
      []
    );
    return res.status(successRes.statusCode).json(successRes);
  } catch (err) {
    const error = new GlobalErrorHandler(
      500,
      "Internal Server Error While Deleteing Record",
      true,
      err
    );
    const formattedError = error.formatErrorResponse();

    return res.status(error.statusCode).json(formattedError);
  }
}

async function userLoginController(req, res) {
  let { userName, password } = req?.body;

  let isUserName =
    (await users.findOne({ userName })) ||
    (await users.findOne({ email: userName }));

  if (!isUserName) {
    let errorData = new GlobalErrorHandler(
      401,
      "No User Found ! Please Register",
      true,
      null
    );
    let formatErrorResponse = errorData?.formatErrorResponse();
    return res.status(200).json(formatErrorResponse);
  }

  if (password !== dycrypt(isUserName?.password)) {
    let errorData = new GlobalErrorHandler(401, "Wrong Password", true, null);
    let formatErrorResponse = errorData?.formatErrorResponse();
    return res.status(200).json(formatErrorResponse);
  }

  let token = generateJwtToken(userName, res);

  // isUserName = { ...isUserName, isActive: true };
  isUserName.isActive = true;

  await isUserName.save();

  let successData = new Success(
    200,
    "success",
    "Successfully Login Completed",
    true,
    {
      token: token,
      userDetails: isUserName,
    }
  );

  return res.status(successData?.statusCode).json(successData);
}

async function userLogoutController(req, res) {
  let { userId } = req.body;

  let userData = await users.findById(userId);
  userData.isActive = false;
  await userData.save();
  console.log("userData", userData);

  // res.clearCookie("token");

  let successData = new Success(
    200,
    "success",
    "Successfully Logout Completed",
    true,
    []
  );
  return res.status(successData?.statusCode).json(successData);
}

async function userProfile(req, res) {
  let { userId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new GlobalErrorHandler(
      400,
      "Invalid ObjectId format",
      true,
      "The provided userId is not valid."
    );
    return res.status(error.statusCode).json(error.formatErrorResponse());
  }

  try {
    // Call the model to get user data
    let userData = await userprofiles.findOne({ registeredUserId: userId });

    // If no data is found, return a "No Data" response
    if (!userData) {
      const successRes = new Success(200, "success", "No Data", false, []);
      return res.status(successRes.statusCode).json(successRes);
    }

    // If data is found, return the user data
    const successRes = new Success(200, "success", "", false, userData);
    return res.status(successRes.statusCode).json(successRes);
  } catch (err) {
    // Handle any errors during the process
    const error = new GlobalErrorHandler(
      500,
      "Internal Server Error",
      true,
      err
    );
    const formattedError = error.formatErrorResponse();

    return res.status(error.statusCode).json(formattedError);
  }
}

async function getRegisterUsers(req, res) {
  try {
    let usersData = await users.find();
    let successData = new Success(
      200,
      "success",
      "Registered Users",
      true,
      usersData
    );
    return res.status(successData?.statusCode).json(successData);
  } catch (error) {
    let errorData = new GlobalErrorHandler(
      400,
      "While Fetching All Registers Data",
      true,
      error
    );

    return res
      .status(errorData?.statusCode)
      .json(errorData?.formatErrorResponse());
  }
}

async function addTask(req, res) {
  let { userId, title, description } = req.body;

  try {
    let isUserData = await userprofiles.findOneAndUpdate(
      { registeredUserId: userId },
      { $push: { userTasks: { title, description } } },
      { new: true }
    );

    let successData = new Success(
      200,
      "success",
      "Successfully Task Added",
      true,
      [isUserData]
    );
    return res.status(successData?.statusCode).json(successData);
  } catch (error) {
    let errorData = new GlobalErrorHandler(
      400,
      "While Inserting Tasks",
      true,
      error
    );

    return res
      .status(errorData?.statusCode)
      .json(errorData?.formatErrorResponse());
  }
}

async function deleteTask(req, res) {
  console.log("Res body", req.body);
  let { userId, taskId } = req.body;

  try {
    let isUserData = await userprofiles.findOne({ registeredUserId: userId });

    let updateTaskList = isUserData?.userTasks.filter(
      (task) => task._id.toString() !== taskId
    );

    isUserData.userTasks = updateTaskList;

    await isUserData.save();

    let successData = new Success(
      200,
      "success",
      "Successfully Task Deleted",
      true,
      [isUserData]
    );
    return res.status(successData?.statusCode).json(successData);
  } catch (error) {
    let errorData = new GlobalErrorHandler(
      400,
      "While Deleting Tasks",
      true,
      error
    );

    return res
      .status(errorData?.statusCode)
      .json(errorData?.formatErrorResponse());
  }
}

async function updateTask(req, res) {
  console.log("req.body", req.body);
  let { userId, taskId, title, description, status } = req.body;

  try {
    let isUserData = await userprofiles.findOne({ registeredUserId: userId });

    let updateTaskList = isUserData?.userTasks.map((item) =>
      item._id.toString() == taskId
        ? { ...item, title, description, status }
        : item
    );

    isUserData.userTasks = updateTaskList;

    await isUserData.save();

    let successData = new Success(
      200,
      "success",
      "Successfully Task Updated",
      true,
      [isUserData]
    );
    return res.status(successData?.statusCode).json(successData);
  } catch (error) {
    let errorData = new GlobalErrorHandler(
      400,
      "While Deleting Tasks",
      true,
      error
    );

    return res
      .status(errorData?.statusCode)
      .json(errorData?.formatErrorResponse());
  }
}

async function getTasks(req, res) {
  let { userId } = req.query;

  console.log("testhello", req.query);

  try {
    let isUserData = await userprofiles.findOne({ registeredUserId: userId });
    let taskData = isUserData?.userTasks?.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    console.log("sorted task data:", taskData);

    let successData = new Success(
      200,
      "success",
      `${taskData.length > 0 ? "Successfully Fetched Task Data" : "No Tasks"}`,
      false,
      taskData
    );
    return res.status(successData?.statusCode).json(successData);
  } catch (error) {
    let errorData = new GlobalErrorHandler(
      400,
      "While Deleting Tasks",
      true,
      error
    );

    return res
      .status(errorData?.statusCode)
      .json(errorData?.formatErrorResponse());
  }
}

module.exports = {
  userRegisterController,
  deleteRegisterUserController,
  userLoginController,
  userLogoutController,
  userProfile,
  getRegisterUsers,
  addTask,
  deleteTask,
  updateTask,
  getTasks,
};
