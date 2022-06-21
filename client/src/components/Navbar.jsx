import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import './Navbar.scss';

const Navbar = () => {

    const [authState, , , logout] = useAuth();

    return (
        <nav>
            <NavLink to='/'>{authState?.username ? "Upload" : "Login"}</NavLink>
            {authState?.username && <>
                <NavLink to='/users'>Users</NavLink>
                <NavLink to='/register'>Register</NavLink>
                <NavLink to='/change-password'>Change password</NavLink>
                <div id="logout">{authState?.username}</div>
                <button onClick={() => logout()}>Logout</button>
            </>}
        </nav>
    );
};

export default Navbar;