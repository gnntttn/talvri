
import React from 'react';

interface RatingCircleProps {
  rating: number;
  size?: 'normal' | 'small';
}

export const RatingCircle: React.FC<RatingCircleProps> = ({ rating, size = 'normal' }) => {
  const normalizedRating = rating * 10;
  
  const isSmall = size === 'small';
  const radius = isSmall ? 16 : 20;
  const strokeWidth = isSmall ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedRating / 100) * circumference;

  let strokeColorClass;
  if (normalizedRating >= 70) {
    strokeColorClass = 'stroke-green-400';
  } else if (normalizedRating >= 40) {
    strokeColorClass = 'stroke-yellow-400';
  } else {
    strokeColorClass = 'stroke-red-400';
  }

  const textSizeClass = isSmall ? 'text-xs' : 'text-sm';
  const circleSize = isSmall ? 40 : 50;

  return (
    <div className="relative flex items-center justify-center" style={{ width: circleSize, height: circleSize }}>
      <svg className="absolute w-full h-full">
        <circle
          className="stroke-slate-700"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          className={`${strokeColorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="absolute flex items-center justify-center w-full h-full bg-slate-800 rounded-full">
        <span className={`text-white font-bold ${textSizeClass}`}>
          {rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
};