import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './UserPage.scss';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    
    const [authState, checkAuth] = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        getAllUsers();
    }, [])

    const removeUser = (username) =>{ 
        axios
            .delete(`http://localhost:3000/users/${username}`, {
                headers: {
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if(res.data.error){
                    console.log(res.data.error);
                } else {
                    alert(`${username} has been deleted.`);
                    navigate("/");
                }
            })
    }

    const getAllUsers = () =>{
        axios
            .get("http://localhost:3000/users", {
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
            })
    }

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
                    {users.map((user) => <ItemSlot {...user} removeUser={removeUser}/>)}
                </tbody>
            </table>
        </div>
    );
};

const ItemSlot = ({ username, removeUser }) => {
    return (
        <tr>
            <td>{username}</td>
            {/* <td><Link to="/change-password"><button className='buttonRemove'>Change password</button></Link></td> */}
            <td><button className='buttonRemove' onClick={() => removeUser(username)}>Remove user</button></td>
        </tr>
    );
};

export default UserPage;