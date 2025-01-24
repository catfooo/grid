export const gridContainerStyle = (numColumns) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`, // Dynamic number of columns
    gridGap: '10px', // gap between grid items
    marginBottom: '20px', // add margin bottom to create space
  })

  export const gridItemStyle = {
    // backgroundColor: '#ccc', // background color of each grid item(gray)
    // backgroundColor: '#D2B48C', // light brown background color of each grid item
    backgroundColor: '#C2B280', // sand dollar background color of each grid item
    padding: '20px', // padding inside each grid item
    textAlign: 'center', // center align text
    cursor: 'pointer', // change cursor to pointer on hover
    minWidth: '20px', // Add a fixed minimum width to ensure consistency
    transition: 'background-color 0.5s ease', // to make less noticeble with the difference of time that path blocking happens and added greener cells shows. it looks like fade in
  };

  export const gridItemStyleHover = {
    ...gridItemStyle,
    cursor: 'default', // Change cursor to default arrow
  };

  export const gridItemGreenStyle = {
    ...gridItemStyle,
    backgroundColor: 'green', // green background color for 1, 3, 7, 9 + ...
    cursor: 'default', // Change cursor to default arrow
  };

  // for closed path
  export const gridItemLightGreenStyle = {
    ...gridItemStyle,
    backgroundColor: '#A89F91', // Deep beige background color for closed path 6-(2,8), ...
    // backgroundColor: 'lightgreen', // lightgreen background color for closed path 6-(2,8)
    cursor: 'default', // Change cursor to default arrow
  };

  export const gridItem12Style = {
    ...gridItemStyle,
    backgroundColor: 'green',
  }

  export const gridItem12NoclickStyle = {
    ...gridItemStyle,
    cursor: 'default',
    backgroundColor: 'green',
  }