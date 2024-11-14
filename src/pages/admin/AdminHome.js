import React, { useState, useEffect } from 'react';
import { userCommands } from '../../apis/user_apis.js';
import '../../css/admin/AdminHome.css'; // Additional styles
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import NavbarAdmin from './Navbar.js';
import { HelperFunctions } from '../../helpers/functions.js';

function AdminHome(props){
    let navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const loggedInEmail = localStorage.getItem('email');
    
    useEffect(() => {
        const role = localStorage.getItem('role');
        HelperFunctions.CheckIfRoleIsAllowed(role, props.rolesAllowed);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }

        userCommands.getAllUsers(token)
            .then((response) => {
                if (response.length === 0) {
                    setError('No users found.');
                } else {
                    setUsers(response);
                }
            })
            .catch((err) => {
                console.log(err);
                setError('Error fetching users.');
            });
    }, []);

    const handleEdit = (userId) => {
        // Implement edit logic here
        console.log('Edit user:', userId);
        navigate(`users/edit/${userId}`);
    };

    const handleDelete = (userId) => {
        // Implement delete logic here
        console.log('Delete user:', userId);
        navigate(`users/delete/${userId}`);
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container">
            <NavbarAdmin/>
            <h2 className="mt-4">Users</h2>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.email !== loggedInEmail && ( // Exclude buttons if the email matches the logged-in user
                                    <>
                                        <button className="btn btn-primary mr-2" onClick={() => handleEdit(user.id)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminHome;