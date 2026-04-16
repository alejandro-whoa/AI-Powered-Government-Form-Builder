import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({ 
  label, 
  hint, 
  error, 
  id,
  className = '',
  ...props 
}: TextareaProps) {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;
  
  return (
    <div className={`mb-6 ${className}`}>
      <label 
        htmlFor={textareaId} 
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
      <textarea
        id={textareaId}
        className={`
          w-full px-2 py-1 border-2 border-[#0b0c0c]
          ${error ? 'border-[#d4351c] border-4' : ''}
          focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
        `}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
        rows={5}
        {...props}
      />
    </div>
  );
}
