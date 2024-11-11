import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { postCommands } from '../../apis/post_api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postText, setPostText] = useState('');
  const [postIsBlocked, setPostIsBlocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    postCommands.getPostById(id, token).then(post => {
        setPostText(post.text);
        setPostIsBlocked(post.isBlocked);
    }).catch(err => setError(err));
  }, [id]);

  const handleSave = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    postCommands.updatePost(id, {
        "id": id,
        "text": postText,
        "userId": userId,
        "isBlocked": postIsBlocked
    }, token)
    .then(result => {
        console.log(result);
        navigate(-1); // Go back to previous page or use `navigate('/path')` to direct to another page
    })
    .catch(err => setError(err));
    
  };
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Edit Post</Typography>
      <TextField
        label="Post Text"
        fullWidth
        margin="normal"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditPost;
