import { React, useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import NavbarClient from './Navbar.js';
import { userCommands } from '../../apis/user_apis.js';
import { postCommands } from '../../apis/post_api.js';
import { useNavigate } from 'react-router-dom';
import '../../css/user/profile.css';
import { HelperFunctions } from '../../helpers/functions.js';

function Profile(props) {
    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState('');
    // const [followers, setFollowers] = useState([]);
    // const [following, setFollowings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);  // State to manage delete confirmation dialog
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        HelperFunctions.CheckIfRoleIsAllowed(role, props.rolesAllowed);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found. Please log in.');
            return;
        }
        userCommands.getUserWithId(userId, token).then((result) => {
            setUser(result);
        }).catch((err) => {
            setError(`Error retrieving user: ${err}`);
        });
        postCommands.getPostsOfUserWitId(userId, token)
            .then((fetchedPosts) => {
                setUserPosts(fetchedPosts);
            })
            .catch((err) => setError(`Failed to fetch user's posts! Error: ${err}`));
    }, [props.rolesAllowed]);

    const handleDownloadData = () => {
        const { password, ...userData } = user;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "user_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleDeleteProfile = () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        userCommands.deleteUser(userId, token)  // API call to delete the user's profile
            .then(() => {
                alert("Your profile has been deleted.");
                localStorage.clear();  // Clear local storage and navigate to login
                navigate('/login', { replace: true });
            })
            .catch((err) => alert(`Error deleting profile: ${err}`));
    };

    const openDeleteConfirmation = () => setOpenDialog(true);
    const closeDeleteConfirmation = () => setOpenDialog(false);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box className="parent">
            {/* Navbar */}
            <Box className="navbar">
                <NavbarClient />
            </Box>

            {/* User Avatar and Basic Info */}
            <Box className="avatar-box">
                <Paper elevation={3}>
                    <Avatar sx={{ width: 80, height: 80, marginBottom: 2 }}>S0</Avatar>
                    <Typography variant="h6">{user.firstName}</Typography>
                    <Typography variant="subtitle1">{user.lastName}</Typography>
                </Paper>
            </Box>

            {/* User's Tweets */}
            <Box className="tweets-box">
                <Paper elevation={3}>
                    <Typography variant="h6">Tweets</Typography>
                    <List>
                        {userPosts.length > 0 && userPosts.map((post) => (
                            <ListItem key={post.id}>
                                <ListItemText primary={post.text} secondary={post.createdAt} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* User's Details */}
            <Box className="details-box">
                <Paper elevation={3}>
                    <Typography variant="body1">Location: {user.location}</Typography>
                    <Typography variant="body1">Web: {user.website}</Typography>
                    <Typography variant="body1">Bio: {user.bio}</Typography>
                </Paper>
            </Box>

            {/* User's Stats (followers, following) */}
            {/* <Box className="stats-box">
                <Paper elevation={3}>
                    <Typography><Link href="#">Following: {following.length}</Link></Typography>
                    <Typography><Link href="#">Followers: {followers.length}</Link></Typography>
                    <Typography><Link href="#">Tweets: 123</Link></Typography>
                </Paper>
            </Box> */}

            {/* Download Data and Delete Profile Buttons */}
            <Box className="actions-box">
                <Button variant="contained" color="secondary" onClick={handleDownloadData}>
                    Download My Data
                </Button>
                <Button variant="contained" color="error" onClick={openDeleteConfirmation} sx={{ marginTop: 1 }}>
                    Delete My Profile
                </Button>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={closeDeleteConfirmation}>
                <DialogTitle>Delete Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your profile? This action cannot be undone, and all your data will be permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteConfirmation} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteProfile} color="error">Confirm Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Profile;
