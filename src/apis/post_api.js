import axios from "axios";
import { OldLocalhostUrl } from "../constants/urls";

const postURL = `${OldLocalhostUrl}/api/posts`;
const moderatorURL = `${OldLocalhostUrl}/api/moderator/predict`;

export const postCommands = {
    getFlaggedPosts: (token) => axios.get(`${postURL}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    getAllPosts: (token) => axios.get(`${postURL}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    getPostsOfUserWitId: (userId, token) => axios.get(`${postURL}/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    blockUnblockPost: (post, token) => axios.put(`${postURL}/${post.id}`, {
        "id": post.id,
        "text": post.text,
        "createdAt": post.createdAt,
        "userId": post.userId,
        "isBlocked": !post.isBlocked
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    savePost: (text, userId, token) => axios.post(`${postURL}`, {
        "text": text,
        "userId": userId
    }, {
         headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data).catch(error => error.response.data),

    checkIfPostIsOffensive: (post, token) => axios.post(`${moderatorURL}`, {
        "text": post.text
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    deletePost: (postId, token) => axios.delete(`${postURL}/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    updatePost: (postId, request, token) => axios.put(`${postURL}/${postId}`, {
        "id": request.id,
        "text": request.text,
        "userId": request.userId,
        "isBlocked": request.isBlocked
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    getPostById: (postId, token) => axios.get(`${postURL}/myposts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),
};