import { useEffect, useState, useRef } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  const windowRef = useRef(window);

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: windowRef.current.innerWidth });
    }

    windowRef.current.addEventListener('resize', handleResize);
    handleResize();
    // TODO: add an update when the page is first loaded

    return () => windowRef.current.removeEventListener('resize', handleResize);
  });

  return windowSize;
}

export default useWindowSize;