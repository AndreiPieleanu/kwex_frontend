import { React, useEffect, useState } from 'react';
import { Box, Typography, Paper, Link, Avatar, List, ListItem, ListItemText } from '@mui/material';
import NavbarClient from './Navbar.js';
import { userCommands } from '../../apis/user_apis.js';
import { postCommands } from '../../apis/post_api.js';
import '../../css/user/profile.css';  // Imported CSS for styles

function Profile(props) {
    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowings] = useState([]);

    useEffect(() => {
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

        // followCommands.getFollowersOfUserWithId(userId, token)
        //     .then((result) => {
        //         setFollowers(result);
        //     })
        //     .catch((err) => setError(`Failed to fetch followers! Error: ${err}`));

        // followCommands.getFollowingsOfUserWithId(userId, token)
        //     .then((result) => {
        //         setFollowings(result);
        //     })
        //     .catch((err) => setError(`Failed to fetch followings! Error: ${err}`));
    }, []);

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
            <Box className="stats-box">
                <Paper elevation={3}>
                    <Typography><Link href="#">Following: {following.length}</Link></Typography>
                    <Typography><Link href="#">Followers: {followers.length}</Link></Typography>
                    <Typography><Link href="#">Tweets: 123</Link></Typography>
                </Paper>
            </Box>

            {/* Following List */}
            <Box className="following-box">
                <Paper elevation={3}>
                    <Typography variant="h6">Following:</Typography>
                    <List>
                        {following.length > 0 && following.map((user) => (
                            <ListItem key={user.id}>
                                <Link href="#">{user.firstName} {user.lastName}</Link>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Box>
    );
}

export default Profile;
