import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function CookiePopup({ toggleCookiePopup }) {

    const handleButtonClick = () =>{
        toggleCookiePopup();
        
        Cookies.set('hideCookiesPopup', 'true', { expires: 365 });
         
    }
    

  return (
    <>
    <div className='cookie-popup'>
        <p>
            This website uses cookies to enhance the user experience. By using this website, you consent to cookies being used.
        </p>
        <button onClick={handleButtonClick}>Got it</button>
    </div>
    
    </>
    
    
  );
}

export default CookiePopup;
