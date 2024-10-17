import { Button } from '@mui/material';
import '../css/logout.css';
import { LoginCommands } from '../apis/login';
import { useNavigate } from "react-router-dom";

function Logout() {

    let navigate = useNavigate();

    const handleYes = () => {
        LoginCommands.Logout();
        navigate("/login", { replace: true });
        window.location.reload();
    }
    const handleNo = () => {
        navigate(-1);
    }

    return (
        <div className="logout-container">
            <div className="logout-content">
                <h1 className="logout-title">Warning! Are you sure you want to logout?</h1>
                <div className="logout-buttons">
                    <Button variant="contained" onClick={handleYes} className="logout-button">
                        Yes
                    </Button>
                    <Button variant="contained" onClick={handleNo} className="logout-button">
                        No
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default Logout;