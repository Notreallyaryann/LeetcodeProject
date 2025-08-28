const axios = require('axios');

const getLanguageById = (lang) => {
  if (!lang) return undefined;

  const normalized = lang.toLowerCase().trim();

  const language = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 63,
    "js": 63
  };

  return language[normalized];
};

const SubmitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: { base64_encoded: 'false' },
    headers: {
      'x-rapidapi-key': '18aeb09e10mshabe180218d09302p1ff10cjsnc9bb03ce7bdf', 
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: { submissions }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

const waiting = async (timer) => {
  return new Promise(resolve => setTimeout(resolve, timer));
};

const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(','),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': '18aeb09e10mshabe180218d09302p1ff10cjsnc9bb03ce7bdf', 
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  }

  while (true) {
    const result = await fetchData();

    if (!result || !result.submissions) {
      return [];
    }

    const isResultObtained = result.submissions.every((r) => r.status && r.status.id > 2);

    if (isResultObtained) {
      return result.submissions;
    }

    await waiting(1000);
  }
};

module.exports = { getLanguageById, SubmitBatch, submitToken };














