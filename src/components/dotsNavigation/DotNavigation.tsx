import React from 'react';
import './dotNavigation.css';

interface DotNavigationProps {
  numDots: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

const DotNavigation: React.FC<DotNavigationProps> = ({ numDots, activeIndex, onDotClick }) => {
  const dots = [];
  for (let i = 0; i < numDots; i++) {
    dots.push(
      <span
        key={i}
        className={`dot ${activeIndex === i ? 'active' : ''}`}
        onClick={() => onDotClick(i)}
      ></span>
    );
  }

  return <div className="dot-navigation">{dots}</div>;
};

export default DotNavigation;
