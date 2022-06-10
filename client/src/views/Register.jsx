import './Register.scss'
import { useState } from 'react';
import { createBrowserHistory } from "history";
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const history = createBrowserHistory();

    const checkFields = () => {
        if (password === confirmPassword && password.length >= 6) {
            setStateButton({
                disabled: false
            })
            return;
        }
        else {
            setStateButton({
                disabled: true
            })
        }

        if (password.length < 6 || !username) {

            setStateButton({
                disabled: true
            })

            return;
        }
        if (password.length - 1 === confirmPassword.length) {

            setStateButton({
                disabled: false
            })
            return;
        }
    }

    const handleUsernameChange = (e) => {
        e.preventDefault();

        setUsername(e.target.value);
        checkFields();
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        setPassword(e.target.value);
        checkFields();

    };

    const handleConfirmPasswordChange = (e) => {
        e.preventDefault();

        setConfirmPassword(e.target.value);
        checkFields();

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!password || !username) {
            setErrorMessage("Please fill in all the required fields.");
            return;
        }
        if (password === confirmPassword) {
            if (password.length < 6) {
                setErrorMessage("Password must be at least 6 characters long");
                return;
            }
            setErrorMessage("");
            register(username, password,);
        } else {
            setErrorMessage("Passwords do not match.");
        }

        history.push("/login");
        window.location.reload();
    };


    return (
        <form method="post" id="register-form" onSubmit={handleSubmit}>
            <div class="register-container">
                <p>{errorMessage}</p>
                <h1>Register</h1>
                <div class="reg-container">
                    <div class="textbox">
                        <input type="text" placeholder="Username" id="username" name="username" onChange={handleUsernameChange} /><br />
                    </div>
                    <div class="textbox">
                        <input type="password" placeholder="Password" id="password" name="password" onChange={handlePasswordChange} /><br />
                    </div>
                    <div class="textbox">
                        <input type="password" placeholder="Confirm Password" id="confirm-password" name="confirm-password" onChange={handleConfirmPasswordChange} /><br />
                    </div>
                </div>
                <div className='changeButton'>
                    <Link to="/">Change your password</Link>
                </div>
                <input class="btn" type="submit" value="Confirm" id="btnSubmit" />
            </div>
        </form >
    )


}

export default Register