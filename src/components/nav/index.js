import "./index.css";
import "../default/index.css";
import Search from "../search/index.js";
import logo from "../../assets/imgs/logo.png";
import { NavLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function Navbar() {
    return (
        <div className="navbar">
            <div className="navright">
                <NavLink className="navlogo" to="/">
                    <img src={logo} alt="logo"></img>
                </NavLink>
                <Search />
            </div>
            <div className="links">
                <NavLink className="link" to="/playlist">
                    Playlist
                </NavLink>
                <NavLink className="link" to="/likes">
                    Likes
                </NavLink>
                <NavLink className="link" to="/trendings">
                    Trendings
                </NavLink>
                <NavLink className="link" to="/profile">
                    <AccountCircleIcon className="acc" />
                </NavLink>
            </div>
        </div>
    );
}
