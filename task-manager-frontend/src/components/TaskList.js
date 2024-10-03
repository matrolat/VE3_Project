import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tasks')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch tasks');
        setLoading(false);
      });
  }, []);

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      axios
        .delete(`http://127.0.0.1:5000/tasks/${taskId}`)
        .then(() => {
          setTasks(tasks.filter(task => task.id !== taskId));
        })
        .catch(err => {
          console.error('Failed to delete task', err);
        });
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg text-gray-500">Loading tasks...</div>;
  if (error) return <div className="text-center mt-10 text-lg text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-600 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-5xl">
        {/* Add New Task Button */}
        <div className="flex justify-end mb-8">
          <Link
            to="/tasks/new"
            className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded-md shadow-md"
          >
            Add New Task
          </Link>
        </div>

        {/* Task List */}
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          Your Task List
        </h1>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <li key={task.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <div className="flex space-x-4">
                  {/* Edit Task */}
                  <Link to={`/tasks/${task.id}/edit`} className="text-blue-500 hover:text-blue-700">
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  {/* Delete Task */}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
