// components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('problems');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: '',
    visibleTestCases: [{ input: '', output: '', explanation: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    startCode: [{ language: 'javascript', initialCode: '' }],
    referenceSolution: [{ language: 'javascript', completeCode: '' }]
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/problem/getAllProblems', { withCredentials: true });
      setProblems(response.data.problems);
    } catch (error) {
      setError('Failed to fetch problems');
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTestCaseChange = (index, field, value, type) => {
    const updatedTestCases = [...formData[type]];
    updatedTestCases[index][field] = value;
    
    setFormData({
      ...formData,
      [type]: updatedTestCases
    });
  };

  const addTestCase = (type) => {
    const newTestCase = type === 'visibleTestCases' 
      ? { input: '', output: '', explanation: '' }
      : { input: '', output: '' };
    
    setFormData({
      ...formData,
      [type]: [...formData[type], newTestCase]
    });
  };

  const removeTestCase = (index, type) => {
    const updatedTestCases = formData[type].filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      [type]: updatedTestCases
    });
  };

  const handleCodeChange = (index, field, value, type) => {
    const updatedCode = [...formData[type]];
    updatedCode[index][field] = value;
    
    setFormData({
      ...formData,
      [type]: updatedCode
    });
  };

  const addCodeBlock = (type) => {
    const newCodeBlock = { 
      language: 'javascript', 
      [type === 'startCode' ? 'initialCode' : 'completeCode']: '' 
    };
    
    setFormData({
      ...formData,
      [type]: [...formData[type], newCodeBlock]
    });
  };

  const removeCodeBlock = (index, type) => {
    const updatedCode = formData[type].filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      [type]: updatedCode
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        await axios.put(`/problem/update/${editingProblem._id}`, formData, { withCredentials: true });
        setEditingProblem(null);
      } else {
        await axios.post('/problem/create', formData, { withCredentials: true });
      }
      
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        difficulty: 'Easy',
        tags: '',
        visibleTestCases: [{ input: '', output: '', explanation: '' }],
        hiddenTestCases: [{ input: '', output: '' }],
        startCode: [{ language: 'javascript', initialCode: '' }],
        referenceSolution: [{ language: 'javascript', completeCode: '' }]
      });
      
      fetchProblems(); // Refresh the list
    } catch (error) {
      setError('Failed to save problem');
      console.error('Error saving problem:', error);
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags,
      visibleTestCases: problem.visibleTestCases,
      hiddenTestCases: problem.hiddenTestCases,
      startCode: problem.startCode,
      referenceSolution: problem.referenceSolution
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await axios.delete(`/problem/delete/${id}`, { withCredentials: true });
        fetchProblems(); // Refresh the list
      } catch (error) {
        setError('Failed to delete problem');
        console.error('Error deleting problem:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingProblem(null);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      difficulty: 'Easy',
      tags: '',
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: [{ input: '', output: '' }],
      startCode: [{ language: 'javascript', initialCode: '' }],
      referenceSolution: [{ language: 'javascript', completeCode: '' }]
    });
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('problems')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'problems' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Manage Problems
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Manage Users
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'problems' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Problems</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Create New Problem
                </button>
              </div>

              {showCreateForm && (
                <div className="bg-gray-100 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingProblem ? 'Edit Problem' : 'Create New Problem'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Visible Test Cases</label>
                        <button
                          type="button"
                          onClick={() => addTestCase('visibleTestCases')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          + Add Test Case
                        </button>
                      </div>
                      
                      {formData.visibleTestCases.map((testCase, index) => (
                        <div key={index} className="bg-white p-4 rounded-md border border-gray-200 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Test Case {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeTestCase(index, 'visibleTestCases')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <input
                              type="text"
                              placeholder="Input"
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value, 'visibleTestCases')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Output"
                              value={testCase.output}
                              onChange={(e) => handleTestCaseChange(index, 'output', e.target.value, 'visibleTestCases')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Explanation"
                              value={testCase.explanation}
                              onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value, 'visibleTestCases')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Hidden Test Cases</label>
                        <button
                          type="button"
                          onClick={() => addTestCase('hiddenTestCases')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          + Add Test Case
                        </button>
                      </div>
                      
                      {formData.hiddenTestCases.map((testCase, index) => (
                        <div key={index} className="bg-white p-4 rounded-md border border-gray-200 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Test Case {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeTestCase(index, 'hiddenTestCases')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Input"
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value, 'hiddenTestCases')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Output"
                              value={testCase.output}
                              onChange={(e) => handleTestCaseChange(index, 'output', e.target.value, 'hiddenTestCases')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Starter Code</label>
                        <button
                          type="button"
                          onClick={() => addCodeBlock('startCode')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          + Add Language
                        </button>
                      </div>
                      
                      {formData.startCode.map((code, index) => (
                        <div key={index} className="bg-white p-4 rounded-md border border-gray-200 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <select
                              value={code.language}
                              onChange={(e) => handleCodeChange(index, 'language', e.target.value, 'startCode')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="cpp">C++</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeCodeBlock(index, 'startCode')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <textarea
                            placeholder="Initial code"
                            value={code.initialCode}
                            onChange={(e) => handleCodeChange(index, 'initialCode', e.target.value, 'startCode')}
                            rows="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Reference Solution</label>
                        <button
                          type="button"
                          onClick={() => addCodeBlock('referenceSolution')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          + Add Language
                        </button>
                      </div>
                      
                      {formData.referenceSolution.map((code, index) => (
                        <div key={index} className="bg-white p-4 rounded-md border border-gray-200 mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <select
                              value={code.language}
                              onChange={(e) => handleCodeChange(index, 'language', e.target.value, 'referenceSolution')}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="java">Java</option>
                              <option value="cpp">C++</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeCodeBlock(index, 'referenceSolution')}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <textarea
                            placeholder="Complete solution code"
                            value={code.completeCode}
                            onChange={(e) => handleCodeChange(index, 'completeCode', e.target.value, 'referenceSolution')}
                            rows="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        {editingProblem ? 'Update Problem' : 'Create Problem'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 font-semibold text-gray-700">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-3">Tags</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {problems.length > 0 ? (
                  problems.map(problem => (
                    <div key={problem._id} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-100 hover:bg-gray-50">
                      <div className="col-span-5 font-medium">{problem.title}</div>
                      <div className={`col-span-2 font-medium ${
                        problem.difficulty === 'Easy' ? 'text-green-600' : 
                        problem.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {problem.difficulty}
                      </div>
                      <div className="col-span-3 text-gray-600">{problem.tags}</div>
                      <div className="col-span-2 flex space-x-2">
                        <button
                          onClick={() => handleEdit(problem)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-center text-gray-600">
                    No problems found. Create your first problem!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <p className="text-gray-600">User management features will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;