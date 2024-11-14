import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userCommands } from '../../apis/user_apis.js'; // Assuming userCommands has the necessary API calls
import { HelperFunctions } from '../../helpers/functions.js';

function DeleteUser(props){
    const { id } = useParams(); // Assuming the user ID is passed in the URL
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleDelete = () => {
        const role = localStorage.getItem('role');
        HelperFunctions.CheckIfRoleIsAllowed(role, props.rolesAllowed);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }
        userCommands.deleteUser(id, token)
            .then(() => {
                alert('User deleted successfully!');
                navigate('/adminhome'); // Redirect after deletion
            })
            .catch(() => {
                alert('Error deleting user.');
            });
    };

    const handleCancel = () => {
        navigate('/adminhome');
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h2>Are you sure you want to delete user {id}?</h2>
            <button className="btn btn-danger" onClick={handleDelete}>Yes</button>
            <button className="btn btn-secondary ml-2" onClick={handleCancel}>No</button>
        </div>
    );
}

export default DeleteUser;