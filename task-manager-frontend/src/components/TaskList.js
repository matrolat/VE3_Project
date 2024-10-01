import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/tasks')
        .then(response => {
            setTasks(response.data);
            setError(null);  // Reset error on successful fetch
        })
        .catch(error => {
            console.error("There was an error fetching the tasks!", error);
            setError("There was an error fetching the tasks.");
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div>
            <h1>Task List</h1>
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>
                                {task.title} - {task.description}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default TaskList;
