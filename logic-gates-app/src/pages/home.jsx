import { useContext, useEffect, useState, useRef } from 'react';

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
import handleDownload from '../konvaLogicGates/functions/downloadTextFile';
import DOMPurify from 'dompurify'

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

  


  const { gates, setGates } = useContext(GatesContext);

  const { gatePositions, setGatePositions } = useContext(GatesPositionContext);

  const { user , loggedin} = useContext(UserContext)

  const { isSuccess ,setIsSuccess } = useContext(SuccessContext);
  
    
  /***************************** End Of useState Definitions ********************/


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
        setSelectedProjectId("");
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
    // function to merge existing gates with new user input
    setTextToBeSaved((prevText) => {return mergeGatesText(prevText, userInput, gates)});
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
      console.log('isFirstParse in handleSubmit: ', isfirstParse)

      setGates(prevGates => {
        const newGateData = parseUserInput(userInput, prevGates, isfirstParse, setIsfirstParse); // Get new gates in object format
    
        // Merge the new levels into the existing structure
        const updatedGates = mergeUniqueGates(prevGates, newGateData);
        console.log('updatedGates: ', updatedGates)
        return updatedGates; // Return the whole object
      });

      setuserInput(userInput);
     
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    }

  }
  
  const handleClearGates = async () =>{
    try{
      

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
    }

  }

  const handleClearGates2 = async () =>{
    try{
      

      setGates([]) // Keep track of all the logic gate inside the 'gates' variable
      setGatePositions({}); // Clear all wire positions
      setSelectedGateId(null); // Clear selection
      setuserInput('');
      setTextToBeSaved(''); // Clear the text to be saved
      setIsfirstParse(true);
      console.log('isFirstParse handleClearGates2', isfirstParse)
      
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    }

  }
  
  // Toggle function for sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [selectedProjectId, setSelectedProjectId] = useState(null)

  async function loadProject(id) {
    setSelectedProjectId(id);
    prevGatesRef.current = null;
    setqueuedProjectId(id);  
    await handleClearGates();
    isFirstRun.current = true;
  }
    
  async function handleSaveProject(){

    const latestProjectInfo = currentProjectInfo; 
    
    if (!latestProjectInfo || !latestProjectInfo.projectId) {
    console.error("Project info is not ready yet.");
    alert("Project info is missing. Please try again.");
    return;
    }

    try{
      const jsonbText = textToJsonb(textToBeSaved)
      const response = await saveProject(latestProjectInfo.projectId, latestProjectInfo.projectName, jsonbText);
      alert('project successfully saved');
      setIsSuccess(false);
      } catch (error){
      alert('proejct failed to save');

      }
  };
  const createNewProject = async () => {
    try{
      if (!loggedin){
        alert('Log in first');
      } else {
        toggleNamePopup(); // close the name popup window
        const response = await createProject(DOMPurify.sanitize(nameInput), user?.id)

        
  
        // refresh projectslist
        setProjectList((prevList) => [...prevList, response.data]);
      }
     

    } catch(error) {
      console.error("error while creating project", error)
    }
    
  }

  

  function toggleNamePopup(){
    setNamePopup(!namePopup);
  }

  const [openProjectOptions, setOpenProjectOptions] = useState(null);
  function toggleProjectOptions(id) {
    setOpenProjectOptions((prevId) => (prevId === id ? null : id));
  }

  const editProjectName = async () => {

  }
  
    
  return (
    <div className="App">
        <Header onSidebarToggle={toggleSidebar}/>
      <div className='main-wrapper'>
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button className='close-button' onClick={toggleSidebar}> {String.fromCharCode(8592)} </button>
          <button className='new-project-button' onClick={toggleNamePopup}>New Project</button>

          
          
          {loggedin? <button className='save-button'  disabled = {!isSuccess} onClick={() => handleSaveProject(
                                                  )}>
                                                   Save Current Project </button>: null }
          
          <h2>Projects</h2>
          <div className='project-list'>
            <ul>
              {projectList ? projectList.map((project) => (
                <div key={project.projectId} className="project-container">
                  <button
                    className={selectedProjectId == project.projectId ? 'project-button selected' : 'project-button'}
                    onClick={() => loadProject(project.projectId)} 
                  >
                    {project.projectName}
                  </button>

                  <button 
                  className='project-button-options'
                  onClick={() => toggleProjectOptions(project.projectId)}
                  
                  >
                  ...
                  </button>

                  {openProjectOptions == project.projectId &&(
                    <div className='project-options'>
                      <div className='project-options-inner'>
                        <button>Edit Name</button>
                        <button>Delete</button>
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
          
          <div className="tools-window">
            
            
            <div className="tools-window-inner">
              
            <button className='download-netlist' onClick={() => handleDownload(textToBeSaved)}>Download Netlist</button>
              <button className='clear' onClick={handleClearGates2}>Clear All Gates
              </button>

            </div>
          </div>

          <LogicGateCanvas
            setSelectedGateId={handleSelectGate}
            selectedGateId={selectedGateId}
          />
          
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
                <button className="create-button" onClick={() => handleSubmit(inputAreaText)}>
                  Create Gate
                </button>
                <button className="delete-button" onClick={handleDeleteGate} disabled={selectedGateId === null}>
                  Delete Gate
                </button>
              </div>
            </div>
          </div> {/*user-input*/}
          
          
        </div> {/*content overlay container*/}
      </div>
    </div>
  );
}

export default Home;



/////////////////////////////   NOTES ////////////////////////////

{/*
    1. Create the grid background with tracking capability to allow the user to insert logic gates
    in specific grid region. DONE
    
    2. Create the parsing logic from user input.

    3. Display the location of the logic gates through the parsing logic.

    4. Create stimulation of logic flow.

    5. Create additional logic gates.
    
*/}