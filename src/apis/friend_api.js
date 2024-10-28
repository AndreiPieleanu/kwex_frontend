import axios from "axios";

const friendURL = "http://localhost:8080/notifications";

export const friendCommands = {

    sendFriendRequest: (senderId, receiverId, text, token) => axios.post(`${friendURL}`, {
        "from": senderId, 
        "to": receiverId, 
        "text": text
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data
    }).catch(error => error.response.data),

    acceptFriendRequest: (requestId, token) => axios.put(`${friendURL}/update/${requestId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data
    }).catch(error => error.response.data),

    rejectFriendRequest: (requestId, token) => axios.delete(`${friendURL}/${requestId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data
    }).catch(error => error.response.data),
};