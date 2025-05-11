import { useEffect, useState } from "react";

function ChatBox({toggleChatbox, chatboxTextArray }) {
    console.log('chatboxarray = ', chatboxTextArray)
    return (
        <>
        {toggleChatbox && <div className="chatbox">
            <div className="chatbox-content">
                
                <div className="chatbox-close-button" onClick={toggleChatbox}>
                    <span>&#215;</span>
                </div>
            
                {chatboxTextArray.map((text, index) => (
                    index % 2 === 0 ? (
                        <div key={index} className="user-bubble-wrapper">
                          <div className="user-bubble">
                            <span>{text}</span>
                          </div>
                        </div>
                    ) : (
                        <div key={index} className="ai-bubble-wrapper">
                          <div className="ai-bubble">
                            <span>{text}</span>
                          </div>
                        </div>
                    )
                ))}
                
            </div>
            
        </div>}

        
        </>
    );
  }
  
  export default ChatBox;
  