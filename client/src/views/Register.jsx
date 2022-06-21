import './Register.scss';
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from "axios";
import { apiUrl } from "../config";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [authState, checkAuth] = useAuth();


    useEffect(() => {
        checkAuth();
    }, []);


    const register = (username, password, confPassword) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("confPassword", confPassword);
        axios
            .post(`${apiUrl}/users/register`, formData, {
                headers: {
                    'Content-Typer': 'multipart/form-data',
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data.error);
                } else {
                    alert("A new user has been added.");
                }
            });
    };

    const checkFields = () => {
        if (password === confirmPassword && password.length >= 6) {
            setStateButton({
                disabled: false
            });
            return;
        }
        else {
            setStateButton({
                disabled: true
            });
        }

        if (password.length < 6 || !username) {

            setStateButton({
                disabled: true
            });

            return;
        }
        if (password.length - 1 === confirmPassword.length) {

            setStateButton({
                disabled: false
            });
            return;
        }
    };

    const handleUsernameChange = (e) => {
        e.preventDefault();

        setUsername(e.target.value);
        //checkFields();
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        setPassword(e.target.value);
        // checkFields();

    };

    const handleConfirmPasswordChange = (e) => {
        e.preventDefault();

        setConfirmPassword(e.target.value);
        // checkFields();

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
            register(username, password, confirmPassword);
        } else {
            setErrorMessage("Passwords do not match.");
        }
    };


    return (
        <form method="post" id="register-form" onSubmit={handleSubmit}>
            <div className="register-container">
                <p>{errorMessage}</p>
                <h1>Register</h1>
                <div className="reg-container">
                    <div className="textbox">
                        <input type="text" placeholder="Username" id="username" name="username" onChange={handleUsernameChange} /><br />
                    </div>
                    <div className="textbox">
                        <input type="password" placeholder="Password" id="password" name="password" onChange={handlePasswordChange} /><br />
                    </div>
                    <div className="textbox">
                        <input type="password" placeholder="Confirm Password" id="confirm-password" name="confirm-password" onChange={handleConfirmPasswordChange} /><br />
                    </div>
                </div>
                <input className="btn" type="submit" value="Confirm" id="btnSubmit" />
            </div>
        </form >
    );


};

export default Register;