const { getLanguageById, SubmitBatch, submitToken } = require('../utils/ProblemUtility');
const Problem = require('../models/problem');

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

module.exports = { createProblem };







