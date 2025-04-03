import { useState } from "react"
import Register from "./register";
import DOMPurify from 'dompurify'
import { checkEmail } from "../../services/checkEmails";
import { showToast } from "../utils/showToast";

function ForgetPassword({toggleForgetPassword}) {
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)

    const handleEmailChange = (e) => {
        const rawEmail = e.target.value.trim();
        const sanitizedEmail = DOMPurify.sanitize(rawEmail);
        
        setEmail(sanitizedEmail); // Always update state
        
        
    };
    
    const handleForgetPassword = async () => {
        // verify email
        try {
            const response = await checkEmail(email)

            if (response.data){
                // insert function to send reset link
                showToast('Sent Password Reset Link to email')
            } else {
                showToast('An error occured')
            }
        }catch (error){
            showToast(error)
        }
        
        
        

        // if success, showtoast the success

        // else showtoast the error
    }

    return (
        <div className="popup">
            <div className="popup-inner-forget-password">
                
                <p>Enter the email that you used to create your account.</p>
                <form onSubmit={handleForgetPassword}>
                    <button onClick={toggleForgetPassword} className="close-button">x</button>
                    <label>
                        Email:
                        <input type="text" value={email} maxLength={100} onChange={handleEmailChange} />
                    </label>
                    
                    <button type="submit">Reset Password</button>
                    
                </form>
                
            </div>
        </div>
    )
}

export default ForgetPassword