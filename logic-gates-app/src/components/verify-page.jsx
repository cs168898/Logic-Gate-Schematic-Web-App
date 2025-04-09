import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../services/verifyEmail';
import { showToast } from '../utils/showToast';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");
  const token = searchParams.get("token");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (token) {
      verifyEmail(token).then(response => {
        setMessage(response.data)
      }).catch(error => {
        setMessage(error.response.data)
      })
        
      
    } else {
      setMessage("Token missing.");
    }
  }, [token]);

  return (
    <div className="p-4 text-center text-xl">
      {message}
    </div>
  );
};

export default VerifyPage;
