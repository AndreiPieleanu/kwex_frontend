import { useEffect, useState } from "react";
import '../../css/user/notifications.css';
import { CardContent, CardHeader, Button, Typography } from "@mui/material";
import Footer from "../Footer";
import NavbarClient from "./Navbar";
import { Card } from "react-bootstrap";
import { userCommands } from "../../apis/user_apis";
import { friendCommands } from "../../apis/friend_api";

export default function Notifications(props) {
    const [users, setUsers] = useState([]);
    const [sentRequests, setSentRequests] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            setError('No token found. Please log in.');
            return;
        }

        userCommands.getAllUsers(token)
            .then((fetchedUsers) => {
                setUsers(fetchedUsers);
            })
            .catch((err) => {
                setError(`Error fetching users: ${err}`);
            });
    }, []);

    // Handle sending follow/friend request
    const handleFollow = (receiverId) => {
        const senderId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (senderId === receiverId) {
            alert("You cannot send a friend request to yourself.");
            return;
        }
        const text = "New friend request sent!";
        props.onMessageSend({ 'text': text, 'to': receiverId });

        // Mark the request as sent (pending state)
        setSentRequests((prev) => ({
            ...prev,
            [receiverId]: 'pending'
        }));
        friendCommands.sendFriendRequest(senderId, receiverId, text, token)
            .catch((err) => {
                setError(`Error sending friend request: ${err}`);
            });
    };

    const MessageReceived = ({ id, from, text }) => {
        const handleAccept = () => {
            const token = localStorage.getItem('token');

            friendCommands.acceptFriendRequest(id, token)
                .then(() => {
                    alert("Friend request accepted!");
                    props.onMessageRemove(id);
                })
                .catch((err) => {
                    alert("Error accepting friend request: " + err);
                });
        };

        const handleReject = () => {
            const token = localStorage.getItem('token');

            friendCommands.rejectFriendRequest(id, token)
                .then(() => {
                    alert("Friend request rejected.");
                    // Remove the message after rejecting
                    props.onMessageRemove(id);
                })
                .catch((err) => {
                    alert("Error rejecting friend request: " + err);
                });
        };

        return (
            <CardContent>
                <label><b>From {from}</b>: {text}</label>
                <div>
                    <Button variant="contained" color="success" onClick={handleAccept}>
                        Accept
                    </Button>
                    <Button variant="contained" color="error" onClick={handleReject} style={{ marginLeft: '10px' }}>
                        Reject
                    </Button>
                </div>
            </CardContent>
        );
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div className="notif-parent">
            <div className="notif-navbar">
                <NavbarClient />
            </div>
            
            {/* User list with follow button */}
            <div className="notif-users">
                <Card className="users-card">
                    <CardHeader className="users-header" title="Users List:" />
                    {users.map(user => {
                        const requestStatus = sentRequests[user.id];
                        return (
                            <div key={user.id} className="user-item">
                                <Typography color="white">{user.firstName} {user.lastName}</Typography>
                                {user.id === localStorage.getItem('userId') ? (
                                    <Typography color="gray">You</Typography>
                                ) : requestStatus === 'pending' ? (
                                    <Typography color="gray">Pending</Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleFollow(user.id)}
                                    >
                                        Send friend request
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </Card>
            </div>

            {/* Notifications */}
            <div className="notif-messages">
                <Card className="notifications-card">
                    <CardHeader className="notifications-header" title="Messages:" />
                    {props.messagesReceived
                        .filter(message => message.from !== props.username)
                        .map(message => (
                            <MessageReceived key={message.id} id={message.id} from={message.from} text={message.text} />
                        ))}
                </Card>
            </div>

            <div className="notif-footer">
                <Footer />
            </div>
        </div>
    );
}
