import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

/* ── Responsive Toaster: bottom-center on mobile, top-right on desktop ──
   Uses matchMedia to detect <640px and switch position accordingly. */

function getIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 639px)').matches;
}

export default function ResponsiveToaster() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <Toaster
      position={isMobile ? 'bottom-center' : 'top-right'}
      toastOptions={{
        duration: 4000,
        style: { background: 'transparent', boxShadow: 'none', padding: 0 },
      }}
    />
  );
}
