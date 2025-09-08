
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';//
import Login from './components/Login.jsx';//
import Register from './components/Register.jsx';//
import ProblemsList from './components/ProblemList.jsx';//
import ProblemDetail from './components/ProblemDetail.jsx';//
import CodeEditor from './components/CodeEditor.jsx';//
import Profile from './components/Profile.jsx';//
import AdminPanel from './components/AdminPanel.jsx';//

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/problems" element={<ProtectedRoute><ProblemsList /></ProtectedRoute>} />
            <Route path="/problem/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
            <Route path="/solve/:id" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
}

function Home() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4">
      <div className="py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to CodeSolve</h1>
        <p className="text-xl text-gray-600 mb-8">Sharpen your coding skills with our collection of programming challenges</p>
        {!user && (
          <div className="space-x-4">
            <a href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md">Login</a>
            <a href="/register" className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-md">Register</a>
          </div>
        )}
      </div>
      
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Diverse Problem Set</h3>
            <p className="text-gray-600">Problems ranging from Easy to Hard difficulty levels</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Multiple Languages</h3>
            <p className="text-gray-600">Support for C++, Java, and JavaScript</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Real-time Evaluation</h3>
            <p className="text-gray-600">Get immediate feedback on your solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;