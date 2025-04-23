// Create a new Particles.js component
import React, { useEffect } from 'react';
import '../styles/Particles.css';

const Particles = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => {
        const x = (e.clientX * -1 / 20);
        const y = (e.clientY * -1 / 20);
        particle.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="particles-container">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            opacity: Math.random() * 0.5 + 0.1,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

export default Particles;