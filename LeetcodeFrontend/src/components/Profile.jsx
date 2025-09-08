
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('solved');

  useEffect(() => {
    fetchSolvedProblems();
  }, []);

  const fetchSolvedProblems = async () => {
    try {
      const response = await axios.get('/problem/problemSolvedByUser', { withCredentials: true });
      setSolvedProblems(response.data.solvedProblems || []);
    } catch (error) {
      setError('Failed to fetch solved problems');
      console.error('Error fetching solved problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-gray-200 rounded-full h-24 w-24 flex items-center justify-center text-4xl font-bold text-gray-700 mx-auto">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-center mt-4">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600 text-center">{user.emailId}</p>
            </div>

            <div className="md:w-2/3 md:pl-8">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2">Progress Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded shadow text-center">
                    <div className="text-2xl font-bold text-blue-600">{solvedProblems.length}</div>
                    <div className="text-sm text-gray-600">Solved</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {solvedProblems.filter(p => p.difficulty === 'Medium').length}
                    </div>
                    <div className="text-sm text-gray-600">Medium</div>
                  </div>
                  <div className="bg-white p-3 rounded shadow text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {solvedProblems.filter(p => p.difficulty === 'Hard').length}
                    </div>
                    <div className="text-sm text-gray-600">Hard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mt-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('solved')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'solved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Solved Problems
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Statistics
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'solved' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Solved Problems ({solvedProblems.length})</h3>
                {solvedProblems.length > 0 ? (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    {solvedProblems.map(problem => (
                      <div key={problem._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{problem.title}</span>
                          <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="mt-2">
                          {problem.tags.split(',').map((tag, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">You haven't solved any problems yet.</p>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-medium mb-2">Difficulty Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Easy</span>
                        <span className="font-medium text-green-600">
                          {solvedProblems.filter(p => p.difficulty === 'Easy').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium</span>
                        <span className="font-medium text-yellow-600">
                          {solvedProblems.filter(p => p.difficulty === 'Medium').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hard</span>
                        <span className="font-medium text-red-600">
                          {solvedProblems.filter(p => p.difficulty === 'Hard').length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-medium mb-2">Activity</h4>
                    <p className="text-gray-600">Your recent activity will appear here.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;