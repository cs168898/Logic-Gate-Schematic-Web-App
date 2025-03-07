import { useState } from "react"
import { loginUser } from '../../services/userLogin';
import Register from "./register";

function Login({ toggle, setLoggedin, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerPopup, setRegisterPopup] = useState(false);


    function toggleRegisterPopup(){
        setRegisterPopup(!registerPopup);
    }

    function handleLogin(e) {
        e.preventDefault()

        loginUser(username, password)
            .then(response => {
                // successful login
                console.log('login successful', response.data);
                setLoggedin(true);
                setUser(response.data);
                toggle();
            }).catch(error => {
                console.error('cant log in: ', error);
                alert('invalid username or password')
            })
        // Code to handle login goes here
        
    }


    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <button type="submit">Login</button>
                    
                </form>
                <button onClick={toggleRegisterPopup} className="register-button"> Register</button>
                    <button onClick={toggle} className="close-button">x</button>
                
                {registerPopup ? <Register toggleRegisterPopup = {toggleRegisterPopup} /> : null}
            </div>
        </div>
    )
}

export default Login