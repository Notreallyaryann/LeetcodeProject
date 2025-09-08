
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`/problem/ProblemById/${id}`, { withCredentials: true });
      setProblem(response.data.getProblem);
    } catch (error) {
      setError('Failed to fetch problem details');
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{problem.title}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {problem.tags.split(',').map((tag, index) => (
              <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'solutions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Solutions
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'submissions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Submissions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Examples:</h3>
              {problem.visibleTestCases.map((testCase, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="font-medium">Example {index + 1}:</p>
                  <p><strong>Input:</strong> {testCase.input}</p>
                  <p><strong>Output:</strong> {testCase.output}</p>
                  {testCase.explanation && (
                    <p><strong>Explanation:</strong> {testCase.explanation}</p>
                  )}
                </div>
              ))}
              
              <div className="mt-6">
                <Link
                  to={`/solve/${problem._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Solve Problem
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'solutions' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Starter Code</h3>
              {problem.startCode.map((code, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-medium mb-2">{code.language}</h4>
                  <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto">
                    {code.initialCode}
                  </pre>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'submissions' && (
            <div>
              <p className="text-gray-600">Your submissions will appear here once you solve the problem.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;