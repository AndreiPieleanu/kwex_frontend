import axios from "axios";
import { OldHttpUrl } from "../constants/urls";

const userURL = `http://${OldHttpUrl}:8080/api/users`;

export const userCommands = {
    createNewUser: (email, firstName, lastName, password, bio, location, website) => axios.post(userURL, {
        "firstName": firstName, 
        "lastName": lastName, 
        "email": email, 
        "password": password, 
        "role": "USER",
        "bio": bio,
        "location": location,
        "website": website
    }).then(response => {
        console.log(response.data);
        return response.data.user
    }).catch(error => error.response.data),

    updateUser: (id, firstName, lastName, email, password, role, token) => axios.put(userURL + `/${id}`, {
        "userId": id, 
        "firstName": firstName, 
        "lastName": lastName, 
        "email": email, 
        "password": password, 
        "role": role
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data.updatedId).catch(error => error.response.data),

    changeRole: (id, token, role) => axios.put(userURL + `/roles/${id}`, {
        "id": id, 
        "role": role
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data.updatedId).catch(error => error.response.data),

    deleteUser: (id, token) => axios.delete(userURL + `/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data).catch(error => error.response.data),

    getUserWithId: (id, token) => axios.get(userURL + `/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.data.foundUser).catch(error => error.response.data),

    getAllUsers: (token) => axios.get(userURL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data;
    }).catch(error => error.response.data),

    getRoles: (token) => axios.get(userURL + `/roles`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data;
    }).catch(error => error.response.data),
};