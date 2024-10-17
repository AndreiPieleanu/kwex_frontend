import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { userCommands } from '../../apis/user_apis.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function ChangeUserRole() {
    const { id } = useParams(); // Capture 'id' from the URL
    const [user, setUser] = useState({
        role: ''
    });
    const [roles, setRoles] = useState([]); // To store the list of roles
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }

        userCommands.getUserWithId(id, token)
            .then(response => {
                setUser({ ...response, password: '', repeatPassword: '' }); // Initialize passwords as empty
            })
            .catch(() => {
                setError('Error fetching user details.');
            });

        userCommands.getRoles(token)
            .then(response => {
                setRoles(response);
            })
            .catch(() => {
                setError('Error fetching roles.');
            });

    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        userCommands.changeRole(id, token, user.role)
            .then(() => {
                alert('User updated successfully!');
                navigate('/adminhome'); // Redirect after successful update
            })
            .catch(() => {
                setError('Error updating user.');
            });
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <FormControl fullWidth className="my-3">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={user.role}
                        name="role"
                        onChange={handleChange}
                        label="Role"
                        required
                        style={{ backgroundColor: 'white' }}
                    >
                        {roles.map(role => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="mt-3"
                >
                    Update User
                </Button>
            </form>
        </div>
    );
}

export default ChangeUserRole;
