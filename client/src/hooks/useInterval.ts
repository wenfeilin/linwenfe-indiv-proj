import { useEffect, useRef } from 'react';

// Grabbed this code from source online (I'll update the source later)
function useInterval(callback: any, delay: number | null) {
  const savedCallback = useRef<any>(null);
 
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;