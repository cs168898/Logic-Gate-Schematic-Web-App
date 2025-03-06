import { useState } from "react"
import { registerUser } from "../../services/userRegister"

function Register({toggleRegisterPopup}) {
    const [username, setUsername] = useState('')
    const [email , setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    function handleRegister(e) {
        e.preventDefault()

        registerUser(username, email, password)
            .then(response => {
                // successful login
                alert('Registeration successful');
                console.log('Registeration successful', response.data);

                toggleRegisterPopup();
                
            }).catch(error => {
                console.error('cant register ', error);
                alert('cant register')
            })
        // Code to handle login goes here
        
    }


    return (
        <div className="popup">
            <div className="popup-inner-register">
                <h2>Login</h2>
                <form onSubmit={handleRegister}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label>
                        Email:
                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <button type="submit">Register</button>
                </form>
                <button onClick={toggleRegisterPopup} className="close-button">Close</button>
            </div>
        </div>
    )
}

export default Register