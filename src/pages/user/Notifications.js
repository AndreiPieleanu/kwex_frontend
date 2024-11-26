import { useEffect, useState } from "react";
import '../../css/user/notifications.css';
import { CardContent, CardHeader, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Footer from "../Footer";
import NavbarClient from "./Navbar";
import { Card } from "react-bootstrap";
import { userCommands } from "../../apis/user_apis";
import { friendCommands } from "../../apis/friend_api";
import { v4 as uuidv4 } from 'uuid';
import { useHelperFunctions } from "../../helpers/functions";

export default function Notifications(props) {
    const [users, setUsers] = useState([]);
    const [friendships, setFriendships] = useState({});
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { CheckIfRoleIsAllowed } = useHelperFunctions();
    const role = localStorage.getItem('role');

    useEffect(() => {
        CheckIfRoleIsAllowed(role, props.rolesAllowed);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            setError('No token found. Please log in.');
            return;
        }

        // Fetch all users
        userCommands.getAllUsers(token)
            .then((fetchedUsers) => {
                setUsers(fetchedUsers);
            })
            .catch((err) => {
                setError(`Error fetching users: ${err}`);
            });

        // Fetch all friendships for the current user
        friendCommands.getAllFriendshipsOfUserWithId(userId, token)
            .then((friendData) => {
                const friendMap = friendData.reduce((acc, friend) => {
                    acc[friend.senderId === userId ? friend.receiverId : friend.senderId] = friend;
                    return acc;
                }, {});
                setFriendships(friendMap);
            })
            .catch((err) => {
                setError(`Error fetching friendships: ${err}`);
            });
    }, [role, props.rolesAllowed, CheckIfRoleIsAllowed]);

    // Handle sending friend request
    const handleFollow = (receiverId) => {
        const senderId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (senderId === receiverId) {
            alert("You cannot send a friend request to yourself.");
            return;
        }
        var text = "New friend request sent!";
        var uuid = uuidv4();
        var newMessage = {
            'id': uuid, 
            'text': text, 
            'to': receiverId
        };
        props.onMessageSend(newMessage);
        friendCommands.sendFriendRequest(senderId, newMessage, token)
            .catch((err) => {
                setError(`Error sending friend request: ${err}`);
            });
    };

    const openRemoveFriendDialog = (userId) => {
        setSelectedUser(userId);
        setOpenDialog(true);
    };

    const closeRemoveFriendDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleRemoveFriend = () => {
        const token = localStorage.getItem('token');
        const userId = selectedUser;
        friendCommands.removeFriendship(userId, token)
            .then(() => {
                alert("Friend removed successfully.");
                setFriendships((prev) => {
                    const updated = { ...prev };
                    delete updated[userId];
                    return updated;
                });
                closeRemoveFriendDialog();
            })
            .catch((err) => {
                alert("Error removing friend: " + err);
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
            
            {/* User list with friend request button */}
            <div className="notif-users">
                <Card className="users-card">
                    <CardHeader className="users-header" title="Users List:" />
                    {users.map(user => {
                        const friendStatus = friendships[user.id]?.status;

                        return (
                            <div key={user.id} className="user-item">
                                <Typography color="white">{user.firstName} {user.lastName}</Typography>
                                {user.id === localStorage.getItem('userId') ? (
                                    <Typography color="gray">You</Typography>
                                ) : friendStatus === "ACCEPTED" ? (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => openRemoveFriendDialog(user.id)}
                                    >
                                        Remove Friend
                                    </Button>
                                ) : friendStatus === "PENDING" ? (
                                    <Typography color="gray">Pending</Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleFollow(user.id)}
                                    >
                                        Send Friend Request
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </Card>
            </div>

            {/* Confirmation Dialog for Removing Friend */}
            <Dialog open={openDialog} onClose={closeRemoveFriendDialog}>
                <DialogTitle>Remove Friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this friend? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeRemoveFriendDialog} color="primary">Cancel</Button>
                    <Button onClick={handleRemoveFriend} color="error">Confirm Remove</Button>
                </DialogActions>
            </Dialog>

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
