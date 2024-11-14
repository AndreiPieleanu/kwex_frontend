import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Logout from './pages/Logout';
import Welcome from './pages/Welcome';
import UserHome from './pages/user/UserHome';
import ModHome from './pages/mod/ModHome';
import AdminHome from './pages/admin/AdminHome';
import Register from './pages/Register';
import ChangeUserRole from './pages/admin/ChangeUserRole';
import DeleteUser from './pages/admin/DeleteUser';
import Profile from './pages/user/Profile';
import { Client } from '@stomp/stompjs';
import { useEffect, useState, useCallback } from 'react';
import Notifications from './pages/user/Notifications';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import EditUser from './pages/user/EditUser';
import EditPost from './pages/user/EditPost';
import { Roles } from './constants/roles';

function App() {
  const [stompClient, setStompClient] = useState();
  const [username, setUsername] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);

  const setupStompClient = useCallback((username) => {
    if (stompClient) return;  // Ensure stompClient is only setup once

    const client = new Client({
      brokerURL: 'ws://localhost:8083/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    client.onConnect = () => {
      client.subscribe('/topic/publicmessages', (data) => {
        onMessageReceived(data);
      });

      client.subscribe(`/user/${username}/queue/inboxmessages`, (data) => {
        onMessageReceived(data);
      });
    };

    client.activate();
    setStompClient(client);
  }, [stompClient]);

  useEffect(() => {
    if (username) {
      setupStompClient(username);
    }
  }, [username, setupStompClient]);

  const sendMessage = (newMessage) => {
    const payload = { id: newMessage.id, from: username, to: newMessage.to, text: newMessage.text };

    if (stompClient && stompClient.connected) {
      if (payload.to) {
        stompClient.publish({ 'destination': `/user/${payload.to}/queue/inboxmessages`, body: JSON.stringify(payload) });
      } else {
        stompClient.publish({ 'destination': '/topic/publicmessages', body: JSON.stringify(payload) });
      }
    } else {
      console.error('Stomp client is not connected.');
    }
  };

  const onMessageReceived = (data) => {
    const message = JSON.parse(data.body);
    setMessagesReceived((prevMessages) => {
      // Avoid adding duplicates by checking if the message ID already exists
      if (!prevMessages.some((msg) => msg.id === message.id)) {
        return [...prevMessages, message];
      }
      return prevMessages;
    });
  };

  const removeMessage = (messageId) => {
    setMessagesReceived((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

  const onUsernameInformed = (username) => {
    setUsername(username);
    setupStompClient(username);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path='/logout' element={<Logout />}></Route>
            <Route path='/userhome' element={<UserHome username={username} onUsernameInformed={onUsernameInformed} rolesAllowed={[Roles.USER]} />}></Route>
            <Route path='/modhome' element={<ModHome roleAllowed={[Roles.MODERATOR]}/>}></Route>
            <Route path='/modhome/users/edit/:id' element={<EditUser rolesAllowed={[Roles.MODERATOR]}/>}></Route>
            <Route path='/userhome/posts/edit/:id' element={<EditPost rolesAllowed={[Roles.USER]}/>}></Route>
            <Route path='/adminhome' element={<AdminHome roleAllowed={[Roles.ADMIN]}/>}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/adminhome/users/edit/:id' element={<ChangeUserRole roleAllowed={[Roles.ADMIN]}/>}/>
            <Route path='/adminhome/users/delete/:id' element={<DeleteUser roleAllowed={[Roles.ADMIN]}/>}/>
            <Route path='/userhome/profile' element={<Profile roleAllowed={[Roles.USER]}/>}/>
            <Route path='/notifications' element={<Notifications roleAllowed={[Roles.USER]} username={username} onMessageSend={sendMessage} onMessageRemove={removeMessage} messagesReceived={messagesReceived}/>}/>
            <Route path='/privacy-policy' element={<PrivacyPolicy />}/>
            <Route path='/terms-of-service' element={<TermsOfService />}/>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
