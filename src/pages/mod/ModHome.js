import React, { useState, useEffect } from 'react';
import { userCommands } from '../../apis/user_apis.js'; // Assuming the API is available
import { postCommands } from '../../apis/post_api.js';
import '../../css/admin/AdminHome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import NavbarAdmin from './Navbar.js';
import { useHelperFunctions } from '../../helpers/functions.js';

function ModHome(props) {
    let navigate = useNavigate();
    const { CheckIfRoleIsAllowed } = useHelperFunctions();
    const role = localStorage.getItem('role');
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]); // posts
    const [error, setError] = useState('');
    const [showFlagged, setShowFlagged] = useState(false);
    const loggedInEmail = localStorage.getItem('email');

    useEffect(() => {
        CheckIfRoleIsAllowed(role, props.rolesAllowed);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }

        // Fetch users
        userCommands.getAllUsers(token)
            .then(response => {
                if (response.length === 0) {
                    setError('No users found.');
                } else {
                    setUsers(response);
                }
            })
            .catch(err => {
                setError('Error fetching users.');
            });

        // Fetch all posts
        postCommands.getAllPosts(token)
            .then(response => {
                setPosts(response); 
            })
            .catch(err => {
                setError('Error fetching posts.');
            });
    }, [role, props.rolesAllowed, CheckIfRoleIsAllowed]);

    const handleEdit = (userId) => {
        navigate(`users/edit/${userId}`);
    };

    const handleDelete = (userId) => {
        navigate(`users/delete/${userId}`);
    };

    const handleRoleChange = (userId, newRole) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }
        userCommands.changeRole(userId, token, newRole)
            .then(() => {
                alert(`User role updated to ${newRole}`);
                setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
            })
            .catch(() => {
                alert('Error updating user role.');
            });
    };

    const handleBlockPost = (post) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }
        postCommands.blockUnblockPost(post, token)
            .then(() => {
                alert('Post blocked successfully!');
            })
            .catch(() => {
                alert('Error blocking post.');
            });
    };

    const checkOffensivePosts = () => {
        const flagged = []; // Initialize the array for flagged posts
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }
        if (!Array.isArray(posts)) {
            setError('Posts is not an array.');
            return;
        }
        // Create an array of promises from the asynchronous operations
        const promises = posts.map((post) => 
            postCommands.checkIfPostIsOffensive(post, token).then(response => {
                if (response) {
                    flagged.push(post); // Add post to flagged if the response is true
                }
            }).catch(err => {
                console.error(`Error with AI model for post ${post.id}:`, err);
                setError(`Error with AI model for post ${post.id}:${err}`);
            })
        );
    
        // Wait for all the promises to complete
        Promise.all(promises).then(() => {
            console.log('Flagged posts:', flagged);
            setPosts(flagged);
            setShowFlagged(true);
        })
        .catch((err) => {
            console.log('Error processing posts:', err);
            setError('Error processing posts.');
        });
    };

    const getAllPosts = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }
        postCommands.getAllPosts(token)
            .then(response => {
                setPosts(response); 
            })
            .catch(err => {
                setError(`Error fetching posts. ${err}`);
            });
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container">
            <NavbarAdmin />
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
                                {user.email !== loggedInEmail && (
                                    <>
                                        <button className="btn btn-primary mr-2" onClick={() => handleEdit(user.id)}>Edit</button>
                                        <button className="btn btn-danger mr-2" onClick={() => handleDelete(user.id)}>Delete</button>
                                        {user.role !== 'MODERATOR' && (
                                            <button className="btn btn-info" onClick={() => handleRoleChange(user.id, 'MODERATOR')}>Make Moderator</button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="mt-4">Posts</h2>
            <button className="btn btn-warning mb-3" onClick={checkOffensivePosts}>
                Use AI Model
            </button>
            <button className="btn btn-warning mb-3" onClick={getAllPosts}>
                Get all posts
            </button>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Content</th>
                        <th>Is blocked?</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {showFlagged ? (
                    Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.text}</td>
                                <td>{post.isBlocked ? "Blocked" : "Not blocked"}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleBlockPost(post)}>Block</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No offensive posts found.</td>
                        </tr>
                    )
                ) : (
                    Array.isArray(posts) ? (
                        posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.text}</td>
                                <td>{post.isBlocked ? "Blocked" : "Not blocked"}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleBlockPost(post)}>Block</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Error: Posts is not a valid array.</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </div>
    );
}

export default ModHome;
