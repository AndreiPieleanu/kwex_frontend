import axios from "axios";

const postURL = "http://localhost:8080/api/posts";
const moderatorURL = "http://localhost:8080/api/moderator/predict";

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
};