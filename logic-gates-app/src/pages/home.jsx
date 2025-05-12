import { useContext, useEffect, useState, useRef, useTransition } from 'react';

// Component Imports

import Header from '../components/header';

// Utilities (functions) Imports
import { parseUserInput } from '../utils/parseUserInput';
import { dragAndDrop } from '../utils/dragAndDrop'; // Allows users to drag and drop text area and sidebar windows
import LogicGateCanvas from '../utils/LogicGateCanvas';
import { GatesContext } from '../context/GatesContext';
import { GatesPositionContext } from '../context/GatesPositionContext';
import { listUsers } from '../../services/userService';
import { UserContext } from '../context/UserContext';
import { getAllProjects } from '../../services/getAllProjects';
import { getProjectById } from '../../services/getProjectById';
import { textToJsonb } from '../utils/textToJsonb';
import { jsonbToText } from '../utils/jsonbToText';
import { SuccessContext } from '../context/SuccessContext';
import { saveProject } from '../../services/saveProject';
import { mergeGatesText } from '../utils/mergeGatesText';
import { createProject } from '../../services/createNewProject';
import { deleteProject } from '../../services/deleteProjects';
import CookiePopup from '../components/cookie-popup';
import { showToast } from '../utils/showToast';
import { generateSchematic } from '../../services/aiGenerate';
import HowToUse from '../components/how-to-use';
import LandingPage from '../components/landing-page';
import handleDownload from '../konvaLogicGates/functions/downloadTextFile';
import DOMPurify from 'dompurify'
import Cookies from 'js-cookie';
import { faL } from '@fortawesome/free-solid-svg-icons';
import ShowNetlist from '../components/show-netlist';
import ChatBox from '../components/chatbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

