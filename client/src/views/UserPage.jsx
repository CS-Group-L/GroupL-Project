import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './UserPage.scss';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { apiUrl } from "../config";

const UserPage = () => {
    const [users, setUsers] = useState([]);

    const [authState, checkAuth, , logout] = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (authState) {
            getAllUsers();
        }
    }, [authState]);

    const removeUser = (username) => {
        axios
            .delete(`${apiUrl}/users/${username}`, {
                headers: {
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data.error);
                } else {
                    alert(`${username} has been deleted.`);
                    navigate("/");
                }
            });
    };

    const getAllUsers = () => {
        axios
            .get(`${apiUrl}/users`, {
                headers: {
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data.error);
                } else {
                    setUsers(res.data);
                }
            });
    };

    return (
        <div className="page-container user-page-container">
            <Link to="/register" className="btn btn-primary">Add users</Link>
            <table>
                <thead>
                    <tr>
                        <th>Users:</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(({ username }) => <tr>
                        <td>{username}</td>
                        <td>{(username !== "admin" && (authState?.username === username || authState?.username === "admin")) && <button className='buttonRemove' onClick={() => {
                            removeUser(username);
                            if (username === authState?.username) {
                                logout();
                            }
                        }}>Remove user</button>}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    );
};

export default UserPage;