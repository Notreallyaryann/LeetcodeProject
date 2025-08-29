const { getLanguageById, SubmitBatch, submitToken } = require('../utils/ProblemUtility');
const Problem = require('../models/problem');

const User = require('../models/user');  


// ------------------ CREATE ------------------
const createProblem = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Missing request body" });
  }

  const { 
    title, 
    description, 
    difficulty, 
    tags, 
    visibleTestCases, 
    hiddenTestCases, 
    startCode, 
    referenceSolution 
  } = req.body;

  try {
    // Validate reference solutions against visible test cases
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await SubmitBatch(submissions);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res.status(400).json({
          message: "Judge0 submission failed",
          submitResult
        });
      }

      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      if (!testResult || !Array.isArray(testResult)) {
        return res.status(400).json({
          message: "Judge0 submission failed (no results)",
          submitResult
        });
      }

      for (const test of testResult) {
        if (!test.status || test.status.id !== 3) {
          return res.status(400).json({
            message: "Reference solution failed on visible test cases",
            failingCase: test
          });
        }
      }
    }

    // Store in DB
    await Problem.create({
      ...req.body,
      problemCreator: req.user._id, 
    });

    res.status(201).json({ message: "Problem created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in creating problem", error: error.message });
  }
};

// ------------------ UPDATE ------------------
const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    difficulty, 
    tags, 
    visibleTestCases, 
    hiddenTestCases, 
    startCode, 
    referenceSolution 
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Problem ID is required" });
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Validate new reference solution (same as in create)
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await SubmitBatch(submissions);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res.status(400).json({
          message: "Judge0 submission failed",
          submitResult
        });
      }

      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      if (!testResult || !Array.isArray(testResult)) {
        return res.status(400).json({
          message: "Judge0 submission failed (no results)",
          submitResult
        });
      }

      for (const test of testResult) {
        if (!test.status || test.status.id !== 3) {
          return res.status(400).json({
            message: "Reference solution failed on visible test cases",
            failingCase: test
          });
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    res.status(200).json({ message: "Problem updated successfully", newProblem });
  } catch (error) {
    res.status(500).json({ message: "Error in updating problem", error: error.message });
  }
};

// ------------------ DELETE ------------------
const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Problem ID is required" });
    }
    const deleteProblem = await Problem.findByIdAndDelete(id);

    if (!deleteProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted successfully", deleteProblem });
  } catch (error) {
    res.status(500).json({ message: "Error in deleting problem", error: error.message });
  }
};

// ------------------ GET BY ID ------------------
const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Problem ID is required" });
    }

    const getProblem = await Problem.findById(id).select('title description difficulty tags visibleTestCases startCode');
    if (!getProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({
      message: "Problem fetched successfully",
      getProblem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching problem",
      error: error.message,
    });
  }
};

// ------------------ GET ALL (with pagination & filters) ------------------
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).select('_id title difficulty tags');

    if (!problems || problems.length === 0) {
      return res.status(404).json({ message: "No problems found" });
    }

    res.status(200).json({
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching problems",
      error: error.message,
    });
  }
};



const solvedAllProblembyUser = async (req, res) => {
  try {
    const userId = req.user._id;

  
    const user = await User.findById(userId).populate({
      path:'problemSolved',
      select:'_id title difficulty tags'
    
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const solvedProblems = user.problemSolved;

    res.status(200).json({
      totalSolved: solvedProblems.length,
      solvedProblems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching solved problems",
      error: error.message,
    });
  }
};


const submittedProblem=async (req, res) => {
  try {
    const userId = req.user._id;
    const { pid } = req.params.pid;
    const ans=await Submission.find({userId,problemId:pid})
  
    if(ans.length===0){
      res.status(404).send({message:"No submission found"})
    }
res.status(200).send(ans)
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching submitted problems",
    })
  }
}




// ------------------ EXPORTS ------------------
module.exports = { 
  createProblem, 
  updateProblem, 
  deleteProblem, 
  getProblemById, 
  getAllProblems ,
  solvedAllProblembyUser,
  submittedProblem
};








