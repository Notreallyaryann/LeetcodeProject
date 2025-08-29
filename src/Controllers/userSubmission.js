const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { getLanguageById, SubmitBatch, submitToken } = require('../utils/ProblemUtility');

const userSubmission = async (req, res) => {
  try {
    const user = req.user; // get logged-in user from middleware
    const userId = user._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    // Validate input
    if (!userId || !problemId || !code || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create submission record in DB
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesPassed: 0,
      status: "Pending",
      testCasesTotal: problem.hiddenTestCases.length
    });

    // Prepare Judge0 submissions for hidden test cases
    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await SubmitBatch(submissions);
    const resultTokens = submitResult.map((v) => v.token);
    const testResult = await submitToken(resultTokens);

    // Evaluate results
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "Accepted";
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status.id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else if (test.status.id === 4) {
        status = "Error";
        errorMessage = test.stderr || test.compile_output || "Error";
      } else {
        status = "Wrong Answer";
        errorMessage = test.stderr || test.compile_output || "Wrong Answer";
      }
    }

    // Update submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // Add problemId to user's problemSolved array if not already there
    if (!user.problemSolved.includes(problemId)) {
      user.problemSolved.push(problemId);
      await user.save();
    }

    res.status(201).json({
      message: "Submission successful",
      submission: submittedResult, // send full submission document
    });
  } catch (error) {
    res.status(500).json({ message: "Error in submission", error: error.message });
  }
};





const runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problemId = req.params.id;

    if (!code || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const languageId = getLanguageById(language);

    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await SubmitBatch(submissions);
    const resultTokens = submitResult.map((v) => v.token);
    const testResult = await submitToken(resultTokens);

    res.status(200).json({
      message: "Run successful",
      results: testResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in running code", error: error.message });
  }
};







module.exports = { userSubmission,runCode };



