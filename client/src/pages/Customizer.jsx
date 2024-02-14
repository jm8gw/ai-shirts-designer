import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from '../config/config';
import state from "../store";
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from "../config/motion";
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from "../components";


const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState(''); // for file uploads

  const [prompt, setPrompt] = useState(''); // AI prompt
  const [generatingImg, setGeneratingImg] = useState(false); // loading state (are we currently generating the image?)
  
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true, 
    stylishShirt: false,
  })

  // show tab content based on the activeTab
  const generateTabConent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return (
          <ColorPicker />
        )
      case "filepicker":
        return (
          <FilePicker 
            file={file}
            setFile={setFile}
            readFile={readFile}
          />
        )
      case "aipicker":
        return (
          <AIPicker 
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        )
      default:
        return null;
    }
  }

  // handle the AI image generation
  const handleSubmit = async (type) => {
    if(prompt === '') return alert('Please enter a prompt');

    try {
      // call our backend to generate the AI image
      setGeneratingImg(true); // set loading state

      const res = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const data = await res.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`); 
    } catch (error) {
      alert(error, 'An error occurred while generating the image');
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab(""); // reset tab
    }
  }

  const handleDecals = (type, res) => { // type can be logo or full
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = res; // update the state (in store)

    if(!activeFilterTab[decalType.filterTab]) { // if the filter tab is not active, make it active
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }

    // after setting the state, activeFilterTab should be updated
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName] // update the tab name so it's not the previous state
      }
    })
  }


  // take in the type of file and pass it on to the reader function to get the file data
  const readFile = (type) => {
    reader(file)
      .then((res) => {
        handleDecals(type, res);
        setActiveEditorTab(""); // reset tab
      })
  }


  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (  // these are the tabs that allow for shirt editing (appearance is already defined in constants.js)
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabConent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />  
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (  // these are the buttons that toggle logo/texture (appearance is already defined in constants.js)
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => {handleActiveFilterTab(tab.name)}}
              />
            ))}
            <div>
              <button className='download-btn' onClick={downloadCanvasToImage}> 
                  <img
                  src={download}
                  alt='download_image'
                  className='w-3/5 h-3/5 object-contain'
                  />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

  )
}

export default Customizer