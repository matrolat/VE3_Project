import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/tasks/${id}`)
      .then(response => {
        setTask(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch task details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="text-gray-700">{task.description}</p>
      <div className="mt-6">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Back to Tasks
        </Link>
      </div>
    </div>
  );
};

export default TaskDetails;
