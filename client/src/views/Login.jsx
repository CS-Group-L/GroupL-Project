import './Login.scss'
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';

const Login = () => {

    const [authState, checkAuth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    const handleUsernameChange = (e) => {
        e.preventDefault();

        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        e.preventDefault();

        setPassword(e.target.value);
    };

    const login = (username, password) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        axios
            .post("https://localhost:3000/users/login", formData, {
                headers: {
                    'Content-Typer': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data);

                } else {
                    const newAuth = {
                        jwt: res.data.accessToken,
                        username: username
                    }
                    sessionStorage.setItem('auth', JSON.stringify(newAuth));
                    setAuth(newAuth);
                }
            })
            .catch((error) => {
                if (error) {
                    setLoginErrorMessage("Invalid credentials");
                    return;
                }
            })

    };

    useEffect(() => {
        if (checkAuth()) {
            navigate("/")
        }
    }, [authState])


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
                <div className="login-container">
                    <p className="error-msg">{loginErrorMessage}</p>
                    <h1>Login</h1>
                    <div className="textbox">
                        <input type="text" placeholder="Username" id="username" name="username" onChange={handleUsernameChange} /><br />
                    </div>
                    <div className="textbox">
                        <input type="password" placeholder="Password" id="password" name="password" onChange={handlePasswordChange} /><br />
                    </div>
                    <input className="btn" type="submit" value="Sign in" id="btnSubmit" />
                </div>
            </form>
            {/* <button onClick={getPrincipal}>Login with google.</button> */}
        </div>
    )


}

export default Login