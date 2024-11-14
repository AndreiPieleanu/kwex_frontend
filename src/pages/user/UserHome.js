import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, Tabs, Tab, List, ListItem, ListItemText, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import NavbarClient from './Navbar.js';
import { postCommands } from '../../apis/post_api.js';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { friendCommands } from '../../apis/friend_api.js';
import { HelperFunctions } from '../../helpers/functions.js';

function UserHome(props) {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { onUsernameInformed } = props;
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [error, setError] = useState('');
  const [friendships, setFriendships] = useState([]);

  const openDeleteConfirmation = (postId) => {
    setSelectedPostId(postId);
    setOpenDialog(true);
  };

  const closeDeleteConfirmation = () => setOpenDialog(false);

  const saveText = (event) => setText(event.target.value);

  const createPost = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    postCommands.savePost(text, userId, token)
      .then(() => {
        alert("Post added successfully!");
        setText('');
        fetchPosts();  // Fetch updated posts
      })
      .catch((err) => setError(`Post could not be created! Error: ${err}`));
  };

  const deletePost = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    postCommands.deletePost(selectedPostId, token)
      .then(() => {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== selectedPostId));
        setPostsCount((prevCount) => prevCount - 1); // Update post count
        setOpenDialog(false);
      })
      .catch((err) => setError(`Failed to delete post! Error: ${err}`));
  };

  const editPost = (postId) => navigate(`posts/edit/${postId}`);

  const fetchPosts = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    HelperFunctions.CheckIfRoleIsAllowed(role, props.rolesAllowed);
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    onUsernameInformed(userId);

    postCommands.getPostsOfUserWitId(userId, token)
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setPostsCount(fetchedPosts.length);
      })
      .catch((err) => setError(`Failed to fetch posts! Error: ${err}`));

    friendCommands.getAllFriendshipsOfUserWithId(userId, token)
      .then(result => setFriendships(result))
      .catch((err) => setError(`Failed to fetch friendships! Error: ${err}`));
  };

  useEffect(fetchPosts, [onUsernameInformed]);

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
          <Typography variant="h6" gutterBottom>What's happening?</Typography>
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
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={createPost}>Post</Button>
        </Paper>
      </Box>

      {/* Timeline */}
      <Box className="div3 timeline" sx={{ gridArea: '2 / 4 / 4 / 7', padding: 2 }}>
        <Tabs value={0} aria-label="tabs">
          <Tab label="Timeline" />
          <Tab label="Mentions" />
        </Tabs>
        <List>
          {posts.length > 0 && posts.map((post) => (
            <ListItem key={post.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => editPost(post.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => openDeleteConfirmation(post.id)}>
                    <DeleteIcon sx={{ color: 'red' }} />
                  </IconButton>
                </>
              }>
              <ListItemText primary={post.text} secondary={post.timestamp} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* User Info */}
      <Box className="div4 userInfo" sx={{ gridArea: '4 / 1 / 6 / 4', padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography>Your tweets: <strong>{postsCount}</strong></Typography>
          <Typography>Friends <strong>{friendships.length}</strong></Typography>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>Delete post</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this post?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">Cancel</Button>
          <Button onClick={deletePost} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserHome;
