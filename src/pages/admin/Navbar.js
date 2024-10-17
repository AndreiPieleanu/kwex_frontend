import React from "react"
import { Link } from "react-router-dom"
import '../../css/admin/navbar.css';

function NavbarAdmin() {
    const links = [
        {
            id: 1,
            path: "/logout",
            text: "Logout"
        }
    ]

    return (
        <nav className="NavbarAdmin">
            <ul>
                {links.map((link) => (
                    <li key={link.id}>
                        <Link to={link.path}>{link.text}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default NavbarAdmin;