import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../css/login.css';
import logo from '../logo.svg';
import { LoginCommands } from '../apis/login.js';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import isFieldEmpty from '../validations/textValidations';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const saveEmail = (event) => {
        setEmail(event.target.value);
    };
    const savePassword = (event) => {
        setPassword(event.target.value);
    };

    let navigate = useNavigate();

    const goToHomePage = () => {
        if(isFieldEmpty(email) || isFieldEmpty(password)){
            alert("Error! You have left some fields empty!");
        }
        else{
            LoginCommands.Login(email, password).then(response => {
                const role = response.role;
                if (role === "USER") {
                    navigate("/userhome");
                }
                else if(role === "MODERATOR"){
                    navigate("/modhome");
                }
                else if(role === "ADMIN"){
                    navigate("/adminhome");
                }
                else{
                    alert("Authentification failed! This role does not exist!");
                }
            });
        }
    }

    return (
        <div className="login-parent">
            <div className="login-logo">
                <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="login-title">
                <h1>Welcome to KweX</h1>
            </div>
            <div className="login-tbx-username">
                <TextField
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    onChange={saveEmail}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                        style: {
                            color: "white",
                        },
                    }}
                    inputProps={{
                        style: {
                          color: "white",
                          borderColor: "white",
                        },
                      }}
                />
            </div>
            <div className="login-tbx-password">
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={savePassword}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                        style: {
                            color: "white",
                        },
                    }}
                    inputProps={{
                        style: {
                          color: "white",
                          borderColor: "white",
                        },
                      }}
                />
            </div>
            <div className="login-login">
                <Button variant="contained" onClick={goToHomePage}>
                    LOGIN
                </Button>
                <br />
                <Link to="/register">New here? Register now!</Link>
            </div>
        </div>
    );
}

export default Login;
