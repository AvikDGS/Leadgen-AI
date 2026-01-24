
import React from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="512" height="512" rx="100" fill="#1A1A1A"/>
      <path d="M78 193H162L213.5 277.5L265 193H349L255.5 334L349 475H265L213.5 390.5L162 475H78L171.5 334L78 193Z" fill="white"/>
      <rect x="269" y="364" width="51" height="51" fill="white"/>
      <path d="M369.344 380.128C369.344 374.304 371.328 369.376 375.296 365.344C379.328 361.312 384.32 359.296 390.272 359.296C396.16 359.296 401.12 361.312 405.152 365.344C409.184 369.312 411.2 374.24 411.2 380.128C411.2 385.952 409.184 390.912 405.152 395.008C401.12 399.104 396.16 401.152 390.272 401.152C384.32 401.152 379.328 399.104 375.296 395.008C371.328 390.912 369.344 385.952 369.344 380.128ZM369.344 414.976H411.2V475H369.344V414.976ZM344 340V475H302.144V340H344ZM432 475H473.856V340H432V475Z" fill="white" style={{display: 'none'}} />
      {/* Fallback to simple text for 'ai' for crispness if paths are complex */}
      <text x="340" y="415" fill="white" style={{ font: 'bold 90px sans-serif' }}>ai</text>
    </svg>
  );
};
