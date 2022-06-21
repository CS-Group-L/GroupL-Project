import './Register.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from "axios";
import { apiUrl } from "../config";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [authState, checkAuth] = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const changePassword = (oldPassword, newPassword, confPassword) => {
        const formData = new FormData();
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);
        formData.append("confPassword", confPassword);
        axios
            .post(`${apiUrl}/users/changepass`, formData, {
                headers: {
                    'Content-Typer': 'multipart/form-data',
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data);
                } else {
                    alert(`Your password has been updated!`);
                    navigate("/");
                }
            });
    };

    const handleOldPasswordChange = (e) => {
        e.preventDefault();

        setOldPassword(e.target.value);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        e.preventDefault();

        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            setErrorMessage("Please fill in all the required fields.");
            return;
        }
        if (newPassword === confPassword) {
            if (password.length < 6) {
                setErrorMessage("Password must be at least 6 characters long");
                return;
            }
            setErrorMessage("");
            changePassword(oldPassword, newPassword, confPassword);
        } else {
            setErrorMessage("Passwords do not match.");
        }
    };


    return (
        <form method="post" id="register-form" onSubmit={handleSubmit}>
            <div className="register-container">
                <p>{errorMessage}</p>
                <h1>Change password</h1>
                <div className="reg-container">
                    <div className="textbox">
                        <input type="password" placeholder="Old password" id="old-pass" name="old-pass" onChange={handleOldPasswordChange} /><br />
                    </div>
                    <div className="textbox">
                        <input type="password" placeholder="New password" id="password" name="password" onChange={handlePasswordChange} /><br />
                    </div>
                    <div className="textbox">
                        <input type="password" placeholder="Confirm new password" id="confirm-password" name="confirm-password" onChange={handleConfirmPasswordChange} /><br />
                    </div>
                </div>
                <input className="btn" type="submit" value="Confirm" id="btnSubmit" />
            </div>
        </form >
    );
};

export default ChangePassword;