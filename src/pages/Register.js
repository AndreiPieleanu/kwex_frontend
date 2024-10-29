import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userCommands } from '../apis/user_apis.js';
import '../css/register.css';
import { Link } from 'react-router-dom';
import { TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import isFieldEmpty from '../validations/textValidations';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [consentGiven, setConsentGiven] = useState(false);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordMatch(event.target.value === repeatPassword);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
        setPasswordMatch(event.target.value === password);
    };

    const handleConsentChange = (event) => {
        setConsentGiven(event.target.checked);
    };

    const navigate = useNavigate();
    const register = () => {
        const newUser = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            bio: bio,
            location: location,
            website: website
        }
        if (isFieldEmpty(newUser.email) || isFieldEmpty(newUser.firstName) || isFieldEmpty(newUser.lastName) || isFieldEmpty(newUser.password) || isFieldEmpty(newUser.bio) || isFieldEmpty(newUser.location) || isFieldEmpty(newUser.website)) {
            alert("Error! You have left some fields empty!");
        }
        else if (password !== repeatPassword) {
            alert("Error! Password is not the same as the one in 'Repeat password' field!");
        }
        else {
            if (!consentGiven) {
                alert("Please agree to the privacy policy and terms of service to proceed.");
                return;
            }
            userCommands.createNewUser(
                newUser.email,
                newUser.firstName,
                newUser.lastName,
                newUser.password,
                newUser.bio,
                newUser.location,
                newUser.website
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
    };
    const inputProps = {
        style: {
            color: "white",
            borderColor: "white",
        },
    };

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
            <div className="register-tbxBio">
                <TextField
                    name="bio"
                    label="Bio"
                    fullWidth
                    margin="normal"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-tbxLocation">
                <TextField
                    name="location"
                    label="Location"
                    fullWidth
                    margin="normal"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            <div className="register-tbxWebsite">
                <TextField
                    name="website"
                    label="Website"
                    fullWidth
                    margin="normal"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    InputLabelProps={InputLabelProps}
                    inputProps={inputProps}
                />
            </div>
            {/* User Consent Checkbox */}
            <div className="register-consent">
                <FormControlLabel
                    control={<Checkbox checked={consentGiven} onChange={handleConsentChange} color="primary" />}
                    label={<span>I agree to the <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link></span>}
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
