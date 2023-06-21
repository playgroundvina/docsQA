import { useEffect } from 'react';

const useClickOutSide = (fn, ref) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        fn();
      }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('touch', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('touch', handleClickOutside);
    };
  }, [fn, ref]);
};

export default useClickOutSide;
