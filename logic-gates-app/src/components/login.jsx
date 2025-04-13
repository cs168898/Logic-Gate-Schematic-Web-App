import { useState } from "react"
import { loginUser } from '../../services/userLogin';
import Register from "./register";
import ForgetPassword from "./forgotPassword";
import DOMPurify from 'dompurify'
import { showToast } from "../utils/showToast";

function Login({ toggle, setLoggedin, setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerPopup, setRegisterPopup] = useState(false);
    const [forgetPasswordPopup, setForgetPasswordPopup] = useState(false);

    function toggleForgetPasswordPopup(){
        setForgetPasswordPopup(!forgetPasswordPopup);
    }

    function toggleRegisterPopup(){
        setRegisterPopup(!registerPopup);
    }

    function handleLogin(e) {
        e.preventDefault()

        loginUser(username, password)
            .then(response => {
                // successful login
                setLoggedin(true);
                setUser(response.data);
                toggle();
            }).catch(error => {
                console.error('cant log in: ', error);
                showToast('Invalid username or password, please ensure your email is verified')
            })
        // Code to handle login goes here
        
    }

    const sanitizeInput = (input) => input.replace(/[^a-zA-Z0-9_-]/g, "");  // Only allow letters, numbers, _ and -


    return (
        <div className="popup">
            <div className="popup-inner">
                <button onClick={toggle} className="close-button">x</button>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={username} maxLength={25} onChange={e => setUsername(sanitizeInput(e.target.value))} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} maxLength={100} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <button type="submit">Login</button>
                    
                </form>
                <div className="button-group">
                    <button onClick={toggleRegisterPopup} className="register-button"> Register</button>
                    
                    {registerPopup ? <Register toggleRegisterPopup = {toggleRegisterPopup} /> : null}

                    {/* <button onClick={toggleForgetPasswordPopup} className="forget-password-button"> Forgot Password? </button> */}
                    {forgetPasswordPopup && <ForgetPassword toggleForgetPassword = {toggleForgetPasswordPopup}/>}
                </div>
                
            </div>
        </div>
    )
}

export default Login