import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted ? createPortal(children, document.body) : null;
}