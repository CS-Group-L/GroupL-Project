import './UserPage.scss'
import { useState } from 'react';

const UserPage = () => {
    const [itemslots, SetItemSlots] = useState([]);
    const [name, setUser] = useState([]);
    const [password, setPassword] = useState([]);
    const [count, setCount] = useState(0);

    function addUsers()  {
    SetItemSlots(itemslots.concat(<ItemSlot naam={name} wachtwoord={password} id={count}/>));
        setCount(count+1);
    }

    return (
    <div className="container2">
        <h1 id='title'>Add users</h1>
        
        <div className="add-elements">
            <input id="add" onChange={e=>setUser(e.target.value)} type="text" placeholder="add user" /><input id="password" onChange={e=>setPassword(e.target.value)} type="text" placeholder="add password" />
            <button id="btn" onClick={addUsers}>Add</button>
        </div>
        
        <div className="element-list">
            <ul id="list">
            </ul>
        </div>
        <table>
        <tr>
            <th>User</th>
            <th>Password</th>
            <th></th>
        </tr>
        <ItemSlot naam={"admin"} wachtwoord={"admin"} id={-1} />
        {itemslots}
        </table>
    </div>
    
    );
};

const ItemSlot = ({naam, wachtwoord, id}) => {
    function deleteUsers (id) {
        document.getElementById(id).remove();
    }

    return (
        <tr id={id}>
            <td>{naam}</td>
            <td>{wachtwoord}</td>
            <td><button onClick={()=>{deleteUsers(id)}}>X</button></td>
        </tr>
    )
}

export default UserPage;