
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    tags: ''
  });

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/problem/getAllProblems', { withCredentials: true });
      setProblems(response.data.problems);
    } catch (error) {
      setError('Failed to fetch problems');
      console.error('Error fetching problems:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Problems</h1>
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
        
        {filteredProblems.map(problem => (
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
        ))}
      </div>
    </div>
  );
};

export default ProblemsList;