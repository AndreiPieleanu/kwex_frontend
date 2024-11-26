import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { OldLocalhostUrl } from "../constants/urls";
// until i fix error 400 bad request
const LOGIN_BASE_URL = `${OldLocalhostUrl}/api/users/login`;

export const LoginCommands = {
    Login: (email, password) => axios.post(LOGIN_BASE_URL, {"email": email, "password": password})
                                     .then(response => {
                                        const decoded_response = jwtDecode(response.data.accessToken);
                                        localStorage.setItem("token", response.data.accessToken);
                                        localStorage.setItem("role", decoded_response.role);
                                        localStorage.setItem("userId", decoded_response.userId);
                                        localStorage.setItem("email", decoded_response.sub);
                                        
                                        // if (decoded_response === undefined){
                                        //     decoded_response = {
                                        //         "sub": "pieleanuandrei2001@gmail.com",
                                        //         "iat": 1727430663,
                                        //         "exp": 1727441463,
                                        //         "role": "USER",
                                        //         "userId": 1
                                        //     };
                                        // }
                                        return decoded_response;
                                    })
                                     .catch(error => alert(error.response)),
    Logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
    }
};