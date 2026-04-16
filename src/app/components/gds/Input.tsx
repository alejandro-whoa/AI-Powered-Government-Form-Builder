import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  width?: 'full' | '20' | '10' | '5' | '4' | '3' | '2';
}

export function Input({ 
  label, 
  hint, 
  error, 
  width = 'full',
  id,
  className = '',
  ...props 
}: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  
  const widthClasses = {
    'full': 'w-full',
    '20': 'w-full max-w-[29.5rem]',
    '10': 'w-full max-w-[14.75rem]',
    '5': 'w-full max-w-[7.375rem]',
    '4': 'w-full max-w-[5.9rem]',
    '3': 'w-full max-w-[4.425rem]',
    '2': 'w-full max-w-[2.95rem]',
  };
  
  return (
    <div className={`mb-6 ${className}`}>
      <label 
        htmlFor={inputId} 
        className="block mb-1 font-bold"
      >
        {label}
      </label>
      {hint && (
        <div id={hintId} className="text-[#505a5f] mb-1">
          {hint}
        </div>
      )}
      {error && (
        <p id={errorId} className="text-[#d4351c] font-bold mb-1 flex items-start">
          <span className="mr-1 font-bold text-lg">!</span>
          <span>Error: {error}</span>
        </p>
      )}
      <input
        id={inputId}
        className={`
          ${widthClasses[width]}
          px-2 py-1 border-2 border-[#0b0c0c]
          ${error ? 'border-[#d4351c] border-4' : ''}
          focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
        `}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
        {...props}
      />
    </div>
  );
}
