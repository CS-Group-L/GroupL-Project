import { NavLink } from "react-router-dom";
import './Navbar.scss';

const Navbar = () => {
    return (
        <nav>
            {/* <a href='/login'>Login</a> */}
            <NavLink to='/'>Upload</NavLink>
            <NavLink to='/users'>Users</NavLink>
            <NavLink to='/register'>Register</NavLink>
            <NavLink to='/change-password'>Change password</NavLink>
        </nav>
    );
};

export default Navbar;