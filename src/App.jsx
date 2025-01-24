import './App.css';
// import { GoogleLogout } from 'react-google-login';
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useRef } from 'react';
import { createOverlayEffect } from './overlayEffect';
import {
  gridContainerStyle,
  gridItemStyle,
  gridItemStyleHover,
  gridItemGreenStyle,
  gridItemLightGreenStyle,
  gridItem12Style,
  gridItem12NoclickStyle,
} from './styles';


// case 6-6, return
// case 6-5-6-6? return?
// if user do 5, user dont erase 111213 by number. they do by index (solved)
// if so, this should be differ by case 2468 (done)
// if case is 665, things need to be added from 6-5.
// 6(from 5) need to be 12, and instead of 147 it need 258
// 전 판에 냠냠했던거 기억해서 돌려주기 전 판에 클릭했던거 기억해서 돌려주기(5가 6으로 대체되는것은 전판에 6을 클릭해서야)
// case 6-6, it shows 359 instead of 369. 5 represents return though..
// instead 147, return 258
// need to make false to openedpath true somewhere, but dk how. prolly dont need to change?
const clientId = import.meta.env.VITE_ID
// const server = 'http://localhost:5001'
const server = 'https://grid-s0tx.onrender.com'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gridItems, setGridItems] = useState(['1', '2', '3', '4', 'O', '6', '7', '8', '9']);
  const [numColumns, setNumColumns] = useState(3); // State to track number of columns
  const [closedPaths, setClosedPaths] = useState([]);
  const [lastClicked, setLastClicked] = useState([]); // State to track the order of clicks
  const [loading, setLoading] = useState(false);
  const [openedPaths, setOpenedPaths] = useState([])
  const [emptyCellValues, setEmptyCellValues] = useState([]);

  // Refs to store previous and current values of emptyCellValues
