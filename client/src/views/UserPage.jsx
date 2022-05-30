import { useState } from 'react';
import { Link } from "react-router-dom";
import './UserPage.scss';

const UserPage = () => {
    const [users, _] = useState([{ name: "admin" }]);

    return (
        <div className="page-container">
            <Link to="/register" className="btn btn-primary">Register a users</Link>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => <ItemSlot {...user} />)}
                </tbody>
            </table>
        </div>
    );
};

const ItemSlot = ({ name }) => {
    return (
        <tr>
            <td>{name}</td>
            <td><button>X</button></td>
        </tr>
    );
};

export default UserPage;