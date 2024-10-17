import { Link } from "react-router-dom";
import '../css/welcome.css';

function Welcome(){
    return (
        <div className="welcome-parent">
            <div className="welcome-pictures"> 
                <h1>Welcome to KweX!</h1>
            </div>
            <div className="welcome-button"> 
                <Link to="/login">Login</Link>
            </div>
        </div>
    );
}

export default Welcome;