const emptyCellValuesRef = useRef([]);
const previousEmptyCellValuesRef = useRef([]);
const initialOpenedPathsTrue = useRef(false);



  
  useEffect(() => {
    if (isLoggedIn) {
      const cleanupOverlay = createOverlayEffect();
    }
  }, [isLoggedIn]); // Dependency array with isLoggedIn

  // '5' mec. see app26 if this is unreadable...
  useEffect(() => {
    const updateGrid = async () => {
      if (lastClicked.length === 2) {
        console.log('Last two clicked items:', lastClicked);
  
        // Define configurations for different click pairs
        const configurations = {
          '6-5': {
            additions: [
              { index: 0, value: previousEmptyCellValuesRef.current[0] },
              { index: 3, value: previousEmptyCellValuesRef.current[1] },
              { index: 6, value: previousEmptyCellValuesRef.current[2] }
            ],
            subtractions: [2, 7, 8],
            action: '-row',
          },
          '4-5': {
            additions: [
              { index: 2, value: previousEmptyCellValuesRef.current[0] },
              { index: 5, value: previousEmptyCellValuesRef.current[1] },
              { index: 8, value: previousEmptyCellValuesRef.current[2] }
            ],
            subtractions: [0, 3, 6],
            action: 'row',
          },
          '2-5': {
            additions: [
              { index: 6, value: previousEmptyCellValuesRef.current[0] },
              { index: 7, value: previousEmptyCellValuesRef.current[1] },
              { index: 8, value: previousEmptyCellValuesRef.current[2] }
            ],
            subtractions: [0, 1, 2],
            action: '-column',
          },
          '8-5': {
            additions: [
              { index: 0, value: previousEmptyCellValuesRef.current[0] },
              { index: 1, value: previousEmptyCellValuesRef.current[1] },
              { index: 2, value: previousEmptyCellValuesRef.current[2] }
            ],
            subtractions: [6, 7, 8],
            action: 'column',
          },
        };
  
        // Determine the current configuration based on lastClicked
        const key = `${lastClicked[0]}-${lastClicked[1]}`;
        const config = configurations[key];
  
        if (!config) {
          console.warn('No action defined for', lastClicked);
          // setLastClicked([]);
          return;
        }
  
        // just to log
        if (initialOpenedPathsTrue.current) {
          console.log('First case happened: using lastClicked[0] for replacement. Value:', lastClicked[0]);
        } else if ((Array.isArray(openedPaths) && openedPaths.length) || openedPaths === true) {
          console.log('Second case happened: using "12" for replacement.');
        } else {
          console.log('Third case happened: using lastClicked[0] for replacement. Value:', lastClicked[0]);
        }

        // Extract the first number from lastClicked as the replacement value
        // const replaceValue = openedPaths ? '12' : lastClicked[0];
        // const replaceValue = (Array.isArray(openedPaths) && openedPaths.length) || openedPaths === true ? '12' : lastClicked[0];
        const replaceValue = initialOpenedPathsTrue.current 
        ? lastClicked[0] 
        : ((Array.isArray(openedPaths) && openedPaths.length) || openedPaths === true ? '12' : lastClicked[0]);
        console.log('useeffect:', openedPaths, replaceValue)

        // Filter and update grid items
        console.log('Before filtering:', gridItems);
        // let updatedGridItems = gridItems.filter(item => !['11', '12', '13'].includes(item));
        let updatedGridItems = gridItems.filter((_, index) => !config.subtractions.includes(index));
        // (_, index) is used when ignore the value but use the index instead.
        console.log('After filtering:', updatedGridItems);
  
        // Add new items and replace specified item
        config.additions.forEach(({ index, value }) => {
          updatedGridItems.splice(index, 0, value);
        });

        // Log the list of additions
console.log('Additions:', config.additions);
// Log the grid items before the replacement operation
console.log('Before replacement checking12, updatedGridItems:', updatedGridItems);

        // updatedGridItems = updatedGridItems.map(item => (item === '5' ? config.replace : item));
        // Use the first number in lastClicked as the replacement
        // updatedGridItems = updatedGridItems.map(item => (item === '5' ? replaceValue : item));
        // Determine if '12' is in additions
        const hasTwelveInAdditions = config.additions.some(item => item.value === '12');
        console.log('has12add', hasTwelveInAdditions)
        // Use 5 instead of replaceValue if '12' is in additions
        updatedGridItems = updatedGridItems.map(item => (item === '5' ? (hasTwelveInAdditions ? '5' : replaceValue) : item));

        // wanted to switch this from hastwelveinadditions, but have to think more
        // if (gridItems.includes(12)) {
        //   updatedGridItems = updatedGridItems.map(item => (item === '5' ? replaceValue : item));
        // }

        // Log the updated grid items
console.log('Updated grid items after checking 12replace:', updatedGridItems);

// // Update openedPaths based on the presence of '12'
// if (!hasTwelveInAdditions) {
//   setOpenedPaths(false); // Set to false if '12' is in additions
// }


  
        console.log('After updating:', updatedGridItems);
        setGridItems(updatedGridItems);
  
        // Perform fetch request
        try {
          const res = await fetch(`${server}/updateGrid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ googleId: localStorage.getItem('googleId'), action: config.action }),
          });
  
          if (res.ok) {
            const data = await res.json();
            console.log(`${config.action.charAt(0).toUpperCase() + config.action.slice(1)} incremented:`, data);
          } else {
            console.error(`Failed to increment ${config.action}:`, res.statusText);
          }
        } catch (error) {
          console.error(`Error incrementing ${config.action}:`, error);
        }
  
        // Clear the lastClicked array
        setLastClicked([]);

    //     // Clear the ref after the first use
    // if (initialOpenedPathsTrue.current) {
    //   // Do this only once when you no longer need `12`
    //   initialOpenedPathsTrue.current = false;
    // }
      }
    };
  
    updateGrid();
  }, [lastClicked, openedPaths]);

  useEffect(() => {
    console.log('Updated gridItems:', gridItems); // Log updated grid items whenever gridItems changes
  }, [gridItems]);

  useEffect(() => {
    console.log('openedPaths has changed:', openedPaths);
  }, [openedPaths]);

  const handleLoginSuccess = async (response) => {
    // Handle successful login
    console.log('Login Success:', response);
    setIsLoggedIn(true);
    setLoading(true); // Set loading state to true

    // Extract the ID token (credential) from the response
    const idToken = response.credential;

    // Decode the ID token to get user profile information
    const userProfile = jwtDecode(idToken);

    // Log the decoded profile information
    console.log('User Profile:', userProfile);

    // Prepare the user object to send to the backend
    const user = {
      googleId: userProfile.sub, // Unique ID for the user
    };

    localStorage.setItem('googleId', user.googleId); // Store googleId locally

     // Send user data to your backend server
     const res = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }).catch(error => console.error('Fetch error:', error));

    if (res.ok) {
      const data = await res.json();
      console.log('Server response:', data);
      setLoading(false); // End loading
    } else {
      console.error('Server responded with an error:', res.statusText);
    } 
  };

  const handleLoginFailure = (error) => {
    // Handle failed login
    console.error('Login Failure:', error);
  };

  const handleLogoutSuccess = () => {
    // Handle successful logout
    console.log('Logout Success');
    setIsLoggedIn(false);
  };

  const handleItemClick = async (index) => {
    if (loading) return; // Prevent clicks while loading

    

    const clickedValue = gridItems[index];

      // Update `openedPaths` and track if it was set to true
      if (openedPaths === true) {
        if (!initialOpenedPathsTrue.current) {
          // Set to true on first click
          initialOpenedPathsTrue.current = true;
          console.log('openedPaths was true, setting initialOpenedPathsTrue.current to true');
        }
        // Handle logic for initial openedPaths being true
      }
  

    // if (openedPaths) {
    //   setOpenedPaths(false); // Reset flag after processing
    // }

  //    // Check if '12' should be unclickable if 4, 2 or 8 click have been made
  // if (['4', '2', '8'].includes(lastClicked[0]) && clickedValue === '12') {
  //   console.log("Cell 12 is unclickable because '4', '2', or '8' was clicked before.");
  //   return; // Prevent clicking on '12'
  // }
      
     // 6-6
     // Check if '12' should be unclickable if two clicks have been made
     console.log('lastclicked (before update), length, clickedvalue:', lastClicked, lastClicked.length, clickedValue)
     if (lastClicked.length === 2 && clickedValue === '12') {
      console.log("Cell 12 is unclickable because two cells were clicked."); // this is likely not happening bcs at return, onclick restricts clicking
      return; // Prevent clicking on '12'
  }

      // Check if the clicked value is '12', then replace it with '6'
  if (clickedValue === '12') {
    // const newGridItems = [...gridItems];
    // newGridItems[index] = '6'; // Replace '12' with '6'
    // setGridItems(newGridItems); // Update the grid state
     // Ensure there is a last clicked value to replace '12'
     if (lastClicked.length > 0) {
      const replacementValue = lastClicked[lastClicked.length - 1]; // Get the most recent value from lastClicked
      const newGridItems = [...gridItems];
      newGridItems[index] = replacementValue; // Replace '12' with the last clicked value
      setGridItems(newGridItems); // Update the grid state
      setOpenedPaths(true) // set the flag to track this replaced value was originally '12'
      console.log('if12:', openedPaths)
    }

    return; // Exit early since no further action is needed
  }

    if (clickedValue === '2' || clickedValue === '4' || clickedValue === '5' || clickedValue === '6' || clickedValue === '8') {
        setLastClicked(prev => {
            if (prev.length === 2) {
                // Only keep the last two clicks
                return [prev[1], clickedValue];
            }
            return [...prev, clickedValue];
        });
    }

    // If the clicked cell is 'O', return early to make not clickable
    if (gridItems[index] === 'O') {
      return;
    }

    // Check if the clicked item is '6'
    if (gridItems[index] === '6') {
      setClosedPaths([0, 6]);
    } else if (gridItems[index] === '2') {
      setClosedPaths([6, 8]);
    } else if (gridItems[index] === '4') {
      setClosedPaths([2, 8]);
    } else if (gridItems[index] === '8') {
      setClosedPaths([0, 2]);
    } else {
      setClosedPaths([]); // Clear highlighted items for other clicks
    }

    let action = null;

    if (gridItems[index] === '6') {
        action = 'row';
    } else if (gridItems[index] === '2') {
        action = 'column';
    } else if (gridItems[index] === '4') {
      action = '-row';
    } else if (gridItems[index] === '8') {
      action = '-column';
    }

    if (action) {
        try {
            const res = await fetch(`${server}/updateGrid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ googleId: localStorage.getItem('googleId'), action }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} incremented:`, data);
            } else {
                console.error(`Failed to increment ${action}:`, res.statusText);
            }
        } catch (error) {
            console.error(`Error incrementing ${action}:`, error);
        }
    }

  

    console.log("Clicked(fetched) cell number(index+1):", index + 1); // Log the number of the clicked cell
    const newGridItems = [...gridItems];
    const emptyCells = []; // Array to store indices of empty cells

    // Define the facing cells for each index
    const facingCells = {
      0: [1, 3, 4],
      1: [0, 2, 3, 4, 5],
      2: [1, 4, 5],
      3: [0, 1, 4, 6, 7],
      4: [0, 1, 2, 3, 5, 6, 7, 8],
      5: [1, 2, 4, 7, 8],
      6: [3, 4, 7],
      7: [3, 4, 5, 6, 8],
      8: [4, 5, 7],
    };

    // Get the numbers facing the clicked cell
    const facingIndices = facingCells[index];

    // Keep the clicked cell and the facing cells, erase the rest
    newGridItems.forEach((item, i) => {
      if (i !== index && !facingIndices.includes(i)) {
        newGridItems[i] = 'd' + (emptyCells.length + 1); // Label the cell as d1, d2, d3, etc.
        emptyCells.push(i); // Add index to empty cells list
      }
    });

    console.log("List of empty cells:", emptyCells); // Log list of empty cells 

    // Log the values of the empty cells
const emptyCellValues = emptyCells.map(cellIndex => gridItems[cellIndex]);
console.log("Values of empty cells:", emptyCellValues);
// Update state
setEmptyCellValues(emptyCellValues);
// Update refs
previousEmptyCellValuesRef.current = emptyCellValuesRef.current;
emptyCellValuesRef.current = emptyCellValues;

    // Set the clicked cell as 'O'
    newGridItems[index] = 'O';

    // If the clicked cell is not the central cell, give central cell back the number (5 in this case)
    if (index !== 4) {
      newGridItems[4] = '5';
      // No need to add the central cell to the empty cells list
    }

    // Add '11', '12', '13' before 'O' if the clicked cell is '1'
    if (index === 0) {
      newGridItems.splice(newGridItems.indexOf('O'), 0, '11', '12', '13', '14');
      // Add '15' before '4'
      newGridItems.splice(newGridItems.indexOf('4'), 0, '15');

      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution
    }

    // Add '11', '12', '13' before '1' if the clicked cell is '2'
    if (index === 1) {
      const indexOfOne = newGridItems.indexOf('1');
      newGridItems.splice(indexOfOne, 0, '11', '12', '13');

      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution
    
    }

    // Add '11', '12', '13' before 'd1' and '14' after 'O' and '15' after '6' if the clicked cell is '3'
    if (index === 2) {
      // // Check if number of columns needs to be changed
      // if (numColumns === 3) {
      //   setNumColumns(4);
      // }

      newGridItems.splice(0, 0, '11', '12', '13'); // Add '11', '12', '13' before 'd1'
      newGridItems.splice(newGridItems.indexOf('O') + 1, 0, '14'); // Add '14' after 'O'
      newGridItems.splice(newGridItems.indexOf('6') + 1, 0, '15'); // Add '15' after '6'

      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution
    
    }

    // Add 'c11' between '3' and 'd2' if the clicked cell is 4
    if (index === 3) {
      // // Check if number of columns needs to be changed
      // if (numColumns === 3) {
      //   setNumColumns(4);
      // }
      // // Add 'c11' before '1' 
      // const indexOfOne = newGridItems.indexOf('1');
      // newGridItems.splice(indexOfOne - 1, 0, 'c11')

      // Add 'c12' after 'd1'
      // newGridItems.splice(3, 0, 'c11')
      const indexOfD1 = newGridItems.findIndex(item => item === '1');
      newGridItems.splice(indexOfD1, 0, '11');
      // newGridItems.splice(7, 0, 'c12');
      const indexOfD2 = newGridItems.findIndex(item => item === 'O');
      newGridItems.splice(indexOfD2, 0, '12');
      // newGridItems.splice(7, 0, 'c13');
      const indexOfD3 = newGridItems.findIndex(item => item === '7');
      newGridItems.splice(indexOfD3, 0, '13');

      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);

      return; // Exit the function here to prevent further execution
    
      
    }

    // let flag6Clicked = false; // Flag to track if cell '6' has been clicked

    // Add 'c11' between '3' and 'd2' if the clicked cell is 6
    if (index === 5) {
      // Check if number of columns needs to be changed
      // put this out after testing
      // if (numColumns === 3) {
      //   setNumColumns(4);
      // }
      // newGridItems.splice(3, 0, 'd11')
      const indexOfD2 = newGridItems.findIndex(item => item === 'd2');
      newGridItems.splice(indexOfD2, 0, '11');
      // newGridItems.splice(7, 0, 'd12');
      const indexOfD3 = newGridItems.findIndex(item => item === 'd3');
      newGridItems.splice(indexOfD3, 0, '12');
      // Add 'd13' after '9' 
      const indexOfNine = newGridItems.indexOf('9');
      newGridItems.splice(indexOfNine + 1, 0, '13')
      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution
    
    }

    if (index === 6) { // If clicked cell is 7
      newGridItems.splice(newGridItems.indexOf('4'), 0, '11'); // Add 11 before '4'
      newGridItems.splice(newGridItems.indexOf('O'), 0, '12'); // Add 12 before 'O'
      newGridItems.splice(newGridItems.indexOf('d5') + 1, 0, '13', '14', '15'); // Add 13, 14, 15 after 'd5'
      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution

    }

    // Add '11', '12', '13' after '9' if the clicked cell is '8'
    if (index === 7) {
      // Find the index of '9'
      const indexOfNine = newGridItems.indexOf('9');
      // Insert '11', '12', '13' after '9'
      newGridItems.splice(indexOfNine + 1, 0, '11', '12', '13');
      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution
    
    }

    if (index === 8) {
      newGridItems.splice(newGridItems.indexOf('6') + 1, 0, '11');
      newGridItems.splice(newGridItems.indexOf('O') + 1, 0, '12', '13', '14', '15');
      // Loop through 'd' cells and change their value to '' if they exist
      for (let i = 1; i <= 9; i++) {
        const dIndex = newGridItems.findIndex(item => item === `d${i}`);
        if (dIndex !== -1) {
          newGridItems[dIndex] = '';
        }
      }
      const filteredGridItems = newGridItems.filter(item => item !== "");
      console.log("Grid items after removing empty strings:", filteredGridItems); // Log filtered grid items
      setGridItems(filteredGridItems);
      return; // Exit the function here to prevent further execution

    }


    setGridItems(newGridItems);

    console.log("List of empty cells:", emptyCells); // Log list of empty cells // not executing bcs of return
    console.log("Grid items after click:", newGridItems); // Log grid items after click // not executing bcs of return
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
    <div>
      <h1> </h1>
      {isLoggedIn ? (
        <>
          <div style={gridContainerStyle(numColumns)}>
            {gridItems.map((item, index) => (
              <div
                key={index}
                style={{
                  ...(item === '' 
                    ? { ...gridItemStyle, visibility: 'hidden' } 
                    : (item === 'O' 
                      ? gridItemStyleHover 
                      : closedPaths.includes(index)
                      ? gridItemLightGreenStyle
                      : (item === '1' || item === '3' || item === '7' || item === '9' || item === '11' || item === '13')
                      ? gridItemGreenStyle
                      :item === '12' && lastClicked.length === 2
                      ? gridItem12NoclickStyle
                      :item === '12'
                      ? gridItem12Style
                      : gridItemStyle)
                  ),
                  pointerEvents: loading ? 'none' : 'auto'
                }}
                // onClick={() => handleItemClick(index)}
                onClick={
                  item === '1' || item === '3' || item === '7' || item === '9' || item === '11' || item === '13'
                  ? null // Disable click for green items
                  : item === '12' && lastClicked.length === 2
                  ? null // Disable click for '12' if two cells are clicked
                  : () => handleItemClick(index)
                }
                // // Disable pointer events when loading
                // style={{
                //   pointerEvents: loading ? 'none' : 'auto',
                //   ...gridItemStyle,
                // }}
              >
                {item}
              </div>
            ))}
          </div>
          {/* <GoogleLogout
            clientId={clientId}
            buttonText="Logout with Google"
            onLogoutSuccess={handleLogoutSuccess}
          /> */}
        </>
      ) : (
        <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
        // <>
        //   <div style={gridContainerStyle}>
        //     {gridItems.map((item, index) => (
        //       <div
        //         key={index}
        //         style={item === '' ? { ...gridItemStyle, visibility: 'hidden' } : (item === 'O' ? gridItemStyleHover : gridItemStyle)}
        //         onClick={() => handleItemClick(index)}
        //       >
        //         {item}
        //       </div>
        //     ))}
        //   </div>
        //   <GoogleLogout
        //     clientId={clientId}
        //     buttonText="Logout with Google"
        //     onLogoutSuccess={handleLogoutSuccess}
        //   />
        // </>
      )}
    </div>
    </GoogleOAuthProvider>
  );
};

export default App;
