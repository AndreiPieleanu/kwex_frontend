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
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Notifications from './pages/user/Notifications';

function App() {
  const [stompClient, setStompClient] = useState();
  const [username, setUsername] = useState();
  const [messagesReceived, setMessagesReceived] = useState([]);

  useEffect(() => {
    if (username) {
      setupStompClient(username);
    }
  }, [username]);

  const setupStompClient = (username) => {
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
  };

  const sendMessage = (newMessage) => {
    const payload = { id: uuidv4(), from: username, to: newMessage.to, text: newMessage.text };

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
            <Route path='/userhome' element={<UserHome username={username} onUsernameInformed={onUsernameInformed} />}></Route>
            <Route path='/modhome' element={<ModHome />}></Route>
            <Route path='/adminhome' element={<AdminHome />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/adminhome/users/edit/:id' element={<ChangeUserRole />}/>
            <Route path='/adminhome/users/delete/:id' element={<DeleteUser />}/>
            <Route path='/userhome/profile' element={<Profile />}/>
            <Route path='/notifications' element={<Notifications username={username} onMessageSend={sendMessage} onMessageRemove={removeMessage} messagesReceived={messagesReceived}/>}/>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
