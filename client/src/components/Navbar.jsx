import './Navbar.scss'

const Navbar = () => {
    return (
        <nav>
            {/* <a href='/login'>Login</a> */}
            <a href='/users'>List of users</a>
            <a href='/'>Compiler</a>
            <a href='/register'>Register a user</a>
        </nav>
    );
}

export default Navbar