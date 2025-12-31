import React, { useState, useEffect } from 'react';

interface SignatureTitleProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
  animated?: boolean;
}

export default function SignatureTitle({ children, className = '', vertical = false, animated = false }: SignatureTitleProps) {
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  if (vertical) {
    return (
      <div 
        className={`vertical-signature signature-float ${isVisible ? 'signature-visible' : 'signature-hidden'} ${className}`}
        style={{ color: 'rgba(255, 255, 255, 0.9)' }}
      >
        {children}
      </div>
    );
  }

  return (
    <h1 
      className={`font-signature text-8xl text-center normal-case ${className}`}
      style={{ color: '#ffffff' }}
    >
      {children}
    </h1>
  );
}
