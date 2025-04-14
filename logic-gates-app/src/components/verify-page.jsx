import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../services/verifyEmail';
import { showToast } from '../utils/showToast';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");
  const hasRun = useRef(false);
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    
  }, [token]);

  const handleVerify = () => {
    if (hasRun.current) return;
    hasRun.current = true;
    setShowMessage(true)
    if (token) {
      
      verifyEmail(token).then(response => {
        setMessage(response.data)
      }).catch(error => {
        setMessage(error.response.data)
      })
        
      
    } else {
      setMessage("Token missing.");
    }
  }

  return (
  <div className='verify-wrapper'>
  {showMessage && <div className="verify-message">
      {message}
  </div>}

  <button onClick={handleVerify} className='verify-button'>
    Verify
  </button>
    
  </div>
  );
};

export default VerifyPage;
