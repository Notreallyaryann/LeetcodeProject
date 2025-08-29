const express = require("express");
const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

const { 
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  solvedAllProblembyUser,
  submittedProblem
} = require("../Controllers/userProblem");

// ------------------ ADMIN ROUTES ------------------
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

// ------------------ USER ROUTES ------------------
problemRouter.get("/ProblemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblems", userMiddleware, getAllProblems);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);

module.exports = problemRouter;
