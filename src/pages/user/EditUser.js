import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { userCommands } from '../../apis/user_apis.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHelperFunctions } from '../../helpers/functions.js';

function EditUser(props) {
    const { id } = useParams(); // Capture 'id' from the URL
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        repeatPassword: '',
        bio: '',
        location: '',
        website: ''
    });
    const [roles, setRoles] = useState([]); // To store the list of roles
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { CheckIfRoleIsAllowed } = useHelperFunctions();
    const role = localStorage.getItem('role');

    useEffect(() => {
        CheckIfRoleIsAllowed(role, props.rolesAllowed);
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

    }, [id, role, props.rolesAllowed, CheckIfRoleIsAllowed]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (user.password !== user.repeatPassword) {
            setPasswordError("Passwords do not match.");
            return;
        } else {
            setPasswordError('');
        }

        const token = localStorage.getItem('token');
        userCommands.updateUser(id, user.firstName, user.lastName, user.email, user.password, user.role, user.bio, user.location, user.website, token)
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
                <TextField
                    label="First Name"
                    variant="outlined"
                    className="form-control my-3"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    className="form-control my-3"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    className="form-control my-3"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth className="my-3">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={user.role}
                        name="role"
                        onChange={handleChange}
                        label="Role"
                        required
                    >
                        {roles.map(role => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Bio"
                    variant="outlined"
                    className="form-control my-3"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Location"
                    variant="outlined"
                    className="form-control my-3"
                    name="location"
                    value={user.location}
                    onChange={handleChange}
                />
                <TextField
                    label="Website"
                    variant="outlined"
                    className="form-control my-3"
                    name="website"
                    value={user.website}
                    onChange={handleChange}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    className="form-control my-3"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                />
                <TextField
                    label="Repeat Password"
                    variant="outlined"
                    className="form-control my-3"
                    name="repeatPassword"
                    type="password"
                    value={user.repeatPassword}
                    onChange={handleChange}
                />
                {passwordError && <div className="alert alert-danger">{passwordError}</div>}
                
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

export default EditUser;
