// import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
// import { User } from "../models/userSchema.js";
// import ErrorHandler from "../middlewares/error.js";
// import { sendToken } from "../utils/jwtToken.js";

// export const register = catchAsyncErrors(async (req, res, next) => {
//   const { name, email, phone, password, role } = req.body;
//   if (!name || !email || !phone || !password || !role) {
//     return next(new ErrorHandler("Please fill full form!"));
//   }
//   const isEmail = await User.findOne({ email });
//   if (isEmail) {
//     return next(new ErrorHandler("Email already registered!"));
//   }
//   const user = await User.create({
//     name,
//     email,
//     phone,
//     password,
//     role,
//   });
//   sendToken(user, 201, res, "User Registered!");
// });

// export const login = catchAsyncErrors(async (req, res, next) => {
//   const { email, password, role } = req.body;
//   if (!email || !password || !role) {
//     return next(new ErrorHandler("Please provide email ,password and role."));
//   }
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new ErrorHandler("Invalid Email Or Password.", 400));
//   }
//   const isPasswordMatched = await user.comparePassword(password);
//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Invalid Email Or Password.", 400));
//   }
//   if (user.role !== role) {
//     return next(
//       new ErrorHandler(`User with provided email and ${role} not found!`, 404)
//     );
//   }
//   sendToken(user, 201, res, "User Logged In!");
// });

// export const logout = catchAsyncErrors(async (req, res, next) => {
//   res
//     .status(201)
//     .cookie("token", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .json({
//       success: true,
//       message: "Logged Out Successfully.",
//     });
// });


// export const getUser = catchAsyncErrors((req, res, next) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });



import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Register a new user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }

  // Check if the email is already registered
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!", 400));
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Send token after successful registration
  sendToken(user, 201, res, "User Registered!");
});

// User login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role.", 400));
  }

  // Find the user by email and select the password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Compare the provided password with the stored password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Check if the user's role matches the provided role
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and role ${role} not found!`, 404)
    );
  }

  // Send token after successful login
  sendToken(user, 200, res, "User Logged In!");
});

// User logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

// Get the currently logged-in user
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
