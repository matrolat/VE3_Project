import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import TaskEdit from './components/TaskEdit';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext, AuthProvider } from './components/AuthContext';  // Import AuthContext and AuthProvider
import './App.css'; // Ensure this imports your custom styles and Tailwind

// Component for protecting routes that require authentication
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div className="App bg-gray-100 min-h-screen">
      <AuthProvider> {/* Wrap the app with the AuthProvider */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TaskList />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <PrivateRoute>
                  <TaskForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <PrivateRoute>
                  <TaskDetails />
                </PrivateRoute>
              }
            />
            <Route 
              path="/tasks/:id/edit" 
              element={
                <PrivateRoute>
                  <TaskEdit />
                </PrivateRoute>
              } 
            /> 
          </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