function Home() {
  /***************************** useState Definitions ***************************/
  const [userInput, setuserInput] = useState("")
  

  const [projectList, setProjectList] = useState([]) // this will store the list of projects from the database

  const [parsedUserInput, setParsedUserInput] = useState("")

  const [selectedGateId, setSelectedGateId] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [ textToBeSaved, setTextToBeSaved] = useState("");

  const [ inputAreaText, setInputAreaText] = useState("");

  const [cleared, setCleared] = useState(false);

  const [ queuedProjectId , setqueuedProjectId] = useState("");

  const [currentProjectInfo, setCurrentProjectInfo] = useState("");

  const [namePopup, setNamePopup] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const [spinnerVisible, setSpinnerVisible] = useState(false)

  const [showLandingPage, setShowLandingPage] = useState(true)

  const [showHowToUse, setshowHowToUse] = useState(false)

  const [useAI, setUseAI] = useState(false)

  const [chatboxTextArray, setChatboxTextArray] = useState([])

  const isHeadless = navigator.webdriver;
  
  /***************************** End Of useState Definitions ********************/

  /***************************** useContext Statements ***************************/

  const { gates, setGates } = useContext(GatesContext);

  const { gatePositions, setGatePositions } = useContext(GatesPositionContext);

  const { user , loggedin} = useContext(UserContext)

  const { isSuccess ,setIsSuccess } = useContext(SuccessContext);
  
    
  /***************************** End of useContext Statements ***************************/


  /***************************** useEffect Statements ***************************/

    // useEffect hook to initialize dragAndDrop on component mount
    useEffect(() => {
      dragAndDrop(); // Initialize the custom drag and drop behavior
      
    }, []); // Run once after component mounts

    useEffect(() => {
      if (loggedin){
        getAllProjects(user.id).then((response) => {
          setProjectList(response.data);
        }).catch(error => {
          console.error(error);
        })
      } else {
        // if user is logged out
        setProjectList(null);
        handleClearGates2();
        setCurrentProjectInfo("");
        setLoadedProjectId("");
        setIsSuccess(false);
      }
      }, [loggedin, user?.id])

      
    // this is to store the previous gates information into a variable for check later on
    const prevGatesRef = useRef();
    const isFirstRun = useRef(true);

    const [isfirstParse, setIsfirstParse] = useState(true);
    // Use useEffect to monitor changes in the gates state
    useEffect(() => {
      
      if (isFirstRun.current) {
        isFirstRun.current = false;
        prevGatesRef.current = gates;

        return;
      }
  
      // check if the current gates created matches the previous gates , if it doesnt, means it was successful
      if (prevGatesRef.current && JSON.stringify(prevGatesRef.current) !== JSON.stringify(gates)) {
        setIsSuccess(true);
        prevGatesRef.current = gates; // Update the previous state of the gates

      } else {
        setIsSuccess(false);
      }
      
    }, [gates]);

    useEffect(() => {
      if (cleared && queuedProjectId) {
        (async () => {
          try {
            const response = await getProjectById(queuedProjectId);
            const rawText = response.data.projectJSON;
            const processedText = jsonbToText(rawText);
            
            if (response.data){
              let projectData = response.data
              setCurrentProjectInfo(projectData);
              setuserInput(DOMPurify.sanitize(processedText));
              setInputAreaText(DOMPurify.sanitize(processedText));
              handleSubmit(DOMPurify.sanitize(processedText));
            }
          } catch (error) {
            console.error("error loading project:", error);
          } finally {
            setCleared(false);
          }
        })();
      }
    }, [cleared, queuedProjectId]);

  // Ensure textToBeSaved is updated correctly before saving
  // useEffect(() => {
  //   if (isSuccess) {
  //     setTextToBeSaved((prevText) => {return mergeGates(prevText, inputAreaText)});
  //   }
  // }, [isSuccess, userInput]);

  /***************************** End Of UseEffect Statements ***************************/
  
  /***************************** Event Handlers ***************************/
  
  // Handle clicking on a gate to select it
  const handleSelectGate = (id) => {
    if(id === selectedGateId){
      setSelectedGateId(null);
    } else{
      setSelectedGateId(id);
    }
    
  };

  // Handle deleting the selected gate
  const handleDeleteGate = () => {
    if (selectedGateId !== null) {
      // Remove the gate from gates
      setGates((prev) => {
        const updatedGates = Object.keys(prev).reduce((acc, levelKey) => {
            acc[levelKey] = prev[levelKey].filter((gate) => gate.id !== selectedGateId);
            return acc;
        }, {});
    
        return updatedGates;
      });
  
      // Remove the gate's positions from gatePositions
      setGatePositions((prev) => {
        const { [selectedGateId]: _, ...rest } = prev; // Update the gatePositions state with the key selectedGateId to '_' which is a placeholder variable (not used).
        return rest;
      });

      // Check if the gates have successfully changed
      
      // Remove the gate's text from textToBeSaved
      setTextToBeSaved((prevText) => {
        const allGates = Object.values(gates).flat(); // Convert gates object into a single array

        const gateToDelete = allGates.find((gate) => gate.id === selectedGateId);
        if (!gateToDelete || !gateToDelete.name) {
          return prevText; // If no matching gate, return old text
        }
      
        try {
          // 1) Parse current text into an array of gate objects
          const prevJsonString = textToJsonb(prevText);
          let prevArray = JSON.parse(prevJsonString); // Now we have a JS array
      
          // 2) Remove the gate whose "name" matches gateToDelete.name
          const updatedArray = prevArray.filter((g) => g.name !== gateToDelete.name);
          // 3) Convert updated array back to text
          const updatedJsonString = JSON.stringify(updatedArray, null, 2);
          const updatedText = jsonbToText(updatedJsonString);
          return updatedText.trim();
      
        } catch (error) {
          console.error("Error removing gate from text:", error);
          return prevText; // In case of parse errors, revert
        }
      });
      
  
      setSelectedGateId(null); // Clear selection
    }
  };

/***************************** End Of Event Handlers ***************************/
  function mergeUniqueGates(prevGates, newGateData) {

    // Clone the previous gates structure to avoid mutation
    const updatedGates = { ...prevGates };

    Object.entries(newGateData).forEach(([level, newGates]) => {
        if (!updatedGates[level]) {
            updatedGates[level] = []; // Create level if it doesn't exist
        }

        // Filter out duplicates: keep only gates that do not exist in prevGates[level]
        const uniqueNewGates = newGates.filter(newGate =>
          !prevGates[level]?.some(prevGate => prevGate.id === newGate.id)
        );

        // Merge only unique gates
        updatedGates[level] = [...updatedGates[level], ...uniqueNewGates];
    });

    return updatedGates; // Return updated gates without duplicates
  }

  useEffect(() => {
    const levels = Object.values(prevGatesRef.current); // Array of arrays
    console.log('levels text to be saved = ', levels)
    const allExistingGates = levels.flat().map(gate => 
      `name: ${gate.name}; type: ${gate.type}; input: ${gate.input}; output: ${gate.output}; ${gate.level? (`level: ${gate.level}`) : ''};`
    );
    // function to merge existing gates with new user input
    setTextToBeSaved((prevText) => {return mergeGatesText(prevText, allExistingGates, gates)});
    console.log('textToBeSaved = ', textToBeSaved)
  }, [gates])

  // if there is nothing on the canvas, set the firstParse back to true
  // this is to use the collectGateLevel function again.
  useEffect(() => {
    if(Object.keys(gates).length == 0){
      setIsfirstParse(true)
    }
  }, [gates])

  // Create the handleSubmit function to send userInput into backend
  const handleSubmit = async (userInput) =>{
    try{

      await new Promise(resolve => setTimeout(resolve, 0)); // allow React to render it

      console.log('isFirstParse in handleSubmit: ', isfirstParse)

      if(useAI){
        setChatboxVisible(true); // show the AI chatbox
        // insert user input into chatbox
        setChatboxTextArray(prev => [...prev, { sender: 'user', content: userInput }]);
        setSpinnerVisible(true); // show spinner
        console.log('using GEMINI AI!!!! FRONTEND')
        console.log('prevGatesRef.current = ', prevGatesRef.current)
        const levels = Object.values(prevGatesRef.current); // Array of arrays
        console.log('levels = ', levels)
        const allExistingGates = levels.flat().map(gate => 
          `name: ${gate.name}; type: ${gate.type}; input: ${gate.input}; output: ${gate.output}; level: ${gate.level};`
        );
        console.log("Formatted gates preview:", allExistingGates[0]);
        const response = await generateSchematic(userInput, allExistingGates);
        setChatboxTextArray(prev => [...prev, { sender: 'ai', content: response.data }]);
        // maybe create a function to extract from delimiter (triple backticks)
        userInput = cleanGateText(response.data)
        
        console.log('the returned user input is: ', userInput)
      }

      setGates(prevGates => {
        const newGateData = parseUserInput(userInput, prevGates, isfirstParse, setIsfirstParse, useAI); // Get new gates in object format
    
        // Merge the new levels into the existing structure
        const updatedGates = mergeUniqueGates(prevGates, newGateData);
        console.log('updatedGates: ', updatedGates)
        return updatedGates; // Return the whole object
      });

      setuserInput(userInput);
     
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    } finally{
      setSpinnerVisible(false); // show spinner
    }

  }
  
  const handleClearGates = async () =>{
    try{
      // This is the Clear Gates for Loading Projects

      setSpinnerVisible(true); // show spinner
      await new Promise(resolve => setTimeout(resolve, 0)); // allow React to render it
      setGates([]) // Keep track of all the logic gate inside the 'gates' variable
      setGatePositions({}); // Clear all wire positions
      setSelectedGateId(null); // Clear selection
      setuserInput('');
      setTextToBeSaved(''); // Clear the text to be saved
      // Trigger an update in the next render
      setCleared(true);   // Now the "cleared" flag flips in the next re-render
      setIsfirstParse(true);
      console.log('isFirstParse handleClearGates1', isfirstParse)
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    } finally{
      setSpinnerVisible(false);
    }

  }

  const handleClearGates2 = async () =>{
    try{
       // This is the Clear Gates for the button
      setSpinnerVisible(true); // show spinner
      await new Promise(resolve => setTimeout(resolve, 0)); // allow React to render it
      setGates([]) // Keep track of all the logic gate inside the 'gates' variable
      setGatePositions({}); // Clear all wire positions
      setSelectedGateId(null); // Clear selection
      setuserInput('');
      setTextToBeSaved(''); // Clear the text to be saved
      setIsfirstParse(true);
      console.log('isFirstParse handleClearGates2', isfirstParse)
      
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    } finally{
      setSpinnerVisible(false);
    }

  }
  
  // Toggle function for sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [loadedProjectId, setLoadedProjectId] = useState(null)

  async function loadProject(id) {
    setUseAI(false);
    setLoadedProjectId(id);
    prevGatesRef.current = null;
    setqueuedProjectId(id);  
    await handleClearGates();
    isFirstRun.current = true;
    setIsSuccess(false);
  }
    
  async function handleSaveProject(){

    setSpinnerVisible(true); // show spinner
    await new Promise(resolve => setTimeout(resolve, 0)); // allow React to render it

    const latestProjectInfo = currentProjectInfo; 
    
    if (!latestProjectInfo || !latestProjectInfo.projectId) {
    console.error("Project info is not ready yet.");
    alert("Project info is missing. Please try again.");
    return;
    }

    try{
      const jsonbText = textToJsonb(textToBeSaved)
      const response = await saveProject(latestProjectInfo.projectId, latestProjectInfo.projectName, jsonbText);
      showToast('Project Successfully Saved', 'success');
      setIsSuccess(false);
    } catch (error){
      showToast('Project Failed to Save');

    }
    setSpinnerVisible(false);
    
  };
  const createNewProject = async () => {
    try{
      setSpinnerVisible(true); // show spinner
      await new Promise(resolve => setTimeout(resolve, 0)); // allow React to render it

      if (!loggedin){
        showToast('Log in first');
      } else {
        toggleNamePopup(); // close the name popup window
        const response = await createProject(DOMPurify.sanitize(nameInput), user?.id)

        
  
        // refresh projectslist
        setProjectList((prevList) => [...prevList, response.data]);
      }
     

    } catch(error) {
      showToast("error while creating project", error)
    } finally{
      setSpinnerVisible(false);
    }
    
  }

  

  function toggleNamePopup(){
    setNamePopup(!namePopup);
  }

  const projectOptionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        projectOptionsRef.current &&
        !projectOptionsRef.current.contains(event.target)
      ) {
        // if it selects anything outside the window, set it to null
        setOpenProjectOptions(null);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [openProjectOptions, setOpenProjectOptions] = useState(null);
  function toggleProjectOptions(id) {
    setOpenProjectOptions((prevId) => (prevId === id ? null : id));
    
    
  }

  const [selectedProjectId, setSelectedProjectId] = useState("")

  const handleDeleteProject = async () => {
    try{
      setSpinnerVisible(true); // show spinner
      await new Promise(resolve => setTimeout(resolve, 0)); // allow React to render it

      const response = deleteProject(selectedProjectId)
      console.log('deleted response = ', response)
      // refresh projectslist
      setProjectList((prevList) =>
        prevList.filter((project) => project.projectId !== selectedProjectId)
      );

      if (selectedProjectId == loadedProjectId){
        await handleClearGates();
        setLoadedProjectId(null);
      }

    } catch (error){
      showToast('Error: ', error)
    } finally{
      setSpinnerVisible(false);
    }
  }

  useEffect(() => {
    console.log('selectedprojectId=', selectedProjectId)
  }, [selectedProjectId])

  const toggleLandingPage = () => {

    setShowLandingPage(!showLandingPage);

  }

  const [landingPageChecked, setLandingPageChecked] = useState(false); // new state


  useEffect(() => {
    const hideLanding = Cookies.get('hideLandingPage');
    const hideCookiePopup = Cookies.get('hideCookiesPopup');
    const shouldShowLanding = hideLanding !== 'true';

    if (isHeadless) {
      // skip landing page for Playwright
      setShowLandingPage(false);
      setshowCookiePopup(false); // optional
    } else {
      setShowLandingPage(shouldShowLanding);
      setshowCookiePopup(Cookies.get('hideCookiesPopup') !== 'true');
    }


    if (hideLanding === 'true') {
      setShowLandingPage(false);
    } else {
      setShowLandingPage(true);
    }

    if(hideCookiePopup === 'true'){
      setshowCookiePopup(false);
    } else {
      setshowCookiePopup(true);
    }
    setLandingPageChecked(true); // done checking


  }, []);

  const [showCookiePopup, setshowCookiePopup] = useState(true)

  const toggleCookiePopup = () =>{
    setshowCookiePopup(!showCookiePopup);
  }

  const toggleHowToUse = () => {
    setshowHowToUse(!showHowToUse)
  }
  
  const [showNetlist, setShowNetlist] = useState(false)
  const toggleShowNetList = () =>{
    setShowNetlist(!showNetlist)
  }

  const [chatboxVisible, setChatboxVisible] = useState(false);
  const toggleChatbox = () =>{
    console.log('chatbox toggled!', chatboxVisible)
    setChatboxVisible(!chatboxVisible);
  }

  function cleanGateText(rawText) {
    // Convert input to string and remove unwanted characters
    const text = typeof rawText === 'string' ? rawText : JSON.stringify(rawText, null, 2);
  
    return text
      .replace(/[\[\]{}"']/g, '')       // remove brackets and quotes
      .split('\n')                      // break into lines
      .map(line => line.trim())         // trim each line
      .filter(line => /^(name|type|input|output|level):/i.test(line)) // keep only valid gate lines
      .join('\n')                       // rejoin
      .trim();
  }
  

  // DO NOT INSERT ANY FUNCTIONS AFTER THIS LINE!!!!
  if (!landingPageChecked) return null;

  const shouldRender = landingPageChecked && !showLandingPage

  return (
    <div className="App">

    {landingPageChecked && showLandingPage && (
      <LandingPage 
      toggleLandingPage={toggleLandingPage}
      toggleHowToUse={toggleHowToUse}
       />
    )}
    {showHowToUse && <HowToUse toggleHowToUse={toggleHowToUse}/>}
        <Header onSidebarToggle={toggleSidebar} toggleHowToUse={toggleHowToUse} />
        
    {chatboxVisible && <ChatBox toggleChatbox={toggleChatbox} chatboxTextArray={chatboxTextArray}/>}
      <div className='main-wrapper'>
        
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

          <button className='close-button' onClick={toggleSidebar}> {String.fromCharCode(8592)} </button>

          {loggedin && <button className='new-project-button' onClick={toggleNamePopup}>New Project</button>}

          {loggedin? <button className='save-button'  disabled = {!isSuccess} onClick={() => handleSaveProject(
                                                  )}>
                                                   Save Current Project </button>: null }
          
          <h2>Projects</h2>
          <div className='project-list'>
            <ul>
              {projectList ? projectList.map((project) => (
                <div key={project.projectId} className="project-container">
                  <button
                    className={loadedProjectId == project.projectId ? 'project-button selected' : 'project-button'}
                    onClick={() => loadProject(project.projectId)} 
                  >
                    {project.projectName}
                  </button>

                  <button 
                  className='project-button-options'
                  onClick={() => {
                    toggleProjectOptions(project.projectId)
                    setSelectedProjectId(project.projectId)
                    
                  }}
                  
                  >
                  ...
                  </button>

                  {openProjectOptions == project.projectId && isSidebarOpen &&(
                    <div className='project-options' ref={projectOptionsRef}>
                      <div className='project-options-inner'>
                        {/* <button>Edit Name</button> */}
                        <button
                        onClick={handleDeleteProject}>Delete</button>
                      </div>
                    </div>
                  )}

                </div>
                
              )) : null}
            </ul>
          </div>
        </div>
        {namePopup?
            <div className='new-project-window'>
              <div className='new-project-window-inner'>
                <h3>Enter the name of your project</h3>
                <input 
                type="text" 
                placeholder='Name of Project'
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}/>
                <button className='create-project-button' onClick={createNewProject}>Create Project</button>
                <button className='close-button' onClick={toggleNamePopup}>x</button>
              </div>
              
            </div>
            :
            null
          }
        
        <div className="content-overlay">
          {(shouldRender || isHeadless) && 
            (
            <>
            <div className="tools-window">
              
                <FontAwesomeIcon icon={faBars}
                      className='drag-drop-icon' 
                      id='drag-drop-icon' 
                      />

              <div className="tools-window-inner">
              <button className='chatbox-button' onClick={toggleChatbox}>AI Chatbox</button>
              <button className="delete-button" onClick={handleDeleteGate} disabled={selectedGateId === null}>
                    Delete Gate
                  </button>
                  
              <button className='view-netlist' onClick={toggleShowNetList}>{showNetlist? 'Hide Netlist' : 'View Netlist'}</button>
              <button className='download-netlist' onClick={() => handleDownload(textToBeSaved)}>Download Netlist</button>
                <button className='clear' onClick={handleClearGates2} disabled={spinnerVisible}>Clear All Gates
                </button>
                

              </div>
              
            </div>
            
              {showNetlist && 
              
                <ShowNetlist gates={gates}/>
              }

            </>
            )
          
          }
          
          
          <div className='spinner-wrapper'>
            {spinnerVisible && <div className='spinner'></div>}
            <LogicGateCanvas
              setSelectedGateId={handleSelectGate}
              selectedGateId={selectedGateId}
            />
          </div>
          
          {(shouldRender || isHeadless) &&
            <div className="user-input">
              <div className="textarea-button-container">
                <textarea
                  className='user-input2'
                  id="user-input"
                  name="user-input"
                  placeholder='-Enter your logic here-'
                  autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                  value = {inputAreaText}
                  onChange={(e) => setInputAreaText(DOMPurify.sanitize(e.target.value))}
                  maxLength={4000}
                ></textarea>
                <div className="button-wrapper">
                  <button 
                    id="use-ai"
                    className={`use-ai-button ${useAI ? 'active' : ''}`}
                    onClick={() => setUseAI(prev => !prev)}
                  >
                    Use AI
                  </button>
                  <button className="create-button" onClick={() => handleSubmit(inputAreaText)} disabled={spinnerVisible}>
                    Create Gate&#40;s&#41;
                  </button>
                  
                  
                </div>
              </div>
            </div> // user input
          }
          
          
          
        </div> {/*content overlay container*/}
      </div>
      { showCookiePopup && landingPageChecked && !showLandingPage && <CookiePopup toggleCookiePopup={toggleCookiePopup}/>}
    </div>
  );
}

export default Home;



/////////////////////////////   NOTES ////////////////////////////

{/*
    Created by Samuel Yew
    LinkedIn: https://www.linkedin.com/in/samuelyew/
    
*/}