import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const TaskEdit = () => {
  const { id } = useParams();  // Get task ID from the URL
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false); // Add completed state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch task details when the component mounts
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/tasks/${id}`)
      .then(response => {
        const task = response.data;
        setTitle(task.title);
        setDescription(task.description);
        setCompleted(task.completed); // Set completed status from API
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load task');
        setLoading(false);
      });
  }, [id]);

  // Handle form submission to update the task
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.put(`http://127.0.0.1:5000/tasks/${id}`, { 
      title, 
      description, 
      completed // Include completed status in the request
    })
      .then(() => {
        navigate('/');  // Navigate back to the task list after editing
      })
      .catch(err => {
        setError('Failed to update task');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-600">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Edit Task
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading task...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700">
                Task Title
              </label>
              <div className="mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faTasks} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700">
                Task Description
              </label>
              <div className="mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400" />
                </div>
                <textarea
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                  placeholder="Enter task description"
                  rows="8" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className={`w-full py-2 px-4 text-white font-bold rounded-md shadow-md ${
                  loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                }`}
                disabled={loading}
              >
                {loading ? 'Updating Task...' : 'Update Task'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TaskEdit;
