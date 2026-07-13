import React from "react";

interface LogoProps {
  className?: string;
  size?: number | string;
}

export default function Logo({ className = "", size = "100%" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      width={size} 
      height={size} 
      className={`rounded-full shrink-0 select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background color of the badge */}
      <rect width="100%" height="100%" fill="#fcfaf2" />
      
      {/* Main decorative enclosing circle */}
      <circle cx="250" cy="250" r="212" fill="none" stroke="#aa936d" strokeWidth="4.5" />
      
      {/* --- Cup and Steam group --- */}
      <g id="cap-and-steam" transform="translate(195, 110)">
        {/* Steam waves */}
        <path 
          d="M 42 -15 Q 47 -22 42 -30 T 42 -45" 
          fill="none" 
          stroke="#aa936d" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 55 -15 Q 60 -25 55 -35 T 55 -50" 
          fill="none" 
          stroke="#aa936d" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 68 -15 Q 73 -22 68 -30 T 68 -45" 
          fill="none" 
          stroke="#aa936d" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />

        {/* Cup rim ellipse */}
        <ellipse cx="55" cy="15" rx="43" ry="8" fill="none" stroke="#aa936d" strokeWidth="4" />
        
        {/* Cup main body bowl */}
        <path 
          d="M 13 15 C 13 54, 97 54, 97 15" 
          fill="none" 
          stroke="#aa936d" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        
        {/* Cup handle */}
        <path 
          d="M 97 19 C 117 19, 117 38, 94 40" 
          fill="none" 
          stroke="#aa936d" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        
        {/* Cup base saucer line */}
        <path 
          d="M 28 57 L 82 57" 
          fill="none" 
          stroke="#aa936d" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      </g>

      {/* --- Text styling --- */}
      <g fill="#aa936d" textAnchor="middle" style={{ fontFamily: "'Playfair Display', Georgia, serif, system-ui" }}>
        {/* CAFÉ */}
        <text 
          x="260" 
          y="266" 
          fontSize="48" 
          fontWeight="500" 
          letterSpacing="20"
        >
          CAFÉ
        </text>
        
        {/* MARTENS */}
        <text 
          x="253" 
          y="336" 
          fontSize="56" 
          fontWeight="bold" 
          letterSpacing="6"
        >
          MARTENS
        </text>
        
        {/* & MORE */}
        <text 
          x="253" 
          y="386" 
          fontSize="36" 
          fontWeight="500" 
          letterSpacing="6"
        >
          & MORE
        </text>
      </g>
    </svg>
  );
}
