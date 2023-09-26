// ClickOutsideDirective.js

const ClickOutsideDirective = {
    beforeMount(el, binding) {
      // Define a click event handler
      const clickHandler = (e) => {
        // Check if the clicked element is outside of the bound element and its children
        if (!el.contains(e.target)) {
          // Call the method specified in the directive's value
          binding.value();
        }
      };
  
      // Attach the click event listener
      document.addEventListener('click', clickHandler);
  
      // Store the event handler so we can remove it later
      el._clickOutsideHandler = clickHandler;
    },
    unmounted(el) {
      // Remove the click event listener when the element is unmounted
      document.removeEventListener('click', el._clickOutsideHandler);
    },
  };
  
  export default ClickOutsideDirective;
  