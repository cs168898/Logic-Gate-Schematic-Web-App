import { useEffect, useState } from "react"
import { registerUser } from "../../services/userRegister"
import DOMPurify from 'dompurify'
import { showToast } from "../utils/showToast"
import { checkUsername } from "../../services/checkUsername"
import { checkEmail } from "../../services/checkEmails"

function Register({toggleRegisterPopup}) {
    const [username, setUsername] = useState('')
    const [email , setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPasswordDiff, setIsPasswordDiff] = useState(false)


    const handleEmailChange = (e) => {
        const rawEmail = e.target.value.trim();
        const sanitizedEmail = DOMPurify.sanitize(rawEmail);
        
        setEmail(sanitizedEmail); // Always update state
        
        
    };

    async function handleRegister(e) {
        e.preventDefault()

        // username validation
        if(username.length == 0){
            showToast('Username cannot be empty!')
            return;
        }


        // Wait for username check before proceeding
        // const usernameTaken = await handleCheckUsername();

        if (await handleCheckUsername()){
            showToast('Username already exists!')
            return;
        }

        // email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/.test(email)) {
            showToast('Invalid email format!')
            return;
        }

        // Check if email exists
        // const emailTaken = await handleCheckEmail();
        if (await handleCheckEmail()) {
            showToast('Email already exists!');
            return;
        }

        // Password Validation
        if (password.length < 6) {  // Example: Minimum 6 characters
            showToast(' Password must be at least 6 characters long!');
            return;
        }

        registerUser(username, email, password)
            .then(response => {
                // successful login
                showToast('Registeration successful, please verify your account in your email', 'success');
                

                toggleRegisterPopup();
                
            }).catch(error => {
                showToast(`${error.response.data}`);
            })
        
        
    }

    const sanitizeInput = (input) => input.replace(/[^a-zA-Z0-9_-]/g, "");  // Only allow letters, numbers, _ and -

    
    const handleCheckUsername = async () => {
        try {
            const response = await checkUsername(username);
            return response.data
        } catch (error) {
            
            return false;
        }
    };

    const handleCheckEmail = async () => {
        try {
            const response = await checkEmail(email);
  
            return response.data;
        } catch (error) {
            showToast("Email already exists");
            return false;
        }
    };

    useEffect(() => {
        if(password !== confirmPassword){
            setIsPasswordDiff(true)
        } else {
            setIsPasswordDiff(false)
        }
    }, [confirmPassword])


    return (
        <div className="popup">
            <div className="popup-inner-register">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <label>
                        Username:
                        <input type="text" value={username} maxLength={25} onChange={e => setUsername(sanitizeInput(e.target.value))} />
                    </label>
                    <label>
                        Email:
                        <input type="text" value={email} maxLength={100} onChange={handleEmailChange} />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} maxLength={100} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <label>
                        Confirm Password:
                        <input type="password" value={confirmPassword} 
                        maxLength={100} 
                        onChange={e => 
                            {setConfirmPassword(e.target.value)
                            passwordConfirmation()
                        }} />
                        {isPasswordDiff ? <span className="password-validation"> Password must be the same </span> : null}
                    </label>
                    <button type="submit" disabled = {isPasswordDiff}> Register </button>
                </form>
                <button onClick={toggleRegisterPopup} className="close-button">x</button>
            </div>
        </div>
    )
}

export default Register