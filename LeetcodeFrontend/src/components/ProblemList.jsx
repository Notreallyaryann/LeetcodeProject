// components/ProblemsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    tags: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProblems();
    } else {
      setError('Please log in to view problems');
      setLoading(false);
    }
  }, [filters, user]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError('');
      
      const API_URL = `/problem/getAllProblems?t=${Date.now()}`;
      
      const response = await axios.get(API_URL, { 
        withCredentials: true,
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.data && response.data.problems) {
        setProblems(response.data.problems);
      } else {
        setError('Unexpected response format from server');
      }
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout: Server is not responding');
      } else if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('Network error: Could not connect to server');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(problem => {
    if (filters.difficulty && problem.difficulty !== filters.difficulty) return false;
    if (filters.tags && !problem.tags.includes(filters.tags)) return false;
    return true;
  });

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
        <p className="ml-4">Loading problems...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Problems</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
            <br />
            <button 
              onClick={fetchProblems}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm mt-2"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <select 
            value={filters.difficulty} 
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <select 
            value={filters.tags} 
            onChange={(e) => setFilters({...filters, tags: e.target.value})}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            <option value="Array">Array</option>
            <option value="LinkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">Dynamic Programming</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 font-semibold text-gray-700">
          <div className="col-span-1">Status</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-3">Tags</div>
        </div>
        
        {filteredProblems.length > 0 ? (
          filteredProblems.map(problem => (
            <div key={problem._id} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-gray-100 hover:bg-gray-50">
              <div className="col-span-1 flex items-center">
                <span className="text-gray-400">○</span>
              </div>
              <div className="col-span-6">
                <Link 
                  to={`/problem/${problem._id}`} 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {problem.title}
                </Link>
              </div>
              <div className={`col-span-2 font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>
              <div className="col-span-3 text-gray-600">
                {problem.tags}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-4 text-center text-gray-600">
            {problems.length === 0 ? 'No problems found in the database.' : 'No problems match your filters.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsList;