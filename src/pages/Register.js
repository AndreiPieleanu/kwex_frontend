import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userCommands } from '../apis/user_apis.js';
import '../css/register.css';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import isFieldEmpty from '../validations/textValidations';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordMatch(event.target.value === repeatPassword);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
        setPasswordMatch(event.target.value === password);
    };

    const navigate = useNavigate();
    const register = () => {
        const newUser = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
        }
        if (isFieldEmpty(newUser.email) || isFieldEmpty(newUser.firstName) || isFieldEmpty(newUser.lastName) || isFieldEmpty(newUser.password)) {
            alert("Error! You have left some fields empty!");
        }
        else if(password !== repeatPassword){
            alert("Error! Password is not the same as the one in 'Repeat password' field!");
        }
        else{
            userCommands.createNewUser(
                newUser.email,
                newUser.firstName,
                newUser.lastName,
                newUser.password
            ).then(response => {
                alert("response value: " + response);
                navigate("/login");
            }).catch((error) => {
                alert('An error occurred with the following message: ' + error);
            });
        }
    };

    const InputLabelProps = {
        style: {
            color: "white",
        },
    }
    const inputProps = {
        style: {
            color: "white",
            borderColor: "white",
        },
    }

    return (
        <div className="register-parent">
            <div className="register-title">
                <h1>Register</h1>
            </div>
            <div className="register-tbxFN">
                <TextField
                    name="firstName"
                    label="First name"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-tbxLN">
                <TextField
                    name="lastName"
                    label="Last name"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-tbxEmail">
                <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-tbxPassword">
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    fullWidth
                    onChange={handlePasswordChange}
                    error={!passwordMatch}
                    helperText={!passwordMatch && "Passwords do not match"}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-tbxRepeatPassword">
                <TextField
                    label="Repeat Password"
                    type="password"
                    value={repeatPassword}
                    fullWidth
                    onChange={handleRepeatPasswordChange}
                    error={!passwordMatch}
                    helperText={!passwordMatch && "Passwords do not match"}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-btnRegister">
                <Button variant="contained" color="primary" type="submit" onClick={register}>
                    Register
                </Button>
                <br />
                <Link to="/login">Already have an account? Login!</Link>
            </div>
        </div>
    );
}
export default Register;