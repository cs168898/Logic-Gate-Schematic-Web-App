import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function LandingPage({ toggleLandingPage }) {
  const [hideAnim, setHideAnim] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleGoToApp = () => {
    if (dontShowAgain) {
      Cookies.set('hideLandingPage', 'true', { expires: 365 });
    }

    setHideAnim(true);
    setTimeout(() => {
      toggleLandingPage();
    }, 700);
  };

  return (
    <>
    <div className={`landing-page ${hideAnim ? 'slide-up' : ''}`}>
      <div className="logo">
        Logic Gate Through Text
      </div>
      
      <div className="how-to-use">
        <span>First time here? </span>
        <button>How to use?</button>
      </div>
      <div className="go-to-app">
        <span>Jump straight into it.</span>
        <button onClick={handleGoToApp}>Go to Application</button>
      </div>
      <br />
      <div className="dont-show">
        <input
          type="checkbox"
          id="dont-show"
          checked={dontShowAgain}
          onChange={(e) => setDontShowAgain(e.target.checked)}
        />
        <label htmlFor="dont-show" className="">
          Don't show this again
        </label>
      </div>
    </div>
    
    </>
    
    
  );
}

export default LandingPage;
