import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom"; // unfortunately the only way to do this is with using UNSAFE_NavigationContext

// My own useBlocker hook for blocking navigation and showing a confirmation dialog when user tries to navigate away since I'm using the Declarative framework from React Router

/**
 * 
 * @param shouldBlock whether navigation should be blocked or not
 */
export function useBlocker(shouldBlock: boolean) {
  // Get the navigator object (controls navigation)
  const navigator = useContext(NavigationContext).navigator;

  // Run when navigation should be blocked or unblocked (and when, in the slight chance, navigator changes).
  useEffect(() => {
    if (!shouldBlock) {
      return;
    }

    // Save the push function (= navigate to route fxn) to restore after overriding.
    const push = navigator.push;

    // Override the push function to block navigation.
    navigator.push = (...args) => {
      // Prompt user for confirmation to continue navigating.
      const proceedNavigation = window.confirm("You are in edit mode and may have unsaved changes. Are you sure you want to leave?");

      // User still wants to continue with navigation.
      if (proceedNavigation) {
        navigator.push = push;
        push(...args);
      }
    }

    // Restore the original push function when effect is cleaned up.
    return () => {
      navigator.push = push;
    }
  }, [shouldBlock, navigator])
}