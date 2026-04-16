import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning' | 'link';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-block px-4 py-2 font-normal cursor-pointer border-2 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#00703c] text-white border-transparent hover:bg-[#005a30] shadow-[0_2px_0_#002d18]',
    secondary: 'bg-[#f3f2f1] text-[#0b0c0c] border-transparent hover:bg-[#dbdad9] shadow-[0_2px_0_#929191]',
    warning: 'bg-[#d4351c] text-white border-transparent hover:bg-[#aa2a16] shadow-[0_2px_0_#6e1a0f]',
    link: 'bg-transparent text-[#1d70b8] border-transparent underline hover:text-[#003078] shadow-none p-0',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
