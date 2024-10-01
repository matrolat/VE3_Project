import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Basic validation
        if (!title || !description) {
            alert("Title and description are required!");
            return;
        }
        
        setLoading(true); // Start loading state
        axios.post('http://127.0.0.1:5000/tasks', { title, description })
        .then(() => {
            navigate('/'); // Navigate back to the task list
        })
        .catch(error => {
            console.error("There was an error creating the task!", error);
        })
        .finally(() => {
            setLoading(false); // End loading state
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
            </button>
        </form>
    );
};

export default TaskForm;
