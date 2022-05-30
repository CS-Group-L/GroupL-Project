import './Login.scss'
import { Link } from "react-router-dom"
import { useState } from "react";
import { createBrowserHistory } from "history";


const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    const history = createBrowserHistory();

    const handleUsernameChange = (e) => {
        e.preventDefault();

        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        e.preventDefault();

        setPassword(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setLoginErrorMessage("Please fill in all the required fields.");
            return;
        } else {
        setLoginErrorMessage("");
        login(username, password);
        }
    };

    return (
        <div>
            <form method="post" id="login-form" onSubmit={handleFormSubmit}>
                <div class="login-container">
                    <p className="error-msg">{loginErrorMessage}</p>
                    <h1>Login</h1>
                    <div class="textbox">
                        <input type="text" placeholder="Username" id="username" name="username" onChange={handleUsernameChange} /><br />
                    </div>
                    <div class="textbox">
                        <input type="password" placeholder="Password" id="password" name="password" onChange={handlePasswordChange} /><br />
                    </div>
                    <input class="btn" type="submit" value="Sign in" id="btnSubmit" />
                </div>
            </form>
            {/* <button onClick={getPrincipal}>Login with google.</button> */}
        </div>
    )


}

export default Login