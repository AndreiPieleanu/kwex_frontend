import { React, useEffect, useState } from 'react';
import { Box, Typography, Paper, Link, Avatar, List, ListItem, ListItemText } from '@mui/material';
import NavbarClient from './Navbar.js';
import { userCommands } from '../../apis/user_apis.js';
import { postCommands } from '../../apis/post_api.js';

function Profile(props) {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);  // Add state to store posts
    const [postsCount, setPostsCount] = useState(0);
    const [error, setError] = useState('');

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
                setPosts(fetchedPosts);
                setPostsCount(fetchedPosts.length);
            })
            .catch((err) => setError(`Failed to fetch posts! Error: ${err}`));
    }, []);

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box className="parent" sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(10, 1fr)', gridGap: '10px' }}>

            {/* Navbar */}
            <Box className="div6" sx={{ gridArea: '1 / 1 / 2 / 7' }}>
                <NavbarClient />
            </Box>

            {/* User Avatar and Basic Info */}
            <Box className="div1" sx={{ gridArea: '2 / 1 / 4 / 4', padding: 2 }}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Avatar sx={{ width: 80, height: 80, marginBottom: 2 }}>S0</Avatar>
                    <Typography variant="h6">{user.firstName}</Typography>
                    <Typography variant="subtitle1">NYDN</Typography>
                </Paper>
            </Box>

            {/* User's Tweets */}
            <Box className="div2" sx={{ gridArea: '4 / 1 / 6 / 4', padding: 2 }}>
                <Paper elevation={3}sx={{ padding: 2, maxHeight: '50vh', overflowY: 'auto' }}>
                    <Typography variant="h6">Tweets</Typography>
                    <List>
                        {posts.map((post) => (
                            <ListItem key={post.id}>
                                <ListItemText primary={post.text} secondary={post.createdAt} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* User's Details */}
            <Box className="div3" sx={{ gridArea: '2 / 4 / 6 / 7', padding: 2 }}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="body1">Full name: {user.firstName} {user.lastName}</Typography>
                </Paper>
            </Box>

            {/* User's Stats */}
            <Box className="div4" sx={{ gridArea: '3 / 4 / 10 / 7', padding: 2 }}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography><Link href="#">43 following</Link></Typography>
                    <Typography><Link href="#">20 followers</Link></Typography>
                    <Typography><Link href="#">tweets {postsCount}</Link></Typography>
                </Paper>
            </Box>

            {/* Following List */}
            <Box className="div5" sx={{ gridArea: '4 / 4 / 10 / 7', padding: 2 }}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">Following:</Typography>
                    <Typography>
                        <Link href="#">U1</Link> <Link href="#">U2</Link> <Link href="#">U3</Link>
                    </Typography>
                    <Typography>
                        <Link href="#">U4</Link> <Link href="#">U5</Link> <Link href="#">U6</Link>
                    </Typography>
                    <Typography>
                        <Link href="#">U7</Link> <Link href="#">U8</Link> <Link href="#">U9</Link>
                    </Typography>
                    <Typography>
                        <Link href="#">U10</Link> <Link href="#">U11</Link> <Link href="#">U12</Link>
                    </Typography>
                    <Typography>
                        <Link href="#">U13</Link> <Link href="#">U14</Link> <Link href="#">U15</Link>
                    </Typography>
                </Paper>
            </Box>

        </Box>
    );
}

export default Profile;
