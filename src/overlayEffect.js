export const createOverlayEffect = () => {
    const body = document.body;
      if (body) {
        // Create an overlay for the fade effect
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'radial-gradient(circle at center, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 100%)';
        overlay.style.transition = 'opacity 10s ease-out'; // Slower transition duration
        overlay.style.zIndex = '9999'; // Ensure the overlay is on top
        overlay.style.pointerEvents = 'none'; // Allow interactions behind the overlay
        overlay.style.opacity = '1'; // Start with opacity 1
        body.appendChild(overlay);

        // Trigger fade out on mount
        setTimeout(() => {
          overlay.style.opacity = '0';
        }, 100); // Slight delay to ensure the effect is visible

        // Remove the overlay after the animation completes
        const handleTransitionEnd = () => {
          body.removeChild(overlay);
        };
        overlay.addEventListener('transitionend', handleTransitionEnd);

        // Cleanup function to remove overlay if component unmounts or isLoggedIn changes
        return () => {
          overlay.removeEventListener('transitionend', handleTransitionEnd);
          if (body.contains(overlay)) {
            body.removeChild(overlay);
          }
        };
      }
}