import { useEffect, useState } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    // TODO: add an update when the page is first loaded

    return () => window.removeEventListener('resize', handleResize);
  }, [window]);

  return windowSize;
}

export default useWindowSize;