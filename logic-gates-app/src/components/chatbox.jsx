import { useEffect, useState } from "react";

function ChatBox({toggleChatbox, chatboxTextArray }) {
    console.log('chatboxarray = ', chatboxTextArray)
    let reversedChatboxTextArray = chatboxTextArray.reverse()

    function splitTextAndCode(text) {
      const match = text.match(/```([\s\S]*?)```/);
      if (!match) 
        return { textOnly: text, codeBlock: null };
    
      const codeBlock = match[1].replace(/;/g, ';\n').trim();
      const textOnly = text.replace(match[0], '').trim();
    
      return { textOnly, codeBlock };
    }


    return (
        <>
        {toggleChatbox && <div className="chatbox">
            <div className="chatbox-close-button" onClick={toggleChatbox}>
              <span>&#215;</span>
            </div>
            <div className="chatbox-content">
                {reversedChatboxTextArray.map((text, index) => {
                  if (index % 2 === 0) {
                    // User message
                    return (
                      <div key={index} className="user-bubble-wrapper">
                        <div className="user-bubble">
                          <span>{text}</span>
                        </div>
                      </div>
                    );
                  } else {
                    // AI message
                    const { textOnly, codeBlock } = splitTextAndCode(text);
                    return (
                      <div key={index} className="ai-bubble-wrapper">
                        <div className="ai-bubble">
                          <p>{textOnly}</p>
                          {codeBlock && <pre>{codeBlock}</pre>}
                        </div>
                      </div>
                    );
                  }
                })}

                
            </div>
            
        </div>}

        
        </>
    );
  }
  
  export default ChatBox;
  