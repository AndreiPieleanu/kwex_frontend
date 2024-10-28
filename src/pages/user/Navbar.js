import { Link } from "react-router-dom";
import '../../css/user/navbar.css';

function NavbarClient() {

    const links = [
        {
            id: 1,
            path: "/userhome",
            text: "Home"
        },
        {
            id: 2,
            path: "/userhome/profile",
            text: "Profile"
        },
        {
            id: 3,
            path: "/logout",
            text: "Logout"
        },
        {
            id: 4,
            path: "/notifications",
            text: "Notifications"
        }
    ];

    return (
        <nav className="navbarClient">
            <ul>
                {links.map((link) => (
                    <li key={link.id}>
                        <Link to={link.path}>{link.text}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavbarClient;
