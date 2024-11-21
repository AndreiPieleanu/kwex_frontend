import axios from "axios";
import { KubernetesHttpUrl } from "../constants/urls";

const friendURL = `http://${KubernetesHttpUrl}:8080/api/notifications`;

export const friendCommands = {

    getAllFriendshipsOfUserWithId: (userId, token) => axios.get(`${friendURL}/friendships/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data
    }).catch(error => error.response.data),

    sendFriendRequest: (senderId, newMessage, token) => axios.post(`${friendURL}`, {
        "id": newMessage.id,
        "from": senderId, 
        "to": newMessage.to, 
        "text": newMessage.text
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