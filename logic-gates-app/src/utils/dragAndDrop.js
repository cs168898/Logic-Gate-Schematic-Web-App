/*************************** DRAG AND DROP FUNCTIONALITY **********************/

  // Drag start handler for regular drag functionality
  export function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
  }

  // Custom drag and drop function
  export function dragAndDrop() {
    let cursor = { x: null, y: null }; // Cursor position
    let userInputPosition = { dom: null, x: null, y: null }; // Element position

    document.addEventListener('mousedown', (event) => {
      if (event.target.classList.contains('user-input') || event.target.classList.contains('tools-window')) {
        // Record initial cursor position and element position on mousedown
        cursor = { x: event.clientX, y: event.clientY };
        userInputPosition = {
          dom: event.target,
          x: event.target.getBoundingClientRect().left,
          y: event.target.getBoundingClientRect().top
        };
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (userInputPosition.dom === null) return; // Only run if the element is selected
      const currentCursor = { x: event.clientX, y: event.clientY };
      const distance = {
        x: currentCursor.x - cursor.x, // Distance moved horizontally
        y: currentCursor.y - cursor.y  // Distance moved vertically
      };
      // Update the element's position based on distance moved
      userInputPosition.dom.style.left = (userInputPosition.x + distance.x) + 'px';
      userInputPosition.dom.style.top = (userInputPosition.y + distance.y) + 'px';
      userInputPosition.dom.style.cursor = 'grab';
    });

    document.addEventListener('mouseup', () => {
      if(userInputPosition.dom == null ) return;
        userInputPosition.dom.style.cursor = 'auto';
        userInputPosition.dom = null; // Stop dragging when the mouse button is released
    });
  }
    /*************************** END OF DRAG AND DROP FUNCTIONALITY **********************/