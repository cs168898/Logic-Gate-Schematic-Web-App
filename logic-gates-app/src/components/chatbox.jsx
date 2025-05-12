import { useEffect, useState } from "react";

function ChatBox({toggleChatbox, chatboxTextArray }) {
    console.log('chatboxarray = ', chatboxTextArray)
    
    let reversedChatboxTextArray = [...chatboxTextArray].reverse()


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
                {chatboxTextArray.map((msg, index) => {
                  const { textOnly, codeBlock } = splitTextAndCode(msg.content);
                  return (
                    <div key={index} className={`${msg.sender}-bubble-wrapper`}>
                      <div className={`${msg.sender}-bubble`}>
                        <p>{textOnly}</p>
                        {codeBlock && <pre>{codeBlock}</pre>}
                      </div>
                    </div>
                  );
                })}

                
            </div>
            
        </div>}

        
        </>
    );
  }
  
  export default ChatBox;
  