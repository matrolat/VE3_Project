import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true); // Start loading
        axios.get(`http://localhost:5000/tasks/${id}`)
        .then(response => {
            setTask(response.data[0]); // Adjusted for the array returned in your API
            setError(null); // Clear any previous errors
        })
        .catch(error => {
            console.error("There was an error fetching the task!", error);
            setError("Task not found!"); // Set error message
        })
        .finally(() => {
            setLoading(false); // End loading
        });
    }, [id]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                task && (
                    <div>
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>
                        <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
                    </div>
                )
            )}
        </div>
    );
};

export default TaskDetails;
