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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path='/logout' element={<Logout />}></Route>
            <Route path='/userhome' element={<UserHome />}></Route>
            <Route path='/modhome' element={<ModHome />}></Route>
            <Route path='/adminhome' element={<AdminHome />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/adminhome/users/edit/:id' element={<ChangeUserRole />}/>
            <Route path='/adminhome/users/delete/:id' element={<DeleteUser />}/>
            <Route path='/userhome/profile' element={<Profile />}/>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
