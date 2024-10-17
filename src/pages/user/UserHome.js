import { React, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, Tabs, Tab, List, ListItem, ListItemText, Paper } from '@mui/material';
import NavbarClient from './Navbar.js';
import '../../css/user/userHome.css';
import { postCommands } from '../../apis/post_api.js';

function UserHome(props) {
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);  // Add state to store posts
  const [postsCount, setPostsCount] = useState(0);
  const [error, setError] = useState('');
  
  const saveText = (event) => {
    setText(event.target.value);
  };

  const createPost = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!token) {
        setError('No token found. Please log in.');
        return;
    }
    postCommands.savePost(text, userId, token).then(() => {
      alert("Post added successfully!");
      setText('');
    }).catch((err) => {
      setError(`Post could not be created! Error: ${err}`);
    });
    postCommands.getPostsOfUserWitId(userId, token)
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setPostsCount(fetchedPosts.length);
      })
      .catch((err) => setError(`Failed to fetch posts! Error: ${err}`));
  };

  // Fetch user's posts on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    
    postCommands.getPostsOfUserWitId(userId, token)
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setPostsCount(fetchedPosts.length);
      })
      .catch((err) => setError(`Failed to fetch posts! Error: ${err}`));
      
  }, []);  // Run this effect on component mount

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Box className="parent" sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(10, 1fr)', gridGap: '10px' }}>
      
      {/* Navbar */}
      <Box className="div1 search" sx={{ gridArea: '1 / 1 / 2 / 7' }}>
        <AppBar position="static">
          <Toolbar>
            <NavbarClient />
          </Toolbar>
        </AppBar>
      </Box>

      {/* What's happening */}
      <Box className="div2 happening" sx={{ gridArea: '2 / 1 / 4 / 4', padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            What's happening?
          </Typography>
          <TextField 
            fullWidth
            label="Share something..." 
            multiline
            maxRows={4}
            variant="outlined" 
            type='text'
            value={text}
            onChange={saveText}
          />
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={createPost}>
            Post
          </Button>
        </Paper>
      </Box>

      {/* Timeline */}
      <Box className="div3 timeline" sx={{ gridArea: '2 / 4 / 4 / 7', padding: 2 }}>
        <Tabs value={0} aria-label="tabs">
          <Tab label="Timeline" />
          <Tab label="Mentions" />
        </Tabs>
        <List>
          {posts.map((post) => (
            <ListItem key={post.id}>
              <ListItemText primary={post.text} secondary={post.timestamp} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Info */}
      <Box className="div4 userInfo" sx={{ gridArea: '4 / 1 / 6 / 4', padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography>Your tweets: <strong>{postsCount}</strong></Typography>
          <Typography>1 hour ago: I'm starting #netbeans</Typography>
          <Typography>Following <strong>23</strong> | Followers <strong>2</strong></Typography>
        </Paper>
      </Box>

      {/* Trends */}
      <Box className="div5 trends" sx={{ gridArea: '4 / 4 / 6 / 7', padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6">Trends</Typography>
          <List>
            <ListItem><ListItemText primary="#Glassfish" /></ListItem>
            <ListItem><ListItemText primary="#EJB" /></ListItem>
            <ListItem><ListItemText primary="#JPA" /></ListItem>
            <ListItem><ListItemText primary="#JSF" /></ListItem>
          </List>
        </Paper>
      </Box>

    </Box>
  );
}

export default UserHome;
