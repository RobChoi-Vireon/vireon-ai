import React from 'react';

// Ultra-lightweight starfield using pure CSS - no canvas, no animations
export default function Starfield({ theme }) {
  if (theme !== 'dark') return null;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none opacity-60" 
      style={{ 
        zIndex: -1,
        background: `
          radial-gradient(2px 2px at 20px 30px, #7FA6FF, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(202,51,255,0.6), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(2px 2px at 160px 30px, rgba(202,51,255,0.4), transparent),
          radial-gradient(1px 1px at 200px 100px, rgba(255,255,255,0.7), transparent),
          radial-gradient(2px 2px at 300px 50px, rgba(127,166,255,0.5), transparent),
          radial-gradient(1px 1px at 350px 120px, rgba(255,255,255,0.9), transparent),
          radial-gradient(1px 1px at 450px 80px, rgba(202,51,255,0.3), transparent),
          radial-gradient(2px 2px at 500px 150px, rgba(255,255,255,0.4), transparent)
        `
      }}
    />
  );
}