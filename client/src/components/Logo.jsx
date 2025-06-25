import React from 'react';

const Logo = () => (
  <svg width="220" height="60" xmlns="http://www.w3.org/2000/svg">
    {/* Background */}
    <rect width="220" height="60" rx="10" ry="10" fill="#180525" />

    {/* Text */}
    <text x="60" y="38" fontFamily="Fira Code, monospace" fontSize="24" fill="#f8fafc">
      Code
      <tspan fill="#ec4899">Hub</tspan> {/* Pink color */}
    </text>

    {/* Left Chevron */}
    <path
      d="M30 20 L20 30 L30 40"
      stroke="#38bdf8"  /* Sky blue */
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Right Chevron */}
    <path
      d="M50 20 L60 30 L50 40"
      stroke="#38bdf8"  /* Sky blue */
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default Logo;
